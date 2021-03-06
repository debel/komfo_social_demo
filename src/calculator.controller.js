module.exports = function (model) {
    var addition = function (collection, number) {
            var n = parseInt(number, 10);
            return model.latest(collection)
                .then(function doAddition(latest) {
                    latest = latest || {result: 0};
                    return {result: latest.result + n};
                })
                .then(model.insert.bind(model, collection))
                .catch(function (err) {
                    throw err;
                });
        },
        multiplication = function (collection, number) {
            var n = parseInt(number, 10);
            return model.latest(collection)
                .then(function doMultiplication (latest){
                    latest = latest || {result: 0};
                    return {result: latest.result * n};
                })
                .then(model.insert.bind(model, collection))
                .catch(function (err){
                    throw err;
                });
        };

    return {
        addition: addition,
        multiplication: multiplication
    };
};
