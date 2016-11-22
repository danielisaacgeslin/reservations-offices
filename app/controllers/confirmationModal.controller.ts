(() => {
    'use strict';
    angular.module('app').controller('confirmationModalController', confirmationModalController);

    confirmationModalController.$inject = ['$scope', '$uibModalInstance', 'data'];
    function confirmationModalController($scope, $uibModalInstance, data) {
        const vm = this;

        vm.data = data;

        vm.cancel = cancel;
        vm.accept = accept;

        function cancel(): void {
            $uibModalInstance.dismiss('delete');
        }

        function accept(): void {
            $uibModalInstance.close();
        }
    }

})();
