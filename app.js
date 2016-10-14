(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngTable'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'DownloadController',
                templateUrl: 'views/downloads.view.html',
                activetab: 'downloads',
                controllerAs: 'vm'
            })
            .when('/demographics', {
                controller: 'DemographicsController',
                templateUrl: 'views/demographics.view.html',
                activetab: 'demographics',
                controllerAs: 'vm'
            })
            .when('/home', { 
                controller: 'HomeController',
                templateUrl: 'views/home.view.html',
                activetab: 'home',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'views/register.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/' });

            // $locationProvider.html5Mode(true);
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$route'];
    function run($rootScope, $location, $cookieStore, $http, $route) { 

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            console.log( $route );

            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });

        // Set Global Links
        $rootScope.globals.merchant_domain = "http://familymartsnap.appsolutely.ph/";
        $rootScope.globals.report_link = "php/api.data.php?";
        // $rootScope.globals.report_link = "http://familymartsnap.appsolutely.ph/reportdata.php?";
        $rootScope.globals.export_link = "http://familymartsnap.appsolutely.ph/exportreportsdata.php?"; 

        toastr.options.closeButton = true;
        toastr.options.showMethod = 'slideDown';
        toastr.options.preventDuplicates = true;
        toastr.options.closeDuration = 200;

        $rootScope.$route = $route;
    }
 

})();
