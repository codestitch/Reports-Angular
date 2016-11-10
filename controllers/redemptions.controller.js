(function(){
   'use strict';

   angular
      .module('app')
      .controller('RedemptionController', RedemptionController)
      .controller('RedemptionModalDialogController', RedemptionModalDialogController)
      .controller('ExportBranchRedemptionCtrl', ExportBranchRedemptionCtrl)
      .controller('ExportCustomerRedemptionCtrl', ExportCustomerRedemptionCtrl)
      .controller('ExportBranchModalTransactionCtrl', ExportBranchModalTransactionCtrl);

   RedemptionController.$inject = ['$rootScope', 'PreloaderService', 'QueryService', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function RedemptionController($rootScope, PreloaderService, QueryService, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
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
      vm.GetBranchRedemption = GetBranchRedemption;
      vm.GetCustomerRedemption = GetCustomerRedemption;
      vm.ExportBranchRedemption = ExportBranchRedemption;
      vm.ExportCustomerRedemption = ExportCustomerRedemption;
      vm.ViewTransactions = ViewTransactions;
      
      // Initialization
      Initialize();


      // Public functions
      function Initialize(){   
         PreloaderService.Display();
         PreloaderService.Hide(); 
         GetRedemptionOverview();
      }

      function GetRedemptionOverview(){
         QueryService.GetRewardsComparison()
             .then( function(result){ 
                  if (result[0].response == "Success") {
                     HasData(); 
                     var config = [{
                            "id": "AmGraph-1", 
                            "title": "Total Points Earned",
                            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>Earned Points:[[value]]</span></b>",
                            "bullet": "round",
                            "dashLength": 3,
                            "colorField":"color",
                            "valueField": "epoints"
                        },{
                            "id": "AmGraph-2", 
                            "title": "Total Points Redeemed",
                            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>Redeemed Points:[[value]]</span></b>",
                            "bullet": "round",
                            "dashLength": 3, 
                            "valueField": "rpoints"
                        }];
                     ChartService.CreateLineChart_Multiple("redemptionChart", result[0].data, "month", config);
                  } 
                  else{
                     NoData();
                  }
             });         
      }

      function GetBranchRedemption(){
         if (vm.daterange.branch.start == "" && vm.daterange.branch.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
            return;
         }
         
         vm.preloader.branch = false;
         vm.tableParams_branch = TableService.Empty(vm.tableParams_branch);
         QueryService.GetBranchRedemption(vm.daterange.branch.start, vm.daterange.branch.end)
            .then( function(result){  
               if (result[0].response == "Success") {  
                  vm.tableParams_branch = TableService.Create(result[0].data, vm.tableParams_branch); 
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
         QueryService.GetCustomerRedemption(vm.daterange.customer.start, vm.daterange.customer.end)
            .then( function(result){  
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


      function ViewTransactions(ev, data){

         PreloaderService.Display();
         $mdDialog.show({
            controller: RedemptionModalDialogController,
            templateUrl: 'templates/redemptions.tmpl.html', 
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals : {
                 data : data,
                 date: vm.daterange.branch
            },
            fullscreen: true
         })
         .then(function(response) { 
            if (response != "") {
               ExportBranchTransctions(response);
            }
         }, function() {
             console.log('You cancelled the dialog.');  
         });

         PreloaderService.Hide();
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
               ExportToastService.Init(_data, 'ExportBranchRedemptionCtrl').then(
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
               ExportToastService.Init(_data, 'ExportCustomerRedemptionCtrl').then(
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

      function ExportBranchTransctions(_data){
         if (vm.daterange.branch.start == "" && vm.daterange.branch.end == "") {  
            ToastService.Show('No Date Range Specified', 'Oops! Don\'t forget to specify a date'); 
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
            ExportToastService.Init(_data, 'ExportBranchModalTransactionCtrl').then(
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



      function HasData(){
         document.getElementById('noDatadiv').className = "hide-element";
         document.getElementById('redemptionChart').className = "chart";
      }

      function NoData(){ 
         document.getElementById('noDatadiv').className = "display-element";
         document.getElementById('redemptionChart').className = "hide-element";
      }

      
      $('#branchredemptionrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.branch.start = start.format('YYYY/MM/DD');
         vm.daterange.branch.end =  end.format('YYYY/MM/DD');
         $('#branchredemptionrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  

      $('#voucherredemptionrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.daterange.customer.start = start.format('YYYY/MM/DD');
         vm.daterange.customer.end =  end.format('YYYY/MM/DD');
         $('#voucherredemptionrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  
 
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   }




   RedemptionModalDialogController.$inject = ['$scope', '$mdDialog', 'QueryService', 'TableService', 'data', 'date', 'ToastService'];
   function RedemptionModalDialogController($scope, $mdDialog, QueryService, TableService, data, date, ToastService){ 

      $scope.doneloading_transaction = false; 
      $scope.norecordText = "";  
      var newdata = { "daterange" : date, "location": data}; 

      QueryService.GetBranchTransaction(date.start, date.end, encodeURIComponent(data.branch))
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
         $mdDialog.hide(newdata);
      }

   } 

   ExportBranchRedemptionCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportBranchRedemptionCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 

      ExportService.ExportBranchRedemption(data.daterange.start, data.daterange.end)
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


   ExportCustomerRedemptionCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportCustomerRedemptionCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
 
      ExportService.ExportCustomerRedemption(data.daterange.start, data.daterange.end)
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


   ExportBranchModalTransactionCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportBranchModalTransactionCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){ 
      console.log(data);
      ExportService.ExportBranchTransaction(data.daterange.start, data.daterange.end, data.location.branch)
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

