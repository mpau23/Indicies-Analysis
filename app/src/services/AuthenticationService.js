IndiciesAnalysis.factory('AuthenticationService', ['Base64Service', '$http', '$cookies', '$rootScope',
    function(Base64Service, $http, $cookies, $rootScope) {

        var service = {

            login: function(username, password, callback) {

                console.log('Attempting to log in');

                $http.get('/api/get/user/by-login/' + Base64Service.encode(username + ':' + password))
                    .then(function(response) {
                        callback(response.data);
                    });
            },

            setCredentials: function(username, password) {

                console.log('Setting credentials')
                var authdata = Base64Service.encode(username + ':' + password);

                console.log('Basic ' + authdata);
                $rootScope.currentUser = authdata;
                $http.defaults.headers.common.Authorization = 'Basic ' + authdata;
                var expiry = new Date();
                expiry.addHours(1);
                $cookies.put('currentUser', $rootScope.currentUser, { expires: expiry });
            },

            clearCredentials: function() {

                delete $rootScope.currentUser;
                $cookies.remove('currentUser');
                $http.defaults.headers.common.Authorization = 'Basic auth';
            }

        };

        return service;
    }
]);
