(function () {
    'use strict';
    angular.module('app').controller('tagsController', tagsController);
    tagsController.$inject = ['$scope', 'storeService'];
    function tagsController($scope, storeService) {
        var vm = this;
        vm.tags = {};
        _init();
        function _init() {
            storeService.getTags().then(function (tags) { vm.tags = tags; });
        }
    }
})();
