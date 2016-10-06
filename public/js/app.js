(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	'use strict';

	angular.module('app').config(config).constant('constants',constants());

	function config($stateProvider, $urlRouterProvider, $httpProvider){
		$httpProvider.interceptors.push('interceptor');

		$urlRouterProvider.otherwise('/');
		$stateProvider.state('/', {
			url : '/',
			templateUrl : 'main.html',
			controller: 'mainController',
			controllerAs: 'vm',
			resolve: {ping: ping}
		}).state('/login', {
			url : '/login',
      templateUrl : 'login.html',
      controller: 'loginController',
      controllerAs: 'vm',
			resolve: {checkSession:checkSession}
		}).state('/reservation', {
			url : '/reservation/:id/:date',
      templateUrl : 'reservation.html',
      controller: 'reservationController',
      controllerAs: 'vm',
			resolve: {ping: ping}
		}).state('/tags', {
			url : '/tags',
      templateUrl : 'tags.html',
      controller: 'tagsController',
      controllerAs: 'vm',
			resolve: {ping: ping}
		}).state('/spaces', {
			url : '/spaces',
      templateUrl : 'spaces.html',
      controller: 'spacesController',
      controllerAs: 'vm',
			resolve: {ping: ping}
		});
	}

	ping.$inject = ['ajaxService'];
	function ping(ajaxService){
		return ajaxService.ping();
	}

	checkSession.$inject = ['ajaxService'];
	function checkSession(ajaxService){
		return ajaxService.checkSession();
	}

	function constants(){
		return {
			serviceUrl: '/reservations-offices/api/',
			genericErrorMessage: 'An error has occurred',
			genericSuccessMessage: 'Operation successfully achieved',
			toasterTime: 3000
		};
	}

})();

},{}],2:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('appController', appController);

	appController.$inject = ['$scope', '$state', 'storeService', 'ajaxService', 'constants'];

	function appController($scope, $state, storeService, ajaxService, constants) {
		var vm = this;
    vm.route = null;
		vm.currentUser = {};
		vm.toasterData = {};

		vm.logout = logout;

    _activate();

    $scope.$watch(function(){return $state.current;}, _updateRoute);
		$scope.$on('ERROR', _toastError);
		$scope.$on('OK', _toastSuccess);
		$scope.$on('goToLogin', _goToLogin);
		$scope.$on('goToRoot', _goToRoot);

		/*private functions*/
		function _activate(){
			_updateRoute();
		}

		function _goToLogin(){
			$state.go('/login');
		}

		function _goToRoot(){
			$state.go('/');
		}

		function _toastError(e,data){
			var type = e.name;
			var message = data ? data : constants.genericErrorMessage;
			vm.toasterData = {type: type, message: message};
		}

		function _toastSuccess(e,data){
			var type = e.name;
			var message = data ? data : constants.genericSuccessMessage;
			vm.toasterData = {type: type, message: message};
		}

    function _updateRoute(){
			if(!$state.current.name || $state.current.name === '/login'){
				storeService.resetCurrentUser();
				vm.currentUser = {};
				return false;
			}
			_getCurrentUser().then(function(){
				vm.route = $state.current.name;
			});
    }

		function _getCurrentUser(){
			return storeService.getCurrentUser().then(function(currentUser){
				vm.currentUser = currentUser;
			});
		}
		/*end private functions*/

		/*public functions*/
		function logout(){
			storeService.logout().then(function(){
				$state.go('/login');
			});
		}
		/*end public functions*/
	}
})();

},{}],3:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('confirmationModalController', confirmationModalController);

	confirmationModalController.$inject = ['$scope', '$uibModalInstance', 'data'];

	function confirmationModalController($scope, $uibModalInstance, data) {
		var vm = this;
    vm.data = data;

    vm.cancel = cancel;
    vm.accept = accept;

		_activate();

		/*private functions*/
		function _activate(){

		}
		/*end private functions*/

		/*public functions*/
    function cancel(){
      $uibModalInstance.dismiss('delete');
    }

    function accept(){
      $uibModalInstance.close();
    }
		/*end public functions*/
	}
})();

},{}],4:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('loginController', loginController);

	loginController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];

	function loginController($scope, $state, storeService, ajaxService) {
		var vm = this;
    vm.status = null;
    vm.username = null;
    vm.password = null;

    vm.login = login;

    _activate();

		/*private functions*/
		function _activate(){
			
		}

		/*end private functions*/

		/*public functions*/
    function login(){
      vm.status = null;
      ajaxService.login(vm.username, vm.password).then(function(response){
        if(response.data.status === 'ERROR'){
          vm.status = response.data.payload;
        }else{
          $state.go('/');
        }
      });
    }
		/*end public functions*/
	}
})();

},{}],5:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('mainController', mainController);

	mainController.$inject = ['$scope', '$q', '$rootScope', '$state', '$uibModal', 'storeService'];

	function mainController($scope, $q, $rootScope, $state, $uibModal, storeService) {
		var vm = this;
		vm.visualization = 'calendar';
		vm.date = new Date();
		vm.reservations = {};
		vm.reservationCount = 0;
		vm.currentUser = {};

		vm.deleteReservation = deleteReservation;
		vm.switchVisualization = switchVisualization;
		vm.next = next;
		vm.prev = prev;
		vm.getReservationList = getReservationList;
		vm.checkVaidity = checkVaidity;

		vm.loading = false;

		_activate();

		/*private functions*/
		function _activate(){
			_getReservationList();
			storeService.getCurrentUser().then(function(user){
				vm.currentUser = user;
			});
		}

		function _toastSuccess(){
			var defer = $q.defer();
			$rootScope.$broadcast('OK', '');
			defer.resolve();
			return defer.promise;
		}

		function _getReservationList(){
			var month = vm.date.getMonth() + 1;
			var year = vm.date.getFullYear();

			vm.loading = true;

			storeService.getReservationList(month, year).then(function(reservations){
				vm.reservations = reservations;
				vm.loading = false;
			});
		}
		/*end private functions*/

		/*public functions*/
		function deleteReservation(reservationId){
			var date = vm.reservations[reservationId].date;
			var title = 'About to delete a reservation';
			var body = 'You are about to delete "'
			.concat(vm.reservations[reservationId].title)
			.concat(' - ')
			.concat(date.getDate()).concat('/').concat(date.getMonth()).concat('/').concat(date.getFullYear())
			.concat('". This action cannot be reverted, are you sure?');

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
			modalInstance.result.then(function(){
				storeService.deleteReservation(reservationId).then(_toastSuccess).then(function(){
					$scope.$broadcast('updateCalendar');
				});
			});
		}

		function switchVisualization(visualization){
			vm.visualization = visualization;
		}

		function next(){
			vm.date.setMonth(vm.date.getMonth() + 1);
			_getReservationList();
		}

		function prev(asd){
			vm.date.setMonth(vm.date.getMonth() - 1);
			_getReservationList();
		}

		function getReservationList(){
			_getReservationList();
		}

		function checkVaidity(date){
			var time = date.getTime();
			var yesterday = new Date().setDate(new Date().getDate() - 1);
			return time > yesterday;
		}
		/*end public functions*/
	}
})();

},{}],6:[function(require,module,exports){
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

			var valid = Boolean(!!day && !!month && !!year && !!from && !!to && !!space);

			if(!vm.ableToCheckVailidity || !valid || angular.equals(check, vm.lastCheck)){
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

},{}],7:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('spacesController', spacesController);

	spacesController.$inject = ['$scope', 'storeService'];

	function spacesController($scope, storeService) {
		var vm = this;
		vm.spaces = {};

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getSpaces().then(function(spaces){
				vm.spaces = spaces;
			});
		}
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();

},{}],8:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').controller('tagsController', tagsController);

	tagsController.$inject = ['$scope', 'storeService'];

	function tagsController($scope, storeService) {
		var vm = this;
		vm.tags = {};

		_activate();

		/*private functions*/
		function _activate(){
			storeService.getTags().then(function(tags){
				vm.tags = tags;
			});
		}
		/*end private functions*/

		/*public functions*/
		/*end public functions*/
	}
})();

},{}],9:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').directive('calendar', calendarDirective);

  calendarDirective.$inject = [];

	function calendarDirective() {
    return {
      restrict: 'E',
      templateUrl: 'calendar.directive.html',
      link: link,
      scope: {
          data: '=',
					date: '=',
					count: '=',
					user: '=',
					delete: '=',
					newReservation: '='
      }
    };

    function link($scope){
			$scope.days = [];

			$scope.checkVaidity = checkVaidity;
			$scope.getNewHref = getNewHref;

			$scope.$watch('data', _updateCalendar);
			$scope.$on('updateCalendar',_updateCalendar);

      /*private functions*/
			function _updateCalendar(){
				var month = $scope.date.getMonth();
				var year = $scope.date.getFullYear();
				var days = _getDaysInMonth(month, year);
				var count = 0;

				days = days.map(function(day){
					day.items = [];
					day.empty = true;
					for(var item in $scope.data){
						if(_compareDates(day.date, $scope.data[item].date)){
							day.items.push($scope.data[item]);
							day.empty = false;
							count++;
						}
					}
					return day;
				});
				$scope.count = count;
				$scope.days = days;
			}

			function _getDaysInMonth(month, year) {
				var date = new Date(year, month, 1);
				var days = [];
				while (date.getMonth() === month) {
					days.push({date: new Date(date)});
					date.setDate(date.getDate() + 1);
				}
				return days;
			}

			function _compareDates(date1, date2){
				return date1.getTime() === date2.getTime();
			}
      /*end private functions*/

      /*public functions*/
			function checkVaidity(date){
				var time = date.getTime();
				var yesterday = new Date().setDate(new Date().getDate() - 1);
				return time > yesterday;
			}

			function getNewHref(date){
				return checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime()) : '';
			}
      /*end public functions*/
    }
	}
})();

},{}],10:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').directive('toaster', toaster);

  toaster.$inject = ['constants'];

	function toaster(constants) {
    return {
      restrict: 'E',
      templateUrl: 'toaster.directive.html',
      link: link,
      scope: {
        data: '='
      }
    };

    function link($scope, $element, $attr){
      var timeout = 0;

      $scope.$watch('data',_toast);
      
      /*private functions*/
      function _toast(){
        if(!$scope.data.type){
          return false;
        }
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          $scope.data = {};
          $scope.$digest();
        }, constants.toasterTime);
      }
      /*end private functions*/

      /*public functions*/
      /*end public functions*/
    }
	}
})();

},{}],11:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').filter('dateToNumber', dateToNumberFilter);

	function dateToNumberFilter() {
		return function(input){
      var output = null;
      output = input.getTime();
      return output;
    };
	}
})();

},{}],12:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').filter('department', departmentFilter);

	function departmentFilter() {
		return function(input){
      var output;
			input = String(input);
      switch(input){
        case '1':
          output = 'A';
          break;
        case '2':
          output = 'B';
          break;
        case '3':
          output = 'C';
          break;
				case '4':
          output = 'D';
          break;
				case '5':
          output = 'E';
          break;
				case '6':
          output = 'F';
          break;
				case '7':
          output = 'G';
          break;
        default:
          output = 'invalid time';
          break;
      }
      return output;
    };
	}
})();

},{}],13:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').filter('fromTimeFilter', fromTimeFilter);

	function fromTimeFilter() {
		return function(items,to){
      items = [].concat(items);
      for(var i=0; i<items.length; i++){
        if(items[i] >= to){
          items.splice(i, 1);
          i--;
        }
      }
      return items;
    };
	}
})();

},{}],14:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').filter('monthFilter', monthFilter);

	function monthFilter() {
		return function(items, date){
      var newItems = {};
      for(var key in items){
        if(items[key].date.getMonth() === date.getMonth() && items[key].date.getFullYear() === date.getFullYear()){
          newItems[key] = items[key];
        }
      }
      return newItems;
    };
	}
})();

},{}],15:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').filter('time', timeFilter);

	function timeFilter() {
		return function(input){
      var output;
			input = String(input);
      switch(input){
        case '1':
          output = 'Morning';
          break;
        case '2':
          output = 'Evening';
          break;
        case '3':
          output = 'Afternoon';
          break;
        default:
          output = '';
          break;
      }
      return output;
    };
	}
})();

},{}],16:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').filter('toTimeFilter', toTimeFilter);

	function toTimeFilter() {
		return function(items,from){
      items = [].concat(items);
      for(var i=0; i<items.length; i++){
        if(items[i] <= from){
          items.splice(i, 1);
          i--;
        }
      }
      return items;
    };
	}
})();

},{}],17:[function(require,module,exports){
/*modules*/
require('./modules/app.module');
require('./config');
/*services*/
require('./services/interceptor.service');
require('./services/process.service');
require('./services/ajax.service');
require('./services/store.service');
/*filters*/
require('./filters/time.filter');
require('./filters/department.filter');
require('./filters/month.filter');
require('./filters/dateToNumber.filter');
require('./filters/fromTime.filter');
require('./filters/toTime.filter');
/*directives*/
require('./directives/toaster.directive');
require('./directives/calendar.directive');
/*controllers*/
require('./controllers/app.controller');
require('./controllers/login.controller');
require('./controllers/main.controller');
require('./controllers/confirmationModal.controller');
require('./controllers/reservation.controller');
require('./controllers/tags.controller');
require('./controllers/spaces.controller');

},{"./config":1,"./controllers/app.controller":2,"./controllers/confirmationModal.controller":3,"./controllers/login.controller":4,"./controllers/main.controller":5,"./controllers/reservation.controller":6,"./controllers/spaces.controller":7,"./controllers/tags.controller":8,"./directives/calendar.directive":9,"./directives/toaster.directive":10,"./filters/dateToNumber.filter":11,"./filters/department.filter":12,"./filters/fromTime.filter":13,"./filters/month.filter":14,"./filters/time.filter":15,"./filters/toTime.filter":16,"./modules/app.module":18,"./services/ajax.service":19,"./services/interceptor.service":20,"./services/process.service":21,"./services/store.service":22}],18:[function(require,module,exports){
(function(){
  'use strict';
  angular.module('app', ['ui.router','ngAnimate', 'ui.bootstrap']);
})();

},{}],19:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('ajaxService', ajaxService);

	ajaxService.$inject = ['$http', '$httpParamSerializerJQLike', 'constants'];

	function ajaxService($http, $httpParamSerializerJQLike, constants) {
		var url = constants.serviceUrl;

		return {
			/*GET*/
			ping: ping, // N/A,
			checkSession: checkSession,

			getReservation: getReservation, // reservation_id(int)
			getReservationList: getReservationList, // N/A
			getReservationTagList: getReservationTagList, // reservation_id(int)
			getComments: getComments, // reservation_id(int)
			getTags: getTags, // N/A
			logout: logout,
			reservationValidity: reservationValidity,
			getCurrentUser: getCurrentUser,
			getSpaces: getSpaces,
			/*POST*/
			saveReservation: saveReservation, // title(string), description(string), body(string), date(string), time(int)
			updateReservation: updateReservation, // reservation_id, title, description, body, date, time
			deleteReservation: deleteReservation, // reservation_id(int)
			addTag: addTag, // reservation_id(int), tag_id(int)
			removeTag: removeTag, // reservation_id(int), tag_id(int)
			saveComment: saveComment, // comment(string), reservation_id(int)
			deleteComment: deleteComment, // comment_id(int)
			updateComment: updateComment, // comment_id(int), comment(string)
			saveTag: saveTag, // tag(string)
			login: login
		};

		/*N/A*/
		function ping(){
			return $http.get(url.concat('?route=ping'));
		}

		/*N/A*/
		function checkSession(){
			return $http.get(url.concat('?route=checkSession'));
		}

		function login(username, password){
			return $http({
				url:url.concat('?route=login'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:$httpParamSerializerJQLike({
					username:username,
					password:password
				})
			});
		}

		function logout(){
			return $http.get(url.concat('?route=logout'));
		}

		function getCurrentUser(){
			return $http.get(url.concat('?route=getCurrentUser'));
		}

		function reservationValidity(id, day, month, year, from, to, space){
			return $http.get(url
			.concat('?route=reservationValidity&day=').concat(day)
			.concat('&month=').concat(month)
			.concat('&year=').concat(year)
			.concat('&from=').concat(from)
			.concat('&to=').concat(to)
			.concat('&space=').concat(space)
			.concat('&id=').concat(id));
		}

		/*reservation_id(int)*/
		function getReservation(reservationId){
			return $http.get(url.concat('?route=getReservation&id=').concat(reservationId));
		}

		/*N/A*/
		function getReservationList(month, year){
			return $http.get(url.concat('?route=getReservationList&month=').concat(month).concat('&year=').concat(year));
		}

		/*reservation_id(int)*/
		function getReservationTagList(reservationId){
			return $http.get(url.concat('?route=getReservationTagList&reservation_id=').concat(reservationId));
		}

		/*reservation_id(int)*/
		function getComments(reservationId){
			return $http.get(url.concat('?route=getComments&reservation_id=').concat(reservationId));
		}

		/*N/A*/
		function getTags(){
			return $http.get(url.concat('?route=getTags'));
		}

		function getSpaces(){
			return $http.get(url.concat('?route=getSpaces'));
		}

		/*title(string), description(string), body(string)*/
		function saveReservation(obj){
			return $http({
				url:url.concat('?route=saveReservation'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:$httpParamSerializerJQLike(obj)
			});
		}

		/*reservation_id(int), title(string), description(string), body(string)*/
		function updateReservation(obj){
			return $http({
				url:url.concat('?route=updateReservation'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike(obj)
			});
		}

		/*reservation_id(int)*/
		function deleteReservation(reservationId){
			return $http({
				url:url.concat('?route=deleteReservation'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId
				})
			});
		}

		/*reservation_id(int), tag_id(int)*/
		function addTag(reservationId, tagId){
			return $http({
				url:url.concat('?route=addTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId,
					tag_id: tagId
				})
			});
		}

		/*reservation_id(int), tag_id(int)*/
		function removeTag(reservationId, tagId){
			return $http({
				url:url.concat('?route=removeTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					reservation_id: reservationId,
					tag_id: tagId
				})
			});
		}

		/*comment(string), reservation_id(int)*/
		function saveComment(comment, reservationId){
			return $http({
				url:url.concat('?route=saveComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment: comment,
					reservation_id: reservationId
				})
			});
		}

		/*comment_id(int)*/
		function deleteComment(commentId){
			return $http({
				url:url.concat('?route=deleteComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId
				})
			});
		}

		/*comment_id(int), comment(string)*/
		function updateComment (comment, commentId){
			return $http({
				url:url.concat('?route=updateComment'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					comment_id: commentId,
					comment: comment
				})
			});
		}

		/*tag(string)*/
		function saveTag(tag){
			return $http({
				url:url.concat('?route=saveTag'),
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $httpParamSerializerJQLike({
					tag: tag
				})
			});
		}
	}
})();

},{}],20:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('interceptor', interceptor);

	interceptor.$inject = ['$q','$rootScope'];

	function interceptor($q, $rootScope) {
		return {
      request: request,
      requestError: requestError,
      response: response,
      responseError: responseError
    };

    function request(config){
      return config;
    }

    function requestError(rejection){
      return $q.reject(rejection);
    }

    function response(response){
      if(response.data.status === 'ERROR'){
        $rootScope.$broadcast('ERROR', response.data.payload);
        return $q.reject(response);
      }
      return response;
    }

    function responseError(rejection){
			if(rejection.status === 403){
				$rootScope.$broadcast('goToLogin');
			}
			if(rejection.status === 400){
				$rootScope.$broadcast('goToRoot');
			}
			var message = rejection.data.payload ? rejection.data.payload : '';
      return $q.reject(rejection);
    }

	}
})();

},{}],21:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('processService', processService);

	processService.$inject = [];

	function processService() {
		return {
      dbArrayAdapter: dbArrayAdapter,
			addZeros: addZeros
    };

		function addZeros(number){
			return number < 10 ? '0'.concat(number) : number;
		}

    function dbArrayAdapter(dbArray){
      var dbObject = {}, tempObj = {}, value;
      if(typeof dbArray !== 'object'){
        return tempObj;
      }
      dbArray.forEach(function(object){
        tempObj = {};
        for(var key in object){
          value = object[key];
          if(new RegExp('timestamp','i').test(key)){
            value = new Date(value);
          }
					if(key === 'DATE'){
						value = new Date(value.replace('-','/').replace('-','/'));
					}
					if(!isNaN(value) && typeof value === 'string' && value.trim()){
						value = Number(value);
					}
          tempObj[key.toLowerCase()] = value;
        }
        dbObject[tempObj.id] = tempObj;
      });
      return dbObject;
    }

	}
})();

},{}],22:[function(require,module,exports){
(function(){
	'use strict';
	angular.module('app').factory('storeService', storeService);

	storeService.$inject = ['ajaxService', 'processService', '$q'];

	function storeService(ajaxService, processService, $q) {
    var reservations = {}, comments = {}, tags = {}, spaces = {}, currentUser = {};

		var currentUserDefer = null;

		return {
      getReservation: getReservation,
      getReservationList: getReservationList,
      getReservationTagList: getReservationTagList,
      getComments: getComments,
      getTags: getTags,
			getCurrentUser: getCurrentUser,
			getSpaces: getSpaces,

      setReservation: setReservation,
      setTag: setTag,
      setComment: setComment,

      deleteTag: deleteTag,
      deleteReservation: deleteReservation,
      deleteComment: deleteComment,

      resetReservations: resetReservations,
      resetComments: resetComments,
      resetTags: resetTags,
			resetCurrentUser: resetCurrentUser,

			logout: logout
    };

		function logout(){
			var defer = $q.defer();
			ajaxService.logout().then(function(){
				resetCurrentUser();
				resetReservations();
				resetTags();
				resetComments();
				defer.resolve();
			});
			return defer.promise;
		}

		function getCurrentUser(){
			var adapted = null;
			var firstRequest = false;

			if(!currentUserDefer){
				firstRequest = true;
				currentUserDefer = $q.defer();
			}

			if(currentUser.id){
				currentUserDefer.resolve(currentUser);
			}

			if(!currentUser.id && firstRequest){
				ajaxService.getCurrentUser().then(function(response){
					adapted = processService.dbArrayAdapter([response.data.payload]);
					currentUser = adapted[Object.keys(adapted)[0]];
					currentUserDefer.resolve(currentUser);
				});
			}

			return currentUserDefer.promise;
		}

    function getReservation(reservationId){
      var defer = $q.defer();
      var reservation;
      if(reservations[reservationId]){
        defer.resolve(reservations[reservationId]);
      }else{
        ajaxService.getReservation(reservationId).then(function(response){
					if(!response.data.payload.length){
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

    function getReservationList(month, year){
      var defer = $q.defer();
      ajaxService.getReservationList(month, year).then(function(response){
        /*keeping old reservations as they were stored*/
        reservations = Object.assign(processService.dbArrayAdapter(response.data.payload), reservations);
        defer.resolve(reservations);
      });
      return defer.promise;
    }

    function getReservationTagList(reservationId){
      var defer = $q.defer();
			var reservationTags;
			ajaxService.getReservationTagList(reservationId).then(function(response){
				reservationTags = processService.dbArrayAdapter(response.data.payload);
				Object.assign(tags, reservationTags);
				reservations[reservationId].tags = reservationTags;
        defer.resolve(reservationTags);
			});
      return defer.promise;
    }

    function getComments(reservationId){
      var defer = $q.defer();
      var newComments;
      ajaxService.getComments(reservationId).then(function(response){
        newComments = processService.dbArrayAdapter(response.data.payload);
        Object.assign(comments,newComments);
        reservations[reservationId].comments = newComments;
        defer.resolve();
      });
      return defer.promise;
    }

    function getTags(){
      var defer = $q.defer();
			if(Object.keys(tags).length){
				defer.resolve(tags);
			}else{
				ajaxService.getTags().then(function(response){
					tags = Object.assign(processService.dbArrayAdapter(response.data.payload), tags);
					defer.resolve(tags);
				});
			}
      return defer.promise;
    }

		function getSpaces(){
      var defer = $q.defer();
			if(Object.keys(spaces).length){
				defer.resolve(spaces);
			}else{
				ajaxService.getSpaces().then(function(response){
					spaces = Object.assign(processService.dbArrayAdapter(response.data.payload), spaces);
					defer.resolve(spaces);
				});
			}
      return defer.promise;
    }

    function setReservation(obj){
      var defer = $q.defer();
      /*save*/
      if(!obj.reservation_id){
        ajaxService.saveReservation(obj).then(function(response){
          defer.resolve(response.data.payload);
        });
      /*update*/
      }else{
        ajaxService.updateReservation(obj).then(function(response){
          resetReservation(obj.reservation_id);
          defer.resolve(obj.reservation_id);
        });
      }
      return defer.promise;
    }

    function setTag(reservationId, tagId, tag){
      var defer = $q.defer();
			ajaxService.addTag(reservationId, tagId).then(function(response){
				defer.resolve(response.data.payload);
			});
      return defer.promise;
    }

    function setComment(comment, reservationId, commentId){
      var defer = $q.defer();
			var newComment = {};
      if(comment, commentId){
        ajaxService.updateComment(comment, commentId).then(function(response){
          comments[commentId].text = comment;
          defer.resolve(response);
        });
      }else{
        ajaxService.saveComment(comment, reservationId).then(function(response){
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

    function deleteTag(reservationId, tagId){
      var defer = $q.defer();
			ajaxService.removeTag(reservationId, tagId).then(function(response){
				delete reservations[reservationId].tags[tagId];
				defer.resolve();
			});
      return defer.promise;
    }

    function deleteReservation(reservationId){
      var defer = $q.defer();
      ajaxService.deleteReservation(reservationId).then(function(response){
        if(reservations[reservationId].comments){
          for(var key in reservations[reservationId].comments){
            delete comments[key];
          }
        }
        delete reservations[reservationId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    function deleteComment(commentId, reservationId){
      var defer = $q.defer();
      ajaxService.deleteComment(commentId).then(function(response){
        delete comments[commentId];
        delete reservations[reservationId].comments[commentId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    function resetReservations(){
      reservations = {};
    }

    function resetReservation(reservationId){
      delete reservations[reservationId];
    }

    function resetTags(){
      tags = {};
    }

    function resetComments(){
      comments = {};
    }

		function resetCurrentUser(){
			currentUserDefer = null;
      currentUser = {};
    }

	}
})();

},{}]},{},[17]);