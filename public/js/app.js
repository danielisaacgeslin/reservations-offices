(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
require('./modules/app.module');
require('./config');
require('./services/interceptor.service');
require('./services/process.service');
require('./services/ajax.service');
require('./services/store.service');
require('./filters/time.filter');
require('./filters/department.filter');
require('./filters/month.filter');
require('./filters/dateToNumber.filter');
require('./filters/fromTime.filter');
require('./filters/toTime.filter');
require('./filters/repeatObjectToArray.filter');
require('./directives/toaster.directive');
require('./directives/calendar.directive');
require('./controllers/app.controller');
require('./controllers/login.controller');
require('./controllers/main.controller');
require('./controllers/confirmationModal.controller');
require('./controllers/reservation.controller');
require('./controllers/tags.controller');
require('./controllers/spaces.controller');

},{"./config":2,"./controllers/app.controller":3,"./controllers/confirmationModal.controller":4,"./controllers/login.controller":5,"./controllers/main.controller":6,"./controllers/reservation.controller":7,"./controllers/spaces.controller":8,"./controllers/tags.controller":9,"./directives/calendar.directive":10,"./directives/toaster.directive":11,"./filters/dateToNumber.filter":12,"./filters/department.filter":13,"./filters/fromTime.filter":14,"./filters/month.filter":15,"./filters/repeatObjectToArray.filter":16,"./filters/time.filter":17,"./filters/toTime.filter":18,"./modules/app.module":19,"./services/ajax.service":20,"./services/interceptor.service":21,"./services/process.service":22,"./services/store.service":23}],2:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').config(config).constant('constants', constants());
    function config($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('interceptor');
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('/', {
            url: '/',
            templateUrl: 'markup/main.html',
            controller: 'mainController',
            controllerAs: 'vm',
            resolve: { ping: ping }
        }).state('/login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginController',
            controllerAs: 'vm',
            resolve: { checkSession: checkSession }
        }).state('/reservation', {
            url: '/reservation/:id/:date',
            templateUrl: 'markup/reservation.html',
            controller: 'reservationController',
            controllerAs: 'vm',
            resolve: { ping: ping }
        }).state('/tags', {
            url: '/tags',
            templateUrl: 'markup/tags.html',
            controller: 'tagsController',
            controllerAs: 'vm',
            resolve: { ping: ping }
        }).state('/spaces', {
            url: '/spaces',
            templateUrl: 'markup/spaces.html',
            controller: 'spacesController',
            controllerAs: 'vm',
            resolve: { ping: ping }
        });
    }
    ping.$inject = ['ajaxService'];
    function ping(ajaxService) {
        return ajaxService.ping();
    }
    checkSession.$inject = ['ajaxService'];
    function checkSession(ajaxService) {
        return ajaxService.checkSession();
    }
    function constants() {
        return {
            serviceUrl: '/reservations-offices/api/',
            genericErrorMessage: 'An error has occurred',
            genericSuccessMessage: 'Operation successfully achieved',
            toasterTime: 3000
        };
    }
})();

},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    var AppController = (function () {
        function AppController($scope, $state, storeService, ajaxService, constants) {
            this.$scope = $scope;
            this.$state = $state;
            this.storeService = storeService;
            this.ajaxService = ajaxService;
            this.constants = constants;
            this.currentUser = {};
            this.toasterData = {};
            this.now = Date.now();
            this.init();
        }
        AppController.prototype.init = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.$state.current; }, this.updateRoute.bind(this));
            this.$scope.$on('ERROR', this.toastError.bind(this));
            this.$scope.$on('OK', this.toastSuccess.bind(this));
            this.$scope.$on('goToLogin', this.goToLogin.bind(this));
            this.$scope.$on('goToRoot', this.goToRoot.bind(this));
            this.updateRoute();
        };
        AppController.prototype.goToLogin = function () {
            this.$state.go('/login');
        };
        AppController.prototype.goToRoot = function () {
            this.$state.go('/');
        };
        AppController.prototype.toastError = function (e, data) {
            var type = e.name;
            var message = data ? data : this.constants.genericErrorMessage;
            this.toasterData = { type: type, message: message };
        };
        AppController.prototype.toastSuccess = function (e, data) {
            var type = e.name;
            var message = data ? data : this.constants.genericSuccessMessage;
            this.toasterData = { type: type, message: message };
        };
        AppController.prototype.updateRoute = function () {
            var _this = this;
            if (!this.$state.current.name || this.$state.current.name === '/login') {
                this.storeService.resetCurrentUser();
                this.currentUser = {};
                return false;
            }
            this.getCurrentUser().then(function () {
                _this.route = _this.$state.current.name;
                return true;
            });
            return true;
        };
        AppController.prototype.getCurrentUser = function () {
            var _this = this;
            return this.storeService.getCurrentUser().then(function (currentUser) {
                _this.currentUser = currentUser;
            });
        };
        AppController.prototype.logout = function () {
            var _this = this;
            this.storeService.logout().then(function () {
                _this.$state.go('/login');
            });
        };
        AppController.$inject = ['$scope', '$state', 'storeService', 'ajaxService', 'constants'];
        return AppController;
    }());
    angular.module('app').controller('appController', AppController);
})();

},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    var ConfirmationModalController = (function () {
        function ConfirmationModalController($scope, $uibModalInstance, data) {
            this.$scope = $scope;
            this.$uibModalInstance = $uibModalInstance;
            this.data = data;
            this.data = data;
        }
        ConfirmationModalController.prototype.cancel = function () {
            this.$uibModalInstance.dismiss('delete');
        };
        ConfirmationModalController.prototype.accept = function () {
            this.$uibModalInstance.close();
        };
        ConfirmationModalController.$inject = ['$scope', '$uibModalInstance', 'data'];
        return ConfirmationModalController;
    }());
    angular.module('app').controller('confirmationModalController', ConfirmationModalController);
})();

},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope, $state, storeService, ajaxService) {
            this.$scope = $scope;
            this.$state = $state;
            this.storeService = storeService;
            this.ajaxService = ajaxService;
        }
        LoginController.prototype.login = function () {
            var _this = this;
            this.status = null;
            this.ajaxService.login(this.username, this.password).then(function (response) {
                if (response.data.status === 'ERROR') {
                    _this.status = response.data.payload;
                }
                else {
                    _this.$state.go('/');
                }
            });
        };
        LoginController.$inject = ['$scope', '$state', 'storeService', 'ajaxService'];
        return LoginController;
    }());
    angular.module('app').controller('loginController', LoginController);
})();

},{}],6:[function(require,module,exports){
(function () {
    'use strict';
    var MainController = (function () {
        function MainController($scope, $q, $rootScope, $state, $uibModal, storeService) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.storeService = storeService;
            this.visualization = 'calendar';
            this.date = new Date();
            this.reservations = {};
            this.reservationCount = 0;
            this.loading = false;
            this.getReservationList();
            this.storeService.getCurrentUser().then(function (user) {
                _this.currentUser = user;
            });
            this.$scope.$on('deleteReservation', this.deleteReservation.bind(this));
        }
        MainController.prototype.toastSuccess = function () {
            var defer = this.$q.defer();
            this.$rootScope.$broadcast('OK', '');
            defer.resolve();
            return defer.promise;
        };
        MainController.prototype.getReservationList = function () {
            var _this = this;
            var month = this.date.getMonth() + 1;
            var year = this.date.getFullYear();
            this.loading = true;
            this.storeService.getReservationList(month, year).then(function (reservations) {
                _this.reservations = reservations;
                _this.loading = false;
            });
        };
        MainController.prototype.deleteReservation = function (e, reservationId) {
            var _this = this;
            var date = this.reservations[reservationId].date;
            var title = 'About to delete a reservation';
            var body = 'You are about to delete "'
                .concat(this.reservations[reservationId].title)
                .concat(' - ')
                .concat(date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". This action cannot be reverted, are you sure?');
            var modalInstance = this.$uibModal.open({
                templateUrl: 'confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                resolve: {
                    data: {
                        title: title,
                        body: body
                    }
                }
            });
            modalInstance.result.then(function () {
                _this.storeService.deleteReservation(reservationId).then(_this.toastSuccess.bind(_this)).then(function () {
                    _this.$scope.$broadcast('updateCalendar');
                });
            });
        };
        MainController.prototype.switchVisualization = function (visualization) {
            this.visualization = visualization;
        };
        MainController.prototype.next = function () {
            this.date.setMonth(this.date.getMonth() + 1);
            this.getReservationList();
        };
        MainController.prototype.prev = function () {
            this.date.setMonth(this.date.getMonth() - 1);
            this.getReservationList();
        };
        MainController.prototype.checkVaidity = function (date) {
            var time = date.getTime();
            var yesterday = new Date().setDate(new Date().getDate() - 1);
            return time > yesterday;
        };
        MainController.$inject = ['$scope', '$q', '$rootScope', '$state', '$uibModal', 'storeService'];
        return MainController;
    }());
    angular.module('app').controller('mainController', MainController);
})();

},{}],7:[function(require,module,exports){
(function () {
    'use strict';
    var ReservationController = (function () {
        function ReservationController($scope, $rootScope, $state, $q, $uibModal, storeService, ajaxService, processService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.storeService = storeService;
            this.ajaxService = ajaxService;
            this.processService = processService;
            this.$inject = ['this.$scope', '$rootScope', '$state', '$q', '$uibModal', 'storeService', 'ajaxService', 'processService'];
            this.reservation = {};
            this.newComment = '';
            this.editableComment = -1;
            this.editableCommentText = '';
            this.filteredTags = {};
            this.noTagOption = { 0: { id: 0, text: 'No tags available' } };
            this.times = this.getTimes();
            this.currentUser = {};
            this.tags = {};
            this.spaces = {};
            this.lastCheck = {};
            this.editEnabled = true;
            this.reservationValidity = true;
            this.ableToCheckVailidity = false;
            this.loading = false;
            this.edition = {
                title: null,
                description: null,
                body: null,
                from_time: 7,
                to_time: 8,
                space: 1,
                date: new Date()
            };
            this.init();
        }
        ReservationController.prototype.init = function () {
            var _this = this;
            this.$scope.$watchGroup([
                function () { return _this.edition.date; },
                function () { return _this.edition.from_time; },
                function () { return _this.edition.to_time; },
                function () { return _this.edition.space; }
            ], this.checkValidity.bind(this));
            if (isNaN(this.$state.params.id)) {
                this.ableToCheckVailidity = true;
                if (this.$state.params.date && !isNaN(this.$state.params.date)) {
                    this.edition.date = new Date(Number(this.$state.params.date));
                }
                this.$q.all([this.getCurrentUser(), this.getTags(), this.getSpaces()]).then(this.filterTags.bind(this));
            }
            else {
                this.getCurrentUser().then(this.getReservation.bind(this)).then(function () {
                    _this.ableToCheckVailidity = true;
                    _this.getComments();
                    _this.checkValidity();
                    _this.$q.all([_this.getReservationTagList(), _this.getTags(), _this.getSpaces()]).then(_this.filterTags.bind(_this));
                });
            }
        };
        ReservationController.prototype.getTimes = function () {
            var times = [];
            for (var i = 1; i <= 24; i++) {
                times.push(i);
            }
            return times;
        };
        ReservationController.prototype.toastSuccess = function () {
            var defer = this.$q.defer();
            this.$rootScope.$broadcast('OK', '');
            defer.resolve();
            this.loading = false;
            return defer.promise;
        };
        ReservationController.prototype.getCurrentUser = function () {
            var _this = this;
            return this.storeService.getCurrentUser().then(function (user) {
                _this.currentUser = user;
            });
        };
        ReservationController.prototype.checkValidity = function () {
            var _this = this;
            var id = this.reservation.id;
            var day = this.processService.addZeros(this.edition.date.getDate());
            var month = this.processService.addZeros(this.edition.date.getMonth() + 1);
            var year = this.edition.date.getFullYear();
            var from = this.edition.from_time;
            var to = this.edition.to_time;
            var space = this.edition.space;
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
            if (!this.ableToCheckVailidity || !valid || angular.equals(check, this.lastCheck)) {
                this.reservationValidity = false;
                return false;
            }
            this.lastCheck = check;
            this.ajaxService.reservationValidity(id, day, month, year, from, to, space).then(function (response) {
                _this.reservationValidity = response.data.payload;
            });
        };
        ReservationController.prototype.getReservation = function () {
            var _this = this;
            var defer = this.$q.defer();
            this.storeService.getReservation(this.tempId ? this.tempId : this.$state.params.id).then(function (reservation) {
                _this.reservation = reservation;
                _this.edition = Object.assign({}, reservation);
                _this.editEnabled = (_this.currentUser.id === reservation.creation_user) && reservation.date.getTime() > Date.now();
                defer.resolve();
            }).catch(function () {
                _this.$state.go('/reservation', { id: 'new', date: Date.now() });
                _this.storeService.resetReservations();
                defer.reject();
            });
            return defer.promise;
        };
        ReservationController.prototype.getComments = function () {
            return this.storeService.getComments(this.reservation.id);
        };
        ReservationController.prototype.getReservationTagList = function () {
            return this.storeService.getReservationTagList(this.reservation.id);
        };
        ReservationController.prototype.getTags = function () {
            var _this = this;
            return this.storeService.getTags().then(function (tags) {
                _this.tags = tags;
            });
        };
        ReservationController.prototype.getSpaces = function () {
            var _this = this;
            return this.storeService.getSpaces().then(function (spaces) {
                _this.spaces = spaces;
            });
        };
        ReservationController.prototype.filterTags = function () {
            var filteredTags = {};
            var marker;
            if (!this.reservation.id) {
                this.filteredTags = this.noTagOption;
                this.selectedTag = this.filteredTags[Object.keys(this.filteredTags)[0]];
                return false;
            }
            for (var tagKey in this.tags) {
                marker = true;
                for (var reservationTagKey in this.reservation.tags) {
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
        };
        ReservationController.prototype.setReservation = function () {
            var _this = this;
            this.edition.title = this.edition.title ? this.edition.title : ' ';
            this.loading = true;
            var obj = {
                title: this.edition.title,
                description: this.edition.description,
                body: this.edition.body,
                date: this.edition.date,
                from: this.edition.from_time,
                to: this.edition.to_time,
                space: this.edition.space,
                reservation_id: this.reservation.id
            };
            return this.storeService.setReservation(obj).then(function (id) {
                _this.lastCheck = null;
                if (!_this.reservation.id) {
                    _this.tempId = id;
                    _this.$state.go('/reservation', { id: id }, {
                        notify: false,
                        reload: false,
                        location: 'replace',
                        inherit: true
                    });
                }
            }).then(this.toastSuccess.bind(this));
        };
        ReservationController.prototype.toggleEdit = function () {
            this.editEnabled = !this.editEnabled;
            if (!this.editEnabled) {
                this.edition = Object.assign({}, this.reservation);
            }
        };
        ReservationController.prototype.saveReservation = function () {
            var date = this.edition.date;
            var title = 'About to save a reservation';
            var body = 'You are about to save "'
                .concat(this.edition.title)
                .concat(' - ')
                .concat(date.getDate().toString()).concat('/')
                .concat(date.getMonth().toString()).concat('/')
                .concat(date.getFullYear().toString())
                .concat('". Are you sure?');
            var modalInstance = this.$uibModal.open({
                templateUrl: 'confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                resolve: {
                    data: {
                        title: title,
                        body: body
                    }
                }
            });
            modalInstance.result
                .then(this.setReservation.bind(this))
                .then(this.getReservation.bind(this))
                .then(this.getReservationTagList.bind(this))
                .then(this.getComments.bind(this))
                .then(this.filterTags.bind(this));
        };
        ReservationController.prototype.saveComment = function () {
            var _this = this;
            this.loading = true;
            return this.storeService.setComment(this.newComment, this.reservation.id).then(function () {
                _this.newComment = '';
            }).then(this.toastSuccess.bind(this));
        };
        ReservationController.prototype.updateComment = function (commentId) {
            this.loading = true;
            return this.storeService.setComment(this.editableCommentText, null, commentId)
                .then(this.toastSuccess.bind(this))
                .then(this.editComment.bind(this));
        };
        ReservationController.prototype.editComment = function (index, commentId) {
            this.editableCommentText = '';
            if (this.editableComment === index) {
                this.editableComment = -1;
            }
            else {
                this.editableComment = index;
                this.editableCommentText = !commentId ? '' : this.reservation.comments[commentId].text;
            }
        };
        ReservationController.prototype.deleteComment = function (commentId) {
            var _this = this;
            var date = this.edition.date;
            var title = 'About to delete a comment';
            var body = 'Are you sure?';
            var modalInstance = this.$uibModal.open({
                templateUrl: 'confirmation.modal.html',
                controller: 'confirmationModalController',
                controllerAs: 'vm',
                resolve: {
                    data: {
                        title: title,
                        body: body
                    }
                }
            });
            modalInstance.result.then(function () {
                _this.loading = true;
                return _this.storeService.deleteComment(commentId, _this.reservation.id)
                    .then(_this.toastSuccess.bind(_this));
            });
        };
        ReservationController.prototype.setTag = function () {
            this.loading = true;
            return this.storeService.setTag(this.reservation.id, this.selectedTag.id)
                .then(this.getReservationTagList.bind(this))
                .then(this.toastSuccess.bind(this))
                .then(this.filterTags.bind(this));
        };
        ReservationController.prototype.deleteTag = function (tagId) {
            this.loading = true;
            return this.storeService.deleteTag(this.reservation.id, tagId)
                .then(this.toastSuccess.bind(this))
                .then(this.filterTags.bind(this));
        };
        return ReservationController;
    }());
    angular.module('app').controller('reservationController', ReservationController);
})();

},{}],8:[function(require,module,exports){
(function () {
    'use strict';
    var SpacesController = (function () {
        function SpacesController($scope, storeService) {
            this.$scope = $scope;
            this.storeService = storeService;
            this.init();
        }
        SpacesController.prototype.init = function () {
            var _this = this;
            this.storeService.getSpaces().then(function (spaces) {
                _this.spaces = spaces;
            });
        };
        SpacesController.$inject = ['$scope', 'storeService'];
        return SpacesController;
    }());
    angular.module('app').controller('spacesController', SpacesController);
})();

},{}],9:[function(require,module,exports){
(function () {
    'use strict';
    var TagsController = (function () {
        function TagsController($scope, storeService) {
            this.$scope = $scope;
            this.storeService = storeService;
            this.init();
        }
        TagsController.prototype.init = function () {
            var _this = this;
            this.storeService.getTags().then(function (tags) {
                _this.tags = tags;
            });
        };
        TagsController.$inject = ['$scope', 'storeService'];
        return TagsController;
    }());
    angular.module('app').controller('tagsController', TagsController);
})();

},{}],10:[function(require,module,exports){
(function () {
    'use strict';
    var calendarDirective = function () {
        return {
            restrict: 'E',
            templateUrl: 'markup/calendar.directive.html',
            link: link,
            scope: {
                data: '=',
                date: '=',
                count: '=',
                user: '=',
                newReservation: '='
            }
        };
    };
    angular.module('app').directive('calendar', calendarDirective);
    function link($scope, element, attributes) {
        var vm = this;
        $scope.checkVaidity = checkVaidity;
        $scope.getNewHref = getNewHref;
        $scope.deleteReservation = deleteReservation;
        init();
        function init() {
            $scope.days = [];
            $scope.checkVaidity = checkVaidity;
            $scope.getNewHref = getNewHref;
            $scope.delete = deleteReservation;
            $scope.$watch('data', updateCalendar);
            $scope.$on('updateCalendar', updateCalendar);
        }
        function updateCalendar() {
            var month = $scope.date.getMonth();
            var year = $scope.date.getFullYear();
            var days = getDaysInMonth(month, year);
            var count = 0;
            days = days.map(function (day) {
                day.items = [];
                day.empty = true;
                for (var item in $scope.data) {
                    if (compareDates(day.date, $scope.data[item].date)) {
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
        function getDaysInMonth(month, year) {
            var date = new Date(year, month, 1);
            var days = [];
            while (date.getMonth() === month) {
                days.push({ date: new Date(date) });
                date.setDate(date.getDate() + 1);
            }
            return days;
        }
        function compareDates(date1, date2) {
            return date1.getTime() === date2.getTime();
        }
        function checkVaidity(date) {
            var time = date.getTime();
            var yesterday = new Date().setDate(new Date().getDate() - 1);
            return time > yesterday;
        }
        function getNewHref(date) {
            return checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime().toString()) : '';
        }
        function deleteReservation(id) {
            $scope.$emit('deleteReservation', id);
        }
    }
})();

},{}],11:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').directive('toaster', toaster);
    toaster.$inject = ['constants'];
    function toaster(constants) {
        return {
            restrict: 'E',
            templateUrl: 'markup/toaster.directive.html',
            link: link,
            scope: {
                data: '='
            }
        };
        function link($scope, $element, $attr) {
            var timeout = 0;
            init();
            function init() {
                $scope.$watch(function () { return $scope.data; }, toast);
            }
            function toast() {
                if (!$scope.data.type) {
                    return false;
                }
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    $scope.data = {};
                    $scope.$digest();
                }, constants.toasterTime);
                return true;
            }
        }
    }
})();

},{}],12:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('dateToNumber', dateToNumberFilter);
    function dateToNumberFilter() {
        return function (input) {
            var output;
            output = input.getTime();
            return output;
        };
    }
})();

},{}],13:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('department', departmentFilter);
    function departmentFilter() {
        return function (input) {
            var output;
            input = String(input);
            switch (input) {
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

},{}],14:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('fromTimeFilter', fromTimeFilter);
    function fromTimeFilter() {
        return function (items, to) {
            items = [].concat(items);
            for (var i = 0; i < items.length; i++) {
                if (items[i] >= to) {
                    items.splice(i, 1);
                    i--;
                }
            }
            return items;
        };
    }
})();

},{}],15:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('monthFilter', monthFilter);
    function monthFilter() {
        return function (items, date) {
            var newItems = {};
            for (var key in items) {
                if (items[key].date.getMonth() === date.getMonth() && items[key].date.getFullYear() === date.getFullYear()) {
                    newItems[key] = items[key];
                }
            }
            return newItems;
        };
    }
})();

},{}],16:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('repeatObjectToArrayFilter', repeatObjectToArrayFilter);
    function repeatObjectToArrayFilter() {
        function orderThis(a, b, orderKey) {
            var aValue = a[orderKey];
            var bValue = b[orderKey];
            if (aValue.getTime && bValue.getTime) {
                aValue = aValue.getTime();
                bValue = bValue.getTime();
            }
            if (aValue > bValue) {
                return 1;
            }
            else {
                return -1;
            }
        }
        return function (items, orderArray) {
            var itemsArray = [];
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    itemsArray.push(items[key]);
                }
            }
            orderArray.forEach(function (orderKey) {
                itemsArray = itemsArray.sort(function (a, b) {
                    return orderThis(a, b, orderKey);
                });
            });
            return itemsArray;
        };
    }
})();

},{}],17:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('time', timeFilter);
    function timeFilter() {
        return function (input) {
            var output;
            input = String(input);
            switch (input) {
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

},{}],18:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').filter('toTimeFilter', toTimeFilter);
    function toTimeFilter() {
        return function (items, from) {
            items = [].concat(items);
            for (var i = 0; i < items.length; i++) {
                if (items[i] <= from) {
                    items.splice(i, 1);
                    i--;
                }
            }
            return items;
        };
    }
})();

},{}],19:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app', ['ui.router', 'ngAnimate', 'ui.bootstrap']);
})();

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('app').factory('interceptor', Interceptor);
    Interceptor.$inject = ['$q', '$rootScope'];
    function Interceptor($q, $rootScope) {
        return {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };
        function request(config) {
            return config;
        }
        function requestError(rejection) {
            return $q.reject(rejection);
        }
        function response(response) {
            if (response.data.status === 'ERROR') {
                $rootScope.$broadcast('ERROR', response.data.payload);
                return $q.reject(response);
            }
            return response;
        }
        function responseError(rejection) {
            if (rejection.status === 403) {
                $rootScope.$broadcast('goToLogin');
            }
            if (rejection.status === 400) {
                $rootScope.$broadcast('goToRoot');
            }
            return $q.reject(rejection);
        }
    }
})();

},{}],22:[function(require,module,exports){
(function () {
    'use strict';
    var ProcessService = (function () {
        function ProcessService() {
        }
        ProcessService.prototype.addZeros = function (number) {
            return (number < 10 ? '0'.concat(number.toString()) : number.toString());
        };
        ProcessService.prototype.dbArrayAdapter = function (dbArray) {
            var dbObject = {};
            var tempObj = {};
            var value;
            if (typeof dbArray !== 'object') {
                return tempObj;
            }
            dbArray.forEach(function (object) {
                tempObj = {};
                for (var key in object) {
                    value = object[key];
                    if (new RegExp('timestamp', 'i').test(key)) {
                        value = new Date(value);
                    }
                    if (key === 'DATE') {
                        value = new Date(value.replace('-', '/').replace('-', '/'));
                    }
                    if (!isNaN(value) && typeof value === 'string' && value.trim()) {
                        value = Number(value);
                    }
                    tempObj[key.toLowerCase()] = value;
                }
                dbObject[tempObj.id] = tempObj;
            });
            return dbObject;
        };
        ProcessService.$inject = [];
        return ProcessService;
    }());
    angular.module('app').service('processService', ProcessService);
})();

},{}],23:[function(require,module,exports){
(function () {
    'use strict';
    var StoreService = (function () {
        function StoreService(ajaxService, processService, $q) {
            this.ajaxService = ajaxService;
            this.processService = processService;
            this.$q = $q;
            this.reservations = {};
            this.comments = {};
            this.tags = {};
            this.spaces = {};
            this.currentUser = {};
        }
        StoreService.prototype.logout = function () {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.logout().then(function () {
                _this.resetCurrentUser();
                _this.resetReservations();
                _this.resetTags();
                _this.resetComments();
                defer.resolve();
            });
            return defer.promise;
        };
        StoreService.prototype.getCurrentUser = function () {
            var _this = this;
            var adapted = null;
            var firstRequest = false;
            if (!this.currentUserDefer) {
                firstRequest = true;
                this.currentUserDefer = this.$q.defer();
            }
            if (this.currentUser.id) {
                this.currentUserDefer.resolve(this.currentUser);
            }
            if (!this.currentUser.id && firstRequest) {
                this.ajaxService.getCurrentUser().then(function (response) {
                    adapted = _this.processService.dbArrayAdapter([response.data.payload]);
                    _this.currentUser = adapted[Object.keys(adapted)[0]];
                    _this.currentUserDefer.resolve(_this.currentUser);
                });
            }
            return this.currentUserDefer.promise;
        };
        StoreService.prototype.getReservation = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            var reservation;
            if (this.reservations[reservationId]) {
                defer.resolve(this.reservations[reservationId]);
            }
            else {
                this.ajaxService.getReservation(reservationId).then(function (response) {
                    if (!response.data.payload.length) {
                        defer.reject();
                        return defer.promise;
                    }
                    reservation = _this.processService.dbArrayAdapter(response.data.payload);
                    _this.reservations[reservationId] = reservation[Object.keys(reservation)[0]];
                    defer.resolve(_this.reservations[reservationId]);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.getReservationList = function (month, year) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.getReservationList(month, year).then(function (response) {
                _this.reservations = Object.assign(_this.processService.dbArrayAdapter(response.data.payload), _this.reservations);
                defer.resolve(_this.reservations);
            });
            return defer.promise;
        };
        StoreService.prototype.getReservationTagList = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            var reservationTags;
            this.ajaxService.getReservationTagList(reservationId).then(function (response) {
                reservationTags = _this.processService.dbArrayAdapter(response.data.payload);
                Object.assign(_this.tags, reservationTags);
                _this.reservations[reservationId].tags = reservationTags;
                defer.resolve(reservationTags);
            });
            return defer.promise;
        };
        StoreService.prototype.getComments = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            var newComments;
            this.ajaxService.getComments(reservationId).then(function (response) {
                newComments = _this.processService.dbArrayAdapter(response.data.payload);
                Object.assign(_this.comments, newComments);
                _this.reservations[reservationId].comments = newComments;
                defer.resolve();
            });
            return defer.promise;
        };
        StoreService.prototype.getTags = function () {
            var _this = this;
            var defer = this.$q.defer();
            if (Object.keys(this.tags).length) {
                defer.resolve(this.tags);
            }
            else {
                this.ajaxService.getTags().then(function (response) {
                    _this.tags = Object.assign(_this.processService.dbArrayAdapter(response.data.payload), _this.tags);
                    defer.resolve(_this.tags);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.getSpaces = function () {
            var _this = this;
            var defer = this.$q.defer();
            if (Object.keys(this.spaces).length) {
                defer.resolve(this.spaces);
            }
            else {
                this.ajaxService.getSpaces().then(function (response) {
                    _this.spaces = Object.assign(_this.processService.dbArrayAdapter(response.data.payload), _this.spaces);
                    defer.resolve(_this.spaces);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.setReservation = function (obj) {
            var _this = this;
            var defer = this.$q.defer();
            if (!obj.reservation_id) {
                this.ajaxService.saveReservation(obj).then(function (response) {
                    defer.resolve(response.data.payload);
                });
            }
            else {
                this.ajaxService.updateReservation(obj).then(function (response) {
                    _this.resetReservation(obj.reservation_id);
                    defer.resolve(obj.reservation_id);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.setTag = function (reservationId, tagId, tag) {
            var defer = this.$q.defer();
            this.ajaxService.addTag(reservationId, tagId).then(function (response) {
                defer.resolve(response.data.payload);
            });
            return defer.promise;
        };
        StoreService.prototype.setComment = function (comment, reservationId, commentId) {
            var _this = this;
            var defer = this.$q.defer();
            var newComment = {};
            if (comment && commentId) {
                this.ajaxService.updateComment(comment, commentId).then(function (response) {
                    _this.comments[commentId].text = comment;
                    defer.resolve(response);
                });
            }
            else {
                this.ajaxService.saveComment(comment, reservationId).then(function (response) {
                    newComment = {
                        id: response.data.payload,
                        text: comment,
                        creation_timestamp: new Date(),
                        creation_user: _this.currentUser.id,
                        floor: _this.currentUser.floor,
                        department: _this.currentUser.department
                    };
                    _this.comments[response.data.payload] = newComment;
                    _this.reservations[reservationId].comments[response.data.payload] = newComment;
                    defer.resolve(response);
                });
            }
            return defer.promise;
        };
        StoreService.prototype.deleteTag = function (reservationId, tagId) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.removeTag(reservationId, tagId).then(function (response) {
                delete _this.reservations[reservationId].tags[tagId];
                defer.resolve();
            });
            return defer.promise;
        };
        StoreService.prototype.deleteReservation = function (reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.deleteReservation(reservationId).then(function (response) {
                if (_this.reservations[reservationId].comments) {
                    for (var key in _this.reservations[reservationId].comments) {
                        delete _this.comments[key];
                    }
                }
                delete _this.reservations[reservationId];
                defer.resolve(response);
            });
            return defer.promise;
        };
        StoreService.prototype.deleteComment = function (commentId, reservationId) {
            var _this = this;
            var defer = this.$q.defer();
            this.ajaxService.deleteComment(commentId).then(function (response) {
                delete _this.comments[commentId];
                delete _this.reservations[reservationId].comments[commentId];
                defer.resolve(response);
            });
            return defer.promise;
        };
        StoreService.prototype.resetReservations = function () {
            this.reservations = {};
        };
        StoreService.prototype.resetReservation = function (reservationId) {
            delete this.reservations[reservationId];
        };
        StoreService.prototype.resetTags = function () {
            this.tags = {};
        };
        StoreService.prototype.resetComments = function () {
            this.comments = {};
        };
        StoreService.prototype.resetCurrentUser = function () {
            this.currentUserDefer = null;
            this.currentUser = {};
        };
        StoreService.$inject = ['ajaxService', 'processService', '$q'];
        return StoreService;
    }());
    angular.module('app').service('storeService', StoreService);
})();

},{}]},{},[1]);
