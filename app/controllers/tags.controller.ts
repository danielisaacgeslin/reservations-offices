(() => {
    'use strict';
    angular.module('app').controller('tagsController', tagsController);

    tagsController.$inject = ['$scope', 'storeService'];
    function tagsController($scope, storeService) {
        const vm = this;
        vm.tags = {};

        _init();

        function _init(): void {
            storeService.getTags().then((tags) => { vm.tags = tags; });
        }
    }
})();
