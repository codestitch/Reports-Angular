﻿(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngTable', 'ngAnimate', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'countTo'])
        
        .config(config)
        .constant('DataLink', {
            "merchant_domain" : "http://192.168.1.9/jproject/bistro/",
            "exportfile_link" : "http://192.168.1.9/jproject/bistro/reports",
            "report_link" : "php/api.data.php?", 
            "export_link" : "php/api.export.php?"
        })
        .run(run); 

    config.$inject = ['$routeProvider', '$locationProvider', '$mdThemingProvider', '$httpProvider'];
    function config($routeProvider, $locationProvider, $mdThemingProvider, $httpProvider) {
        $routeProvider
            .when('/', { 
                cache: false,
                controller: 'DownloadController',
                templateUrl: 'views/downloads.view.html',
                activetab: 'downloads',
                controllerAs: 'vm'
            })
            .when('/registration', {
                cache: false,
                controller: 'RegistrationController',
                templateUrl: 'views/registration.view.html',
                activetab: 'registration',
                controllerAs: 'vm'
            })
            .when('/demographics', {
                cache: false,
                controller: 'DemographicsController',
                templateUrl: 'views/demographics.view.html',
                activetab: 'demographics',
                controllerAs: 'vm'
            })
            .when('/sales', { 
                cache: false,
                controller: 'SalesController',
                templateUrl: 'views/sales.view.html',
                activetab: 'sales',
                controllerAs: 'vm'
            })
            .when('/spend', { 
                cache: false,
                controller: 'SpendController',
                templateUrl: 'views/spend.view.html',
                activetab: 'spend',
                controllerAs: 'vm'
            })
            .when('/branches', { 
                cache: false,
                controller: 'BranchesController',
                templateUrl: 'views/branches.view.html',
                activetab: 'branches',
                controllerAs: 'vm'
            })
            .when('/customers', { 
                cache: false,
                controller: 'CustomersController',
                templateUrl: 'views/customers.view.html',
                activetab: 'customers',
                controllerAs: 'vm'
            })
            .when('/vouchers', { 
                cache: false,
                controller: 'VouchersController',
                templateUrl: 'views/vouchers.view.html',
                activetab: 'vouchers',
                controllerAs: 'vm'
            })
            .when('/redemption', { 
                cache: false,
                controller: 'RedemptionController',
                templateUrl: 'views/redemptions.view.html',
                activetab: 'redemption',
                controllerAs: 'vm'
            })
            .when('/home', { 
                cache: false,
                controller: 'HomeController',
                templateUrl: 'views/home.view.html',
                activetab: 'home',
                controllerAs: 'vm'
            })

            .when('/login', {
                cache: false,
                controller: 'LoginController',
                templateUrl: 'views/login.view.html',
                activetab: 'login',
                controllerAs: 'vm'
            }) 

            .otherwise({ redirectTo: '/' });

            // $locationProvider.html5Mode(true);
        
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        var pomegranate = $mdThemingProvider.extendPalette('red', {
            '500': '#c0392b'
        });
 
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('pomegranate', pomegranate);

        // Use that theme for the primary intentions
        $mdThemingProvider.theme('default')
            .primaryPalette('pomegranate');
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$route'];
    function run($rootScope, $location, $cookieStore, $http, $route) { 

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) { 

            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
 
            if ($location.path() != '/login') {
                document.getElementById('header-container').className = 'page-header'; 
                document.getElementById('footer-container').className = 'page-footer'; 
            }
            else{
                document.getElementById('header-container').className = 'hide-element';
                document.getElementById('footer-container').className = 'hide-element';                 
            }
        });  

        $rootScope.$route = $route;   
    }  


})();
