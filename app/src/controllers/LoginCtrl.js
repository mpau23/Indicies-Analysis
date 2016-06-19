IndiciesAnalysis.controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService',
    function($scope, $location, AuthenticationService) {

        $scope.formError = false;
        $scope.username = "";
        $scope.password = "";

        AuthenticationService.clearCredentials();

        $scope.tryLogin = function() {

            AuthenticationService.login($scope.username, $scope.password, function(response) {
                $scope.shakeError = false;
                if (response.success) {
                    AuthenticationService.setCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.error;
                    $scope.formError = true;
                }
            });
        };

    }
]);
