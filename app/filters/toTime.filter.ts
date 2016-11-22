(() => {
    'use strict';
    angular.module('app').filter('toTimeFilter', toTimeFilter);

    function toTimeFilter(): Function {
        return function(items: number[], from: number): number[] {
            items = [].concat(items);
            for (let i = 0; i < items.length; i++) {
                if (items[i] <= from) {
                    items.splice(i, 1);
                    i--;
                }
            }
            return <number[]>items;
        };
    }
})();
