(() => {
    'use strict';
    angular.module('app').service('ajaxService', ajaxService);

    ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];
    function ajaxService($http, $httpParamSerializerJQLike, constants) {
        const url = constants.serviceUrl.concat('?route=');
        return {
            ping,
            checkSession,
            login,
            logout,
            getCurrentUser,
            reservationValidity,
            getReservation,
            getReservationList,
            getReservationTagList,
            getComments,
            getTags,
            getSpaces,
            saveReservation,
            updateReservation,
            deleteReservation,
            addTag,
            removeTag,
            saveComment,
            deleteComment,
            updateComment,
            saveTag
        };
        /*N/A*/
        function ping(): ng.IPromise<any> {
            return $http.get(url.concat('ping'));
        }

        /*N/A*/
        function checkSession(): ng.IPromise<any> {
            return $http.get(url.concat('checkSession'));
        }

        function login(username: string, password: string): ng.IPromise<any> {
            return $http({
                url: url.concat('login'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({ username, password })
            });
        }

        function logout(): ng.IPromise<any> {
            return $http.get(url.concat('logout'));
        }

        function getCurrentUser(): ng.IPromise<any> {
            return $http.get(url.concat('getCurrentUser'));
        }

        function reservationValidity(id: string, day: string, month: string, year: string, from: string, to: string, space: string): ng.IPromise<any> {
            return $http.get(url
                .concat('reservationValidity&day=').concat(day)
                .concat('&month=').concat(month)
                .concat('&year=').concat(year)
                .concat('&from=').concat(from)
                .concat('&to=').concat(to)
                .concat('&space=').concat(space)
                .concat('&id=').concat(id));
        }

        /*reservation_id(int)*/
        function getReservation(reservationId: number): ng.IPromise<any> {
            return $http.get(url.concat('getReservation&id=').concat(reservationId.toString()));
        }

        /*N/A*/
        function getReservationList(month: number, year: number): ng.IPromise<any> {
            return $http.get(url.concat('getReservationList&month=')
                .concat(month.toString()).concat('&year=')
                .concat(year.toString()));
        }

        /*reservation_id(int)*/
        function getReservationTagList(reservationId: number): ng.IPromise<any> {
            return $http.get(url.concat('getReservationTagList&reservation_id=')
                .concat(reservationId.toString()));
        }

        /*reservation_id(int)*/
        function getComments(reservationId: number): ng.IPromise<any> {
            return $http.get(url.concat('getComments&reservation_id=')
                .concat(reservationId.toString()));
        }

        /*N/A*/
        function getTags(): ng.IPromise<any> {
            return $http.get(url.concat('getTags'));
        }

        function getSpaces(): ng.IPromise<any> {
            return $http.get(url.concat('getSpaces'));
        }

        /*title(string), description(string), body(string)*/
        function saveReservation(obj: IReservation): ng.IPromise<any> {
            return $http({
                url: url.concat('saveReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike(obj)
            });
        }

        /*reservation_id(int), title(string), description(string), body(string)*/
        function updateReservation(obj: IReservation): ng.IPromise<any> {
            return $http({
                url: url.concat('updateReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike(obj)
            });
        }

        /*reservation_id(int)*/
        function deleteReservation(reservationId: number): ng.IPromise<any> {
            return $http({
                url: url.concat('deleteReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({ reservationId })
            });
        }

        /*reservation_id(int), tag_id(int)*/
        function addTag(reservationId: number, tagId: number): ng.IPromise<any> {
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

        /*reservation_id(int), tag_id(int)*/
        function removeTag(reservationId: number, tagId: number): ng.IPromise<any> {
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

        /*comment(string), reservation_id(int)*/
        function saveComment(comment: string, reservationId: number): ng.IPromise<any> {
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

        /*comment_id(int)*/
        function deleteComment(commentId: number): ng.IPromise<any> {
            return $http({
                url: url.concat('deleteComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $httpParamSerializerJQLike({
                    comment_id: commentId
                })
            });
        }

        /*comment_id(int), comment(string)*/
        function updateComment(comment: string, commentId: number): ng.IPromise<any> {
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

        /*tag(string)*/
        function saveTag(tag: ITag): ng.IPromise<any> {
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
}
)();
