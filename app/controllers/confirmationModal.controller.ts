(() => {
    'use strict';

    class ConfirmationModalController implements ng.IController{
        static $inject: string[] = ['$scope', '$uibModalInstance', 'data'];

        constructor(
            public $scope: ng.IScope,
            private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
            public data: any) {
            this.data = data;
        }

        public cancel(): void {
            this.$uibModalInstance.dismiss('delete');
        }

        public accept(): void {
            this.$uibModalInstance.close();
        }
    }

    angular.module('app').controller('confirmationModalController', ConfirmationModalController);
})();
