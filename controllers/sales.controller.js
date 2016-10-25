(function(){
   'use strict';

   angular
      .module('app')
      .controller('SalesController', SalesController);

   SalesController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope' ];
   function SalesController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope) {
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
      vm.restaurants = [];

      // Access Functions 
      vm.GetSalesSummary = GetSalesSummary;
      
      // Initialization
      Initialize();


      // Public functions
      function Initialize(){   
         PreloaderService.Display();
         PreloaderService.Hide(); 
         GetSalesOverview();
         GetRestaurants();
      } 
 
      function GetSalesOverview(){ 
         QueryService.GetSalesOverview()
             .then( function(result){
                 if (result[0].response == "Success") { 
                     var config = [{
                            "id": "AmGraph-1", 
                            "title": "Total Sales",
                            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>Sales:[[value]]</span></b>",
                            "bullet": "round",
                            "dashLength": 3,
                            "colorField":"color",
                            "valueField": "sales"
                        },{
                            "id": "AmGraph-2", 
                            "title": "Total Points",
                            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>Points:[[value]]</span></b>",
                            "bullet": "round",
                            "dashLength": 3, 
                            "valueField": "points"
                        }];
                     ChartService.CreateLineChart_Multiple("saleschart", result[0].data, "month", config);
                 } 
             });
      }


      function GetSalesSummary(){  
         if (vm.daterange.start == "" && vm.daterange.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
         
         vm.preloader.summary = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetSalesSummary(vm.daterange.start, vm.daterange.end)
             .then( function(result){ 
                  console.log(result);
                  if (result[0].response == "Success") {  
                     vm.tableParams = TableService.Create(result[0].data, vm.tableParams); 
                     vm.totalrecord.summary = result[0].data.length;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }
                  vm.preloader.summary = true;
                  
             });  
      }

      function GetRestaurants(){
         QueryService.GetTableRecords('loctable')
             .then( function(result){  
                  if (result[0].response == "Success") {   
                     vm.restaurants = result[0].data;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  } 
                  
             });  
      }

      function GetBranches(){

      }

      function GetSalesPerHour(){  
         if (vm.daterange.start == "" && vm.daterange.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
            
         vm.preloader.perhour = false;
         vm.tableParams_perhhour = TableService.Empty(vm.tableParams_perhhour);
         QueryService.GetSalesPerHour(vm.daterange.start, vm.daterange.end)
             .then( function(result){ 

                  if (result[0].response == "Success") {  
                     vm.tableParams_perhhour = TableService.Create(result[0].data, vm.tableParams_perhhour); 
                     vm.totalrecord.perhour = result[0].data.length;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }
                  vm.preloader.perhour = true;
                  
             });  
      }



      $('#salessummaryrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.start = start.format('YYYY/MM/DD');
         vm.daterange.end =  end.format('YYYY/MM/DD');
         $('#salessummaryrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

      $('#salesperhourange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.start = start.format('YYYY/MM/DD');
         vm.daterange.end =  end.format('YYYY/MM/DD');
         $('#salesperhourange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
    } 

})();

