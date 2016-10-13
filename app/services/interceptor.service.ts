(() => {
    'use strict';

    class Interceptor {
        static $inject: string[] = ['$q', '$rootScope'];

        constructor(private $q: ng.IQService, private $rootScope: ng.IRootScopeService) {

        }

        public request(config: any): any {
            return config;
        }

        public requestError(rejection: any): any {
            return this.$q.reject(rejection);
        }

        public response(response: any): any {
            if (response.data.status === 'ERROR') {
                this.$rootScope.$broadcast('ERROR', response.data.payload);
                return this.$q.reject(response);
            }
            return response;
        }

        public responseError(rejection: any): any {
            if (rejection.status === 403) {
                this.$rootScope.$broadcast('goToLogin');
            }
            if (rejection.status === 400) {
                this.$rootScope.$broadcast('goToRoot');
            }
            return this.$q.reject(rejection);
        }
    }

    angular.module('app').service('interceptor', Interceptor);
})();
