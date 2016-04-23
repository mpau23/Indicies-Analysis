IndiciesAnalysis.factory('CalendarDataService', ['$http', '$q', function($http, $q) {

    var calendarDataService = {

        getMonthlyExpiries: function(startYear) {

            var monthlyExpiresArray = new Array();
            var today = Date.parse("today");
            var startOfMonth = Date.parse("1-1-" + startYear);
            var thirdFridayOfMonth = startOfMonth.moveToNthOccurrence(5, 3);

            monthlyExpiresArray.push({
                expiry: {
                    date: thirdFridayOfMonth.toString("d-MMM-yyyy")
                }

            });

            while (thirdFridayOfMonth < today) {
                startOfMonth.addMonths(1);
                thirdFridayOfMonth = startOfMonth.moveToNthOccurrence(5, 3);
                monthlyExpiresArray.push({
                    expiry: {
                        date: thirdFridayOfMonth.toString("d-MMM-yyyy")
                    }
                });
            }

            return monthlyExpiresArray;
        },

        getMonthlyOptions: function(daysUntilExpiry, startYear) {

            var monthlyExpiresArray = calendarDataService.getMonthlyExpiries(startYear);

            angular.forEach(monthlyExpiresArray, function(monthlyExpiry, key) {

                var close = Date.parse(monthlyExpiry.expiry.date);
                close.addDays(-daysUntilExpiry);
                monthlyExpiry.open = {
                    date: close.toString("d-MMM-yyyy")
                }

            });

            return monthlyExpiresArray;
        }

    }

    return calendarDataService;

}]);
