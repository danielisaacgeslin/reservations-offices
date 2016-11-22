(() => {
    'use strict';
    angular.module('app').service('processService', processService);

    processService.$inject = [];
    function processService() {
        return {
            addZeros,
            dbArrayAdapter
        };

        function addZeros(number: number): string {
            return <string>(number < 10 ? '0'.concat(number.toString()) : number.toString());
        }

        function dbArrayAdapter(dbArray: any[]): any {
            let dbObject: Object = {};
            let tempObj: any = {};
            let value: any;

            if (typeof dbArray !== 'object') {
                return tempObj;
            }
            dbArray.forEach((object: any) => {
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
