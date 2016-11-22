(() => {
    'use strict';
    angular.module('app').controller('mainController', mainController);

    mainController.$inject = ['$scope', '$q', '$rootScope', '$state', '$uibModal', 'storeService'];
    function mainController($scope, $q, $rootScope, $state, $uibModal, storeService) {
        const vm = this;
        vm.visualization = 'calendar';
        vm.date = new Date();
        vm.reservations = {};
        vm.reservationCount = 0;
        vm.currentUser = null;
        vm.loading = false;

        vm.getReservationList = getReservationList;
        vm.deleteReservation = deleteReservation;
        vm.switchVisualization = switchVisualization;
        vm.next = next;
        vm.prev = prev;
        vm.checkVaidity = checkVaidity;

        _init();

        function _init() {
            getReservationList();
            storeService.getCurrentUser().then((user: IUser) => {
                vm.currentUser = <IUser>user;
            });
            $scope.$on('deleteReservation', deleteReservation);
        }

        function _toastSuccess(): ng.IPromise<any> {
            const defer = $q.defer();
            $rootScope.$broadcast('OK', '');
            defer.resolve();
            return defer.promise;
        }

        function getReservationList(): void {
            const month: number = vm.date.getMonth() + 1;
            const year: number = vm.date.getFullYear();

            vm.loading = true;

            storeService.getReservationList(month, year).then((reservations) => {
                vm.reservations = reservations;
                vm.loading = false;
            });
        }

        function deleteReservation(e: any, reservationId: number): void {
            const date: Date = vm.reservations[reservationId].date;
            const title: string = 'About to delete a reservation';
            const body: string = 'You are about to delete "'
                .concat(vm.reservations[reservationId].title)
                .concat(' - ')
                .concat(date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". This action cannot be reverted, are you sure?');

            const modalInstance: any = $uibModal.open({
                templateUrl: 'markup/confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                //windowClass : '',
                //backdrop : 'static',
                //keyboard : false,
                resolve: { data: { title, body } }
            });

            /*accepting deletion*/
            modalInstance.result.then(() => {
                storeService.deleteReservation(reservationId).then(_toastSuccess).then(() => {
                    $scope.$broadcast('updateCalendar');
                });
            });
        }

        function switchVisualization(visualization: string): void {
            vm.visualization = visualization;
        }

        function next(): void {
            vm.date.setMonth(vm.date.getMonth() + 1);
            getReservationList();
        }

        function prev(): void {
            vm.date.setMonth(vm.date.getMonth() - 1);
            getReservationList();
        }

        function checkVaidity(date): boolean {
            const time: number = date.getTime();
            const yesterday: number = new Date().setDate(new Date().getDate() - 1);
            return time > yesterday;
        }
    }
})();
