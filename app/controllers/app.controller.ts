(() => {
    'use strict';

    class AppController implements ng.IController{
        static $inject: string[] = ['$scope', '$state', 'storeService', 'ajaxService', 'constants'];
        private route: string;
        public currentUser: IUser = {};
        public toasterData: IToasterData = {};
        public now: number = Date.now();

        constructor(
            public $scope: ng.IScope,
            private $state: ng.ui.IStateService,
            private storeService: any,
            private ajaxService: any,
            private constants: any) {
            this.init();
        }



        /*private functions*/
        private init(): void {
            this.$scope.$watch(() => this.$state.current, this.updateRoute.bind(this));
            this.$scope.$on('ERROR', this.toastError.bind(this));
            this.$scope.$on('OK', this.toastSuccess.bind(this));
            this.$scope.$on('goToLogin', this.goToLogin.bind(this));
            this.$scope.$on('goToRoot', this.goToRoot.bind(this));
            this.updateRoute();
        }

        private goToLogin(): void {
            this.$state.go('/login');
        }

        private goToRoot(): void {
            this.$state.go('/');
        }

        private toastError(e: any, data: any): void {
            const type = e.name;
            const message = data ? data : this.constants.genericErrorMessage;
            this.toasterData = { type: type, message: message };
        }

        private toastSuccess(e: any, data: any): void {
            const type = e.name;
            const message = data ? data : this.constants.genericSuccessMessage;
            this.toasterData = { type: type, message: message };
        }

        private updateRoute(): boolean {
            if (!this.$state.current.name || this.$state.current.name === '/login') {
                this.storeService.resetCurrentUser();
                this.currentUser = {};
                return false;
            }
            this.getCurrentUser().then(() => {
                this.route = this.$state.current.name;
                return true;
            });
            return true;
        }

        private getCurrentUser(): ng.IPromise<IUser> {
            return this.storeService.getCurrentUser().then((currentUser: IUser) => {
                this.currentUser = currentUser;
            });
        }

        public logout(): void {
            this.storeService.logout().then(() => {
                this.$state.go('/login');
            });
        }
    }

    angular.module('app').controller('appController', AppController);
})();
