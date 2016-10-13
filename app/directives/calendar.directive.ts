(()=>{
	'use strict';

	angular.module('app').directive('calendar', calendarDirective);

  calendarDirective.$inject = [];

	function calendarDirective(): ng.IDirective {

		class Link{
			constructor(public $scope: any){
				this.$scope.days = [];

				this.$scope.checkVaidity = this.checkVaidity;
				this.$scope.getNewHref = this.getNewHref;
				this.$scope.delete = this.deleteReservation;

				this.$scope.$watch('data', this.updateCalendar.bind(this));
				this.$scope.$on('updateCalendar', this.updateCalendar.bind(this));
			}

      /*private functions*/
			private updateCalendar(){
				const month: number = this.$scope.date.getMonth();
				const year: number = this.$scope.date.getFullYear();
				let days: any[] = this.getDaysInMonth(month, year);
				let count: number = 0;

				days = days.map((day: any): any=>{
					day.items = [];
					day.empty = true;
					for(let item in this.$scope.data){
						if(this.compareDates(day.date, this.$scope.data[item].date)){
							day.items.push(this.$scope.data[item]);
							day.empty = false;
							count++;
						}
					}
					return day;
				});

				this.$scope.count = count;
				this.$scope.days = days;
			}

			private getDaysInMonth(month: number, year: number): any[] {
				const date: Date = new Date(year, month, 1);
				let days: any[] = [];
				while (date.getMonth() === month) {
					days.push({date: new Date(date)});
					date.setDate(date.getDate() + 1);
				}
				return days;
			}

			private compareDates(date1: Date, date2: Date){
				return date1.getTime() === date2.getTime();
			}
      /*end private functions*/

      /*public functions*/
			public checkVaidity(date: Date): boolean{
				const time: number = date.getTime();
				const yesterday: number = new Date().setDate(new Date().getDate() - 1);
				return time > yesterday;
			}

			public getNewHref(date: Date): string{
				return this.checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime().toString()) : '';
			}

			public deleteReservation(id: number): void{
				this.$scope.$emit('deleteReservation', id);
			}
    }

    return {
      restrict: 'E',
      templateUrl: 'calendar.directive.html',
      link: Link,
      scope: {
          data: '=',
					date: '=',
					count: '=',
					user: '=',
					newReservation: '='
      }
    };
	}
})();
