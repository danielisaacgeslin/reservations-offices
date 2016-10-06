(function(){
	'use strict';
	angular.module('app').controller('reservationController', reservationController);

	reservationController.$inject = ['$scope', '$rootScope', '$state', '$q', '$uibModal', 'storeService', 'ajaxService', 'processService'];

	function reservationController($scope, $rootScope, $state, $q, $uibModal, storeService, ajaxService, processService) {
		var vm = this;

		_activate();

    /*private functions*/
		function _activate(){
			vm.reservation = {};
	    vm.newComment = '';
	    vm.editableComment = -1;
	    vm.editableCommentText = '';
			vm.filteredTags = {};
			vm.noTagOption = {0: {id: 0, text: 'No tags available'}};
			vm.selectedTag = null;
			vm.tempId = null;
			vm.editEnabled = true;
			vm.times = _getTimes();
			vm.reservationValidity = true;
			vm.currentUser = {};
			vm.tags = {};
			vm.spaces = {};
			vm.lastCheck = {};
			vm.edition = {
				title: null,
				description: null,
				body: null,
				from_time: 7,
				to_time: 8,
				space: 1,
				date: new Date()
			};

	    vm.toggleEdit = toggleEdit;
	    vm.saveReservation = saveReservation;
	    vm.saveComment = saveComment;
	    vm.editComment = editComment;
	    vm.updateComment = updateComment;
	    vm.deleteComment = deleteComment;
			vm.setTag = setTag;
			vm.deleteTag = deleteTag;
			vm.ableToCheckVailidity = false;

			vm.loading = false;

			$scope.$watch('vm.edition.date', _checkValidity);
			$scope.$watch('vm.edition.from_time', _checkValidity);
			$scope.$watch('vm.edition.to_time', _checkValidity);
			$scope.$watch('vm.edition.space', _checkValidity);

      if(isNaN($state.params.id)){
				vm.ableToCheckVailidity = true;
				if($state.params.date && !isNaN($state.params.date)){
					vm.edition.date = new Date(Number($state.params.date));
				}
				$q.all([_getCurrentUser(),_getTags(),_getSpaces()]).then(_filterTags);
      }else{
        _getCurrentUser().then(_getReservation).then(function(){
					vm.ableToCheckVailidity = true;
					_getComments();
					_checkValidity();
					$q.all([_getReservationTagList(), _getTags(),_getSpaces()]).then(_filterTags);
				});
      }
		}

		function _getTimes(){
			var times = [];
			for(var i=1; i<=24; i++){
				times.push(i);
			}
			return times;
		}

		function _toastSuccess(){
			var defer = $q.defer();
			$rootScope.$broadcast('OK', '');
			defer.resolve();
			vm.loading = false;
			return defer.promise;
		}

		function _getCurrentUser(){
			return storeService.getCurrentUser().then(function(user){
				vm.currentUser = user;
			});
		}

		function _checkValidity(){
			var id = vm.reservation.id;
			var day = processService.addZeros(vm.edition.date.getDate());
			var month = processService.addZeros(vm.edition.date.getMonth() + 1);
			var year = vm.edition.date.getFullYear();
			var from = vm.edition.from_time;
			var to = vm.edition.to_time;
			var space = vm.edition.space;
			var check = {
				id: id,
				day: day,
				month: month,
				year: year,
				from: from,
				to: to,
				space: space
			};

			if(!vm.ableToCheckVailidity){
				return false;
			}

			if(!day || !month || !year || !from || !to || !space || angular.equals(check, vm.lastCheck)){
				vm.reservationValidity = false;
				return false;
			}

			vm.lastCheck = check;

			ajaxService.reservationValidity(id, day, month, year, from, to, space).then(function(response){
				vm.reservationValidity = response.data.payload;
			});
		}

    function _getReservation(){
			var defer = $q.defer();
      storeService.getReservation(vm.tempId ? vm.tempId : $state.params.id).then(function(reservation){
				vm.reservation = reservation;
        vm.edition = Object.assign({},reservation);
				vm.editEnabled = (vm.currentUser.id === reservation.creation_user) && reservation.date.getTime() > Date.now();
				defer.resolve();
			}).catch(function(){
				$state.go('/reservation',{id:'new', date: Date.now()});
				storeService.resetReservations();
				defer.reject();
			});
			return defer.promise;
    }

    function _getComments(){
      return storeService.getComments(vm.reservation.id);
    }

		function _getReservationTagList(){
			return storeService.getReservationTagList(vm.reservation.id);
		}

		function _getTags(){
			return storeService.getTags().then(function(tags){
				vm.tags = tags;
			});
		}

		function _getSpaces(){
			return storeService.getSpaces().then(function(spaces){
				vm.spaces = spaces;
			});
		}

		function _filterTags(){
			var filteredTags = {},  marker;
			if(!vm.reservation.id){
				vm.filteredTags = vm.noTagOption;
				vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
				return false;
			}
			for(var tagKey in vm.tags){
				marker = true;
					for(var reservationTagKey in vm.reservation.tags){
						if(reservationTagKey === vm.tags[tagKey].id){
							marker = false;
							break;
						}
					}
					if(marker){
						filteredTags[tagKey] = Object.assign({}, vm.tags[tagKey]);
					}
			}
			vm.filteredTags = filteredTags;
			if(!Object.keys(vm.filteredTags).length){
				vm.filteredTags = vm.noTagOption;
			}
			vm.selectedTag = vm.filteredTags[Object.keys(vm.filteredTags)[0]];
		}

		function _setReservation(){
			vm.edition.title = vm.edition.title ? vm.edition.title : ' ';
			vm.loading = true;
			var obj = {
				title:vm.edition.title,
			  description:vm.edition.description,
			  body:vm.edition.body,
			  date:vm.edition.date,
			  from:vm.edition.from_time,
				to:vm.edition.to_time,
				space: vm.edition.space,
			  reservation_id:vm.reservation.id
			};
			return storeService.setReservation(obj).then(function(id){
        if(!vm.reservation.id){
					vm.tempId = id;
          $state.go('/reservation', {id: id}, {
					    notify:false,
					    reload:false,
					    location:'replace',
					    inherit:true
					});
        }
      }).then(_toastSuccess);
		}
    /*end private functions*/

    /*public functions*/
    function toggleEdit(){
      vm.editEnabled = !vm.editEnabled;
      if(!vm.editEnabled){
        vm.edition = Object.assign({},vm.reservation);
      }
    }

    function saveReservation(){
			var date = vm.edition.date;
			var title = 'About to save a reservation';
			var body = 'You are about to save "'
			.concat(vm.edition.title)
			.concat(' - ')
			.concat(date.getDate()).concat('/').concat(date.getMonth()).concat('/').concat(date.getFullYear())
			.concat('". Are you sure?');

			var modalInstance = $uibModal.open({
				templateUrl : 'confirmation.modal.html',
				controller : 'confirmationModalController',
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
			.then(_setReservation)
			.then(_getReservation)
			.then(_getReservationTagList)
			.then(_getComments)
			.then(_filterTags);
    }

    function saveComment(){
			vm.loading = true;
      return storeService.setComment(vm.newComment, vm.reservation.id).then(function(){
        vm.newComment = '';
      }).then(_toastSuccess);
    }

    function updateComment(commentId){
			vm.loading = true;
      return storeService.setComment(vm.editableCommentText, null, commentId).then(_toastSuccess).then(editComment);
    }

    function editComment(index, commentId){
      vm.editableCommentText = '';
      if(vm.editableComment === index){
        vm.editableComment = -1;
      }else{
        vm.editableComment = index;
        vm.editableCommentText = !commentId ? '' : vm.reservation.comments[commentId].text;
      }
    }

    function deleteComment(commentId){
			var date = vm.edition.date;
			var title = 'About to delete a comment';
			var body = 'Are you sure?';

			var modalInstance = $uibModal.open({
				templateUrl : 'confirmation.modal.html',
				controller : 'confirmationModalController',
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

			modalInstance.result.then(function(){
				vm.loading = true;
				return storeService.deleteComment(commentId, vm.reservation.id).then(_toastSuccess);
			});
    }

		function setTag(){
			vm.loading = true;
			storeService.setTag(vm.reservation.id, vm.selectedTag.id)
			.then(_getReservationTagList)
			.then(_toastSuccess)
			.then(_filterTags);
		}

		function deleteTag(tagId){
			vm.loading = true;
			return storeService.deleteTag(vm.reservation.id, tagId).then(_toastSuccess).then(_filterTags);
		}
    /*end public functions*/

	}
})();
