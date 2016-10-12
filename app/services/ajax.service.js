(function () {
    'use strict';
    angular.module('app').factory('ajaxService', ajaxService);
    ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];
    function ajaxService($http, $httpParamSerializerJQLike, constants) {
        var url = constants.serviceUrl;
        return {
            ping: ping,
            checkSession: checkSession,
            getReservation: getReservation,
            getReservationList: getReservationList,
            getReservationTagList: getReservationTagList,
            getComments: getComments,
            getTags: getTags,
            logout: logout,
            reservationValidity: reservationValidity,
            getCurrentUser: getCurrentUser,
            getSpaces: getSpaces,
            saveReservation: saveReservation,
            updateReservation: updateReservation,
            deleteReservation: deleteReservation,
            addTag: addTag,
            removeTag: removeTag,
            saveComment: saveComment,
            deleteComment: deleteComment,
            updateComment: updateComment,
            saveTag: saveTag,
            login: login
        };
        function ping() {
            return $http.get(url.concat('?route=ping'));
        }
        function checkSession() {
            return $http.get(url.concat('?route=checkSession'));
        }
        function login(username, password) {
            return $http({
                url: url.concat('?route=login'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    username: username,
                    password: password
                })
            });
        }
        function logout() {
            return $http.get(url.concat('?route=logout'));
        }
        function getCurrentUser() {
            return $http.get(url.concat('?route=getCurrentUser'));
        }
        function reservationValidity(id, day, month, year, from, to, space) {
            return $http.get(url
                .concat('?route=reservationValidity&day=').concat(day)
                .concat('&month=').concat(month)
                .concat('&year=').concat(year)
                .concat('&from=').concat(from)
                .concat('&to=').concat(to)
                .concat('&space=').concat(space)
                .concat('&id=').concat(id));
        }
        function getReservation(reservationId) {
            return $http.get(url.concat('?route=getReservation&id=').concat(reservationId));
        }
        function getReservationList(month, year) {
            return $http.get(url.concat('?route=getReservationList&month=').concat(month).concat('&year=').concat(year));
        }
        function getReservationTagList(reservationId) {
            return $http.get(url.concat('?route=getReservationTagList&reservation_id=').concat(reservationId));
        }
        function getComments(reservationId) {
            return $http.get(url.concat('?route=getComments&reservation_id=').concat(reservationId));
        }
        function getTags() {
            return $http.get(url.concat('?route=getTags'));
        }
        function getSpaces() {
            return $http.get(url.concat('?route=getSpaces'));
        }
        function saveReservation(obj) {
            return $http({
                url: url.concat('?route=saveReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike(obj)
            });
        }
        function updateReservation(obj) {
            return $http({
                url: url.concat('?route=updateReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike(obj)
            });
        }
        function deleteReservation(reservationId) {
            return $http({
                url: url.concat('?route=deleteReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    reservation_id: reservationId
                })
            });
        }
        function addTag(reservationId, tagId) {
            return $http({
                url: url.concat('?route=addTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    reservation_id: reservationId,
                    tag_id: tagId
                })
            });
        }
        function removeTag(reservationId, tagId) {
            return $http({
                url: url.concat('?route=removeTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    reservation_id: reservationId,
                    tag_id: tagId
                })
            });
        }
        function saveComment(comment, reservationId) {
            return $http({
                url: url.concat('?route=saveComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    comment: comment,
                    reservation_id: reservationId
                })
            });
        }
        function deleteComment(commentId) {
            return $http({
                url: url.concat('?route=deleteComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    comment_id: commentId
                })
            });
        }
        function updateComment(comment, commentId) {
            return $http({
                url: url.concat('?route=updateComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    comment_id: commentId,
                    comment: comment
                })
            });
        }
        function saveTag(tag) {
            return $http({
                url: url.concat('?route=saveTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    tag: tag
                })
            });
        }
    }
})();
