
const https = require('https');
const axios = require('axios');

const RetryHalper = require('../utils/retryHalper');

/**
 * return all users
 */
exports.getAllUsers = () => {
      return new Promise((resolve, reject) => {
        https.get('https://guesty-user-service.herokuapp.com/user', (resp) => {
            let data = '';
    
            try {
          
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                  data += chunk;
                });
              
                // The whole response has been received. Print out the result.
                return resp.on('end', () => {
                    return resolve(JSON.parse(data))
                });
            } catch (err) {
                reject(err);
            }
          
          }).on("error", (err) => {
            reject(err);
          });
    });
}


exports.updateUser = updateUser;
exports.createUser = createUser;
exports.deleteUser = deleteUser;

/**
 * Update user data
 * @param {*} dataForUpdate 
 */
function updateUser (dataForUpdate) {
    return axios.put('https://guesty-user-service.herokuapp.com/user/'+ dataForUpdate.userId, dataForUpdate.data).then((response) => {
        return Promise.resolve(response.data);
    }, (err) => {
        // condition for one more retry
        if (err.response.status === 503 && RetryHalper.isCalledFirstTime(dataForUpdate.userId)) {
            RetryHalper.calledFirstTime[dataForUpdate.userId] = true;
            return updateUser(dataForUpdate);
        }
        return Promise.reject(err);
    });
};

/**
 * Create new user
 * @param {*} postData 
 */
function createUser (postData) {
    return axios.post('https://guesty-user-service.herokuapp.com/user', postData).then((response) => {
        return Promise.resolve(response.data);
    }, (err) => {
        // condition for one more retry
        if (err.response.status === 503 && RetryHalper.isCalledFirstTime(postData.email)) {
            RetryHalper.calledFirstTime[postData.email] = true;
            return createUser(postData);
        }
        return Promise.reject(err);
    });
}

/**
 * 
 * @param {*} userId 
 */
function deleteUser (userId) {
    return axios.delete('https://guesty-user-service.herokuapp.com/user' + userId).then((response) => {
        return Promise.resolve(response.data);
    }, (err) => {
        // condition for one more retry
        if (err.response.status === 503 && RetryHalper.isCalledFirstTime(userId)) {
            RetryHalper.calledFirstTime[userId] = true;
            return deleteUser(userId);
        }
        return Promise.reject(err);
    });
}
