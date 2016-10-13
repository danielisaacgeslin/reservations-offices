(() => {
    'use strict';

    class SpacesController implements ng.IController{
        static $inject: string[] = ['$scope', 'storeService'];
        public spaces: Object;

        constructor(private $scope: ng.IScope, private storeService: any) {
            this.init();
        }

        init(): void {
            this.storeService.getSpaces().then((spaces: Object) => {
                this.spaces = spaces;
            });
        }
    }

    angular.module('app').controller('spacesController', SpacesController);

})();
