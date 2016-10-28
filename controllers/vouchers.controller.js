(function(){
   'use strict';

   angular
      .module('app')
      .controller('VouchersController', VouchersController);

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

      } 
 
      function GetCustomerRedemption(){
         
      } 
      
      $('#branchvoucherrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.summary.start = start.format('YYYY/MM/DD');
         vm.daterange.summary.end =  end.format('YYYY/MM/DD');
         $('#branchvoucherrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

      $('#customervoucherrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.perhour.start = start.format('YYYY/MM/DD');
         vm.daterange.perhour.end =  end.format('YYYY/MM/DD');
         $('#customervoucherrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
    } 

})();

