(function () {
    'use strict';
    angular.module('app').directive('toaster', toaster);
    toaster.$inject = ['constants'];
    function toaster(constants) {
        var Link = (function () {
            function Link($scope, $element, $attr) {
                this.$scope = $scope;
                this.$element = $element;
                this.timeout = 0;
                this.$scope.$watch('data', this.toast.bind(this));
            }
            Link.prototype.toast = function () {
                var _this = this;
                if (!this.$scope.data.type) {
                    return false;
                }
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    _this.$scope.data = {};
                    _this.$scope.$digest();
                }, constants.toasterTime);
                return true;
            };
            return Link;
        }());
        return {
            restrict: 'E',
            templateUrl: 'toaster.directive.html',
            link: Link,
            scope: {
                data: '='
            }
        };
    }
})();
