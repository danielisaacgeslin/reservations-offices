(() => {
    'use strict';

    class LoginController implements ng.IController{
        static $inject: string[] = ['$scope', '$state', 'storeService', 'ajaxService'];
        public status: string;
        public username: string;
        public password: string;

        constructor(
            public $scope: ng.IScope,
            private $state: ng.ui.IStateService,
            private storeService: any,
            private ajaxService: any) {
        }

        /*public functions*/
        public login(): void {
            this.status = null;
            this.ajaxService.login(this.username, this.password).then((response: any) => {
                if (response.data.status === 'ERROR') {
                    this.status = response.data.payload;
                } else {
                    this.$state.go('/');
                }
            });
        }
        /*end public functions*/
    }

    angular.module('app').controller('loginController', LoginController);
})();
