(function () {
    'use strict';
    angular.module('app').filter('toTimeFilter', toTimeFilter);
    function toTimeFilter() {
        return function (items, from) {
            items = [].concat(items);
            for (var i = 0; i < items.length; i++) {
                if (items[i] <= from) {
                    items.splice(i, 1);
                    i--;
                }
            }
            return items;
        };
    }
})();
