(function () {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope, $state, storeService, ajaxService) {
            this.$scope = $scope;
            this.$state = $state;
            this.storeService = storeService;
            this.ajaxService = ajaxService;
        }
        LoginController.prototype.login = function () {
            var _this = this;
            this.status = null;
            this.ajaxService.login(this.username, this.password).then(function (response) {
                if (response.data.status === 'ERROR') {
                    _this.status = response.data.payload;
                }
                else {
                    _this.$state.go('/');
                }
            });
        };
        LoginController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];
        return LoginController;
    }());
    angular.module('app').controller('loginController', LoginController);
})();
