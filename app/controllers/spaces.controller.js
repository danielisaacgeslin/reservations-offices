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
