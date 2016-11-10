(function(){
   'use strict';

   angular
      .module('app')
      .controller('BranchesController', BranchesController)
      .controller('ExportBranchCtrl', ExportBranchCtrl)
      .controller('ExportBranchQuarterlySalesCtrl', ExportBranchQuarterlySalesCtrl)
      .controller('ExportBranchQuarterlyVisitsCtrl', ExportBranchQuarterlyVisitsCtrl);

   BranchesController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function BranchesController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
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
      vm.GetBranchSummary = GetBranchSummary;
      vm.ExportBranchSummary = ExportBranchSummary;
      vm.ExportQuarterlySales = ExportQuarterlySales;
      vm.ExportQuarterlyVisits = ExportQuarterlyVisits;

      // Initialization
      Initialize();


      // Public functions
      function Initialize(){   
         PreloaderService.Display();
         PreloaderService.Hide(); 
         GetBranchQuarterlySales();
         GetBranchQuarterlyVisits();
      }

      function GetBranchQuarterlySales(){
         QueryService.GetBranchQuarterlySales ()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.quarterlysales = result[0].data;
                  }
            });
      }

      function GetBranchQuarterlyVisits(){
         QueryService.GetBranchQuarterlyVisits ()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.quarterlyvisit = result[0].data;
                  }
            });
      }

      function GetBranchSummary(){

         if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }

         vm.preloader.summary = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetBranchSummary(vm.daterange.summary.start, vm.daterange.summary.end)
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

      function ExportBranchSummary(){ 
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
               ExportToastService.Init(_data, 'ExportBranchCtrl').then(
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
               ExportToastService.Init(_data, 'ExportBranchQuarterlySalesCtrl').then(
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
               ExportToastService.Init(_data, 'ExportBranchQuarterlyVisitsCtrl').then(
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

      $('#branchsummarydate').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.summary.start = start.format('YYYY/MM/DD');
         vm.daterange.summary.end =  end.format('YYYY/MM/DD');
         $('#branchsummarydate span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });

 
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   } 

   ExportBranchCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportBranchCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      ExportService.ExportBranchSummary(data.daterange.start, data.daterange.end)
         .then(function(result){
            if (result[0].response == "Success") { 
               window.location = DataLink.exportfile_link+"/excel/"+result[0].filename; 
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

   ExportBranchQuarterlySalesCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportBranchQuarterlySalesCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      if (data.mode == "all") { 
         ExportService.ExportQuarterlySalesAll()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.exportfile_link+"/excel/"+result[0].filename; 
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
         ExportService.ExportQuarterlySales()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.exportfile_link+"/excel/"+result[0].filename; 
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

   ExportBranchQuarterlyVisitsCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportBranchQuarterlyVisitsCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
      
      if (data.mode == "all") { 
         
         ExportService.ExportQuarterlyVisitsAll()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.exportfile_link+"/excel/"+result[0].filename; 
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
         
         ExportService.ExportQuarterlyVisits()
            .then(function(result){
               if (result[0].response == "Success") { 
                  window.location = DataLink.exportfile_link+"/excel/"+result[0].filename; 
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

