(function () {
    'use strict';
    angular.module('app').controller('confirmationModalController', confirmationModalController);
    confirmationModalController.$inject = ['$scope', '$uibModalInstance', 'data'];
    function confirmationModalController($scope, $uibModalInstance, data) {
        var vm = this;
        vm.data = data;
        vm.cancel = cancel;
        vm.accept = accept;
        function cancel() {
            $uibModalInstance.dismiss('delete');
        }
        function accept() {
            $uibModalInstance.close();
        }
    }
})();
