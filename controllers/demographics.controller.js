(function(){
   'use strict';

   angular
      .module('app')
      .controller('DemographicsController', DemographicsController)
      .controller('DialogController', DialogController);

   DemographicsController.$inject = ['PreloaderService', 'QueryService', '$http', 'ChartService', 'TableService', 'ToastService', '$mdDialog', '$scope' ];
   function DemographicsController(PreloaderService, QueryService, $http, ChartService, TableService, ToastService, $mdDialog, $scope) {
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

      vm.doneloading_transactions = true; // preloader

      // Access Functions
      vm.SelectGender = SelectGender; 
      vm.SelectBirthday = SelectBirthday; 
      vm.SelectAgeRange = SelectAgeRange; 
      vm.GetCustomerSummary = GetCustomerSummary;  
      vm.ExportCustomer = ExportCustomer;  

      vm.ViewTransactions = ViewTransactions; 
        
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

      function GetCustomerSummary(){     

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
                 }
                 else if (result[0].response == "Empty"){ 
                     ToastService.Show('No Data Found', 'Oops! It seems there\' no records at the moment');
                 }
                  vm.doneloading_transactions = true;
                  
             });  
      } 

      function ExportCustomer(){
         ToastService.Show('Export Successful', '' ); 
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
            controller: DialogController,
            templateUrl: 'templates/demographics.tmpl.html',
            // templateUrl: 'tabDialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals : {
                 data : data
            },
            fullscreen: true
         })
         .then(function() {
             console.log('You said the information was.'); 
         }, function() {
             console.log('You cancelled the dialog.');  
         });

         PreloaderService.Hide();
      }

      
        
      Metronic.init(); // init metronic core components
      Layout.init(); // init current layout   
   }


   DialogController.$inject = ['$scope', '$mdDialog', 'QueryService', 'TableService', 'data', 'ToastService'];
   function DialogController($scope, $mdDialog, QueryService, TableService, data, ToastService) { 

      $scope.toggleTransaction = true; // for export flag show/hide
      $scope.doneloading_transaction = false;
      $scope.doneloading_profile = false; 
      $scope.norecordText = "";


      QueryService.GetCustomerTransactionHistory(data.memberID)
         .then( function(result){
            console.log(result);
            if (result[0].response == "Success") {  
               $scope.tableParams = TableService.Create(result[0].data, $scope.tableParams);   
               $scope.doneloading_transaction = true;
               console.log(result);
            }
            else if (result[0].response == "Empty"){ 
               $scope.doneloading_transaction = true;
               $scope.norecordText = "No Records Found";
            }
         }); 

      QueryService.GetCustomerDetails(data.email)
         .then( function(result){
            console.log(result);
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

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      }; 

      $scope.export = function(){
         ToastService.Show('Export Successful', '' ); 
      }

   } 

})();

