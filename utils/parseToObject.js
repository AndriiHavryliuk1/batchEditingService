exports.parseToObject = (str) => {
    let objects = []
    try {
        JSON.parse(str);
    } catch (err) {
        try {
            const nextObjectIndex = retnum(err.message);
            objects = [JSON.parse(str.substring(0, nextObjectIndex)), JSON.parse(str.substring(nextObjectIndex, str.length))]
            return objects;
        } catch (err) {
            return objects;
        }
    }

    function retnum(str) { 
        var num = str.replace(/[^0-9]/g, ''); 
        return parseInt(num,10); 
    }
}