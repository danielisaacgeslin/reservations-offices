(() =>{
	'use strict';

	class MainController {
		static $inject: any[] = ['$scope', '$q', '$rootScope', '$state', '$uibModal', 'storeService'];
		public visualization: string = 'calendar';
		public date: Date = new Date();
		public reservations: Object = {};
		public reservationCount: number = 0;
		public currentUser: IUser;
		public loading: boolean = false;

		constructor(
			public $scope: ng.IScope,
			private $q: ng.IQService,
			private $rootScope: ng.IRootScopeService,
			private $state: ng.ui.IState,
			private $uibModal: ng.ui.bootstrap.IModalService,
			private storeService: any
		){
			this.init();
		}

		/*private functions*/
		init(): void{
			this.getReservationList();
			this.storeService.getCurrentUser().then((user:IUser)=>{
				this.currentUser = <IUser>user;
			});
		}

		toastSuccess(): ng.IPromise<any>{
			const defer = this.$q.defer();
			this.$rootScope.$broadcast('OK', '');
			defer.resolve();
			return defer.promise;
		}

		getReservationList(): void{
			const month: number = this.date.getMonth() + 1;
			const year: number = this.date.getFullYear();

			this.loading = true;

			this.storeService.getReservationList(month, year).then((reservations)=>{
				this.reservations = reservations;
				this.loading = false;
			});
		}
		/*end private functions*/

		/*public functions*/
		deleteReservation(reservationId: number): void{
			const date: Date = this.reservations[reservationId].date;
			const title: string = 'About to delete a reservation';
			const body: string = 'You are about to delete "'
			.concat(this.reservations[reservationId].title)
			.concat(' - ')
			.concat(date.getDate().toString()).concat('/')
			.concat(date.getMonth().toString()).concat('/')
			.concat(date.getFullYear().toString())
			.concat('". This action cannot be reverted, are you sure?');

			const modalInstance: any = this.$uibModal.open({
				templateUrl : 'confirmation.modal.html',
				controller : 'confirmationModalController',
				controllerAs: 'vm',
				//windowClass : '',
				//backdrop : 'static',
				//keyboard : false,
				resolve: {
					data: {
						title: title,
						body: body
					}
				}
			});

			/*accepting deletion*/
			modalInstance.result.then(()=>{
				this.storeService.deleteReservation(reservationId).then(this.toastSuccess).then(()=>{
					this.$scope.$broadcast('updateCalendar');
				});
			});
		}

		switchVisualization(visualization: string): void{
			this.visualization = visualization;
		}

		next(): void{
			this.date.setMonth(this.date.getMonth() + 1);
			this.getReservationList();
		}

		prev(): void{
			this.date.setMonth(this.date.getMonth() - 1);
			this.getReservationList();
		}

		checkVaidity(date): boolean{
			const time: number = date.getTime();
			const yesterday: number = new Date().setDate(new Date().getDate() - 1);
			return time > yesterday;
		}
		/*end public functions*/
	}

	angular.module('app').controller('mainController', MainController);
})();
