(function () {
    'use strict';
    var MainController = (function () {
        function MainController($scope, $q, $rootScope, $state, $uibModal, storeService) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.storeService = storeService;
            this.visualization = 'calendar';
            this.date = new Date();
            this.reservations = {};
            this.reservationCount = 0;
            this.loading = false;
            this.getReservationList();
            this.storeService.getCurrentUser().then(function (user) {
                _this.currentUser = user;
            });
            this.$scope.$on('deleteReservation', this.deleteReservation.bind(this));
        }
        MainController.prototype.toastSuccess = function () {
            var defer = this.$q.defer();
            this.$rootScope.$broadcast('OK', '');
            defer.resolve();
            return defer.promise;
        };
        MainController.prototype.getReservationList = function () {
            var _this = this;
            var month = this.date.getMonth() + 1;
            var year = this.date.getFullYear();
            this.loading = true;
            this.storeService.getReservationList(month, year).then(function (reservations) {
                _this.reservations = reservations;
                _this.loading = false;
            });
        };
        MainController.prototype.deleteReservation = function (e, reservationId) {
            var _this = this;
            var date = this.reservations[reservationId].date;
            var title = 'About to delete a reservation';
            var body = 'You are about to delete "'
                .concat(this.reservations[reservationId].title)
                .concat(' - ')
                .concat(date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". This action cannot be reverted, are you sure?');
            var modalInstance = this.$uibModal.open({
                templateUrl: 'confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                resolve: {
                    data: {
                        title: title,
                        body: body
                    }
                }
            });
            modalInstance.result.then(function () {
                _this.storeService.deleteReservation(reservationId).then(_this.toastSuccess.bind(_this)).then(function () {
                    _this.$scope.$broadcast('updateCalendar');
                });
            });
        };
        MainController.prototype.switchVisualization = function (visualization) {
            this.visualization = visualization;
        };
        MainController.prototype.next = function () {
            this.date.setMonth(this.date.getMonth() + 1);
            this.getReservationList();
        };
        MainController.prototype.prev = function () {
            this.date.setMonth(this.date.getMonth() - 1);
            this.getReservationList();
        };
        MainController.prototype.checkVaidity = function (date) {
            var time = date.getTime();
            var yesterday = new Date().setDate(new Date().getDate() - 1);
            return time > yesterday;
        };
        MainController.$inject = ['$scope', '$q', '$rootScope', '$state', '$uibModal', 'storeService'];
        return MainController;
    }());
    angular.module('app').controller('mainController', MainController);
})();
