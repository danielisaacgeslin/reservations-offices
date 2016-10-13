(()=>{
	'use strict';

	const calendarDirective = (): ng.IDirective =>{
		return {
			restrict: 'E',
			templateUrl: 'calendar.directive.html',
			link: link,
			scope: {
					data: '=',
					date: '=',
					count: '=',
					user: '=',
					newReservation: '='
			}
		}
	};

	angular.module('app').directive('calendar', calendarDirective);

	function link($scope: any, element: JQuery, attributes: ng.IAttributes): void{
		const vm = this;

		$scope.checkVaidity = checkVaidity;
		$scope.getNewHref = getNewHref;
		$scope.deleteReservation = deleteReservation;

		init();

		function init(): void{
			$scope.days = [];

			$scope.checkVaidity = checkVaidity;
			$scope.getNewHref = getNewHref;
			$scope.delete = deleteReservation;
			$scope.$watch('data', updateCalendar);
			$scope.$on('updateCalendar', updateCalendar);
		}

		function updateCalendar(): void{
			const month: number = $scope.date.getMonth();
			const year: number = $scope.date.getFullYear();
			let days: any[] = getDaysInMonth(month, year);
			let count: number = 0;

			days = days.map((day: any): any=>{
				day.items = [];
				day.empty = true;
				for(let item in $scope.data){
					if(compareDates(day.date, $scope.data[item].date)){
						day.items.push($scope.data[item]);
						day.empty = false;
						count++;
					}
				}
				return day;
			});

			$scope.count = count;
			$scope.days = days;
		}

		function getDaysInMonth(month: number, year: number): any[] {
			const date: Date = new Date(year, month, 1);
			let days: any[] = [];
			while (date.getMonth() === month) {
				days.push({date: new Date(date)});
				date.setDate(date.getDate() + 1);
			}
			return days;
		}

		function compareDates(date1: Date, date2: Date): boolean{
			return date1.getTime() === date2.getTime();
		}

		function checkVaidity(date: Date): boolean{
			const time: number = date.getTime();
			const yesterday: number = new Date().setDate(new Date().getDate() - 1);
			return time > yesterday;
		}

		function getNewHref(date: Date): string{
			return checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime().toString()) : '';
		}

		function deleteReservation(id: number): void{
			$scope.$emit('deleteReservation', id);
		}
	}
})();
