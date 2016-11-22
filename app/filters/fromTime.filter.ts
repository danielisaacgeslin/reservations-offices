(() => {
    'use strict';
    angular.module('app').filter('fromTimeFilter', fromTimeFilter);

    function fromTimeFilter(): Function {
        return function(items: number[], to: number): number[] {
            items = [].concat(items);
            for (let i = 0; i < items.length; i++) {
                if (items[i] >= to) {
                    items.splice(i, 1);
                    i--;
                }
            }
            return <number[]>items;
        };
    }
})();
