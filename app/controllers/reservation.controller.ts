(() => {
    'use strict';
    angular.module('app').controller('reservationController', reservationController);

    reservationController.$inject = ['$scope', '$rootScope', '$state', '$q', '$uibModal', 'storeService', 'ajaxService', 'processService'];
    function reservationController($scope, $rootScope, $state, $q, $uibModal, storeService, ajaxService, processService) {
        const vm = this;

        vm.toggleEdit = toggleEdit;
        vm.saveReservation = saveReservation;
        vm.saveComment = saveComment;
        vm.updateComment = updateComment;
        vm.editComment = editComment;
        vm.deleteComment = deleteComment;
        vm.setTag = setTag;
        vm.deleteTag = deleteTag;

        _init();

        /*function _functions*/
        function _init(): void {
            vm.reservation = {};
            vm.newComment = '';
            vm.editableComment = -1;
            vm.editableCommentText = '';
            vm.filteredTags = {};
            vm.noTagOption = { 0: { id: 0, text: 'No tags available' } };
            vm.selectedTag = null;
            vm.tempId = null;
            vm.times = _getTimes();
            vm.currentUser = {};
            vm.tags = {};
            vm.spaces = {};
            vm.lastCheck = {};
            vm.editEnabled = true;
            vm.reservationValidity = true;
            vm.ableToCheckVailidity = false;
            vm.loading = false;
            vm.edition = {
                title: null,
                description: null,
                body: null,
                from_time: 7,
                to_time: 8,
                space: 1,
                date: new Date()
            };
            $scope.$watchGroup(
                [
                    () => vm.edition.date,
                    () => vm.edition.from_time,
                    () => vm.edition.to_time,
                    () => vm.edition.space
                ],
                _checkValidity
            );

            if (isNaN($state.params.id)) {
                vm.ableToCheckVailidity = true;
                if ($state.params.date && !isNaN($state.params.date)) {
                    vm.edition.date = new Date(Number($state.params.date));
                }
                $q.all(
                    [_getCurrentUser(), _getTags(), _getSpaces()]
                ).then(_filterTags);
            } else {
                _getCurrentUser().then(_getReservation).then(() => {
                    vm.ableToCheckVailidity = true;
                    _getComments();
                    _checkValidity();
                    $q.all(
                        [_getReservationTagList(), _getTags(), _getSpaces()]
                    ).then(_filterTags);
                });
            }
        }

        function _getTimes(): number[] {
            const times = [];
            for (let i = 1; i <= 24; i++) {
                times.push(<number>i);
            }
            return times;
        }

        function _toastSuccess(): ng.IPromise<any> {
            const defer = $q.defer();
            $rootScope.$broadcast('OK', '');
            defer.resolve();
            vm.loading = false;
            return defer.promise;
        }

        function _getCurrentUser(): ng.IPromise<IUser> {
            return storeService.getCurrentUser().then((user: IUser) => {
                vm.currentUser = user;
            });
        }

        function _checkValidity(): any {
            const id: number = vm.reservation.id;
            const day: number = processService.addZeros(vm.edition.date.getDate());
            const month: number = processService.addZeros(vm.edition.date.getMonth() + 1);
            const year: number = vm.edition.date.getFullYear();
            const from: number = vm.edition.from_time;
            const to: number = vm.edition.to_time;
            const space: number = vm.edition.space;
            const check: any = {
                id,
                day,
                month,
                year,
                from,
                to,
                space
            };

            const valid: boolean = Boolean(!!day && !!month && !!year && !!from && !!to && !!space);
            if (!vm.ableToCheckVailidity || !valid || angular.equals(check, vm.lastCheck)) {
                vm.reservationValidity = false;
                return false;
            }

            vm.lastCheck = check;

            ajaxService.reservationValidity(id, day, month, year, from, to, space).then((response) => {
                vm.reservationValidity = <boolean>response.data.payload;
            });
        }

        function _getReservation(): ng.IPromise<any> {
            const defer = $q.defer();
            storeService.getReservation(vm.tempId ? vm.tempId : $state.params.id).then((reservation: IReservation) => {
                vm.reservation = reservation;
                vm.edition = Object.assign({}, reservation);
                vm.editEnabled = <boolean>(vm.currentUser.id === reservation.creation_user) && reservation.date.getTime() > Date.now();
                defer.resolve();
            }).catch(() => {
                $state.go('/reservation', { id: 'new', date: Date.now() });
                storeService.re_setReservations();
                defer.reject();
            });
            return defer.promise;
        }

        function _getComments(): ng.IPromise<any> {
            return storeService.getComments(vm.reservation.id);
        }

        function _getReservationTagList(): ng.IPromise<any> {
            return storeService.getReservationTagList(vm.reservation.id);
        }

        function _getTags(): ng.IPromise<any> {
            return storeService.getTags().then(tags => { vm.tags = tags });
        }

        function _getSpaces(): ng.IPromise<any> {
            return storeService.getSpaces().then(spaces => { vm.spaces = spaces });
        }

        function _filterTags(): any {
            let filteredTags: any = {}
            let marker: boolean;
            if (!vm.reservation.id) {
                vm.filteredTags = vm.noTagOption;
                vm.selectedTag = vm.filteredTags[Object.keys(filteredTags)[0]];
                return false;
            }

            for (let tagKey in vm.tags) {
                marker = true;
                for (let reservationTagKey in vm.reservation.tags) {
                    if (Number(reservationTagKey) === vm.tags[tagKey].id) {
                        marker = false;
                        break;
                    }
                }
                if (marker) {
                    filteredTags[tagKey] = Object.assign({}, vm.tags[tagKey]);
                }
            }

            vm.filteredTags = filteredTags;
            if (!Object.keys(filteredTags).length) {
                vm.filteredTags = vm.noTagOption;
            }
            vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
        }

        function _setReservation(): ng.IPromise<any> {
            vm.edition.title = vm.edition.title ? vm.edition.title : ' ';
            vm.loading = true;
            const obj = {
                title: vm.edition.title,
                description: vm.edition.description,
                body: vm.edition.body,
                date: vm.edition.date,
                from: vm.edition.from_time,
                to: vm.edition.to_time,
                space: vm.edition.space,
                reservation_id: vm.reservation.id
            };
            return storeService.setReservation(obj).then((id: number) => {
                vm.lastCheck = null;
                if (!vm.reservation.id) {
                    vm.tempId = id;
                    $state.go('/reservation', { id: id }, {
                        notify: false,
                        reload: false,
                        location: 'replace',
                        inherit: true
                    });
                }
            }).then(_toastSuccess);
        }
        /*end function _functions*/

        /*function functions*/
        function toggleEdit(): void {
            vm.editEnabled = !vm.editEnabled;
            if (!vm.editEnabled) {
                vm.edition = Object.assign({}, <IReservation>vm.reservation);
            }
        }

        function saveReservation(): void {
            const date: Date = vm.edition.date;
            const title: string = 'About to save a reservation';
            const body: string = 'You are about to save "'
                .concat(vm.edition.title ? vm.edition.title : '')
                .concat(' - ')
                .concat(
                date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". Are you sure?');

            const modalInstance = $uibModal.open({
                templateUrl: 'markup/confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                resolve: {data: {title,body}}
            });

            /*accepting deletion*/
            modalInstance.result
                .then(_setReservation)
                .then(_getReservation)
                .then(_getReservationTagList)
                .then(_getComments)
                .then(_filterTags);
        }

        function saveComment(): void {
            vm.loading = true;
            return storeService.setComment(vm.newComment, vm.reservation.id).then(() => {
                vm.newComment = '';
            }).then(_toastSuccess);
        }

        function updateComment(commentId: number): ng.IPromise<any> {
            vm.loading = true;
            return storeService.setComment(vm.editableCommentText, null, commentId)
                .then(_toastSuccess)
                .then(editComment);
        }

        function editComment(index: number, commentId: number): void {
            vm.editableCommentText = '';
            if (vm.editableComment === index) {
                vm.editableComment = -1;
            } else {
                vm.editableComment = index;
                vm.editableCommentText = !commentId ? '' : vm.reservation.comments[commentId].text;
            }
        }

        function deleteComment(commentId: number): void {
            const date: Date = vm.edition.date;
            const title: string = 'About to delete a comment';
            const body: string = 'Are you sure?';

            const modalInstance = $uibModal.open({
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
                vm.loading = true;
                return storeService.deleteComment(commentId, vm.reservation.id)
                    .then(_toastSuccess);
            });
        }

        function setTag(): ng.IPromise<any> {
            vm.loading = true;
            return storeService.setTag(vm.reservation.id, vm.selectedTag.id)
                .then(_getReservationTagList)
                .then(_toastSuccess)
                .then(_filterTags);
        }

        function deleteTag(tagId: number): ng.IPromise<any> {
            vm.loading = true;
            return storeService.deleteTag(vm.reservation.id, tagId)
                .then(_toastSuccess)
                .then(_filterTags);
        }
    }

})();
