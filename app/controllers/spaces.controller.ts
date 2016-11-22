(() => {
    'use strict';
    angular.module('app').controller('spacesController', spacesController);

    spacesController.$inject = ['$scope', 'storeService'];
    function spacesController($scope, storeService) {
        const vm = this;
        vm.spaces = {};

        _init();

        function _init(): void {
            storeService.getSpaces().then((spaces) => { vm.spaces = spaces; });
        }
    }
})();
