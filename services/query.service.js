(function(){
	'use strict';

	angular
		.module('app')
      .constant('DataLink', {
         "merchant_domain" : "http://192.168.1.9/jproject/bistro/",
         "report_link" : "php/api.data.php?",
         "export_link" : "http://192.168.1.9/jproject/bistro/"
      })
		.factory('QueryService', QueryService);

	QueryService.$inject = ['$http', '$rootScope', 'DataLink'];
	function QueryService($http, $rootScope, DataLink){
		var service = {};

		// Downloads
		service.GetYearlyDownload = GetYearlyDownload;
		service.GetMonthlyDownload = GetMonthlyDownload;

		// Demographics
		service.GetAge = GetAge;
		service.GetPlatformRegistration = GetPlatformRegistration;
		service.GetGender = GetGender;
		service.GetDemographics = GetDemographics; 
      service.GetCustomerTransactionHistory = GetCustomerTransactionHistory;

		return service;

      /*
			Public Functions
			----------------
			Downloads
      */ 
      function GetYearlyDownload(){ 
      	var url = DataLink.report_link+"function=get_downloads_yearly";  
         return $http.get(url).then(handleSuccess, handleError); 
      }
      
      function GetMonthlyDownload(){ 
      	var url = DataLink.report_link+"function=get_downloads_monthly";  
         return $http.get(url).then(handleSuccess, handleError); 
      }



      /*
			Public Functions
			----------------
			Demographics
      */
      function GetPlatformRegistration(){
      	var url = DataLink.report_link+"function=get_userPlatformRegistration";  
         return $http.get(url).then(handleSuccess, handleError); 
      }

      function GetAge(){
      	var url = DataLink.report_link+"function=get_userAge";  
         return $http.get(url).then(handleSuccess, handleError); 
      }

      function GetGender(){
      	var url = DataLink.report_link+"function=get_userGender";  
         return $http.get(url).then(handleSuccess, handleError);       	
      }

		function GetDemographics(startdate, enddate, email, gender, birthday, startAge, endAge){  
			var url = DataLink.report_link+"function=get_userInformation&startDate="+startdate+"&endDate="+enddate
				+"&email="+email+"&gender="+gender+"&birthday="+birthday+"&startAge="+startAge+"&startAge="+startAge; 
         return $http.get(url).then(handleSuccess, handleError);
		}   

      function GetCustomerTransactionHistory(memberID){
         var url = DataLink.report_link+"function=get_customerTransactionHistory&memberID="+memberID; 
         return $http.get(url).then(handleSuccess, handleError);
      }


		// private functions
      function handleSuccess(response) {  
         return response.data;
      }

      function handleError(error) {
     		console.log(error);
			toastr['warning']("An unexpected error occured.", "Error"); 
      }

	}

})();