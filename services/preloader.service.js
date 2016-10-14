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
 

        return service; 

        function Display() {
            $rootScope.preloader = 'display';
            
            console.log($rootScope.preloader);
        }

        function Hide() {
            $rootScope.preloader = 'hide';
            console.log($rootScope.preloader);
        }
    }

})();