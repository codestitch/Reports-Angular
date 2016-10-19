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

            // $rootScope.$on('$locationChangeStart', function () {
            //     clearFlashMessage();
            // });

            // function clearFlashMessage() {
            //     var flash = $rootScope.flash;
            //     if (flash) {
            //         if (!flash.keepAfterLocationChange) {
            //             delete $rootScope.flash;
            //         } else {
            //             // only keep for a single location change
            //             flash.keepAfterLocationChange = false;
            //         }
            //     }
            // }
        }

        function Display() {
            $rootScope.preloader = 'display'; 
            document.getElementById('homePreloader').className = "display-element";
            console.log("Preloader: "+$rootScope.preloader);
        }

        function Hide() {
            $rootScope.preloader = 'hide';
            document.getElementById('homePreloader').className = "hide-element";
            console.log("Preloader: "+$rootScope.preloader);
        }
    }

})();