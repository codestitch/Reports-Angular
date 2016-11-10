(function(){
   'use strict';

   angular
      .module('app')
      .controller('RegistrationController', RegistrationController)
      .controller('ExportRegistrationCtrl', ExportRegistrationCtrl);

   RegistrationController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function RegistrationController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
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
      vm.exportingprogress = false; 

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
         QueryService.GetCardRegistration_Summary(vm.daterange.summary.start, vm.daterange.summary.end)
            .then( function(result){ 
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
                        ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment');
                        vm.totalrecord.history = 0;
                     }
                     else{
                        ToastService.Show('Something went wrong', result); 
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
                        ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment');
                        vm.totalrecord.history = 0;
                     }
                     else{
                        ToastService.Show('Something went wrong', result); 
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
                        ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment');
                        vm.totalrecord.history = 0;
                     }
                     else{
                        ToastService.Show('Something went wrong', result); 
                     } 
                     vm.preloader.history = true;
                  });
               break;
         } 
      }

 
      function ExportRegistrationSummary(ev){

         if (!vm.exportingprogress) {

            if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
               ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
               return;
            }
            var _data = { 'start': vm.daterange.summary.start, 'end': vm.daterange.summary.end, 'mode': 'summary'};

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent(ev)
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportRegistrationCtrl').then(
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
 
      function ExportRegistrationHistory(ev){ 

         if (!vm.exportingprogress) {

            if (vm.daterange.history.start == "" && vm.daterange.history.end == "") {  
               ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
               return;
            }
            var _data = { 'start': vm.daterange.history.start, 'end': vm.daterange.history.end, 'mode': 'history', 'historystatus' : vm.historystatus};

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent(ev)
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() {  
              
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportRegistrationCtrl').then(
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

   ExportRegistrationCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportRegistrationCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      if (data.mode == "summary") {

         ExportService.ExportCardRegistration_Summary(data.start, data.end)
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
      else if (data.mode == "history"){

         switch(data.historystatus){
            case 'active' : 

               ExportService.ExportActive_CardHistory(data.start, data.end)
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
                     console.log("active");
                  });

               break;

            case 'inactive' : 

               ExportService.ExportInactive_CardHistory(data.start, data.end)
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
                  
               break;

            case 'expired' : 

               ExportService.ExportExpired_CardHistory(data.start, data.end)
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
                  
               break;

         }
      }

   }

})();