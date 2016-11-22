(() => {
    'use strict';
    angular.module('app').filter('department', departmentFilter);

    function departmentFilter(): Function {
        const abc: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
            'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
            'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        return function(input: number): string {
            let output;
            input = Number(input);
            output = abc[input - 1];
            return <string>output;
        };
    }
})();
