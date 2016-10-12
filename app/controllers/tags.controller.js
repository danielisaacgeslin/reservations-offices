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
