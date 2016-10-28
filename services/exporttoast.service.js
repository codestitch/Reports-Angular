(function () {
    'use strict';

      angular
        .module('app')
        .factory('ExportToastService', ExportToastService);

      ExportToastService.$inject = ['$rootScope', '$mdToast', '$q'];
      function ExportToastService($rootScope, $mdToast, $q) {
         var service = {};

         service.Init = Init;
         return service;

         function Init(parameter, parameterController){   
            return $q(function(resolve, reject) {

               $mdToast.show({
                     hideDelay   : 0,
                     position    : 'top right',
                     controller  : parameterController,
                     templateUrl : 'templates/export.tmpl.html',
                     toastClass : 'md-toast-fixed',
                     locals : {
                        data: parameter
                     }
                  }
               ).then(
                  function(response){ 
                     resolve(response);
                  },function(response){ 
                     reject(response);
                  });  
            }); 

         }
   
      } 

})();