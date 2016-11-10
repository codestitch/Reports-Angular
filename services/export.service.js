(function(){
	'use strict';

	angular
		.module('app') 
		.factory('ExportService', ExportService);

	ExportService.$inject = ['$http', '$rootScope', 'DataLink', 'ToastService'];
	function ExportService($http, $rootScope, DataLink, ToastService){
		var service = {};

		// Downloads 

      // Card Registration
      service.ExportCardRegistration_Summary = ExportCardRegistration_Summary; 
      service.ExportActive_CardHistory = ExportActive_CardHistory;
      service.ExportInactive_CardHistory = ExportInactive_CardHistory;
      service.ExportExpired_CardHistory = ExportExpired_CardHistory;

		// Demographics 
		service.ExportDemographics = ExportDemographics; 
      service.ExportCustomerTransactionHistory = ExportCustomerTransactionHistory; 

      // Sales 
      service.ExportSalesSummary = ExportSalesSummary;
      service.ExportSalesPerHour = ExportSalesPerHour;
      service.ExportSalesPerBranch = ExportSalesPerBranch;

      // Spend 
      service.ExportSpendSummary = ExportSpendSummary;

      // Branches
      service.ExportBranchSummary = ExportBranchSummary;
      service.ExportQuarterlySales = ExportQuarterlySales;
      service.ExportQuarterlySalesAll = ExportQuarterlySalesAll;
      service.ExportQuarterlyVisits = ExportQuarterlyVisits;
      service.ExportQuarterlyVisitsAll = ExportQuarterlyVisitsAll; 

      // Customers
      service.ExportCustomerQuarterlySales = ExportCustomerQuarterlySales;
      service.ExportCustomerQuarterlySalesAll = ExportCustomerQuarterlySalesAll;
      service.ExportCustomerQuarterlyVisits = ExportCustomerQuarterlyVisits;
      service.ExportCustomerQuarterlyVisitsAll = ExportCustomerQuarterlyVisitsAll;
      service.ExportCustomerSummary = ExportCustomerSummary; 

      // Vouchers 
      service.ExportBranchRedemptionVouchers = ExportBranchRedemptionVouchers;
      service.ExportCustomerRedemptionVouchers = ExportCustomerRedemptionVouchers;

      // Redemptions 
      service.ExportBranchRedemption = ExportBranchRedemption;
      service.ExportCustomerRedemption = ExportCustomerRedemption;
      service.ExportBranchTransaction = ExportBranchTransaction;

      // Json
      service.GetTableRecords = GetTableRecords;
      service.GetRecord = GetRecord;


		return service; 


      /*
         Public Functions
         ----------------
         Card Registration
      */

      function ExportCardRegistration_Summary(startdate, enddate){
         var url = DataLink.export_link+"function=export_cardregistration_summary&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }
 
      function ExportActive_CardHistory(startdate, enddate){
         var url = DataLink.export_link+"function=export_cardhistory_active&startdate="+startdate+"&enddate="+enddate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function ExportInactive_CardHistory(startdate, enddate){
         var url = DataLink.export_link+"function=export_cardhistory_inactive&startdate="+startdate+"&enddate="+enddate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }

      function ExportExpired_CardHistory(startdate, enddate){
         var url = DataLink.export_link+"function=export_cardhistory_expired&startdate="+startdate+"&enddate="+enddate;  
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });  
      }



      /*
			Public Functions
			----------------
			Demographics
      */ 

		function ExportDemographics(startdate, enddate, email, gender, birthday, startAge, endAge){  
			var url = DataLink.export_link+"function=export_userInformation&startDate="+startdate+"&endDate="+enddate
				+"&email="+email+"&gender="+gender+"&birthday="+birthday+"&startAge="+startAge+"&endAge="+endAge; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
		}   

      function ExportCustomerTransactionHistory(memberID){
         var url = DataLink.export_link+"function=export_customerTransactionHistory&memberID="+memberID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
      }

      function ExportCustomerDetails(email){
         var url = DataLink.export_link+"function=export_customerProfileDetail&email="+email; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });
      }
 

      /*
         Public Functions
         ----------------
         Loyalty Sales
      */ 

      function ExportSalesSummary(startdate, enddate){
         var url = DataLink.export_link+"function=export_salessummary&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function ExportSalesPerHour(startdate, enddate, locID, brandID){
         var url = DataLink.export_link+"function=export_salesperhourly&startDate="+startdate+"&endDate="+enddate+"&locID="+locID+"&brandID="+brandID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function ExportSalesPerBranch(startdate, startTime, locID, brandID){
         var url = DataLink.export_link+"function=export_salesperbranch&startDate="+startdate+"&startTime="+startTime+"&locID="+locID+"&brandID="+brandID; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      } 


      /*
         Public Functions
         ----------------
         Spend
      */  
      function ExportSpendSummary(startdate, enddate){
         var url = DataLink.export_link+"function=export_spentsummary&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      } 

      function ExportSpendSummary(startdate, enddate){
         var url = DataLink.export_link+"function=export_spentsummary&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }


      /*
         Public Functions
         ----------------
         Branches
      */  
      function ExportBranchSummary(startdate, enddate){
         var url = DataLink.export_link+"function=export_branchsalessummary&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      } 

      function ExportQuarterlySales(){
         var url = DataLink.export_link+"function=export_branch_quarterlysales"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportQuarterlySalesAll(){
         var url = DataLink.export_link+"function=export_branch_quarterlysales_all"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportQuarterlyVisits(){
         var url = DataLink.export_link+"function=export_branch_quarterlyvisits"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportQuarterlyVisitsAll(){
         var url = DataLink.export_link+"function=export_branch_quarterlyvisits_all"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      } 


      /*
         Public Functions
         ----------------
         Customers
      */   
      function ExportCustomerSummary(startdate, enddate){
         var url = DataLink.export_link+"function=export_customer_transactions&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportCustomerQuarterlySales(){
         var url = DataLink.export_link+"function=export_customers_quarterlysales"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportCustomerQuarterlySalesAll(){
         var url = DataLink.export_link+"function=export_customers_quarterlysales_all"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportCustomerQuarterlyVisits(){
         var url = DataLink.export_link+"function=export_customers_quarterlyvisits"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportCustomerQuarterlyVisitsAll(){
         var url = DataLink.export_link+"function=export_customers_quarterlyvisits_all"; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }


      /*
         Public Functions
         ----------------
         Vouchers
      */    
      function ExportBranchRedemptionVouchers(startdate, enddate){
         var url = DataLink.export_link+"function=export_redemptionVoucher&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });             
      }

      function ExportCustomerRedemptionVouchers(startdate, enddate){
         var url = DataLink.export_link+"function=export_customerRedemptionVoucher&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

   


      /*
         Public Functions
         ----------------
         Redemptions
      */    
      function ExportBranchRedemption(startdate, enddate){
         var url = DataLink.export_link+"function=export_branchRedemption&startDate="+startdate+"&endDate="+enddate; 
         console.log(url);
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportCustomerRedemption(startdate, enddate){
         var url = DataLink.export_link+"function=export_customerRedemption&startDate="+startdate+"&endDate="+enddate; 
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });    
      }

      function ExportBranchTransaction(startdate, enddate, locname){
         var url = DataLink.export_link+"function=export_locationTransactions&startDate="+startdate+"&endDate="+enddate+"&locName="+locname; 
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
         var url = DataLink.export_link+"function=gettablerecords&table="+table;
         return $http.get(url).then(handleSuccess, function(error){ 
            ToastService.Show("An unexpected error occured", error); 
         });         
      }

      function GetRecord(table, dataID){
         var url = DataLink.export_link+"function=getrecord&table="+table+"&brandID="+dataID;
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