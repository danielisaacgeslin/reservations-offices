(() => {
    'use strict';

    class TagsController implements ng.IController{
        static $inject: string[] = ['$scope', 'storeService'];
        public tags: Object;

        constructor(private $scope: ng.IScope, private storeService: any) {
            this.init();
        }

        init(): void {
            this.storeService.getTags().then((tags: Object) => {
                this.tags = tags;
            });
        }
    }

    angular.module('app').controller('tagsController', TagsController);

})();
