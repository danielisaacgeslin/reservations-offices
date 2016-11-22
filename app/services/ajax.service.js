(function () {
    'use strict';
    angular.module('app').service('ajaxService', ajaxService);
    ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];
    function ajaxService($http, $httpParamSerializerJQLike, constants) {
        var url = constants.serviceUrl.concat('?route=');
        return {
            ping: ping,
            checkSession: checkSession,
            login: login,
            logout: logout,
            getCurrentUser: getCurrentUser,
            reservationValidity: reservationValidity,
            getReservation: getReservation,
            getReservationList: getReservationList,
            getReservationTagList: getReservationTagList,
            getComments: getComments,
            getTags: getTags,
            getSpaces: getSpaces,
            saveReservation: saveReservation,
            updateReservation: updateReservation,
            deleteReservation: deleteReservation,
            addTag: addTag,
            removeTag: removeTag,
            saveComment: saveComment,
            deleteComment: deleteComment,
            updateComment: updateComment,
            saveTag: saveTag
        };
        function ping() {
            return $http.get(url.concat('ping'));
        }
        function checkSession() {
            return $http.get(url.concat('checkSession'));
        }
        function login(username, password) {
            return $http({
                url: url.concat('login'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({ username: username, password: password })
            });
        }
        function logout() {
            return $http.get(url.concat('logout'));
        }
        function getCurrentUser() {
            return $http.get(url.concat('getCurrentUser'));
        }
        function reservationValidity(id, day, month, year, from, to, space) {
            return $http.get(url
                .concat('reservationValidity&day=').concat(day)
                .concat('&month=').concat(month)
                .concat('&year=').concat(year)
                .concat('&from=').concat(from)
                .concat('&to=').concat(to)
                .concat('&space=').concat(space)
                .concat('&id=').concat(id));
        }
        function getReservation(reservationId) {
            return $http.get(url.concat('getReservation&id=').concat(reservationId.toString()));
        }
        function getReservationList(month, year) {
            return $http.get(url.concat('getReservationList&month=')
                .concat(month.toString()).concat('&year=')
                .concat(year.toString()));
        }
        function getReservationTagList(reservationId) {
            return $http.get(url.concat('getReservationTagList&reservation_id=')
                .concat(reservationId.toString()));
        }
        function getComments(reservationId) {
            return $http.get(url.concat('getComments&reservation_id=')
                .concat(reservationId.toString()));
        }
        function getTags() {
            return $http.get(url.concat('getTags'));
        }
        function getSpaces() {
            return $http.get(url.concat('getSpaces'));
        }
        function saveReservation(obj) {
            return $http({
                url: url.concat('saveReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike(obj)
            });
        }
        function updateReservation(obj) {
            return $http({
                url: url.concat('updateReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike(obj)
            });
        }
        function deleteReservation(reservationId) {
            return $http({
                url: url.concat('deleteReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({ reservationId: reservationId })
            });
        }
        function addTag(reservationId, tagId) {
            return $http({
                url: url.concat('addTag'),
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
                url: url.concat('removeTag'),
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
                url: url.concat('saveComment'),
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
                url: url.concat('deleteComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    comment_id: commentId
                })
            });
        }
        function updateComment(comment, commentId) {
            return $http({
                url: url.concat('updateComment'),
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
                url: url.concat('saveTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    tag: tag
                })
            });
        }
    }
})();
