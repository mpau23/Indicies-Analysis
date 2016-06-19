IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', 'CalendarDataService', 'OptionCalculationService',
    function($scope, $http, $q, MarketDataService, CalendarDataService, OptionCalculationService) {

        renderMarketData("SPY", 15, 0, "monthly", 2000);

        $scope.marketKeys = ['SPY', 'FTSE', 'GDAXI', 'SLV', 'QQQ', 'IWM'];
        $scope.marketKey = { "value": $scope.marketKeys[0] };

        $scope.optionTypes = ["weekly", "monthly"];
        $scope.optionType = { "value": $scope.optionTypes[1] };

        $scope.changeDaysToExpiry = function() {
            console.log($scope.marketKey.value);
            console.log($scope.optionType.value);
            renderMarketData($scope.marketKey.value, $scope.openBeforeExpiry, $scope.closeBeforeExpiry, $scope.optionType.value, $scope.startYear);
        };

        function renderMarketData(marketKey, daysToExpiry, closeBeforeExpiry, optionType, startYear) {

            if (!marketKey) {
                marketKey = "SPY";
            }

            if (!daysToExpiry) {
                daysToExpiry = 15;
            }

            if (!closeBeforeExpiry) {
                closeBeforeExpiry = 0;
            }

            if (!optionType) {
                optionType = "monthly";
            }

            if (!startYear) {
                startYear = 2000;
            }

            var marketDataPromise = MarketDataService.getDailyMarketData(startYear, marketKey);
            var volatilityDataPromise = MarketDataService.getVolatilityData(startYear);
            var options = CalendarDataService.getOptions(daysToExpiry, startYear, optionType);

            $q.all([marketDataPromise, volatilityDataPromise]).then(function(response) {

                var marketData = response[0];
                var volatilityData = response[1];

                if (marketData && volatilityData) {
                    var optionData = OptionCalculationService.getOptionData(marketData, volatilityData, options, closeBeforeExpiry);
                }

                $scope.marketData = options;

            });
        }
    }
]);
