'use strict';
/*modules*/
import './modules/app.module';
import './config';
/*services*/
import './services/interceptor.service';
import './services/process.service';
import './services/ajax.service';
import './services/store.service';
/*filters*/
import './filters/time.filter';
import './filters/department.filter';
import './filters/month.filter';
import './filters/dateToNumber.filter';
import './filters/fromTime.filter';
import './filters/toTime.filter';
import './filters/repeatObjectToArray.filter';
/*directives*/
import './directives/toaster.directive';
import './directives/calendar.directive';
/*controllers*/
import './controllers/app.controller';
import './controllers/login.controller';
import './controllers/main.controller';
import './controllers/confirmationModal.controller';
import './controllers/reservation.controller';
import './controllers/tags.controller';
import './controllers/spaces.controller';
