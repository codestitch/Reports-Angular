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

        $(".login-bg").backstretch([
          "assets/img/login.jpg",
          "assets/img/login2.jpg" 
        ], {
            fade: 750,
            duration: 4000
        });
    } 


})();
