(function () {
    'use strict';
    angular.module('app').directive('calendar', calendarDirective);
    calendarDirective.$inject = [];
    function calendarDirective() {
        var Link = (function () {
            function Link($scope) {
                this.$scope = $scope;
                this.$scope.days = [];
                this.$scope.checkVaidity = this.checkVaidity;
                this.$scope.getNewHref = this.getNewHref;
                this.$scope.delete = this.deleteReservation;
                this.$scope.$watch('data', this.updateCalendar.bind(this));
                this.$scope.$on('updateCalendar', this.updateCalendar.bind(this));
            }
            Link.prototype.updateCalendar = function () {
                var _this = this;
                var month = this.$scope.date.getMonth();
                var year = this.$scope.date.getFullYear();
                var days = this.getDaysInMonth(month, year);
                var count = 0;
                days = days.map(function (day) {
                    day.items = [];
                    day.empty = true;
                    for (var item in _this.$scope.data) {
                        if (_this.compareDates(day.date, _this.$scope.data[item].date)) {
                            day.items.push(_this.$scope.data[item]);
                            day.empty = false;
                            count++;
                        }
                    }
                    return day;
                });
                this.$scope.count = count;
                this.$scope.days = days;
            };
            Link.prototype.getDaysInMonth = function (month, year) {
                var date = new Date(year, month, 1);
                var days = [];
                while (date.getMonth() === month) {
                    days.push({ date: new Date(date) });
                    date.setDate(date.getDate() + 1);
                }
                return days;
            };
            Link.prototype.compareDates = function (date1, date2) {
                return date1.getTime() === date2.getTime();
            };
            Link.prototype.checkVaidity = function (date) {
                var time = date.getTime();
                var yesterday = new Date().setDate(new Date().getDate() - 1);
                return time > yesterday;
            };
            Link.prototype.getNewHref = function (date) {
                return this.checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime().toString()) : '';
            };
            Link.prototype.deleteReservation = function (id) {
                this.$scope.$emit('deleteReservation', id);
            };
            return Link;
        }());
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
