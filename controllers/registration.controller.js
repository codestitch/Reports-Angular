(function(){
	'use strict';

	angular
		.module('app')
		.controller("RegistrationController", RegistrationController);

	RegistrationController.$inject = ['$rootScope', 'QueryService']

})();