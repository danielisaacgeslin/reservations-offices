(function(){
	'use strict';
	angular.module('app').filter('repeatObjectToArrayFilter', repeatObjectToArrayFilter);

	function repeatObjectToArrayFilter() {
    function orderThis(a, b, orderKey){
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

		return function(items, orderArray){
      var itemsArray = [];
      for(var key in items){
        if(items.hasOwnProperty(key)){
          itemsArray.push(items[key]);
        }
      }

      orderArray.forEach(function(orderKey){
        itemsArray = itemsArray.sort(function(a, b){
          return orderThis(a, b, orderKey);
        });
      });

      return itemsArray;
    };
	}
})();
