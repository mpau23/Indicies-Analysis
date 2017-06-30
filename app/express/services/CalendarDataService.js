var winston = require('winston');
var Promise = require("bluebird");

var calendarDataService = {

    getMonthlyExpiries: function(startYear, daysUntilExpiry) {

        var monthlyExpiresArray = new Array();
        var today = Date.parse("today");
        var startOfMonth = Date.parse("1-1-" + startYear);
        var thirdFridayOfMonth = startOfMonth.moveToNthOccurrence(5, 3);
        var openDate = Date.parse(thirdFridayOfMonth.toString());
        openDate.addDays(-daysUntilExpiry);

        monthlyExpiresArray.push({
            expiry: {
                date: thirdFridayOfMonth.toString("d-MMM-yyyy")
            },
            open: {
                date: openDate.toString("d-MMM-yyyy")
            }

        });

        while (thirdFridayOfMonth < today) {
            startOfMonth.addMonths(1);
            thirdFridayOfMonth = startOfMonth.moveToNthOccurrence(5, 3);
            openDate = Date.parse(thirdFridayOfMonth.toString());
            openDate.addDays(-daysUntilExpiry);
            
            monthlyExpiresArray.push({
                expiry: {
                    date: thirdFridayOfMonth.toString("d-MMM-yyyy")
                },
                open: {
                    date: openDate.toString("d-MMM-yyyy")
                }

            });
        }

        return monthlyExpiresArray;
    },

    getWeeklyExpiries: function(startYear, daysUntilExpiry) {

        var weeklyExpiriesArray = new Array();
        var today = Date.parse("today");
        var dates = Date.parse("1-1-" + startYear);
        var nextFridayOccurrence = dates.moveToNthOccurrence(5, 1);
        var openDate = nextFridayOccurrence.addDays(-daysUntilExpiry);

        weeklyExpiriesArray.push({
            expiry: {
                date: nextFridayOccurrence.toString("d-MMM-yyyy")
            },
            open: {
                daate: openDate.toString("d-MMM-yyyy")
            }

        });

        while (nextFridayOccurrence < today) {
            nextFridayOccurrence.addDays(7);
            openDate = nextFridayOccurrence.addDays(-daysUntilExpiry);
            weeklyExpiriesArray.push({
                expiry: {
                    date: nextFridayOccurrence.toString("d-MMM-yyyy")
                },
                open: {
                    daate: openDate.toString("d-MMM-yyyy")
                }
            });
        }

        return weeklyExpiriesArray;
    },

    getOptions: function(daysUntilExpiry, startYear, occurrence) {

        winston.info("Calculating " + occurrence + " option dates from year " + startYear + " with " + daysUntilExpiry + " days before expiry")
        return new Promise(function(resolve, reject) {

            if (occurrence == "weekly") {
                var expiryArray = calendarDataService.getWeeklyExpiries(startYear, daysUntilExpiry);
            } else {
                var expiryArray = calendarDataService.getMonthlyExpiries(startYear, daysUntilExpiry);
            }

            resolve(expiryArray);
            winston.info("Calculated option dates : ");
        });

    }

};

module.exports = calendarDataService;

