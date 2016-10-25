(function(){
   'use strict';

   angular
      .module('app')
      .controller('RegistrationController', RegistrationController);

   RegistrationController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope' ];
   function RegistrationController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope) {
      var vm = this; 
        
      // Variables  
      vm.spent = {};
      vm.daterange = { 
         summary: { start: '', end: ''},
         history: { start: '', end: ''}
      };
      vm.historystatus = 'active';

      vm.totalrecord = { summary: 0, history: 0 };
      vm.preloader = {
         summary: true,
         history: true
      };  

      // Access Functions 
      vm.GetOverview = GetOverview; 
      vm.GetRegistrationSummary = GetRegistrationSummary;
      vm.GetRegistrationHistory = GetRegistrationHistory;
      vm.GetHistoryStatus = GetHistoryStatus;

      vm.ExportRegistrationSummary = ExportRegistrationSummary;
      vm.ExportRegistrationHistory = ExportRegistrationHistory;
       
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
            case 'daily': GetDaily_CardRegistration(); break;
            case 'weekly': GetWeekly_CardRegistration(); break;
            case 'monthly': GetMonthly_CardRegistration(); break;
            case 'quarterly': GetQuarterly_CardRegistration(); break;
            case 'yearly': GetYearly_CardRegistration(); break;
            default: GetDaily_CardRegistration(); break;
         }
      }


      function GetDaily_CardRegistration (){
         QueryService.GetDaily_CardRegistration()
            .then( function(result){
                  if (result[0].response == "Success") {  
                      vm.spent = result[0].data[0];
                  }
            });
      }

      function GetWeekly_CardRegistration (){
         QueryService.GetWeekly_CardRegistration()
            .then( function(result){
                  if (result[0].response == "Success") {  
                      vm.spent = result[0].data[0];
                  }
            });
      }

      function GetMonthly_CardRegistration (){
         QueryService.GetMonthly_CardRegistration()
            .then( function(result){
                  if (result[0].response == "Success") {  
                      vm.spent = result[0].data[0];
                  }
            });
      }

      function GetQuarterly_CardRegistration (){
         QueryService.GetQuarterly_CardRegistration()
            .then( function(result){
                  if (result[0].response == "Success") {  
                      vm.spent = result[0].data[0];
                  }
            }); 
      }

      function GetYearly_CardRegistration (){
         QueryService.GetYearly_CardRegistration()
            .then( function(result){
                  if (result[0].response == "Success") {  
                      vm.spent = result[0].data[0];
                     console.log(vm.spent);
                  }
            }); 
      }


      function GetRegistrationSummary(){

         if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }

         vm.preloader.summary = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetCardRegistration_Summary()
            .then( function(result){ 
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

      function GetHistoryStatus(_status){
         switch(_status){
            case 'active' : vm.historystatus = 'active'; break;
            case 'inactive' : vm.historystatus = 'inactive'; break;
            case 'expired' : vm.historystatus = 'expired'; break;
            default: vm.historystatus = 'expired'; break;
         }
      }

      function GetRegistrationHistory(){  

         if (vm.daterange.history.start == "" && vm.daterange.history.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }

         vm.preloader.history = false;
         vm.tableParams_history = TableService.Empty(vm.tableParams_history);
         switch(vm.historystatus){
            case 'active': 
               QueryService.GetActive_CardHistory(vm.daterange.history.start, vm.daterange.history.end)
                  .then( function(result){ 
                     if (result[0].response == "Success") {  
                        vm.tableParams_history = TableService.Create(result[0].data, vm.tableParams_history); 
                        vm.totalrecord.history = result[0].data.length;  
                     }
                     else if (result[0].response == "Empty"){ 
                        ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                     }
                     vm.preloader.history = true;
                  });
               break;

            case 'inactive': 
               QueryService.GetInactive_CardHistory(vm.daterange.history.start, vm.daterange.history.end)
                  .then( function(result){ 
                     if (result[0].response == "Success") {  
                        vm.tableParams_history = TableService.Create(result[0].data, vm.tableParams_history); 
                        vm.totalrecord.history = result[0].data.length;  
                     }
                     else if (result[0].response == "Empty"){ 
                        ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                     }
                     vm.preloader.history = true;
                  });
               break;

            case 'expired': 
               QueryService.GetExpired_CardHistory(vm.daterange.history.start, vm.daterange.history.end)
                  .then( function(result){ 
                     if (result[0].response == "Success") {  
                        vm.tableParams_history = TableService.Create(result[0].data, vm.tableParams_history); 
                        vm.totalrecord.history = result[0].data.length;  
                     }
                     else if (result[0].response == "Empty"){ 
                        ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                     }
                     vm.preloader.history = true;
                  });
               break;
         }


      }

 
      function ExportRegistrationSummary(){

      } 
 
      function ExportRegistrationHistory(){

      }
       
      $('#summarydate').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.summary.start = start.format('YYYY/MM/DD');
         vm.daterange.summary.end =  end.format('YYYY/MM/DD');
         $('#summarydate span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });
       
      $('#historydate').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.history.start = start.format('YYYY/MM/DD');
         vm.daterange.history.end =  end.format('YYYY/MM/DD');
         $('#historydate span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });   
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
    } 

})();

