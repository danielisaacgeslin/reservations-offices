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
