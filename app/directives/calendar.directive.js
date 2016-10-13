(function () {
    'use strict';
    var calendarDirective = function () {
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
        };
    };
    angular.module('app').directive('calendar', calendarDirective);
    function link($scope, element, attributes) {
        var vm = this;
        $scope.checkVaidity = checkVaidity;
        $scope.getNewHref = getNewHref;
        $scope.deleteReservation = deleteReservation;
        init();
        function init() {
            $scope.days = [];
            $scope.checkVaidity = checkVaidity;
            $scope.getNewHref = getNewHref;
            $scope.delete = deleteReservation;
            $scope.$watch('data', updateCalendar);
            $scope.$on('updateCalendar', updateCalendar);
        }
        function updateCalendar() {
            var month = $scope.date.getMonth();
            var year = $scope.date.getFullYear();
            var days = getDaysInMonth(month, year);
            var count = 0;
            days = days.map(function (day) {
                day.items = [];
                day.empty = true;
                for (var item in $scope.data) {
                    if (compareDates(day.date, $scope.data[item].date)) {
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
        function getDaysInMonth(month, year) {
            var date = new Date(year, month, 1);
            var days = [];
            while (date.getMonth() === month) {
                days.push({ date: new Date(date) });
                date.setDate(date.getDate() + 1);
            }
            return days;
        }
        function compareDates(date1, date2) {
            return date1.getTime() === date2.getTime();
        }
        function checkVaidity(date) {
            var time = date.getTime();
            var yesterday = new Date().setDate(new Date().getDate() - 1);
            return time > yesterday;
        }
        function getNewHref(date) {
            return checkVaidity(date) ? '#/reservation/new/'.concat(date.getTime().toString()) : '';
        }
        function deleteReservation(id) {
            $scope.$emit('deleteReservation', id);
        }
    }
})();
