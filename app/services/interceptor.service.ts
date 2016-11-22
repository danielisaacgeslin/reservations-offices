(() => {
    'use strict';
    angular.module('app').factory('interceptor', Interceptor);

    Interceptor.$inject = ['$q', '$rootScope'];
    function Interceptor($q, $rootScope) {
        return {
            request,
            requestError,
            response,
            responseError
        }

        function request(config: any): any {
            return config;
        }

        function requestError(rejection: any): any {
            return $q.reject(rejection);
        }

        function response(response: any): any {
            if (response.data.status === 'ERROR') {
                $rootScope.$broadcast('ERROR', response.data.payload);
                return $q.reject(response);
            }
            return response;
        }

        function responseError(rejection: any): any {
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
