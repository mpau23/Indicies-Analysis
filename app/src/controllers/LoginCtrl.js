IndiciesAnalysis.controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService',
    function($scope, $location, AuthenticationService) {

        $scope.formError = false;
        $scope.login = "";
        $scope.password = "";

        AuthenticationService.clearCredentials();

        $scope.tryLogin = function() {

            AuthenticationService.login($scope.login, $scope.password, function(response) {
                $scope.shakeError = false;
                if (response.success) {
                    AuthenticationService.setCredentials($scope.login, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.error;
                    $scope.formError = true;
                }
            });
        };

    }
]);
