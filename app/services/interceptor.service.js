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
