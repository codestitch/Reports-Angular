(function(){
   'use strict';

   angular
      .module('app')
      .controller('SpendController', SpendController)
      .controller('ExportSpendCtrl', ExportSpendCtrl);

   SpendController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function SpendController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
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

      vm.spent = {};

      // Access Functions 
      vm.GetOverview = GetOverview; 
      vm.GetSpendSummary = GetSpendSummary;
      vm.ExportSpendSummary = ExportSpendSummary;

      
      // Initialization
      Initialize();


      // Public functions
      function Initialize(){   
         PreloaderService.Display();
         PreloaderService.Hide(); 
         GetOverview('daily');
      }

      function GetOverview(_status){ 
         switch(_status){
            case 'daily': GetDaily_Spend(); break;
            case 'weekly': GetWeekly_Spend(); break;
            case 'monthly': GetMonthly_Spend(); break;
            case 'quarterly': GetQuarterly_Spend(); break;
            case 'yearly': GetYearly_Spend(); break;
            default: GetDaily_Spend(); break;
         }
      }

      function GetDaily_Spend(){ 
         QueryService.GetSpendDaily()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.spent = result[0].data[0];
                  }
            });
      }

      function GetWeekly_Spend(){ 
         QueryService.GetSpendWeekly()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.spent = result[0].data[0];
                  }
            });
      }

      function GetMonthly_Spend(){ 
         QueryService.GetSpendMonthly()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.spent = result[0].data[0];
                  }
            });
      }

      function GetQuarterly_Spend(){ 
         QueryService.GetSpendQuarterly()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.spent = result[0].data[0];
                  }
            });
      }

      function GetYearly_Spend(){ 
         QueryService.GetSpendYearly()
            .then( function(result){
                  if (result[0].response == "Success") {  
                     vm.spent = result[0].data[0];
                  }
            });
      }
 
      function GetSpendSummary(){ 

         if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }

         vm.preloader.summary = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetSpendSummary(vm.daterange.summary.start, vm.daterange.summary.end)
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

      function ExportSpendSummary(){

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
               ExportToastService.Init(_data, 'ExportSpendCtrl').then(
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

      $('#spendsummarydate').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.summary.start = start.format('YYYY/MM/DD');
         vm.daterange.summary.end =  end.format('YYYY/MM/DD');
         $('#spendsummarydate span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });

      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
    } 

   ExportSpendCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportSpendCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      ExportService.ExportSpendSummary(data.daterange.start, data.daterange.end)
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

})();

