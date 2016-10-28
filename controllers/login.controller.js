(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'ToastService'];
    function LoginController($location, AuthenticationService, ToastService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();

              console.log('screen.height');
              console.log(screen.height);
              document.getElementById('sideImage').style.height = (screen.height - 130)+"px"; 
        })();

        function login() {
 
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response[0].response == "Success") {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {  

                    ToastService.Show('Error Login Credentials', response[0].description); 
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
