(function(){
   'use strict';

   angular
      .module('app')
      .controller('EmptyController', EmptyController);

   EmptyController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function EmptyController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
      var vm = this; 
        
      // Variables 
      vm.daterange = { 
         summary: { start: '', end: ''},
         perhour: { start: '', end: ''}
      };
      vm.totalrecord = { summary: 0, perhour: 0 };
      vm.preloader = {
         summary: true,
         perhour: true
      };
      vm.exportingprogress = false; // export flag

      
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

