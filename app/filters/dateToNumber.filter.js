(function () {
    'use strict';
    angular.module('app').filter('dateToNumber', dateToNumberFilter);
    function dateToNumberFilter() {
        return function (input) {
            var output;
            output = input.getTime();
            return output;
        };
    }
})();
