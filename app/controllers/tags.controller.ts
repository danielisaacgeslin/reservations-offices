(() => {
    'use strict';

    class TagsController {
        static $inject: any[] = ['$scope', 'storeService'];
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
