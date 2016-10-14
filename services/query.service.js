(function(){
	'use strict';

	angular
		.module('app')
		.factory('QueryService', QueryService);

	QueryService.$inject = ['$http', '$rootScope'];
	function QueryService($http, $rootScope, $q){
		var service = {};

		service.GetDemographics = GetDemographics; 

		return service; 

        //public functions
		function GetDemographics(startdate, enddate){  
			var url = $rootScope.globals.report_link+"function=get_customerSummary&startDate="+startdate+"&endDate="+enddate;
  
            return $http.get(url).then(handleSuccess, handleError('Error getting all users'));
		}   


		// private functions
        function handleSuccess(response) { 
            return response.data;
        }

        function handleError(error) {
        	console.log(error)
            return function () {
                return { success: false, message: error };
            };
        }

	}

})();