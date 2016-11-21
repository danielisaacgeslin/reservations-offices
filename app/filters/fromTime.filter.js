(function () {
    'use strict';
    angular.module('app').filter('fromTimeFilter', fromTimeFilter);
    function fromTimeFilter() {
        return function (items, to) {
            items = [].concat(items);
            for (var i = 0; i < items.length; i++) {
                if (items[i] >= to) {
                    items.splice(i, 1);
                    i--;
                }
            }
            return items;
        };
    }
})();
