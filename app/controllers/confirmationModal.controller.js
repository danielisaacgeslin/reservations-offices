(function () {
    'use strict';
    var ConfirmationModalController = (function () {
        function ConfirmationModalController($scope, $uibModalInstance, data) {
            this.$scope = $scope;
            this.$uibModalInstance = $uibModalInstance;
            this.data = data;
            this.data = data;
        }
        ConfirmationModalController.prototype.cancel = function () {
            this.$uibModalInstance.dismiss('delete');
        };
        ConfirmationModalController.prototype.accept = function () {
            this.$uibModalInstance.close();
        };
        ConfirmationModalController.$inject = ['$scope', '$uibModalInstance', 'data'];
        return ConfirmationModalController;
    }());
    angular.module('app').controller('confirmationModalController', ConfirmationModalController);
})();
