(function(){
   'use strict';

   angular
      .module('app')
      .controller('VouchersController', VouchersController)
      .controller('ExportBranchVoucherCtrl', ExportBranchVoucherCtrl)
      .controller('ExportCustomerVoucherCtrl', ExportCustomerVoucherCtrl);

   VouchersController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function VouchersController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
      var vm = this; 
        
      // Variables 
      vm.daterange = { 
         branch: { start: '', end: ''},
         customer: { start: '', end: ''}
      };
      vm.totalrecord = { branch: 0, customer: 0 };
      vm.preloader = {
         branch: true,
         customer: true
      };
      vm.exportingprogress = false; // export flag

      
      // Access Functions 
      vm.GetOverview = GetOverview;
      vm.GetBranchRedemption = GetBranchRedemption;
      vm.GetCustomerRedemption = GetCustomerRedemption;
      vm.ExportBranchRedemption = ExportBranchRedemption;
      vm.ExportCustomerRedemption = ExportCustomerRedemption;

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
            case 'daily': GetDaily_Vouchers(); break;
            case 'weekly': GetWeekly_Vouchers(); break;
            case 'monthly': GetMonthly_Vouchers(); break;
            case 'quarterly': GetQuarterly_Vouchers(); break;
            case 'yearly': GetYearly_Vouchers(); break;
            default: GetDaily_CardRegistration(); break;
         }
      }

      function GetDaily_Vouchers(){
         QueryService.GetDaily_Vouchers()
            .then( function(result){ 
               if (result[0].response == "Success") {  
                  HasData();
                  ChartService.CreateBarChart_Single("voucherchart", result[0].data, 
                        "name", "Redemption", "redemption", 
                        "[[category]]<br><b><span style='font-size:14px;'>Redemption: [[value]]</span></b>", 3, 30, true);
               }
               else if (result[0].response == "Empty"){
                  NoData();
               }
            });
      }

      function GetWeekly_Vouchers(){
         QueryService.GetWeekly_Vouchers()
            .then( function(result){
               if (result[0].response == "Success") {  
                  HasData();
                  ChartService.CreateBarChart_Single("voucherchart", result[0].data, 
                        "name", "Redemption", "redemption", 
                        "[[category]]<br><b><span style='font-size:14px;'>Redemption: [[value]]</span></b>", 3, 30, true);
               }
               else if (result[0].response == "Empty"){
                  NoData();
               }
            });
      }

      function GetMonthly_Vouchers(){
         QueryService.GetMonthly_Vouchers()
            .then( function(result){
               if (result[0].response == "Success") {  
                  HasData();
                  document.getElementById('noDatadiv').className = "hide-element";
                  ChartService.CreateBarChart_Single("voucherchart", result[0].data, 
                        "name", "Redemption", "redemption", 
                        "[[category]]<br><b><span style='font-size:14px;'>Redemption: [[value]]</span></b>", 3, 30, true);
               }
               else if (result[0].response == "Empty"){
                  NoData();
               }
            });
      }

      function GetQuarterly_Vouchers(){
         QueryService.GetQuarterly_Vouchers()
            .then( function(result){
               if (result[0].response == "Success") {  
                  HasData();
                  ChartService.CreateBarChart_Single("voucherchart", result[0].data, 
                        "name", "Redemption", "redemption", 
                        "[[category]]<br><b><span style='font-size:14px;'>Redemption: [[value]]</span></b>", 3, 30, true);
               }
               else if (result[0].response == "Empty"){
                  NoData();
               }
            });
      }

      function GetYearly_Vouchers(){
         QueryService.GetYearly_Vouchers()
            .then( function(result){
               if (result[0].response == "Success") {  
                  HasData();
                  ChartService.CreateBarChart_Single("voucherchart", result[0].data, 
                        "name", "Redemption", "redemption", 
                        "[[category]]<br><b><span style='font-size:14px;'>Redemption: [[value]]</span></b>", 3, 30, true);
               }
               else if (result[0].response == "Empty"){
                  NoData();
               }
            });
      }

      function HasData(){
         document.getElementById('noDatadiv').className = "hide-element";
         document.getElementById('voucherchart').className = "chart";
      }

      function NoData(){ 
         document.getElementById('noDatadiv').className = "display-element";
         document.getElementById('voucherchart').className = "hide-element";
      }

      function GetBranchRedemption(){

         if (vm.daterange.branch.start == "" && vm.daterange.branch.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
         
         vm.preloader.branch = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetRedemptionVouchers(vm.daterange.branch.start, vm.daterange.branch.end)
             .then( function(result){ 
                  console.log(result);
                  if (result[0].response == "Success") {  
                     vm.tableParams = TableService.Create(result[0].data, vm.tableParams); 
                     vm.totalrecord.branch = result[0].data.length;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }
                  vm.preloader.branch = true;
                  
             });  

      } 
 
      function GetCustomerRedemption(){

         if (vm.daterange.customer.start == "" && vm.daterange.customer.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
         
         vm.preloader.customer = false;
         vm.tableParams_customer = TableService.Empty(vm.tableParams_customer);
         QueryService.GetCustomerRedemptionVouchers(vm.daterange.customer.start, vm.daterange.customer.end)
             .then( function(result){ 
                  console.log(result);
                  if (result[0].response == "Success") {  
                     vm.tableParams_customer = TableService.Create(result[0].data, vm.tableParams_customer); 
                     vm.totalrecord.customer = result[0].data.length;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }
                  vm.preloader.customer = true;
                  
             }); 

      } 

      function ExportBranchRedemption(){
         if (!vm.exportingprogress) { 
            
            if (vm.daterange.branch.start == "" && vm.daterange.branch.end == "") {  
               ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
               return;
            }

            var _data = { 'daterange': vm.daterange.branch };

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent()
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportBranchVoucherCtrl').then(
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

      function ExportCustomerRedemption(){
         if (!vm.exportingprogress) { 
            
            if (vm.daterange.customer.start == "" && vm.daterange.customer.end == "") {  
               ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
               return;
            }

            var _data = { 'daterange': vm.daterange.customer };

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent()
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportCustomerVoucherCtrl').then(
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

      
      $('#branchvoucherrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.branch.start = start.format('YYYY/MM/DD');
         vm.daterange.branch.end =  end.format('YYYY/MM/DD');
         $('#branchvoucherrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

      $('#customervoucherrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.customer.start = start.format('YYYY/MM/DD');
         vm.daterange.customer.end =  end.format('YYYY/MM/DD');
         $('#customervoucherrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   }



   ExportBranchVoucherCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportBranchVoucherCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 

      ExportService.ExportBranchRedemptionVouchers(data.daterange.start, data.daterange.end)
         .then( function(result){
            if (result[0].response == "Success") {   
               window.location = DataLink.exportfile_link+"/excel/"+result[0].filename;  
               $mdToast.hide('Success');   
            }
            else if (result[0].response == "Empty"){  
               $mdToast.cancel('Empty');   
            }
            else{ 
               $mdToast.cancel(result); 
            } 
         });
   } 

   
   ExportCustomerVoucherCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportCustomerVoucherCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 

      ExportService.ExportCustomerRedemptionVouchers(data.daterange.start, data.daterange.end)
         .then( function(result){
            if (result[0].response == "Success") {   
               window.location = DataLink.exportfile_link+"/excel/"+result[0].filename;  
               $mdToast.hide('Success');   
            }
            else if (result[0].response == "Empty"){  
               $mdToast.cancel('Empty');   
            }
            else{ 
               $mdToast.cancel(result); 
            } 
         });
   } 

})();

