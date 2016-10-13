(()=>{
	'use strict';
	angular.module('app').filter('repeatObjectToArrayFilter', repeatObjectToArrayFilter);

	function repeatObjectToArrayFilter(): Function {
    function orderThis(a: any, b: any, orderKey: string): number{
      var aValue = a[orderKey];
      var bValue = b[orderKey];

      if(aValue.getTime && bValue.getTime){
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }
      if(aValue > bValue){
        return 1;
      }else{
        return -1;
      }
    }

		return function(items: any[], orderArray: string[]): any[]{
      var itemsArray = [];
      for(let key in items){
        if(items.hasOwnProperty(key)){
          itemsArray.push(items[key]);
        }
      }

      orderArray.forEach((orderKey: string)=>{
        itemsArray = <any[]>itemsArray.sort((a: any, b: any)=>{
          return <number>orderThis(a, b, orderKey);
        });
      });

      return <any[]>itemsArray;
    };
	}
})();
