(function () {
    'use strict';
    var AjaxService = (function () {
        function AjaxService($http, $httpParamSerializerJQLike, constants) {
            this.$http = $http;
            this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
            this.constants = constants;
            this.url = this.constants.serviceUrl.concat('?route=');
        }
        AjaxService.prototype.ping = function () {
            return this.$http.get(this.url.concat('ping'));
        };
        AjaxService.prototype.checkSession = function () {
            return this.$http.get(this.url.concat('checkSession'));
        };
        AjaxService.prototype.login = function (username, password) {
            return this.$http({
                url: this.url.concat('login'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    username: username,
                    password: password
                })
            });
        };
        AjaxService.prototype.logout = function () {
            return this.$http.get(this.url.concat('logout'));
        };
        AjaxService.prototype.getCurrentUser = function () {
            return this.$http.get(this.url.concat('getCurrentUser'));
        };
        AjaxService.prototype.reservationValidity = function (id, day, month, year, from, to, space) {
            return this.$http.get(this.url
                .concat('reservationValidity&day=').concat(day)
                .concat('&month=').concat(month)
                .concat('&year=').concat(year)
                .concat('&from=').concat(from)
                .concat('&to=').concat(to)
                .concat('&space=').concat(space)
                .concat('&id=').concat(id));
        };
        AjaxService.prototype.getReservation = function (reservationId) {
            return this.$http.get(this.url.concat('getReservation&id=').concat(reservationId.toString()));
        };
        AjaxService.prototype.getReservationList = function (month, year) {
            return this.$http.get(this.url.concat('getReservationList&month=')
                .concat(month.toString()).concat('&year=')
                .concat(year.toString()));
        };
        AjaxService.prototype.getReservationTagList = function (reservationId) {
            return this.$http.get(this.url.concat('getReservationTagList&reservation_id=')
                .concat(reservationId.toString()));
        };
        AjaxService.prototype.getComments = function (reservationId) {
            return this.$http.get(this.url.concat('getComments&reservation_id=')
                .concat(reservationId.toString()));
        };
        AjaxService.prototype.getTags = function () {
            return this.$http.get(this.url.concat('getTags'));
        };
        AjaxService.prototype.getSpaces = function () {
            return this.$http.get(this.url.concat('getSpaces'));
        };
        AjaxService.prototype.saveReservation = function (obj) {
            return this.$http({
                url: this.url.concat('saveReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike(obj)
            });
        };
        AjaxService.prototype.updateReservation = function (obj) {
            return this.$http({
                url: this.url.concat('updateReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike(obj)
            });
        };
        AjaxService.prototype.deleteReservation = function (reservationId) {
            return this.$http({
                url: this.url.concat('deleteReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    reservation_id: reservationId
                })
            });
        };
        AjaxService.prototype.addTag = function (reservationId, tagId) {
            return this.$http({
                url: this.url.concat('addTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    reservation_id: reservationId,
                    tag_id: tagId
                })
            });
        };
        AjaxService.prototype.removeTag = function (reservationId, tagId) {
            return this.$http({
                url: this.url.concat('removeTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    reservation_id: reservationId,
                    tag_id: tagId
                })
            });
        };
        AjaxService.prototype.saveComment = function (comment, reservationId) {
            return this.$http({
                url: this.url.concat('saveComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    comment: comment,
                    reservation_id: reservationId
                })
            });
        };
        AjaxService.prototype.deleteComment = function (commentId) {
            return this.$http({
                url: this.url.concat('deleteComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    comment_id: commentId
                })
            });
        };
        AjaxService.prototype.updateComment = function (comment, commentId) {
            return this.$http({
                url: this.url.concat('updateComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    comment_id: commentId,
                    comment: comment
                })
            });
        };
        AjaxService.prototype.saveTag = function (tag) {
            return this.$http({
                url: this.url.concat('saveTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    tag: tag
                })
            });
        };
        AjaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];
        return AjaxService;
    }());
    angular.module('app').service('ajaxService', AjaxService);
})();
