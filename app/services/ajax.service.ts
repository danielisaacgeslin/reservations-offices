(() => {
    'use strict';

    class AjaxService {
        static $inject: string[] = ['$http', '$httpParamSerializerJQLike', 'constants'];
        private url: string;

        constructor(
            private $http: ng.IHttpService,
            private $httpParamSerializerJQLike: any,
            private constants: any) {
            this.url = this.constants.serviceUrl.concat('?route=');
        }

        /*N/A*/
        public ping(): ng.IPromise<any> {
            return this.$http.get(this.url.concat('ping'));
        }

        /*N/A*/
        public checkSession(): ng.IPromise<any> {
            return this.$http.get(this.url.concat('checkSession'));
        }

        public login(username: string, password: string): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('login'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    username: username,
                    password: password
                })
            });
        }

        public logout(): ng.IPromise<any> {
            return this.$http.get(this.url.concat('logout'));
        }

        public getCurrentUser(): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getCurrentUser'));
        }

        public reservationValidity(id: string, day: string, month: string, year: string, from: string, to: string, space: string): ng.IPromise<any> {
            return this.$http.get(this.url
                .concat('reservationValidity&day=').concat(day)
                .concat('&month=').concat(month)
                .concat('&year=').concat(year)
                .concat('&from=').concat(from)
                .concat('&to=').concat(to)
                .concat('&space=').concat(space)
                .concat('&id=').concat(id));
        }

        /*reservation_id(int)*/
        public getReservation(reservationId: number): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getReservation&id=').concat(reservationId.toString()));
        }

        /*N/A*/
        public getReservationList(month: number, year: number): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getReservationList&month=')
                .concat(month.toString()).concat('&year=')
                .concat(year.toString()));
        }

        /*reservation_id(int)*/
        public getReservationTagList(reservationId: number): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getReservationTagList&reservation_id=')
                .concat(reservationId.toString()));
        }

        /*reservation_id(int)*/
        public getComments(reservationId: number): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getComments&reservation_id=')
                .concat(reservationId.toString()));
        }

        /*N/A*/
        public getTags(): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getTags'));
        }

        public getSpaces(): ng.IPromise<any> {
            return this.$http.get(this.url.concat('getSpaces'));
        }

        /*title(string), description(string), body(string)*/
        public saveReservation(obj: IReservation): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('saveReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike(obj)
            });
        }

        /*reservation_id(int), title(string), description(string), body(string)*/
        public updateReservation(obj: IReservation): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('updateReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike(obj)
            });
        }

        /*reservation_id(int)*/
        public deleteReservation(reservationId: number): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('deleteReservation'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    reservation_id: reservationId
                })
            });
        }

        /*reservation_id(int), tag_id(int)*/
        public addTag(reservationId: number, tagId: number): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('addTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    reservation_id: reservationId,
                    tag_id: tagId
                })
            });
        }

        /*reservation_id(int), tag_id(int)*/
        public removeTag(reservationId: number, tagId: number): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('removeTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    reservation_id: reservationId,
                    tag_id: tagId
                })
            });
        }

        /*comment(string), reservation_id(int)*/
        public saveComment(comment: string, reservationId: number): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('saveComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    comment: comment,
                    reservation_id: reservationId
                })
            });
        }

        /*comment_id(int)*/
        public deleteComment(commentId: number): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('deleteComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    comment_id: commentId
                })
            });
        }

        /*comment_id(int), comment(string)*/
        public updateComment(comment: string, commentId: number): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('updateComment'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    comment_id: commentId,
                    comment: comment
                })
            });
        }

        /*tag(string)*/
        public saveTag(tag: ITag): ng.IPromise<any> {
            return this.$http({
                url: this.url.concat('saveTag'),
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: this.$httpParamSerializerJQLike({
                    tag: tag
                })
            });
        }
    }

    angular.module('app').service('ajaxService', AjaxService);
})();
