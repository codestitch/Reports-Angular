(function(){
   'use strict';

   angular
      .module('app')
      .controller('DemographicsController', DemographicsController)
      .controller('DemographicsDialogController', DemographicsDialogController)
      .controller('ExportDemographicsCtrl', ExportDemographicsCtrl)
      .controller('ExportDemographicsModalCtrl', ExportDemographicsModalCtrl);

   DemographicsController.$inject = ['PreloaderService', 'QueryService', '$http', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope', 'ExportToastService' ];
   function DemographicsController(PreloaderService, QueryService, $http, ChartService, TableService, ToastService, $mdDialog, $scope, ExportToastService) {
      var vm = this; 
        
      // Variables
      vm.startdate = "";
      vm.enddate = "";  
      vm.email = "";  
      vm.gender = { title: "Gender", value: ""};
      vm.bday = { title: "Birth Month", value: ""};
      vm.agerange = { title: "Age Range", start: "", end: ""};

      vm.platform = { android: "", ios: "", web: ""}; 
      vm.gendercount = { male: 0, female: 0};

      vm.totalrecord = 0;
      vm.doneloading_transactions = true; // preloader
      vm.exportingprogress = false; 

      // Access Functions
      vm.SelectGender = SelectGender; 
      vm.SelectBirthday = SelectBirthday; 
      vm.SelectAgeRange = SelectAgeRange; 
      vm.GetCustomerDetails = GetCustomerDetails;  
      vm.ExportCustomer = ExportCustomer;  

      vm.ViewTransactions = ViewTransactions;  

      // Initialization
      Initialize();


      // Public functions
      function Initialize(){ 
         PreloaderService.Display();
         GetRegistration();
         GetAge();
         GetGender(); 
         PreloaderService.Hide(); 
      }

      function GetRegistration(){
         QueryService.GetPlatformRegistration()
             .then( function(result){
                 if (result[0].response == "Success") { 
                     angular.forEach(result[0].data, function(val){
                         if (val.v_platform == "android") { vm.platform.android = val.total; }
                         if (val.v_platform == "ios") { vm.platform.ios = val.total; }
                         if (val.v_platform == "web") { vm.platform.web = val.total; }
                     });  
                 }
             });
      }

      function GetAge(){
         QueryService.GetAge()
            .then( function(result){   
               if (result[0].response == "Success") {
                  ChartService.CreateBarChart_Single("ageChart", result[0].data, 
                      "label", "Age", "count", "Age Count: <br><span style='font-size:14px'><b>[[value]]</b></span>", 2, 2, false); 
               }
            });   
      }

      function GetGender(){ 
         QueryService.GetGender()
             .then( function(result){
                 if (result[0].response == "Success") { 
                     angular.forEach(result[0].data, function(val){
                         if (val.gender == "male") { vm.gendercount.male = val.count; }
                         if (val.gender == "female") { vm.gendercount.female = val.count; } 
                     });   
                 }
             });
      }

      function GetCustomerDetails(){     

         if (vm.startdate == "" && vm.enddate == "" && vm.email == "" && vm.gender.value == "" && vm.bday.value == "" && vm.agerange.start == "") {  
            ToastService.Show('No Filter Found', 'Oops! You seem to forget selecting a filter. Kindly select at least 1 filter.'); 
            return;
         }
         
         vm.doneloading_transactions = false;
         vm.tableParams = TableService.Empty(vm.tableParams);
         QueryService.GetDemographics(vm.startdate, vm.enddate, vm.email, vm.gender.value, vm.bday.value, vm.agerange.start, vm.agerange.end)
             .then( function(result){ 

                  if (result[0].response == "Success") {  
                     vm.tableParams = TableService.Create(result[0].data, vm.tableParams); 
                     vm.totalrecord = result[0].data.length;
                  }
                  else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems that there\'s no existing record at the moment');
                  }
                  else{
                     ToastService.Show('Something went wrong', result); 
                  } 
                  vm.doneloading_transactions = true;
                  
             });  
      } 

      function SelectGender(_gender){
         if (_gender == "Male") { vm.gender = { title: "Male", value: "male"} }
         else if (_gender == "Female") { vm.gender = { title: "Female", value: "female"} }
         else { vm.gender = { title: "Gender", value: ""} } 
      }

      function SelectBirthday(_bday){
         switch(_bday){
             case 1: vm.bday = { title: "January", value: 1}; break;
             case 2: vm.bday = { title: "February", value: 2}; break;
             case 3: vm.bday = { title: "March", value: 3}; break;
             case 4: vm.bday = { title: "April", value: 4}; break;
             case 5: vm.bday = { title: "May", value: 5}; break;
             case 6: vm.bday = { title: "June", value: 6}; break;
             case 7: vm.bday = { title: "July", value: 7}; break;
             case 8: vm.bday = { title: "August", value: 8}; break;
             case 9: vm.bday = { title: "September", value: 9}; break;
             case 10: vm.bday = { title: "October", value: 10}; break;
             case 11: vm.bday = { title: "November", value: 11}; break;
             case 12: vm.bday = { title: "December", value: 12}; break;
             default: vm.bday = { title: "Birth Month", value: ""}; break;
         }
      }

      function SelectAgeRange(_agerange){
         switch(_agerange){
             case 1: vm.agerange = { title: "18 to 25", start: 18, end: 25}; break;
             case 2: vm.agerange = { title: "26 to 35", start: 26, end: 35}; break;
             case 3: vm.agerange = { title: "36 to 45", start: 36, end: 45}; break;
             case 4: vm.agerange = { title: "46 to 59", start: 46, end: 59}; break; 
             default: vm.agerange = { title: "Age Range", start: "", end: ""}; break;
         }
      }
 

      function ViewTransactions(ev, data){

         PreloaderService.Display();
         $mdDialog.show({
            controller: DemographicsDialogController,
            templateUrl: 'templates/demographics.tmpl.html', 
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals : {
                 data : data
            },
            fullscreen: true
         })
         .then(function(response) { 
            if (response != "") {
               ExportCustomerTransaction(response);
            }
         }, function() {
             console.log('You cancelled the dialog.');  
         });

         PreloaderService.Hide();
      }
 

      function ExportCustomer(ev){

         if (!vm.exportingprogress) { 
            
            if (vm.startdate == "" && vm.enddate == "" && vm.email == "" && vm.gender.value == "" && vm.bday.value == "" && vm.agerange.start == "") {  
               ToastService.Show('No Filter Found', 'Oops! You seem to forget selecting a filter. Kindly select at least 1 filter.'); 
               return;
            }

            var _data = { 'start': vm.startdate, 'end': vm.enddate, 'email': vm.email, 'gender' : vm.gender.value, 
                           'bday' : vm.bday.value, 'age' : vm.agerange, };

            var confirm = $mdDialog.confirm()
                   .title('Would you like to export searched data?')
                   .textContent('Allows you to see the raw data you\'ve searched for.')
                   .ariaLabel('Lucky day')
                   .targetEvent(ev)
                   .ok('Yes Please')
                   .cancel('Nope');

            $mdDialog.show(confirm).then(function() { 
               
               vm.exportingprogress = true;  
               ExportToastService.Init(_data, 'ExportDemographicsCtrl').then(
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

      function ExportCustomerTransaction(_data){

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
            ExportToastService.Init(_data, 'ExportDemographicsModalCtrl').then(
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

      $('#reportrange').daterangepicker({
         locale: {
            format: 'YYYY-MM-DD'
         }
      },
      function(start, end, label) { 
         vm.startdate = start.format('YYYY/MM/DD');
         vm.enddate =  end.format('YYYY/MM/DD');
         $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      });  
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   }


   DemographicsDialogController.$inject = ['$scope', '$mdDialog', 'QueryService', 'TableService', 'data', 'ToastService', 'ExportToastService'];
   function DemographicsDialogController($scope, $mdDialog, QueryService, TableService, data, ToastService, ExportToastService) { 

      $scope.toggleTransaction = true; // for export flag show/hide
      $scope.doneloading_transaction = false;
      $scope.doneloading_profile = false; 
      $scope.norecordText = "";    

      QueryService.GetCustomerTransactionHistory(data.memberID)
         .then( function(result){ 
            if (result[0].response == "Success") {   
               $scope.tableParams = TableService.Create(result[0].data, $scope.tableParams);   
               $scope.doneloading_transaction = true; 
            }
            else if (result[0].response == "Empty"){ 
               $scope.doneloading_transaction = true;
               $scope.norecordText = "No Records Found";
            }
         }); 

      QueryService.GetCustomerDetails(data.email)
         .then( function(result){ 
            if (result[0].response == "Success") {  
               $scope.customer = result[0].data[0];
               $scope.doneloading_profile = true;
            }
            else if (result[0].response == "Empty"){ ;  
               $scope.doneloading_profile = true;
            }
         });  

      $scope.ToggleTab = function(_tab){
         $scope.toggleTransaction = (_tab == 'transactions') ? true : false;
         console.log($scope.toggleTransaction);
      } 

      $scope.cancel = function() {
         $mdDialog.cancel();
      }; 

      $scope.export = function(){
         if (data.memberID != null || data.memberID != '') {
            $mdDialog.hide(data.memberID);            
         }
         else{
            $mdDialog.hide();   
         }
         
      } 
   } 

   ExportDemographicsCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportDemographicsCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){
      console.log(data);

      ExportService.ExportDemographics(data.start, data.end, data.email, data.gender, data.bday, data.age.start, data.age.end)
         .then( function(result){
            if (result[0].response == "Success") {   
               window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename;  
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

   ExportDemographicsModalCtrl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data', 'ExportService', 'ToastService', 'DataLink'];
   function ExportDemographicsModalCtrl($rootScope, $scope, $mdToast, $mdDialog, data, ExportService, ToastService, DataLink){
      console.log(data);

      ExportService.ExportCustomerTransactionHistory(data)
         .then( function(result){
            if (result[0].response == "Success") {   
               window.location = DataLink.merchant_domain+"reports/excel/"+result[0].filename;  
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

