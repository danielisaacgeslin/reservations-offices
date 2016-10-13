(()=>{
	'use strict';

	class ProcessService{
		static $inject: any[] = [];

		constructor(){ }

		public addZeros(number: number): string{
			return <string>(number < 10 ? '0'.concat(number.toString()) : number.toString);
		}

    public dbArrayAdapter(dbArray: any[]): any{
      let dbObject: Object = {};
			let tempObj: any = {};
			let value: any;

      if(typeof dbArray !== 'object'){
        return tempObj;
      }
      dbArray.forEach((object: any)=>{
        tempObj = {};
        for(var key in object){
          value = object[key];
          if(new RegExp('timestamp','i').test(key)){
            value = new Date(value);
          }
					if(key === 'DATE'){
						value = new Date(value.replace('-','/').replace('-','/'));
					}
					if(!isNaN(value) && typeof value === 'string' && value.trim()){
						value = Number(value);
					}
          tempObj[key.toLowerCase()] = value;
        }
        dbObject[tempObj.id] = tempObj;
      });
      return dbObject;
    }
	}

	angular.module('app').service('processService', ProcessService);
})();
