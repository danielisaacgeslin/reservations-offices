(()=>{
	'use strict';
	angular.module('app').filter('monthFilter', monthFilter);

	function monthFilter(): Function {
		return function(items: any, date: Date): any{
      var newItems = {};
      for(let key in items){
        if(items[key].date.getMonth() === date.getMonth() && items[key].date.getFullYear() === date.getFullYear()){
          newItems[key] = items[key];
        }
      }
      return newItems;
    };
	}
})();
