(() => {
    'use strict';
    angular.module('app').controller('loginController', loginController);

    loginController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];
    function loginController($scope, $state, storeService, ajaxService) {
        const vm = this;
        vm.status = null;
        vm.username = null;
        vm.password = null;

        vm.login = login;

        function login(): void {
            vm.status = null;
            ajaxService.login(vm.username, vm.password).then((response: any) => {
                if (response.data.status === 'ERROR') {
                    vm.status = response.data.payload;
                } else {
                    $state.go('/');
                }
            });
        }
    }
})();
