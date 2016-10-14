(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
 
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response[0].response == "Success") {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {  
                    FlashService.Error(response[0].description);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
