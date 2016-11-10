(function(){
	'use strict';

	angular
		.module('app')
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

      // Spend
      service.GetSpendDaily = GetSpendDaily;
      service.GetSpendWeekly = GetSpendWeekly;
      service.GetSpendMonthly = GetSpendMonthly;
      service.GetSpendQuarterly = GetSpendQuarterly;
      service.GetSpendYearly = GetSpendYearly;
      service.GetSpendSummary = GetSpendSummary;

      // Branches
      service.GetBranchQuarterlySales = GetBranchQuarterlySales;
      service.GetBranchQuarterlyVisits = GetBranchQuarterlyVisits;
      service.GetBranchSummary = GetBranchSummary; 

      // Customers
      service.GetCustomerQuarterlySales = GetCustomerQuarterlySales;
      service.GetCustomerQuarterlyVisits = GetCustomerQuarterlyVisits;
      service.GetCustomerSummary = GetCustomerSummary;

      // Vouchers
      service.GetDaily_Vouchers = GetDaily_Vouchers;
      service.GetWeekly_Vouchers = GetWeekly_Vouchers;
      service.GetMonthly_Vouchers = GetMonthly_Vouchers;
      service.GetQuarterly_Vouchers = GetQuarterly_Vouchers;
      service.GetYearly_Vouchers = GetYearly_Vouchers;
      service.GetRedemptionVouchers = GetRedemptionVouchers;
      service.GetCustomerRedemptionVouchers = GetCustomerRedemptionVouchers;

      // Redemption
      service.GetRewardsComparison = GetRewardsComparison;
      service.GetBranchRedemption = GetBranchRedemption;
      service.GetBranchTransaction = GetBranchTransaction;
      service.GetCustomerRedemption = GetCustomerRedemption;

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

      function GetCardRegistration_Summary(startDate, endDate){
         var url = DataLink.report_link+"function=get_cardregistration_summary&startDate="+startDate+"&endDate="+endDate;    
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

      function GetActive_CardHistory(startDate, endDate){
         var url = DataLink.report_link+"function=get_cardhistory_active&startDate="+startDate+"&endDate="+endDate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetInactive_CardHistory(startDate, endDate){
         var url = DataLink.report_link+"function=get_cardhistory_inactive&startDate="+startDate+"&endDate="+endDate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetExpired_CardHistory(startDate, endDate){
         var url = DataLink.report_link+"function=get_cardhistory_expired&startDate="+startDate+"&endDate="+endDate;  
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
         // delete $http.defaults.headers.common['X-Requested-With'];
      	var url = DataLink.report_link+"function=get_userPlatformRegistration";  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetAge(){
         // delete $http.defaults.headers.common['X-Requested-With'];
      	var url = DataLink.report_link+"function=get_userAge"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetGender(){
      	var url = DataLink.report_link+"function=get_userGender";   
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });       	
      }

		function GetDemographics(startDate, endDate, email, gender, birthday, startAge, endAge){  
			var url = DataLink.report_link+"function=get_userInformation&startDate="+startDate+"&endDate="+endDate
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

      function GetSalesSummary(startDate, endDate){
         var url = DataLink.report_link+"function=get_salessummary&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function GetSalesPerHour(startDate, endDate, locID, brandID){
         var url = DataLink.report_link+"function=get_salesperhourly&startDate="+startDate+"&endDate="+endDate+"&locID="+locID+"&brandID="+brandID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function GetSalesPerBranch(startDate, startTime, locID, brandID){
         var url = DataLink.report_link+"function=get_salesperbranch&startDate="+startDate+"&startTime="+startTime+"&locID="+locID+"&brandID="+brandID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

 

      /*
         Public Functions
         ----------------
         Spend
      */
      function GetSpendDaily(){
         var url = DataLink.report_link+"function=get_spent_daily"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });                  
      }

      function GetSpendWeekly(){
         var url = DataLink.report_link+"function=get_spent_weekly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function GetSpendMonthly(){
         var url = DataLink.report_link+"function=get_spent_monthly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function GetSpendQuarterly(){
         var url = DataLink.report_link+"function=get_spent_quarterly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function GetSpendYearly(){
         var url = DataLink.report_link+"function=get_spent_yearly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function GetSpendSummary(startDate, endDate){
         var url = DataLink.report_link+"function=get_spent_summary&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }



      /*
         Public Functions
         ----------------
         Branches
      */
      function GetBranchQuarterlySales(){
         var url = DataLink.report_link+"function=get_branch_quarterlysales"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetBranchQuarterlyVisits(){
         var url = DataLink.report_link+"function=get_branch_quarterlyvisits"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetBranchSummary(startDate, endDate){
         var url = DataLink.report_link+"function=get_branchsalessummary&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }


      /*
         Public Functions
         ----------------
         Customers
      */
      function GetCustomerQuarterlySales(){
         var url = DataLink.report_link+"function=get_customers_quarterlysales"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetCustomerQuarterlyVisits(){
         var url = DataLink.report_link+"function=get_customers_quarterlyvisits"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetCustomerSummary(startDate, endDate){
         var url = DataLink.report_link+"function=get_customer_transactions&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }  


      /*
         Public Functions
         ----------------
         Vouchers
      */ 
      function GetDaily_Vouchers(){
         var url = DataLink.report_link+"function=get_redemptionVoucher_daily"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetWeekly_Vouchers(){
         var url = DataLink.report_link+"function=get_redemptionVoucher_weekly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetMonthly_Vouchers(){
         var url = DataLink.report_link+"function=get_redemptionVoucher_monthly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetQuarterly_Vouchers(){
         var url = DataLink.report_link+"function=get_redemptionVoucher_quarterly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetYearly_Vouchers(){
         var url = DataLink.report_link+"function=get_redemptionVoucher_yearly"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetRedemptionVouchers(startDate, endDate){
         var url = DataLink.report_link+"function=get_redemptionVoucher&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function GetCustomerRedemptionVouchers(startDate, endDate){
         var url = DataLink.report_link+"function=get_customerRedemptionVoucher&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }



      /*
         Public Functions
         ----------------
         Vouchers
      */ 
      function GetRewardsComparison(){
         var url = DataLink.report_link+"function=get_rewards_comparison"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 
      }

      function GetBranchRedemption(startDate, endDate){
         var url = DataLink.report_link+"function=get_branchRedemption&startDate="+startDate+"&endDate="+endDate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 

      }

      function GetBranchTransaction(startDate, endDate, locname){
         console.log(locname);
         var url = DataLink.report_link+"function=get_locationTransactions&startDate="+startDate+"&endDate="+endDate+"&locName="+locname; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         }); 

      }

      function GetCustomerRedemption(startDate, endDate){
         var url = DataLink.report_link+"function=get_customerRedemption&startDate="+startDate+"&endDate="+endDate; 
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