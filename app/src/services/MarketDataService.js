IndiciesAnalysis.factory('MarketDataService', ['$http', '$q', function($http, $q) {

    var marketDataService = {

        getDailyMarketData: function(startYear, market) {

            return marketDataPromise = $http.get('/api/get/market-data/local/daily/' + market)
                .then(function(response) {

                    if (response) {

                        var marketDataArray = [];

                        angular.forEach(response.data, function(day, key) {

                            var date = Date.parse(day.Date);

                            marketDataArray[date.getTime()] = {
                                date: day.Date,
                                open: day.Open,
                                high: day.High,
                                low: day.Low,
                                close: day.Close
                            };
                        });
                        return marketDataArray;

                    } else {
                        return $q.reject;
                    }

                });
        },

        getVolatilityData: function(startYear) {

            return marketDataPromise = $http.get('/api/get/market-data/local/daily/VIX')
                .then(function(response) {

                    if (response) {

                        var marketDataArray = [];

                        angular.forEach(response.data, function(day, key) {

                            var date = Date.parse(day.Date);

                            marketDataArray[date.getTime()] = {
                                date: day.Date,
                                open: day.Open,
                                high: day.High,
                                low: day.Low,
                                close: day.Close
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
