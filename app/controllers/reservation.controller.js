(function () {
    'use strict';
    var ReservationController = (function () {
        function ReservationController($scope, $rootScope, $state, $q, $uibModal, storeService, ajaxService, processService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.storeService = storeService;
            this.ajaxService = ajaxService;
            this.processService = processService;
            this.$inject = ['this.$scope', '$rootScope', '$state', '$q', '$uibModal', 'storeService', 'ajaxService', 'processService'];
            this.reservation = {};
            this.newComment = '';
            this.editableComment = -1;
            this.editableCommentText = '';
            this.filteredTags = {};
            this.noTagOption = { 0: { id: 0, text: 'No tags available' } };
            this.times = this.getTimes();
            this.currentUser = {};
            this.tags = {};
            this.spaces = {};
            this.lastCheck = {};
            this.editEnabled = true;
            this.reservationValidity = true;
            this.ableToCheckVailidity = false;
            this.loading = false;
            this.edition = {
                title: null,
                description: null,
                body: null,
                from_time: 7,
                to_time: 8,
                space: 1,
                date: new Date()
            };
            this.init();
        }
        ReservationController.prototype.init = function () {
            var _this = this;
            this.$scope.$watchGroup([
                function () { return _this.edition.date; },
                function () { return _this.edition.from_time; },
                function () { return _this.edition.to_time; },
                function () { return _this.edition.space; }
            ], this.checkValidity.bind(this));
            if (isNaN(this.$state.params.id)) {
                this.ableToCheckVailidity = true;
                if (this.$state.params.date && !isNaN(this.$state.params.date)) {
                    this.edition.date = new Date(Number(this.$state.params.date));
                }
                this.$q.all([this.getCurrentUser(), this.getTags(), this.getSpaces()]).then(this.filterTags.bind(this));
            }
            else {
                this.getCurrentUser().then(this.getReservation.bind(this)).then(function () {
                    _this.ableToCheckVailidity = true;
                    _this.getComments();
                    _this.checkValidity();
                    _this.$q.all([_this.getReservationTagList(), _this.getTags(), _this.getSpaces()]).then(_this.filterTags.bind(_this));
                });
            }
        };
        ReservationController.prototype.getTimes = function () {
            var times = [];
            for (var i = 1; i <= 24; i++) {
                times.push(i);
            }
            return times;
        };
        ReservationController.prototype.toastSuccess = function () {
            var defer = this.$q.defer();
            this.$rootScope.$broadcast('OK', '');
            defer.resolve();
            this.loading = false;
            return defer.promise;
        };
        ReservationController.prototype.getCurrentUser = function () {
            var _this = this;
            return this.storeService.getCurrentUser().then(function (user) {
                _this.currentUser = user;
            });
        };
        ReservationController.prototype.checkValidity = function () {
            var _this = this;
            var id = this.reservation.id;
            var day = this.processService.addZeros(this.edition.date.getDate());
            var month = this.processService.addZeros(this.edition.date.getMonth() + 1);
            var year = this.edition.date.getFullYear();
            var from = this.edition.from_time;
            var to = this.edition.to_time;
            var space = this.edition.space;
            var check = {
                id: id,
                day: day,
                month: month,
                year: year,
                from: from,
                to: to,
                space: space
            };
            var valid = Boolean(!!day && !!month && !!year && !!from && !!to && !!space);
            if (!this.ableToCheckVailidity || !valid || angular.equals(check, this.lastCheck)) {
                this.reservationValidity = false;
                return false;
            }
            this.lastCheck = check;
            this.ajaxService.reservationValidity(id, day, month, year, from, to, space).then(function (response) {
                _this.reservationValidity = response.data.payload;
            });
        };
        ReservationController.prototype.getReservation = function () {
            var _this = this;
            var defer = this.$q.defer();
            this.storeService.getReservation(this.tempId ? this.tempId : this.$state.params.id).then(function (reservation) {
                _this.reservation = reservation;
                _this.edition = Object.assign({}, reservation);
                _this.editEnabled = (_this.currentUser.id === reservation.creation_user) && reservation.date.getTime() > Date.now();
                defer.resolve();
            }).catch(function () {
                _this.$state.go('/reservation', { id: 'new', date: Date.now() });
                _this.storeService.resetReservations();
                defer.reject();
            });
            return defer.promise;
        };
        ReservationController.prototype.getComments = function () {
            return this.storeService.getComments(this.reservation.id);
        };
        ReservationController.prototype.getReservationTagList = function () {
            return this.storeService.getReservationTagList(this.reservation.id);
        };
        ReservationController.prototype.getTags = function () {
            var _this = this;
            return this.storeService.getTags().then(function (tags) {
                _this.tags = tags;
            });
        };
        ReservationController.prototype.getSpaces = function () {
            var _this = this;
            return this.storeService.getSpaces().then(function (spaces) {
                _this.spaces = spaces;
            });
        };
        ReservationController.prototype.filterTags = function () {
            var filteredTags = {};
            var marker;
            if (!this.reservation.id) {
                this.filteredTags = this.noTagOption;
                this.selectedTag = this.filteredTags[Object.keys(this.filteredTags)[0]];
                return false;
            }
            for (var tagKey in this.tags) {
                marker = true;
                for (var reservationTagKey in this.reservation.tags) {
                    if (reservationTagKey === this.tags[tagKey].id) {
                        marker = false;
                        break;
                    }
                }
                if (marker) {
                    filteredTags[tagKey] = Object.assign({}, this.tags[tagKey]);
                }
            }
            this.filteredTags = filteredTags;
            if (!Object.keys(this.filteredTags).length) {
                this.filteredTags = this.noTagOption;
            }
            this.selectedTag = this.filteredTags[Object.keys(this.filteredTags)[0]];
        };
        ReservationController.prototype.setReservation = function () {
            var _this = this;
            this.edition.title = this.edition.title ? this.edition.title : ' ';
            this.loading = true;
            var obj = {
                title: this.edition.title,
                description: this.edition.description,
                body: this.edition.body,
                date: this.edition.date,
                from: this.edition.from_time,
                to: this.edition.to_time,
                space: this.edition.space,
                reservation_id: this.reservation.id
            };
            return this.storeService.setReservation(obj).then(function (id) {
                _this.lastCheck = null;
                if (!_this.reservation.id) {
                    _this.tempId = id;
                    _this.$state.go('/reservation', { id: id }, {
                        notify: false,
                        reload: false,
                        location: 'replace',
                        inherit: true
                    });
                }
            }).then(this.toastSuccess.bind(this));
        };
        ReservationController.prototype.toggleEdit = function () {
            this.editEnabled = !this.editEnabled;
            if (!this.editEnabled) {
                this.edition = Object.assign({}, this.reservation);
            }
        };
        ReservationController.prototype.saveReservation = function () {
            var date = this.edition.date;
            var title = 'About to save a reservation';
            var body = 'You are about to save "'
                .concat(this.edition.title)
                .concat(' - ')
                .concat(date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". Are you sure?');
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
            modalInstance.result
                .then(this.setReservation.bind(this))
                .then(this.getReservation.bind(this))
                .then(this.getReservationTagList.bind(this))
                .then(this.getComments.bind(this))
                .then(this.filterTags.bind(this));
        };
        ReservationController.prototype.saveComment = function () {
            var _this = this;
            this.loading = true;
            return this.storeService.setComment(this.newComment, this.reservation.id).then(function () {
                _this.newComment = '';
            }).then(this.toastSuccess.bind(this));
        };
        ReservationController.prototype.updateComment = function (commentId) {
            this.loading = true;
            return this.storeService.setComment(this.editableCommentText, null, commentId)
                .then(this.toastSuccess.bind(this))
                .then(this.editComment.bind(this));
        };
        ReservationController.prototype.editComment = function (index, commentId) {
            this.editableCommentText = '';
            if (this.editableComment === index) {
                this.editableComment = -1;
            }
            else {
                this.editableComment = index;
                this.editableCommentText = !commentId ? '' : this.reservation.comments[commentId].text;
            }
        };
        ReservationController.prototype.deleteComment = function (commentId) {
            var _this = this;
            var date = this.edition.date;
            var title = 'About to delete a comment';
            var body = 'Are you sure?';
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
                _this.loading = true;
                return _this.storeService.deleteComment(commentId, _this.reservation.id)
                    .then(_this.toastSuccess.bind(_this));
            });
        };
        ReservationController.prototype.setTag = function () {
            this.loading = true;
            return this.storeService.setTag(this.reservation.id, this.selectedTag.id)
                .then(this.getReservationTagList.bind(this))
                .then(this.toastSuccess.bind(this))
                .then(this.filterTags.bind(this));
        };
        ReservationController.prototype.deleteTag = function (tagId) {
            this.loading = true;
            return this.storeService.deleteTag(this.reservation.id, tagId)
                .then(this.toastSuccess.bind(this))
                .then(this.filterTags.bind(this));
        };
        return ReservationController;
    }());
    angular.module('app').controller('reservationController', ReservationController);
})();
