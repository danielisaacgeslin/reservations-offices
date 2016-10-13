(()=>{
	'use strict';

	class StoreService{
		static $inject:any[] = ['ajaxService', 'processService', '$q'];
    private reservations: any = {};
		private comments: any = {};
		private tags: any = {};
		private spaces: any = {};
		private currentUser: IUser = {};
		private currentUserDefer: any;

		constructor(private ajaxService: any, private processService: any, private $q: ng.IQService){

		}

		public logout(): ng.IPromise<any>{
			const defer = this.$q.defer();
			this.ajaxService.logout().then(()=>{
				this.resetCurrentUser();
				this.resetReservations();
				this.resetTags();
				this.resetComments();
				defer.resolve();
			});
			return defer.promise;
		}

		public getCurrentUser(): ng.IPromise<IUser>{
			let adapted = null;
			let firstRequest = false;

			if(!this.currentUserDefer){
				firstRequest = true;
				this.currentUserDefer = this.$q.defer();
			}

			if(this.currentUser.id){
				this.currentUserDefer.resolve(this.currentUser);
			}

			if(!this.currentUser.id && firstRequest){
				this.ajaxService.getCurrentUser().then((response: any)=>{
					adapted = this.processService.dbArrayAdapter([response.data.payload]);
					this.currentUser = adapted[Object.keys(adapted)[0]];
					this.currentUserDefer.resolve(this.currentUser);
				});
			}

			return this.currentUserDefer.promise;
		}

    public getReservation(reservationId: number): ng.IPromise<IReservation>{
      const defer = this.$q.defer();
      let reservation;
      if(this.reservations[reservationId]){
        defer.resolve(this.reservations[reservationId]);
      }else{
        this.ajaxService.getReservation(reservationId).then((response: any)=>{
					if(!response.data.payload.length){
						defer.reject();
						return defer.promise;
					}
          reservation = this.processService.dbArrayAdapter(response.data.payload);
          this.reservations[reservationId] = reservation[Object.keys(reservation)[0]];
					defer.resolve(this.reservations[reservationId]);
        });
      }
      return defer.promise;
    }

    public getReservationList(month: number, year: number): ng.IPromise<any>{
      const defer = this.$q.defer();
      this.ajaxService.getReservationList(month, year).then((response: any)=>{
        /*keeping old reservations as they were stored*/
        this.reservations = Object.assign(this.processService.dbArrayAdapter(response.data.payload), this.reservations);
        defer.resolve(this.reservations);
      });
      return defer.promise;
    }

    public getReservationTagList(reservationId: number): ng.IPromise<any>{
      const defer = this.$q.defer();
			let reservationTags;
			this.ajaxService.getReservationTagList(reservationId).then((response: any)=>{
				reservationTags = this.processService.dbArrayAdapter(response.data.payload);
				Object.assign(this.tags, reservationTags);
				this.reservations[reservationId].tags = reservationTags;
        defer.resolve(reservationTags);
			});
      return defer.promise;
    }

    public getComments(reservationId: number): ng.IPromise<any>{
      const defer = this.$q.defer();
      let newComments;
      this.ajaxService.getComments(reservationId).then((response: any)=>{
        newComments = this.processService.dbArrayAdapter(response.data.payload);
        Object.assign(this.comments,newComments);
        this.reservations[reservationId].comments = newComments;
        defer.resolve();
      });
      return defer.promise;
    }

    public getTags(): ng.IPromise<any>{
      const defer = this.$q.defer();
			if(Object.keys(this.tags).length){
				defer.resolve(this.tags);
			}else{
				this.ajaxService.getTags().then((response: any)=>{
					this.tags = Object.assign(this.processService.dbArrayAdapter(response.data.payload), this.tags);
					defer.resolve(this.tags);
				});
			}
      return defer.promise;
    }

		public getSpaces(): ng.IPromise<any>{
      const defer = this.$q.defer();
			if(Object.keys(this.spaces).length){
				defer.resolve(this.spaces);
			}else{
				this.ajaxService.getSpaces().then((response: any)=>{
					this.spaces = Object.assign(this.processService.dbArrayAdapter(response.data.payload), this.spaces);
					defer.resolve(this.spaces);
				});
			}
      return defer.promise;
    }

    public setReservation(obj: any): ng.IPromise<number>{
      const defer = this.$q.defer();
      /*save*/
      if(!obj.reservation_id){
        this.ajaxService.saveReservation(obj).then((response: any)=>{
          defer.resolve(response.data.payload);
        });
      /*update*/
      }else{
        this.ajaxService.updateReservation(obj).then((response: any)=>{
          this.resetReservation(obj.reservation_id);
          defer.resolve(obj.reservation_id);
        });
      }
      return defer.promise;
    }

    public setTag(reservationId: number, tagId: number, tag: ITag): ng.IPromise<any>{
      const defer = this.$q.defer();
			this.ajaxService.addTag(reservationId, tagId).then((response: any)=>{
				defer.resolve(response.data.payload);
			});
      return defer.promise;
    }

    public setComment(comment: string, reservationId: number, commentId: number): ng.IPromise<any>{
      const defer = this.$q.defer();
			let newComment = {};
      if(comment && commentId){
        this.ajaxService.updateComment(comment, commentId).then((response: any)=>{
          this.comments[commentId].text = comment;
          defer.resolve(response);
        });
      }else{
        this.ajaxService.saveComment(comment, reservationId).then((response: any)=>{
          newComment = {
						id: response.data.payload,
						text: comment,
						creation_timestamp: new Date(),
						creation_user: this.currentUser.id,
						floor: this.currentUser.floor,
						department: this.currentUser.department
					};
					this.comments[response.data.payload] = newComment;
					this.reservations[reservationId].comments[response.data.payload] = newComment;
          defer.resolve(response);
        });
      }
      return defer.promise;
    }

    public deleteTag(reservationId: number, tagId: number): ng.IPromise<any>{
      const defer = this.$q.defer();
			this.ajaxService.removeTag(reservationId, tagId).then((response: any)=>{
				delete this.reservations[reservationId].tags[tagId];
				defer.resolve();
			});
      return defer.promise;
    }

    public deleteReservation(reservationId: number): ng.IPromise<any>{
      const defer = this.$q.defer();
      this.ajaxService.deleteReservation(reservationId).then((response: any)=>{
        if(this.reservations[reservationId].comments){
          for(let key in this.reservations[reservationId].comments){
            delete this.comments[key];
          }
        }
        delete this.reservations[reservationId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    public deleteComment(commentId: number, reservationId: number): ng.IPromise<any>{
      const defer = this.$q.defer();
      this.ajaxService.deleteComment(commentId).then((response: any)=>{
        delete this.comments[commentId];
        delete this.reservations[reservationId].comments[commentId];
        defer.resolve(response);
      });
      return defer.promise;
    }

    public resetReservations(): void{
      this.reservations = {};
    }

    public resetReservation(reservationId: number): void{
      delete this.reservations[reservationId];
    }

    public resetTags(): void{
      this.tags = {};
    }

    public resetComments(): void{
      this.comments = {};
    }

		public resetCurrentUser(): void{
			this.currentUserDefer = null;
      this.currentUser = {};
    }
	}

	angular.module('app').service('storeService', StoreService);
})();
