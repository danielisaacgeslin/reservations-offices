(function () {
    'use strict';
    var AppController = (function () {
        function AppController($scope, $state, storeService, ajaxService, constants) {
            this.$scope = $scope;
            this.$state = $state;
            this.storeService = storeService;
            this.ajaxService = ajaxService;
            this.constants = constants;
            this.currentUser = {};
            this.toasterData = {};
            this.init();
        }
        AppController.prototype.init = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.$state.current; }, this.updateRoute.bind(this));
            this.$scope.$on('ERROR', this.toastError.bind(this));
            this.$scope.$on('OK', this.toastSuccess.bind(this));
            this.$scope.$on('goToLogin', this.goToLogin.bind(this));
            this.$scope.$on('goToRoot', this.goToRoot.bind(this));
            this.updateRoute();
        };
        AppController.prototype.goToLogin = function () {
            this.$state.go('/login');
        };
        AppController.prototype.goToRoot = function () {
            this.$state.go('/');
        };
        AppController.prototype.toastError = function (e, data) {
            var type = e.name;
            var message = data ? data : this.constants.genericErrorMessage;
            this.toasterData = { type: type, message: message };
        };
        AppController.prototype.toastSuccess = function (e, data) {
            var type = e.name;
            var message = data ? data : this.constants.genericSuccessMessage;
            this.toasterData = { type: type, message: message };
        };
        AppController.prototype.updateRoute = function () {
            var _this = this;
            if (!this.$state.current.name || this.$state.current.name === '/login') {
                this.storeService.resetCurrentUser();
                this.currentUser = {};
                return false;
            }
            this.getCurrentUser().then(function () {
                _this.route = _this.$state.current.name;
                return true;
            });
            return true;
        };
        AppController.prototype.getCurrentUser = function () {
            var _this = this;
            return this.storeService.getCurrentUser().then(function (currentUser) {
                _this.currentUser = currentUser;
            });
        };
        AppController.prototype.logout = function () {
            var _this = this;
            this.storeService.logout().then(function () {
                _this.$state.go('/login');
            });
        };
        AppController.$inject = ['$scope', '$state', 'storeService', 'ajaxService', 'constants'];
        return AppController;
    }());
    angular.module('app').controller('appController', AppController);
})();
