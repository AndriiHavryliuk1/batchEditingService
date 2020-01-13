class RetryHalper {

    static resetCounter() {
        RetryHalper.calledFirstTime = {};
    }

    static isCalledFirstTime(id) {
        return !RetryHalper.calledFirstTime[id];
    }

}

RetryHalper.calledFirstTime = {};



module.exports = RetryHalper;