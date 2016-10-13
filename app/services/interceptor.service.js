(function () {
    'use strict';
    var Interceptor = (function () {
        function Interceptor($q, $rootScope) {
            this.$q = $q;
            this.$rootScope = $rootScope;
        }
        Interceptor.prototype.request = function (config) {
            return config;
        };
        Interceptor.prototype.requestError = function (rejection) {
            return this.$q.reject(rejection);
        };
        Interceptor.prototype.response = function (response) {
            if (response.data.status === 'ERROR') {
                this.$rootScope.$broadcast('ERROR', response.data.payload);
                return this.$q.reject(response);
            }
            return response;
        };
        Interceptor.prototype.responseError = function (rejection) {
            if (rejection.status === 403) {
                this.$rootScope.$broadcast('goToLogin');
            }
            if (rejection.status === 400) {
                this.$rootScope.$broadcast('goToRoot');
            }
            return this.$q.reject(rejection);
        };
        Interceptor.$inject = ['$q', '$rootScope'];
        return Interceptor;
    }());
    angular.module('app').service('interceptor', Interceptor);
})();
