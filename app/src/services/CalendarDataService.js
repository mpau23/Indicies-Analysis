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

        getWeeklyExpiries: function(startYear) {

            var weeklyExpiriesArray = new Array();
            var today = Date.parse("today");
            var dates = Date.parse("1-1-" + startYear);
            var nextFridayOccurrence = dates.moveToNthOccurrence(5, 1);

            weeklyExpiriesArray.push({
                expiry: {
                    date: nextFridayOccurrence.toString("d-MMM-yyyy")
                }

            });

            while (nextFridayOccurrence < today) {
                nextFridayOccurrence.addDays(7);
                weeklyExpiriesArray.push({
                    expiry: {
                        date: nextFridayOccurrence.toString("d-MMM-yyyy")
                    }
                });
            }

            return weeklyExpiriesArray;
        },

        getOptions: function(daysUntilExpiry, startYear, occurrence) {

            if (occurrence == "weekly") {
                var expiryArray = calendarDataService.getWeeklyExpiries(startYear);
            } else {
                var expiryArray = calendarDataService.getMonthlyExpiries(startYear);

            }


            angular.forEach(expiryArray, function(monthlyExpiry, key) {

                var close = Date.parse(monthlyExpiry.expiry.date);
                close.addDays(-daysUntilExpiry);
                monthlyExpiry.open = {
                    date: close.toString("d-MMM-yyyy")
                }

            });

            return expiryArray;
        }

    }

    return calendarDataService;

}]);
