(function(){
	'use strict';

	angular
		.module('app')
      .constant('DataLink', {
         "merchant_domain" : "http://192.168.1.9/jproject/bistro/",
         "report_link" : "php/api.data.php?",
         // "report_link" : "http://bff.appsolutely.ph/reportdata/data.php?",
         "export_link" : "http://192.168.1.9/jproject/bistro/"
      })
		.factory('QueryService', QueryService);

	QueryService.$inject = ['$http', '$rootScope', 'DataLink', 'ToastService'];
	function QueryService($http, $rootScope, DataLink, ToastService){
		var service = {};

		// Downloads
		service.GetYearlyDownload = GetYearlyDownload;
		service.GetMonthlyDownload = GetMonthlyDownload;

      // Card Registration
      service.GetCardRegistration_Summary = GetCardRegistration_Summary;
      service.GetDaily_CardRegistration = GetDaily_CardRegistration;
      service.GetWeekly_CardRegistration = GetWeekly_CardRegistration;
      service.GetMonthly_CardRegistration = GetMonthly_CardRegistration;
      service.GetQuarterly_CardRegistration = GetQuarterly_CardRegistration;
      service.GetYearly_CardRegistration = GetYearly_CardRegistration;
      service.GetActive_CardHistory = GetActive_CardHistory;
      service.GetInactive_CardHistory = GetInactive_CardHistory;
      service.GetExpired_CardHistory = GetExpired_CardHistory;

		// Demographics
		service.GetAge = GetAge;
		service.GetPlatformRegistration = GetPlatformRegistration;
		service.GetGender = GetGender;
		service.GetDemographics = GetDemographics; 
      service.GetCustomerTransactionHistory = GetCustomerTransactionHistory;
      service.GetCustomerDetails = GetCustomerDetails;

      // Sales
      service.GetSalesOverview = GetSalesOverview;
      service.GetSalesSummary = GetSalesSummary;
      service.GetSalesPerHour = GetSalesPerHour;
      service.GetSalesPerBranch = GetSalesPerBranch;


      // Json
      service.GetTableRecords = GetTableRecords;
      service.GetRecord = GetRecord;


		return service;

      /*
			Public Functions
			----------------
			Downloads
      */ 
      function GetYearlyDownload(){ 
      	var url = DataLink.report_link+"function=get_downloads_yearly";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }
      
      function GetMonthlyDownload(){ 
      	var url = DataLink.report_link+"function=get_downloads_monthly";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }


      /*
         Public Functions
         ----------------
         Card Registration
      */

      function GetCardRegistration_Summary(startdate, enddate){
         var url = DataLink.report_link+"function=get_cardregistration_summary";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetDaily_CardRegistration(){
         var url = DataLink.report_link+"function=get_cardregistration_daily";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetWeekly_CardRegistration(){
         var url = DataLink.report_link+"function=get_cardregistration_weekly";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetMonthly_CardRegistration(){
         var url = DataLink.report_link+"function=get_cardregistration_monthly";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetQuarterly_CardRegistration(){
         var url = DataLink.report_link+"function=get_cardregistration_quarterly";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetYearly_CardRegistration(){
         var url = DataLink.report_link+"function=get_cardregistration_yearly";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetActive_CardHistory(startdate, enddate){
         var url = DataLink.report_link+"function=get_cardhistory_active&startdate="+startdate+"&enddate="+enddate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetInactive_CardHistory(startdate, enddate){
         var url = DataLink.report_link+"function=get_cardhistory_inactive&startdate="+startdate+"&enddate="+enddate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetExpired_CardHistory(startdate, enddate){
         var url = DataLink.report_link+"function=get_cardhistory_expired&startdate="+startdate+"&enddate="+enddate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }



      /*
			Public Functions
			----------------
			Demographics
      */
      function GetPlatformRegistration(){
         delete $http.defaults.headers.common['X-Requested-With'];
      	var url = DataLink.report_link+"function=get_userPlatformRegistration";  
         // var url = "https://api.getevents.co/event?&lat=41.904196&lng=12.465974";
         // return $http({
         //     method: 'GET',
         //     url: url
         // }).
         // success(function(status) {
         //     //your code when success
         //     console.log(status);
         // }).
         // error(function(status) {
         //     //your code when fails
         //     console.log(status);
         //      ToastService.Show("An unexpected error occured 1", status);
         // });

         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetAge(){
         delete $http.defaults.headers.common['X-Requested-With'];
      	var url = DataLink.report_link+"function=get_userAge";  
         
         // return $http({
         //     method: 'GET',
         //     url: url, 
         //     dataType: 'json',
         //     headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
         // }).
         // success(function(status) {
         //     //your code when success
         //     console.log(status);
         // }).
         // error(function(status) {
         //     //your code when fails
         //     console.log(status);
         //      ToastService.Show("An unexpected error occured 2", status);
         // });

         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetGender(){
      	var url = DataLink.report_link+"function=get_userGender";   
         
         // return $http({
         //     method: 'JSONP',
         //     url: url
         // }).
         // success(function(status) {
         //     //your code when success
         //     console.log(status);
         // }).
         // error(function(status) {
         //     //your code when fails
         //     console.log(status);
         //      ToastService.Show("An unexpected error occured 3", status);
         // });

         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });       	
      }

		function GetDemographics(startdate, enddate, email, gender, birthday, startAge, endAge){  
			var url = DataLink.report_link+"function=get_userInformation&startDate="+startdate+"&endDate="+enddate
				+"&email="+email+"&gender="+gender+"&birthday="+birthday+"&startAge="+startAge+"&endAge="+endAge; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
		}   

      function GetCustomerTransactionHistory(memberID){
         var url = DataLink.report_link+"function=get_customerTransactionHistory&memberID="+memberID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
      }

      function GetCustomerDetails(email){
         var url = DataLink.report_link+"function=get_customerProfileDetail&email="+email; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
      }
 

      /*
         Public Functions
         ----------------
         Loyalty Sales
      */
      function GetSalesOverview(){
         var url = DataLink.report_link+"function=get_salesprogress"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
      }

      function GetSalesSummary(startdate, enddate){
         var url = DataLink.report_link+"function=get_salessummary&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function GetSalesPerHour(startdate, enddate, locID, brandID){
         var url = DataLink.report_link+"function=get_salesperhourly&startDate="+startdate+"&endDate="+enddate+"&locID="+locID+"&brandID="+brandID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function GetSalesPerBranch(startdate, locID, brandID){
         var url = DataLink.report_link+"function=get_salesperbranch&startDate="+startdate+"&locID="+locID+"&brandID="+brandID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }




      /*
         Public Functions
         ----------------
         JSON
      */

      function GetTableRecords(table){
         var url = DataLink.report_link+"function=gettablerecords&table="+table;
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function GetRecord(table, dataID){
         var url = DataLink.report_link+"function=getrecord&table="+table+"&brandID="+dataID;
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }
 


		// private functions
      function handleSuccess(response) {  
         return response.data;
      } 

	}

})();