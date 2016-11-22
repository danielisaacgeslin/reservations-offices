(() => {
    'use strict';

    angular.module('app').directive('toaster', toaster);

    toaster.$inject = ['constants'];
    function toaster(constants: any): ng.IDirective {
        return {
            restrict: 'E',
            templateUrl: 'markup/toaster.directive.html',
            link: link,
            scope: {
                data: '='
            }
        };

        function link($scope: any, $element: any, $attr: any) {
            let timeout: number = 0;

            init();

            function init(): void {
                $scope.$watch(() => $scope.data, toast);
            }

            function toast(): boolean {
                if (!$scope.data.type) {
                    return false;
                }
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    $scope.data = {};
                    $scope.$digest();
                }, constants.toasterTime);
                return true;
            }
        }
    }
})();
