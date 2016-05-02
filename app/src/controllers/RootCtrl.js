IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', 'CalendarDataService',
    function($scope, $http, $q, MarketDataService, CalendarDataService) {

        renderMarketData();

        $scope.marketKeys = ['SPY', 'FTSE', 'GDAXI', 'SLV', 'QQQ', 'IWM'];

        $scope.changeDaysToExpiry = function() {

            renderMarketData($scope.openBeforeExpiry, $scope.marketKey, $scope.closeBeforeExpiry);
        };

        function renderMarketData(daysToExpiry, marketKey, closeBeforeExpiry) {

            if (!daysToExpiry) {
                daysToExpiry = 15;
            }

            if (!closeBeforeExpiry) {
                closeBeforeExpiry = 0;
            }

            if (!marketKey) {
                marketKey = 'SPY';
            }

            var marketData = MarketDataService.getDailyMarketData(2000, marketKey);
            var volatilityData = MarketDataService.getVolatilityData(2000);
            var monthlyOptions = CalendarDataService.getMonthlyOptions(daysToExpiry, 2000);

            $q.all([marketData, volatilityData]).then(function(response) {

                var marketDataArray = response[0];
                var volatilityDataArray = response[1];

                angular.forEach(monthlyOptions, function(monthlyOption, key) {

                    var expiryDate = getUpdatedDate(Date.parse(monthlyOption.expiry.date), -closeBeforeExpiry, marketDataArray, 5);
                    var openDate = getUpdatedDate(Date.parse(monthlyOption.open.date), 0, marketDataArray, 5);

                    var expiryMarketData = marketDataArray[expiryDate.getTime()];
                    var openMarketData = marketDataArray[openDate.getTime()];

                    if (expiryMarketData && openMarketData) {

                        setOptionMarketData(monthlyOption.expiry, expiryMarketData, expiryDate.toString("d-MMM-yyyy"));
                        setOptionMarketData(monthlyOption.open, openMarketData, openDate.toString("d-MMM-yyyy"));
                        setOptionVariance(monthlyOption, marketDataArray);
                        setOptionVolatility(monthlyOption.expiry, volatilityDataArray, 5);
                        setOptionVolatility(monthlyOption.open, volatilityDataArray, 5);

                    } else {
                        console.log("No market data for: Expiry=" + expiryDate + ", Open=" + openDate);
                    }

                });

                $scope.marketData = monthlyOptions;

            });
        }

        function getUpdatedDate(date, adjustByDays, marketData, threshold) {

            var updatedDate = new Date(date.getTime());
            updatedDate.addDays(adjustByDays);
            var currentDateMarketData = marketData[updatedDate.getTime()];
            var updatedThreshold = 0;
            
            while (!currentDateMarketData && (updatedThreshold <= threshold)) {
                updatedDate.addDays(1);
                currentDateMarketData = marketData[updatedDate.getTime()];
                updatedThreshold++;
            }
            console.log(updatedDate);
            return updatedDate;
        }

        function setOptionMarketData(optionDataForDate, marketDataForDate, date) {

            optionDataForDate.date = date;
            optionDataForDate.open = marketDataForDate.open;
            optionDataForDate.close = marketDataForDate.close;
            optionDataForDate.high = marketDataForDate.high;
            optionDataForDate.low = marketDataForDate.low;
        }

        function setOptionVariance(monthlyOption, marketDataArray) {

            var highestHigh = monthlyOption.open.high;
            var lowestLow = monthlyOption.open.low;
            var expiryDateForVariance = Date.parse(monthlyOption.expiry.date);
            var openDateForVariance = Date.parse(monthlyOption.open.date);

            while (expiryDateForVariance > openDateForVariance) {

                openDateForVariance.addDays(1);

                if (marketDataArray[openDateForVariance.getTime()]) {
                    if (marketDataArray[openDateForVariance.getTime()].high > highestHigh) {
                        highestHigh = marketDataArray[openDateForVariance.getTime()].high;
                    }
                    if (marketDataArray[openDateForVariance.getTime()].low < lowestLow) {
                        lowestLow = marketDataArray[openDateForVariance.getTime()].low;
                    }
                }
            }

            monthlyOption.variance = (monthlyOption.expiry.close - monthlyOption.open.open) / monthlyOption.open.open;

            if (monthlyOption.variance > 0) {
                monthlyOption.highLowVariance =
                    ((highestHigh - monthlyOption.open.open) / monthlyOption.open.open) - monthlyOption.variance;
            } else {
                monthlyOption.highLowVariance =
                    ((lowestLow - monthlyOption.open.open) / monthlyOption.open.open) - monthlyOption.variance;
            }
        }

        function setOptionVolatility(optionDataForDate, marketData, threshold) {

            var volatilityDate = new Date.parse(optionDataForDate.date);
            var updatedThreshold = 0;

            while (!marketData[volatilityDate.getTime()] && (updatedThreshold <= threshold)) {
                volatilityDate.addDays(-1);
                updatedThreshold++;
            }

            if (updatedThreshold == 0) {
                optionDataForDate.volatility = marketData[volatilityDate.getTime()].open;
            } else {
                optionDataForDate.volatility = marketData[volatilityDate.getTime()].close;
            }

        }

    }
]);
