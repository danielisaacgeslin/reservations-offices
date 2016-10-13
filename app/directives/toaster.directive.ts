(()=>{
	'use strict';

	angular.module('app').directive('toaster', toaster);

  toaster.$inject = ['constants'];

	function toaster(constants: any): ng.IDirective {

		class Link{
			private timeout: number = 0;
			constructor(public $scope: any, public $element: any, $attr: any){
				this.$scope.$watch('data', this.toast);
			}

			toast(): boolean{
				if(!this.$scope.data.type){
					return false;
				}
				clearTimeout(this.timeout);
				this.timeout = setTimeout(()=>{
					this.$scope.data = {};
					this.$scope.$digest();
				}, constants.toasterTime);
				return true;
			}
		}

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
