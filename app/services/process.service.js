(function () {
    'use strict';
    var ProcessService = (function () {
        function ProcessService() {
        }
        ProcessService.prototype.addZeros = function (number) {
            return (number < 10 ? '0'.concat(number.toString()) : number.toString);
        };
        ProcessService.prototype.dbArrayAdapter = function (dbArray) {
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
        };
        ProcessService.$inject = [];
        return ProcessService;
    }());
    angular.module('app').service('processService', ProcessService);
})();
