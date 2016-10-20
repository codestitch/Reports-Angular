(function(){
   'use strict';

   angular
      .module('app')
      .controller('EmptyController', EmptyController);

   EmptyController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope' ];
   function EmptyController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope) {
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

