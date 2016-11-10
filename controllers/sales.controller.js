(function(){
   'use strict';

   angular
      .module('app')
      .controller('SalesController', SalesController)
      .controller('SalesDialogController', SalesDialogController)
      .controller('ExportSalesCtrl', ExportSalesCtrl)
      .controller('ExportSalesPerHourCtrl', ExportSalesPerHourCtrl)
      .controller('ExportSalesPerBranchCtrl', ExportSalesPerBranchCtrl);

   SalesController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function SalesController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
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
      vm.branches = {};
      vm.restos = {};
      vm.selectedresto = {"name": "Select Restaurant", "value":""};
      vm.selectedbranch = {"name": "Select Branch", "value":""};
      vm.exportingprogress = false; // export flag

      // Access Functions 
      vm.GetSalesSummary = GetSalesSummary;
      vm.SelectRestaurant = SelectRestaurant;
      vm.SelectBranch = SelectBranch; 
      vm.GetSalesPerHour = GetSalesPerHour;
      vm.ExportSalesSummary = ExportSalesSummary;
      vm.ExportSalesPerHour = ExportSalesPerHour;
      vm.ViewTransactions = ViewTransactions;
      
      // Initialization
      Initialize();


      // Public functions
      function Initialize(){   
         PreloaderService.Display();
         PreloaderService.Hide(); 
         GetSalesOverview();
         GetRestaurant();
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
         if (vm.daterange.summary.start == "" && vm.daterange.summary.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
         
         vm.preloader.summary = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetSalesSummary(vm.daterange.summary.start, vm.daterange.summary.end)
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

      function GetRestaurant(){
         QueryService.GetTableRecords('brandtable')
             .then( function(result){  
                  console.log(result);
                  if (result[0].response == "Success") {   
                     vm.restos = result[0].data;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }  
             });  
      } 

      function SelectRestaurant(_resto){
         vm.selectedresto = _resto;
         vm.selectedbranch = {"name": "Select Branch", "value":""};

         QueryService.GetRecord('loctable', _resto.brandID)
             .then( function(result){   
                  if (result[0].response == "Success") {   
                     vm.branches = result[0].data;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }  
             });  
      }

      function SelectBranch(_branch){ 
         vm.selectedbranch = _branch;
      }

      function GetSalesPerHour(){    

         if (vm.daterange.perhour.start == "" && vm.daterange.perhour.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
         else if (vm.selectedresto.value == ""){
            ToastService.Show('No Resto Specified', 'Oops! Don\'t forget to specify a restaurant'); 
            return;            
         } 
         else if (vm.selectedbranch.value == ""){
            ToastService.Show('No Branch Specified', 'Oops! Don\'t forget to specify a branch'); 
            return;            
         }

         vm.preloader.perhour = false;
         vm.tableParams_perhour = TableService.Empty(vm.tableParams_perhour);
         QueryService.GetSalesPerHour(vm.daterange.perhour.start, vm.daterange.perhour.end, vm.selectedbranch.locID, vm.selectedresto.brandID)
             .then( function(result){  
                  console.log(result)
                  if (result[0].response == "Success") {  
                     vm.tableParams_perhour = TableService.Create(result[0].data, vm.tableParams_perhour); 
                     vm.totalrecord.perhour = result[0].data.length;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                  }
                  vm.preloader.perhour = true;
                  
             });  
      }

      function ViewTransactions(ev, data){

         $mdDialog.show({
            controller: SalesDialogController,
            templateUrl: 'templates/sales.tmpl.html', 
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals : {
                 data : { 'location': vm.selectedbranch, 'resto': vm.selectedresto, 'sales': data } 
            },
            fullscreen: true
         })
         .then(function(response) { 
            if (response != "") {
               ExportSalesPerBranch(response);
            }
         }, function() {
             console.log('You cancelled the dialog.');  
         });
      }  


      function ExportSalesSummary(){
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
               ExportToastService.Init(_data, 'ExportSalesCtrl').then(
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

      function ExportSalesPerHour(){ 
         if (!vm.exportingprogress) {  

            if (vm.daterange.perhour.start == "" && vm.daterange.perhour.end == "") {  
               ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
               return;
            }
            else if (vm.selectedresto.value == ""){
               ToastService.Show('No Resto Specified', 'Oops! Don\'t forget to specify a restaurant'); 
               return;            
            }
            else if (vm.selectedbranch.value == ""){
               ToastService.Show('No Branch Specified', 'Oops! Don\'t forget to specify a branch'); 
               return;            
            } 

            var _data = { 'daterange': vm.daterange.perhour, 'branch' : vm.selectedbranch.locID, 'resto' : vm.selectedresto.brandID };

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent()
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportSalesPerHourCtrl').then(
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

      function ExportSalesPerBranch(_data){
         if (vm.startdate == "" && vm.enddate == "" && vm.email == "" && vm.gender.value == "" && vm.bday.value == "" && vm.agerange.start == "") {  
            ToastService.Show('No Filter Found', 'Oops! You seem to forget selecting a filter. Kindly select at least 1 filter.'); 
            return;
         } 

         var confirm = $mdDialog.confirm()
                .title('Would you like to export searched data?')
                .textContent('Allows you to see the raw data you\'ve searched for.')
                .ariaLabel('Lucky day') 
                .ok('Yes Please')
                .cancel('Nope');

         $mdDialog.show(confirm).then(function() { 
            
            vm.exportingprogress = true;  
            ExportToastService.Init(_data, 'ExportSalesPerBranchCtrl').then(
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


      $('#salessummaryrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.summary.start = start.format('YYYY/MM/DD');
         vm.daterange.summary.end =  end.format('YYYY/MM/DD');
         $('#salessummaryrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

      $('#salesperhourange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.perhour.start = start.format('YYYY/MM/DD');
         vm.daterange.perhour.end =  end.format('YYYY/MM/DD');
         $('#salesperhourange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   } 


   SalesDialogController.$inject = ['$scope', '$mdDialog', 'QueryService', 'TableService', 'data', 'ToastService'];
   function SalesDialogController($scope, $mdDialog, QueryService, TableService, data, ToastService){ 

      $scope.doneloading_transaction = false; 
      $scope.norecordText = ""; 

      QueryService.GetSalesPerBranch(data.sales.dateAdded, data.sales.Hour, data.location.locID, data.resto.brandID )
          .then( function(result){  
               console.log(result)
               if (result[0].response == "Success") {  
                  $scope.tableParams = TableService.Create(result[0].data, $scope.tableParams); 
                  $scope.doneloading_transaction = true;
               }
               else if (result[0].response == "Empty"){  
                  $scope.doneloading_transaction = true;
                  $scope.norecordText = "No Records Found";
               } 
               
          });  

      $scope.cancel = function() {
        $mdDialog.cancel();
      }; 

      $scope.export = function(){
         $mdDialog.hide(data);
      }

   }

   ExportSalesCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportSalesCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 

      ExportService.ExportSalesSummary(data.daterange.start, data.daterange.end)
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

   ExportSalesPerHourCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportSalesPerHourCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 

      ExportService.ExportSalesPerHour(data.daterange.start, data.daterange.end, data.branch, data.resto)
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

   ExportSalesPerBranchCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportSalesPerBranchCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
      console.log(data);
      ExportService.ExportSalesPerBranch(data.sales.dateAdded, data.sales.Hour, data.location.locID, data.resto.brandID )
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

