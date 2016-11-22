(() => {
    'use strict';

    angular.module('app').service('storeService', storeService);

    storeService.$inject = ['ajaxService', 'processService', '$q'];
    function storeService(ajaxService, processService, $q) {
        let reservations = {};
        let comments = {};
        let tags = {};
        let spaces = {};
        let currentUser: IUser = {};
        let currentUserDefer;

        return {
            logout,
            getCurrentUser,
            getReservation,
            getReservationList,
            getReservationTagList,
            getComments,
            getTags,
            getSpaces,
            setReservation,
            setTag,
            setComment,
            deleteTag,
            deleteReservation,
            deleteComment,
            resetReservations,
            resetReservation,
            resetTags,
            resetComments,
            resetCurrentUser
        };

        function logout(): ng.IPromise<any> {
            const defer = $q.defer();
            ajaxService.logout().then(() => {
                resetCurrentUser();
                resetReservations();
                resetTags();
                resetComments();
                defer.resolve();
            });
            return defer.promise;
        }

        function getCurrentUser(): ng.IPromise<IUser> {
            let adapted = null;
            let firstRequest = false;

            if (!currentUserDefer) {
                firstRequest = true;
                currentUserDefer = $q.defer();
            }

            if (currentUser.id) {
                currentUserDefer.resolve(currentUser);
            }

            if (!currentUser.id && firstRequest) {
                ajaxService.getCurrentUser().then((response: any) => {
                    adapted = processService.dbArrayAdapter([response.data.payload]);
                    currentUser = adapted[Object.keys(adapted)[0]];
                    currentUserDefer.resolve(currentUser);
                });
            }

            return currentUserDefer.promise;
        }

        function getReservation(reservationId: number): ng.IPromise<IReservation> {
            const defer = $q.defer();
            let reservation;
            if (reservations[reservationId]) {
                defer.resolve(reservations[reservationId]);
            } else {
                ajaxService.getReservation(reservationId).then((response: any) => {
                    if (!response.data.payload.length) {
                        defer.reject();
                        return defer.promise;
                    }
                    reservation = processService.dbArrayAdapter(response.data.payload);
                    reservations[reservationId] = reservation[Object.keys(reservation)[0]];
                    defer.resolve(reservations[reservationId]);
                });
            }
            return defer.promise;
        }

        function getReservationList(month: number, year: number): ng.IPromise<any> {
            const defer = $q.defer();
            ajaxService.getReservationList(month, year).then((response: any) => {
                /*keeping old reservations as they were stored*/
                reservations = Object.assign(processService.dbArrayAdapter(response.data.payload), reservations);
                defer.resolve(reservations);
            });
            return defer.promise;
        }

        function getReservationTagList(reservationId: number): ng.IPromise<any> {
            const defer = $q.defer();
            let reservationTags;
            ajaxService.getReservationTagList(reservationId).then((response: any) => {
                reservationTags = processService.dbArrayAdapter(response.data.payload);
                Object.assign(tags, reservationTags);
                reservations[reservationId].tags = reservationTags;
                defer.resolve(reservationTags);
            });
            return defer.promise;
        }

        function getComments(reservationId: number): ng.IPromise<any> {
            const defer = $q.defer();
            let newComments;
            ajaxService.getComments(reservationId).then((response: any) => {
                newComments = processService.dbArrayAdapter(response.data.payload);
                Object.assign(comments, newComments);
                reservations[reservationId].comments = newComments;
                defer.resolve();
            });
            return defer.promise;
        }

        function getTags(): ng.IPromise<any> {
            const defer = $q.defer();
            if (Object.keys(tags).length) {
                defer.resolve(tags);
            } else {
                ajaxService.getTags().then((response: any) => {
                    tags = Object.assign(processService.dbArrayAdapter(response.data.payload), tags);
                    defer.resolve(tags);
                });
            }
            return defer.promise;
        }

        function getSpaces(): ng.IPromise<any> {
            const defer = $q.defer();
            if (Object.keys(spaces).length) {
                defer.resolve(spaces);
            } else {
                ajaxService.getSpaces().then((response: any) => {
                    spaces = Object.assign(processService.dbArrayAdapter(response.data.payload), spaces);
                    defer.resolve(spaces);
                });
            }
            return defer.promise;
        }

        function setReservation(obj: any): ng.IPromise<number> {
            const defer = $q.defer();
            /*save*/
            if (!obj.reservation_id) {
                ajaxService.saveReservation(obj).then((response: any) => {
                    defer.resolve(response.data.payload);
                });
                /*update*/
            } else {
                ajaxService.updateReservation(obj).then((response: any) => {
                    resetReservation(obj.reservation_id);
                    defer.resolve(obj.reservation_id);
                });
            }
            return defer.promise;
        }

        function setTag(reservationId: number, tagId: number, tag: ITag): ng.IPromise<any> {
            const defer = $q.defer();
            ajaxService.addTag(reservationId, tagId).then((response: any) => {
                defer.resolve(response.data.payload);
            });
            return defer.promise;
        }

        function setComment(comment: string, reservationId: number, commentId: number): ng.IPromise<any> {
            const defer = $q.defer();
            let newComment = {};
            if (comment && commentId) {
                ajaxService.updateComment(comment, commentId).then((response: any) => {
                    comments[commentId].text = comment;
                    defer.resolve(response);
                });
            } else {
                ajaxService.saveComment(comment, reservationId).then((response: any) => {
                    newComment = {
                        id: response.data.payload,
                        text: comment,
                        creation_timestamp: new Date(),
                        creation_user: currentUser.id,
                        floor: currentUser.floor,
                        department: currentUser.department
                    };
                    comments[response.data.payload] = newComment;
                    reservations[reservationId].comments[response.data.payload] = newComment;
                    defer.resolve(response);
                });
            }
            return defer.promise;
        }

        function deleteTag(reservationId: number, tagId: number): ng.IPromise<any> {
            const defer = $q.defer();
            ajaxService.removeTag(reservationId, tagId).then((response: any) => {
                delete reservations[reservationId].tags[tagId];
                defer.resolve();
            });
            return defer.promise;
        }

        function deleteReservation(reservationId: number): ng.IPromise<any> {
            const defer = $q.defer();
            ajaxService.deleteReservation(reservationId).then((response: any) => {
                if (reservations[reservationId].comments) {
                    for (let key in reservations[reservationId].comments) {
                        delete comments[key];
                    }
                }
                delete reservations[reservationId];
                defer.resolve(response);
            });
            return defer.promise;
        }

        function deleteComment(commentId: number, reservationId: number): ng.IPromise<any> {
            const defer = $q.defer();
            ajaxService.deleteComment(commentId).then((response: any) => {
                delete comments[commentId];
                delete reservations[reservationId].comments[commentId];
                defer.resolve(response);
            });
            return defer.promise;
        }

        function resetReservations(): void {
            reservations = {};
        }

        function resetReservation(reservationId: number): void {
            delete reservations[reservationId];
        }

        function resetTags(): void {
            tags = {};
        }

        function resetComments(): void {
            comments = {};
        }

        function resetCurrentUser(): void {
            currentUserDefer = null;
            currentUser = {};
        }
    }
})();
