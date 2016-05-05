IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', 'CalendarDataService', 'OptionCalculationService',
    function($scope, $http, $q, MarketDataService, CalendarDataService, OptionCalculationService) {

        renderMarketData(15, "SPY", 0);

        $scope.marketKeys = ['SPY', 'FTSE', 'GDAXI', 'SLV', 'QQQ', 'IWM'];

        $scope.changeDaysToExpiry = function() {
            renderMarketData($scope.openBeforeExpiry, $scope.marketKey, $scope.closeBeforeExpiry);
        };

        function renderMarketData(daysToExpiry, marketKey, closeBeforeExpiry) {

            if (!marketKey) {
                marketKey = "SPY";
            }

            if (!daysToExpiry) {
                daysToExpiry = 15;
            }

            if (!closeBeforeExpiry) {
                closeBeforeExpiry = 0;
            }

            var marketDataPromise = MarketDataService.getDailyMarketData(2000, marketKey);
            var volatilityDataPromise = MarketDataService.getVolatilityData(2000);
            var monthlyOptions = CalendarDataService.getMonthlyOptions(daysToExpiry, 2000);

            $q.all([marketDataPromise, volatilityDataPromise]).then(function(response) {

                var marketData = response[0];
                var volatilityData = response[1];

                if (marketData && volatilityData) {
                    var optionData = OptionCalculationService.getOptionData(marketData, volatilityData, monthlyOptions, closeBeforeExpiry);
                }

                $scope.marketData = monthlyOptions;

            });
        }
    }
]);
