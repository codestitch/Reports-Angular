(function(){
   'use strict';

   angular
      .module('app')
      .controller('CustomersController', CustomersController)
      .controller('ExportCustomerCtrl', ExportCustomerCtrl)
      .controller('ExportCustomerQuarterlySalesCtrl', ExportCustomerQuarterlySalesCtrl)
      .controller('ExportCustomerQuarterlyVisitsCtrl', ExportCustomerQuarterlyVisitsCtrl);

   CustomersController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function CustomersController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
      var vm = this; 
        
      // Variables 
      vm.daterange = { 
         summary: { start: '', end: ''} 
      };
      vm.totalrecord = { summary: 0 };
      vm.preloader = {
         summary: true 
      };
      vm.exportingprogress = false; // export flag
      
      // Access Functions 
      vm.GetCustomerSummary = GetCustomerSummary;
      vm.ExportCustomerSummary = ExportCustomerSummary;
      vm.ExportQuarterlySales = ExportQuarterlySales;
      vm.ExportQuarterlyVisits = ExportQuarterlyVisits;

      
      // Initialization
      Initialize();


      // Public functions
      function Initialize(){   
         PreloaderService.Display();
         PreloaderService.Hide(); 
         GetCustomerQuarterlySales();
         GetCustomerQuarterlyVisits();
      }


      function GetCustomerQuarterlySales(){
         QueryService.GetCustomerQuarterlySales ()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.quarterlysales = result[0].data;
                  }
            });
      }

      function GetCustomerQuarterlyVisits(){
         QueryService.GetCustomerQuarterlyVisits ()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.quarterlyvisit = result[0].data;
                  }
            });
      }

      function GetCustomerSummary(){    

         if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }

         vm.preloader.summary = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetCustomerSummary(vm.daterange.summary.start, vm.daterange.summary.end)
            .then( function(result){ 
               console.log(result);
               if (result[0].response == "Success") {  
                  vm.tableParams = TableService.Create(result[0].data, vm.tableParams); 
                  vm.totalrecord.summary = result[0].data.length;  
               }
               else if (result[0].response == "Empty"){ 
                  ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment');
               }
               else{
                  ToastService.Show('Something went wrong', result); 
               } 
               vm.preloader.summary = true;
            }); 
      }

      function ExportCustomerSummary(){
         if (!vm.exportingprogress) {

            if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
               ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
               return;
            }
            var _data = { 'daterange': vm.daterange.summary };

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent()
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportCustomerCtrl').then(
                  function(resolve) {  
                     ToastService.Show('Export Successful', '');
                     vm.exportingprogress = false; 
                  }, function(reject) {  
                     vm.exportingprogress = false; 
                     if (reject == "Empty") {
                        ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment'); 
                     }
                     else {
                        ToastService.Show('Something went wrong', reject); 
                     }
                  }); 

            }, function() {
               vm.exportingprogress = false; 
            }); 
         }
      }

      function ExportQuarterlySales(_isall){
         if (!vm.exportingprogress) {
            var _data = (_isall) ? { 'mode': 'all' } : { 'mode': 'single' }; 

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent()
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportCustomerQuarterlySalesCtrl').then(
                  function(resolve) {  
                     ToastService.Show('Export Successful', '');
                     vm.exportingprogress = false; 
                  }, function(reject) {  
                     vm.exportingprogress = false; 
                     if (reject == "Empty") {
                        ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment'); 
                     }
                     else {
                        ToastService.Show('Something went wrong', reject); 
                     }
                  }); 

            }, function() {
               vm.exportingprogress = false; 
            });
         }       
      }

      function ExportQuarterlyVisits(_isall){
         if (!vm.exportingprogress) {
            var _data = (_isall) ? { 'mode': 'all' } : { 'mode': 'single' }; 

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent()
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportCustomerQuarterlyVisitsCtrl').then(
                  function(resolve) {  
                     ToastService.Show('Export Successful', '');
                     vm.exportingprogress = false; 
                  }, function(reject) {  
                     vm.exportingprogress = false; 
                     if (reject == "Empty") {
                        ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment'); 
                     }
                     else {
                        ToastService.Show('Something went wrong', reject); 
                     }
                  }); 

            }, function() {
               vm.exportingprogress = false; 
            });
         } 

      }

      $('#customersummarydate').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.summary.start = start.format('YYYY/MM/DD');
         vm.daterange.summary.end =  end.format('YYYY/MM/DD');
         $('#customersummarydate span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   } 


   ExportCustomerCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportCustomerCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      ExportService.ExportCustomerSummary(data.daterange.start, data.daterange.end)
         .then(function(result){
            if (result[0].response == "Success") { 
               window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename; 
               $mdToast.hide('Success');  
            }
            else if(result[0].response == "Empty"){
               $mdToast.cancel('Empty');   
            }
            else{
               $mdToast.cancel(result);   
            }
         }); 
   }


   ExportCustomerQuarterlySalesCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportCustomerQuarterlySalesCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      if (data.mode == "all") { 
         ExportService.ExportCustomerQuarterlySalesAll()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename; 
                  $mdToast.hide('Success');  
               }
               else if(result[0].response == "Empty"){
                  $mdToast.cancel('Empty');   
               }
               else{
                  $mdToast.cancel(result);   
               }
            }); 
      }
      else if (data.mode == "single") { 
         ExportService.ExportCustomerQuarterlySales()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename; 
                  $mdToast.hide('Success');  
               }
               else if(result[0].response == "Empty"){
                  $mdToast.cancel('Empty');   
               }
               else{
                  $mdToast.cancel(result);   
               }
            });  
      }
   }


   ExportCustomerQuarterlyVisitsCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportCustomerQuarterlyVisitsCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 

      if (data.mode == "all") { 
         ExportService.ExportCustomerQuarterlyVisitsAll()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename; 
                  $mdToast.hide('Success');  
               }
               else if(result[0].response == "Empty"){
                  $mdToast.cancel('Empty');   
               }
               else{
                  $mdToast.cancel(result);   
               }
            }); 
      }
      else if (data.mode == "single") { 
         ExportService.ExportCustomerQuarterlyVisits()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename; 
                  $mdToast.hide('Success');  
               }
               else if(result[0].response == "Empty"){
                  $mdToast.cancel('Empty');   
               }
               else{
                  $mdToast.cancel(result);   
               }
            });  
      }
   }

})();

