(function () {
    'use strict';
    angular.module('app').controller('spacesController', spacesController);
    spacesController.$inject = ['$scope', 'storeService'];
    function spacesController($scope, storeService) {
        var vm = this;
        vm.spaces = {};
        _init();
        function _init() {
            storeService.getSpaces().then(function (spaces) { vm.spaces = spaces; });
        }
    }
})();
