(function(){
	'use strict';

	angular
		.module('app')
		.factory('ToastService', ToastService) 
		.controller('ToastControl', ToastControl);

	ToastService.$inject = ['$rootScope', '$mdToast'];
	function ToastService($rootScope, $mdToast){
		var service = {};
 
		service.Show = Show; 

		return service;

      /*
			Public Functions
			---------------- 
      */ 
      function Show(status, message){  

      	var message = {
      		status: status,
      		message: message
      	};

      	$mdToast.show({
		         hideDelay   : 3000,
		         position    : 'top right',
		         controller  : 'ToastControl',
		         templateUrl : 'templates/toast.tmpl.html',
		         toastClass : 'md-toast-fixed',
		         locals : {
		         	data: message
		         }
	         }
		   ); 

      } 
	}


	ToastControl.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'data'];
	function ToastControl($rootScope, $scope, $mdToast, $mdDialog, data){
		
  		var isDlgOpen;	
		$scope.status = data.status; 
		$scope.hasMessage = (data.message == '') ? false : true;

		$scope.closeToast = function() {
        if (isDlgOpen) return;

        $mdToast
          .hide()
          .then(function() {
            isDlgOpen = false;
          });
      };

      $scope.openMoreInfo = function(e) {
         if ( isDlgOpen ) return;
         isDlgOpen = true;

         $mdDialog
          .show($mdDialog
            .alert()
            .title($scope.status)
            .textContent(data.message)
            .ariaLabel('More info')
            .ok('Got it')
            .targetEvent(e)
         )
         .then(function() {
            isDlgOpen = false;
         });

      };
	}

})();
