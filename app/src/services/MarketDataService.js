IndiciesAnalysis.factory('MarketDataService', ['$http', '$q', function($http, $q) {

    var marketDataService = {

        getDailyMarketData: function(startYear) {

            return marketDataPromise = $http.get('/api/get/market-data/daily/' + startYear)
                .then(function(response) {

                    if (response) {

                        var marketDataArray = [];

                        angular.forEach(response.data.dataset.data, function(day, key) {

                            var date = Date.parse(day[0]);

                            marketDataArray[date.getTime()] = {
                                date: day[0],
                                open: day[1],
                                high: day[2],
                                low: day[3],
                                close: day[4]
                            };
                        });
                        return marketDataArray;

                    } else {
                        return $q.reject;
                    }

                });
        }

    }

    return marketDataService;

}]);
