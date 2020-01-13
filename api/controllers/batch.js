const Bottleneck = require("bottleneck");
const batchService = require('../../services/batch');
const RetryHalper = require('../../utils/retryHalper');


/**
 * needed to limit external calls per/sec
 */
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 333
  });

exports.batchForUsers = async (req, res, next) => {
    let result;
    try {
        if (req.query.ids) {
            result = await executeBatchByParams(req, res, next);
        } else {
            result = await executeBatchByBody(req, res, next);
        }
    
        res.status(200).json({resolved: result.resolved, rejected: result.rejected});
    } catch(err) {
        next(err);
    }

};

/**
 * By params we transmit only ids
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function executeBatchByParams(req, res, next) {
    RetryHalper.resetCounter();
    const ids = JSON.parse(req.query.ids);

    const allThePromises = [];

    ids.forEach((id, index) => {
        const wrappedPromise = limiter.wrap(batchService.updateUser);
        // if deques body is array so get corresponding value else all users will have the same value 
        const data = Array.isArray(req.body) ? req.body[index] : req.body;
        allThePromises.push(wrappedPromise({userId: id, data: data}));
    });

    try {
      const result = await Promise.all(allThePromises.map(reflect));
      return {
            resolved:  result.filter(r => r.status === "resolved").map(r => r.data),
            rejected: result.filter(r => r.status === "rejected")
      };
    } catch(err){
      next(err);
    }
}


/**
 * In this case reques body should be an array of object for update
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function executeBatchByBody(req, res, next) {
    const allThePromises = [];
    req.body.forEach((item) => {

        let wrappedPromise;
        switch (item.ver) {
            case "PUT":
                wrappedPromise = limiter.wrap(batchService.updateUser);
                allThePromises.push(wrappedPromise({userId: item.userId, data: item.data}));
                break;
            case "POST":
                wrappedPromise = limiter.wrap(batchService.createUser);
                allThePromises.push(wrappedPromise({data: item.data}));
                break;
            case "DELETE":
                wrappedPromise = limiter.wrap(batchService.deleteUser);
                allThePromises.push(wrappedPromise(item.userId));
                break;
        }

    });
  
    try {
        const result = await Promise.all(allThePromises.map(reflect));
        return {
              resolved: result.filter(r => r.status === "resolved").map(r => r.data),
              rejected: result.filter(r => r.status === "rejected")
        };
    } catch(err){
      next(err);
    }
}

/**
 * Differentiate resolved result from rejected
 * @param {*} promise
 */
function reflect(promise){
    return promise.then((v) => { 
        return {data: v, status: "resolved" };
    }, (e) => { 
        return {err: e, status: "rejected" };
    });
}
