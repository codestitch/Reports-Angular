(function(){
    'use strict';

    angular
        .module('app')
        .controller('DemographicsController', DemographicsController);

    DemographicsController.$inject = ['UserService', 'PreloaderService','$rootScope', 'QueryService', '$http', 'NgTableParams' ];
    function DemographicsController(UserService, PreloaderService, $rootScope, QueryService, $http, NgTableParams) {
        var vm = this; 

        vm.data = [];
        vm.startdate = "";
        vm.enddate = ""; 
        vm.email = "e";

        vm.GetCustomerSummary = GetCustomerSummary; 
        
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
 

        // functions
        function GetCustomerSummary(){  

            if (vm.startdate == "" || vm.enddate == "") {
                console.log("empty");
                toastr['warning']("Oops! You've forgotten to specify date range", "No Date"); 
                return;
            }

            QueryService.GetDemographics(vm.startdate, vm.enddate)
                .then( function(result){ 
                vm.data = result[0].data;
                console.log(vm.data);

                var count = (result[0].data.length > 10) ? [40, 80, 100, 150] : [];
                vm.tableParams = new NgTableParams({
                    page: 1, 
                    count: 10
                }, { 
                    paginationMaxBlocks: 15,
                    paginationMinBlocks: 2, 
                    counts: count,
                    dataset: vm.data
                });

            });  
        } 
 
 
    }

})();