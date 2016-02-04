IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', 'CalendarDataService',
    function($scope, $http, $q, MarketDataService, CalendarDataService) {

        renderMarketData();

        function renderMarketData() {

            var marketData = MarketDataService.getDailyMarketData(2000);
            var monthlyOptions = CalendarDataService.getMonthlyOptions(12, 2000);

            $q.all([marketData]).then(function(response) {

                var marketDataArray = response[0];
                angular.forEach(monthlyOptions, function(monthlyOption, key) {

                    var expiryDate = Date.parse(monthlyOption.expiry.date);
                    var openDate = Date.parse(monthlyOption.open.date);
                    var expiryMarketData = marketDataArray[expiryDate.getTime()];
                    var openMarketData = marketDataArray[openDate.getTime()];
                    
                    if (expiryMarketData) {
                        monthlyOption.expiry.open = expiryMarketData.open;
                        monthlyOption.expiry.close = expiryMarketData.close;
                        monthlyOption.expiry.high = expiryMarketData.high;
                        monthlyOption.expiry.low = expiryMarketData.low;
                    } else {
                        console.log(expiryDate + ": not in market data");
                    }
                    
                    if (openMarketData) {
                        monthlyOption.open.open = openMarketData.open;
                        monthlyOption.open.close = openMarketData.close;
                        monthlyOption.open.high = openMarketData.high;
                        monthlyOption.open.low = openMarketData.low;
                    } else {
                        console.log(openDate + ": not in market data");
                    }

                    if(expiryMarketData && openMarketData) {
                    	monthlyOption.variance = (expiryMarketData.close - openMarketData.open) / openMarketData.open;
                    }

                });

                console.log(monthlyOptions);
                $scope.marketData = monthlyOptions;

            });
        }

    }
]);
