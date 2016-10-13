(() => {
    'use strict';

    class ReservationController implements ng.IController{
        $inject: string[] = ['this.$scope', '$rootScope', '$state', '$q', '$uibModal', 'storeService', 'ajaxService', 'processService'];
        public reservation: any = {};
        public newComment: string = '';
        public editableComment: number = -1;
        public editableCommentText: string = '';
        public filteredTags: any = {};
        public noTagOption: any = { 0: { id: 0, text: 'No tags available' } };
        public selectedTag: ITag;
        public tempId: number;
        public times: number[] = this.getTimes();
        public currentUser: IUser = {};
        public tags: any = {};
        public spaces: any = {};
        public lastCheck: any = {};
        public editEnabled: boolean = true;
        public reservationValidity: boolean = true;
        public ableToCheckVailidity: boolean = false;
        public loading: boolean = false;
        public edition: IReservation = {
            title: null,
            description: null,
            body: null,
            from_time: 7,
            to_time: 8,
            space: 1,
            date: new Date()
        };

        constructor(
            public $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private $state: any,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private storeService: any,
            private ajaxService: any,
            private processService: any
        ) {
            this.init();
        }

        /*private functions*/
        private init(): void {
            this.$scope.$watchGroup(
                [
                  () => this.edition.date,
                  () => this.edition.from_time,
                  () => this.edition.to_time,
                  () => this.edition.space
                ],
                this.checkValidity.bind(this)
            );

            if (isNaN(this.$state.params.id)) {
                this.ableToCheckVailidity = true;
                if (this.$state.params.date && !isNaN(this.$state.params.date)) {
                    this.edition.date = new Date(Number(this.$state.params.date));
                }
                this.$q.all(
                    [this.getCurrentUser(), this.getTags(), this.getSpaces()]
                ).then(this.filterTags.bind(this));
            } else {
                this.getCurrentUser().then(this.getReservation.bind(this)).then(() => {
                    this.ableToCheckVailidity = true;
                    this.getComments();
                    this.checkValidity();
                    this.$q.all(
                        [this.getReservationTagList(), this.getTags(), this.getSpaces()]
                    ).then(this.filterTags.bind(this));
                });
            }
        }

        private getTimes(): number[] {
            const times = [];
            for (let i = 1; i <= 24; i++) {
                times.push(<number>i);
            }
            return times;
        }

        private toastSuccess(): ng.IPromise<any> {
            const defer = this.$q.defer();
            this.$rootScope.$broadcast('OK', '');
            defer.resolve();
            this.loading = false;
            return defer.promise;
        }

        private getCurrentUser(): ng.IPromise<IUser> {
            return this.storeService.getCurrentUser().then((user: IUser) => {
                this.currentUser = user;
            });
        }

        private checkValidity(): any {
            const id: number = this.reservation.id;
            const day: number = this.processService.addZeros(this.edition.date.getDate());
            const month: number = this.processService.addZeros(this.edition.date.getMonth() + 1);
            const year: number = this.edition.date.getFullYear();
            const from: number = this.edition.from_time;
            const to: number = this.edition.to_time;
            const space: number = this.edition.space;
            const check: any = {
                id: id,
                day: day,
                month: month,
                year: year,
                from: from,
                to: to,
                space: space
            };

            const valid: boolean = Boolean(!!day && !!month && !!year && !!from && !!to && !!space);
            if (!this.ableToCheckVailidity || !valid || angular.equals(check, this.lastCheck)) {
                this.reservationValidity = false;
                return false;
            }

            this.lastCheck = check;

            this.ajaxService.reservationValidity(id, day, month, year, from, to, space).then((response) => {
                this.reservationValidity = <boolean>response.data.payload;
            });
        }

        private getReservation(): ng.IPromise<any> {
            const defer = this.$q.defer();
            this.storeService.getReservation(this.tempId ? this.tempId : this.$state.params.id).then((reservation: IReservation) => {
                this.reservation = reservation;
                this.edition = Object.assign({}, reservation);
                this.editEnabled = <boolean>(this.currentUser.id === reservation.creation_user) && reservation.date.getTime() > Date.now();
                defer.resolve();
            }).catch(() => {
                this.$state.go('/reservation', { id: 'new', date: Date.now() });
                this.storeService.resetReservations();
                defer.reject();
            });
            return defer.promise;
        }

        private getComments(): ng.IPromise<any> {
            return this.storeService.getComments(this.reservation.id);
        }

        private getReservationTagList(): ng.IPromise<any> {
            return this.storeService.getReservationTagList(this.reservation.id);
        }

        private getTags(): ng.IPromise<any> {
            return this.storeService.getTags().then((tags) => {
                this.tags = tags;
            });
        }

        private getSpaces(): ng.IPromise<any> {
            return this.storeService.getSpaces().then((spaces) => {
                this.spaces = spaces;
            });
        }

        private filterTags(): any {
            const filteredTags: any = {}
            let marker: boolean;
            if (!this.reservation.id) {
                this.filteredTags = this.noTagOption;
                this.selectedTag = this.filteredTags[Object.keys(this.filteredTags)[0]];
                return false;
            }
            for (let tagKey in this.tags) {
                marker = true;
                for (let reservationTagKey in this.reservation.tags) {
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
        }

        private setReservation(): ng.IPromise<any> {
            this.edition.title = this.edition.title ? this.edition.title : ' ';
            this.loading = true;
            const obj = {
                title: this.edition.title,
                description: this.edition.description,
                body: this.edition.body,
                date: this.edition.date,
                from: this.edition.from_time,
                to: this.edition.to_time,
                space: this.edition.space,
                reservation_id: this.reservation.id
            };
            return this.storeService.setReservation(obj).then((id: number) => {
                this.lastCheck = null;
                if (!this.reservation.id) {
                    this.tempId = id;
                    this.$state.go('/reservation', { id: id }, {
                        notify: false,
                        reload: false,
                        location: 'replace',
                        inherit: true
                    });
                }
            }).then(this.toastSuccess.bind(this));
        }
        /*end private functions*/

        /*public functions*/
        public toggleEdit(): void {
            this.editEnabled = !this.editEnabled;
            if (!this.editEnabled) {
                this.edition = Object.assign({}, <IReservation>this.reservation);
            }
        }

        public saveReservation(): void {
            const date: Date = this.edition.date;
            const title: string = 'About to save a reservation';
            const body: string = 'You are about to save "'
                .concat(this.edition.title)
                .concat(' - ')
                .concat(
                date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". Are you sure?');

            const modalInstance = this.$uibModal.open({
                templateUrl: 'confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                //windowClass : '',
                //backdrop : 'static',
                //keyboard : false,
                resolve: {
                    data: {
                        title: title,
                        body: body
                    }
                }
            });

            /*accepting deletion*/
            modalInstance.result
                .then(this.setReservation.bind(this))
                .then(this.getReservation.bind(this))
                .then(this.getReservationTagList.bind(this))
                .then(this.getComments.bind(this))
                .then(this.filterTags.bind(this));
        }

        public saveComment(): void {
            this.loading = true;
            return this.storeService.setComment(this.newComment, this.reservation.id).then(() => {
                this.newComment = '';
            }).then(this.toastSuccess.bind(this));
        }

        public updateComment(commentId: number): ng.IPromise<any> {
            this.loading = true;
            return this.storeService.setComment(this.editableCommentText, null, commentId)
                .then(this.toastSuccess.bind(this))
                .then(this.editComment.bind(this));
        }

        public editComment(index: number, commentId: number): void {
            this.editableCommentText = '';
            if (this.editableComment === index) {
                this.editableComment = -1;
            } else {
                this.editableComment = index;
                this.editableCommentText = !commentId ? '' : this.reservation.comments[commentId].text;
            }
        }

        public deleteComment(commentId: number): void {
            const date: Date = this.edition.date;
            const title: string = 'About to delete a comment';
            const body: string = 'Are you sure?';

            const modalInstance = this.$uibModal.open({
                templateUrl: 'confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                //windowClass : '',
                //backdrop : 'static',
                //keyboard : false,
                resolve: {
                    data: {
                        title: title,
                        body: body
                    }
                }
            });

            modalInstance.result.then(() => {
                this.loading = true;
                return this.storeService.deleteComment(commentId, this.reservation.id)
                    .then(this.toastSuccess.bind(this));
            });
        }

        public setTag(): ng.IPromise<any> {
            this.loading = true;
            return this.storeService.setTag(this.reservation.id, this.selectedTag.id)
                .then(this.getReservationTagList.bind(this))
                .then(this.toastSuccess.bind(this))
                .then(this.filterTags.bind(this));
        }

        public deleteTag(tagId: number): ng.IPromise<any> {
            this.loading = true;
            return this.storeService.deleteTag(this.reservation.id, tagId)
                .then(this.toastSuccess.bind(this))
                .then(this.filterTags.bind(this));
        }
        /*end public functions*/
    }

    angular.module('app').controller('reservationController', ReservationController);
})();
