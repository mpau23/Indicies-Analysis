IndiciesAnalysis.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            name: 'home',
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'RootCtrl'
        })
        .state('login', {
            name: 'login',
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });
}]);
