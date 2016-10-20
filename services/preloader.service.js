(function () {
    'use strict';

    angular
        .module('app')
        .factory('PreloaderService', PreloaderService);

    PreloaderService.$inject = ['$rootScope'];
    function PreloaderService($rootScope) {
        var service = {};

        service.Display = Display;
        service.Hide = Hide; 

        initService();

        return service; 

        function initService() { 
        }

        function Display() {
            $rootScope.preloader = 'display'; 
            // document.getElementById('homePreloader').className = "display-element";
            console.log("Preloader: "+$rootScope.preloader);
        }

        function Hide() {
            $rootScope.preloader = 'hide';
            // document.getElementById('homePreloader').className = "hide-element";
            console.log("Preloader: "+$rootScope.preloader);
        }
    }

})();