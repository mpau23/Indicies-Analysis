IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', function($scope, $http, $q, MarketDataService) {

    $scope.marketKeys = ['SPY', 'FTSE', 'DAX', 'SLV', 'QQQ', 'IWM', 'GDX'];
    $scope.marketKey = { "value": $scope.marketKeys[0] };

    $scope.optionTypes = ["weekly", "monthly"];
    $scope.optionType = { "value": $scope.optionTypes[1] };

    $scope.loading = false;

    renderMarketData("SPY", 15, 0, "monthly", 2000);

    $scope.changeDaysToExpiry = function() {
        renderMarketData($scope.marketKey.value, $scope.openBeforeExpiry, $scope.closeBeforeExpiry, $scope.optionType.value, $scope.startYear);
    };

    function renderMarketData(marketKey, daysToExpiry, closeBeforeExpiry, optionType, startYear) {
        $scope.loading = true;

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

        var marketDataPromise = MarketDataService.getOptions(marketKey, daysToExpiry, closeBeforeExpiry, optionType, startYear);

        marketDataPromise.then(function(response) {
            if (response) {
                $scope.marketData = response;

            }

            $scope.loading = false;
        });
    }
}]);
