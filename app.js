(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngTable', 'ngAnimate', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
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
            .when('/registration', {
                controller: 'RegistrationController',
                templateUrl: 'views/registration.view.html',
                activetab: 'registration',
                controllerAs: 'vm'
            })
            .when('/demographics', {
                controller: 'DemographicsController',
                templateUrl: 'views/demographics.view.html',
                activetab: 'demographics',
                controllerAs: 'vm'
            })
            .when('/sales', { 
                controller: 'SalesController',
                templateUrl: 'views/sales.view.html',
                activetab: 'sales',
                controllerAs: 'vm'
            })
            .when('/spend', { 
                controller: 'SpendController',
                templateUrl: 'views/spend.view.html',
                activetab: 'spend',
                controllerAs: 'vm'
            })
            .when('/branches', { 
                controller: 'BranchesController',
                templateUrl: 'views/branches.view.html',
                activetab: 'branches',
                controllerAs: 'vm'
            })
            .when('/customers', { 
                controller: 'DustomersController',
                templateUrl: 'views/customers.view.html',
                activetab: 'customers',
                controllerAs: 'vm'
            })
            .when('/vouchers', { 
                controller: 'VouchersController',
                templateUrl: 'views/vouchers.view.html',
                activetab: 'vouchers',
                controllerAs: 'vm'
            })
            .when('/redemption', { 
                controller: 'RedemptionController',
                templateUrl: 'views/redemption.view.html',
                activetab: 'redemption',
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

        toastr.options.closeButton = true;
        toastr.options.showMethod = 'slideDown';
        toastr.options.preventDuplicates = true;
        toastr.options.closeDuration = 200;

        $rootScope.$route = $route;

        
    } 


})();
