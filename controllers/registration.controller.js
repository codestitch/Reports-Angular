(function(){
   'use strict';

   angular
      .module('app')
      .controller('RegistrationController', RegistrationController);

   RegistrationController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope' ];
   function RegistrationController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope) {
      var vm = this; 
        
      // Variables 

      // Access Functions 
      
      // Initialization
      Initialize();


      // Public functions
      function Initialize(){  
         PreloaderService.Display(); 
         PreloaderService.Hide(); 
      }
 
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
    } 

})();

