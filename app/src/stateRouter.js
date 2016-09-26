IndiciesAnalysis.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            views: {
                '@': {
                    templateUrl: 'views/root.html'
                },
                'header@index': {
                    templateUrl: 'views/root.header.html',
                    controller: 'HeaderCtrl',
                },

                '@index': {
                    templateUrl: 'views/root.home.html',
                    controller: 'HomeCtrl',
                }
            }
        })
        .state('index.login', {
            url: 'login',
            views: {
                '@index': {
                    templateUrl: 'views/root.login.html',
                    controller: 'LoginCtrl',
                    url: 'login'
                }
            }
        });

}]);
