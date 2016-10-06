(function(){
	'use strict';
	angular.module('app').controller('spacesController', spacesController);

	spacesController.$inject = ['$scope', 'storeService'];

	function spacesController($scope, storeService) {
		var vm = this;
		vm.spaces = {};

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getSpaces().then(function(spaces){
				vm.spaces = spaces;
			});
		}
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();
