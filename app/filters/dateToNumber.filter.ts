(()=>{
	'use strict';
	angular.module('app').filter('dateToNumber', dateToNumberFilter);

	function dateToNumberFilter(): Function {
		return function(input: Date): number{
      var output: number;
      output = input.getTime();
      return <number>output;
    };
	}
})();
