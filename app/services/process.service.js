(function () {
    'use strict';
    angular.module('app').service('processService', processService);
    processService.$inject = [];
    function processService() {
        return {
            addZeros: addZeros,
            dbArrayAdapter: dbArrayAdapter
        };
        function addZeros(number) {
            return (number < 10 ? '0'.concat(number.toString()) : number.toString());
        }
        function dbArrayAdapter(dbArray) {
            var dbObject = {};
            var tempObj = {};
            var value;
            if (typeof dbArray !== 'object') {
                return tempObj;
            }
            dbArray.forEach(function (object) {
                tempObj = {};
                for (var key in object) {
                    value = object[key];
                    if (new RegExp('timestamp', 'i').test(key)) {
                        value = new Date(value);
                    }
                    if (key === 'DATE') {
                        value = new Date(value.replace('-', '/').replace('-', '/'));
                    }
                    if (!isNaN(value) && typeof value === 'string' && value.trim()) {
                        value = Number(value);
                    }
                    tempObj[key.toLowerCase()] = value;
                }
                dbObject[tempObj.id] = tempObj;
            });
            return dbObject;
        }
    }
})();
