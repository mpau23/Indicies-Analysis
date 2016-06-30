IndiciesAnalysis.factory('MarketDataService', ['$http', '$q', function($http, $q) {

    var marketDataService = {

        getOptions: function(marketKey, daysToExpiry, closeBeforeExpiry, optionType, startYear) {

            var apiString = marketKey + "/" + daysToExpiry + "/" + closeBeforeExpiry + "/" + optionType + "/" + startYear;


            return marketDataPromise = $http.get('/api/get/market-data/local/daily/' + apiString)
                .then(function(response) {

                    if (response) {
                        return response.data;
                    } else {
                        return $q.reject;
                    }
                });
        }

    }

    return marketDataService;

}]);
