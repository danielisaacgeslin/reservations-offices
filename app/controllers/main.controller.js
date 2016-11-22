(function () {
    'use strict';
    angular.module('app').controller('mainController', mainController);
    mainController.$inject = ['$scope', '$q', '$rootScope', '$state', '$uibModal', 'storeService'];
    function mainController($scope, $q, $rootScope, $state, $uibModal, storeService) {
        var vm = this;
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
            storeService.getCurrentUser().then(function (user) {
                vm.currentUser = user;
            });
            $scope.$on('deleteReservation', deleteReservation);
        }
        function _toastSuccess() {
            var defer = $q.defer();
            $rootScope.$broadcast('OK', '');
            defer.resolve();
            return defer.promise;
        }
        function getReservationList() {
            var month = vm.date.getMonth() + 1;
            var year = vm.date.getFullYear();
            vm.loading = true;
            storeService.getReservationList(month, year).then(function (reservations) {
                vm.reservations = reservations;
                vm.loading = false;
            });
        }
        function deleteReservation(e, reservationId) {
            var date = vm.reservations[reservationId].date;
            var title = 'About to delete a reservation';
            var body = 'You are about to delete "'
                .concat(vm.reservations[reservationId].title)
                .concat(' - ')
                .concat(date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". This action cannot be reverted, are you sure?');
            var modalInstance = $uibModal.open({
                templateUrl: 'markup/confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                resolve: { data: { title: title, body: body } }
            });
            modalInstance.result.then(function () {
                storeService.deleteReservation(reservationId).then(_toastSuccess).then(function () {
                    $scope.$broadcast('updateCalendar');
                });
            });
        }
        function switchVisualization(visualization) {
            vm.visualization = visualization;
        }
        function next() {
            vm.date.setMonth(vm.date.getMonth() + 1);
            getReservationList();
        }
        function prev() {
            vm.date.setMonth(vm.date.getMonth() - 1);
            getReservationList();
        }
        function checkVaidity(date) {
            var time = date.getTime();
            var yesterday = new Date().setDate(new Date().getDate() - 1);
            return time > yesterday;
        }
    }
})();
