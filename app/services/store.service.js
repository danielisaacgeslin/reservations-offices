(function () {
    'use strict';
    var StoreService = (function () {
        function StoreService(ajaxService, processService, $q) {
            this.ajaxService = ajaxService;
            this.processService = processService;
            this.$q = $q;
            this.reservations = {};
            this.comments = {};
            this.tags = {};
            this.spaces = {};
            this.currentUser = {};
        }
        StoreService.prototype.logout = function () {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.logout().then(function () {
                _this.resetCurrentUser();
                _this.resetReservations();
                _this.resetTags();
                _this.resetComments();
                defer.resolve();
            });
            return defer.promise;
        };
        StoreService.prototype.getCurrentUser = function () {
            var _this = this;
            var adapted = null;
            var firstRequest = false;
            if (!this.currentUserDefer) {
                firstRequest = true;
                this.currentUserDefer = this.$q.defer();
            }
            if (this.currentUser.id) {
                this.currentUserDefer.resolve(this.currentUser);
            }
            if (!this.currentUser.id && firstRequest) {
                this.ajaxService.getCurrentUser().then(function (response) {
                    adapted = _this.processService.dbArrayAdapter([response.data.payload]);
                    _this.currentUser = adapted[Object.keys(adapted)[0]];
                    _this.currentUserDefer.resolve(_this.currentUser);
                });
            }
            return this.currentUserDefer.promise;
        };
        StoreService.prototype.getReservation = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            var reservation;
            if (this.reservations[reservationId]) {
                defer.resolve(this.reservations[reservationId]);
            }
            else {
                this.ajaxService.getReservation(reservationId).then(function (response) {
                    if (!response.data.payload.length) {
                        defer.reject();
                        return defer.promise;
                    }
                    reservation = _this.processService.dbArrayAdapter(response.data.payload);
                    _this.reservations[reservationId] = reservation[Object.keys(reservation)[0]];
                    defer.resolve(_this.reservations[reservationId]);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.getReservationList = function (month, year) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.getReservationList(month, year).then(function (response) {
                _this.reservations = Object.assign(_this.processService.dbArrayAdapter(response.data.payload), _this.reservations);
                defer.resolve(_this.reservations);
            });
            return defer.promise;
        };
        StoreService.prototype.getReservationTagList = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            var reservationTags;
            this.ajaxService.getReservationTagList(reservationId).then(function (response) {
                reservationTags = _this.processService.dbArrayAdapter(response.data.payload);
                Object.assign(_this.tags, reservationTags);
                _this.reservations[reservationId].tags = reservationTags;
                defer.resolve(reservationTags);
            });
            return defer.promise;
        };
        StoreService.prototype.getComments = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            var newComments;
            this.ajaxService.getComments(reservationId).then(function (response) {
                newComments = _this.processService.dbArrayAdapter(response.data.payload);
                Object.assign(_this.comments, newComments);
                _this.reservations[reservationId].comments = newComments;
                defer.resolve();
            });
            return defer.promise;
        };
        StoreService.prototype.getTags = function () {
            var _this = this;
            var defer = this.$q.defer();
            if (Object.keys(this.tags).length) {
                defer.resolve(this.tags);
            }
            else {
                this.ajaxService.getTags().then(function (response) {
                    _this.tags = Object.assign(_this.processService.dbArrayAdapter(response.data.payload), _this.tags);
                    defer.resolve(_this.tags);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.getSpaces = function () {
            var _this = this;
            var defer = this.$q.defer();
            if (Object.keys(this.spaces).length) {
                defer.resolve(this.spaces);
            }
            else {
                this.ajaxService.getSpaces().then(function (response) {
                    _this.spaces = Object.assign(_this.processService.dbArrayAdapter(response.data.payload), _this.spaces);
                    defer.resolve(_this.spaces);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.setReservation = function (obj) {
            var _this = this;
            var defer = this.$q.defer();
            if (!obj.reservation_id) {
                this.ajaxService.saveReservation(obj).then(function (response) {
                    defer.resolve(response.data.payload);
                });
            }
            else {
                this.ajaxService.updateReservation(obj).then(function (response) {
                    _this.resetReservation(obj.reservation_id);
                    defer.resolve(obj.reservation_id);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.setTag = function (reservationId, tagId, tag) {
            var defer = this.$q.defer();
            this.ajaxService.addTag(reservationId, tagId).then(function (response) {
                defer.resolve(response.data.payload);
            });
            return defer.promise;
        };
        StoreService.prototype.setComment = function (comment, reservationId, commentId) {
            var _this = this;
            var defer = this.$q.defer();
            var newComment = {};
            if (comment && commentId) {
                this.ajaxService.updateComment(comment, commentId).then(function (response) {
                    _this.comments[commentId].text = comment;
                    defer.resolve(response);
                });
            }
            else {
                this.ajaxService.saveComment(comment, reservationId).then(function (response) {
                    newComment = {
                        id: response.data.payload,
                        text: comment,
                        creation_timestamp: new Date(),
                        creation_user: _this.currentUser.id,
                        floor: _this.currentUser.floor,
                        department: _this.currentUser.department
                    };
                    _this.comments[response.data.payload] = newComment;
                    _this.reservations[reservationId].comments[response.data.payload] = newComment;
                    defer.resolve(response);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.deleteTag = function (reservationId, tagId) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.removeTag(reservationId, tagId).then(function (response) {
                delete _this.reservations[reservationId].tags[tagId];
                defer.resolve();
            });
            return defer.promise;
        };
        StoreService.prototype.deleteReservation = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.deleteReservation(reservationId).then(function (response) {
                if (_this.reservations[reservationId].comments) {
                    for (var key in _this.reservations[reservationId].comments) {
                        delete _this.comments[key];
                    }
                }
                delete _this.reservations[reservationId];
                defer.resolve(response);
            });
            return defer.promise;
        };
        StoreService.prototype.deleteComment = function (commentId, reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.deleteComment(commentId).then(function (response) {
                delete _this.comments[commentId];
                delete _this.reservations[reservationId].comments[commentId];
                defer.resolve(response);
            });
            return defer.promise;
        };
        StoreService.prototype.resetReservations = function () {
            this.reservations = {};
        };
        StoreService.prototype.resetReservation = function (reservationId) {
            delete this.reservations[reservationId];
        };
        StoreService.prototype.resetTags = function () {
            this.tags = {};
        };
        StoreService.prototype.resetComments = function () {
            this.comments = {};
        };
        StoreService.prototype.resetCurrentUser = function () {
            this.currentUserDefer = null;
            this.currentUser = {};
        };
        StoreService.$inject = ['ajaxService', 'processService', '$q'];
        return StoreService;
    }());
    angular.module('app').service('storeService', StoreService);
})();
