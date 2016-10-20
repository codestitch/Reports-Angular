(function(){
    'use strict';

    angular
        .module('app')
        .controller('DownloadController', DownloadController);

    DownloadController.$inject = ['$rootScope', 'QueryService', 'ChartService', 'PreloaderService'];
    function DownloadController($rootScope, QueryService, ChartService, PreloaderService) {
        var vm = this;

        // Variables
        vm.yeartoday = "";
        vm.monthtoday = "";

        // Access Functions 

        // Init 
        GetDateToday();

        // Public Functions 
        function SelectYearlyDownload(){
            QueryService.GetYearlyDownload()
                .then( function(result){
                    if (result[0].response == "Success") { 
                        var config = [{
                                "balloonText": "<i class='fa fa-apple'></i> <span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>",
                                "fillAlphas": 0.5,
                                "lineAlpha": 0.5,
                                "title": "iOS",
                                "valueField": "iOS"
                            }, {
                                "balloonText": "<i class='fa fa-android'></i> <span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>",
                                "fillAlphas": 0.5,
                                "lineAlpha": 0.5,
                                "title": "Android",
                                "valueField": "Android"
                            }];
                        ChartService.CreateLineChart_Multiple("yearlyChart", result[0].data, "Month", config);
                    } 
                });
        }

        function SelectMonthlyDownload(){ 
            QueryService.GetMonthlyDownload()
                .then( function(result){
                    if (result[0].response == "Success") { 
                        console.log(result);
                        var config = [{
                                "balloonText": "<i class='fa fa-apple'></i> <span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>",
                                "fillAlphas": 0.5,
                                "lineAlpha": 0.5,
                                "title": "iOS",
                                "valueField": "iOS"
                            }, {
                                "balloonText": "<i class='fa fa-android'></i> <span style='font-size:14px; color:#000000;'><b>[[value]]</b></span>",
                                "fillAlphas": 0.5,
                                "lineAlpha": 0.5,
                                "title": "Android",
                                "valueField": "Android"
                            }];
                        ChartService.CreateLineChart_Multiple("monthlyChart", result[0].data, "Week", config);
                    } 
                });
        }

        // Private functions
        function GetDateToday(){
            PreloaderService.Display();

            var d = new Date();
            var month = d.getMonth();
            var montharray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            vm.yeartoday = d.getFullYear();
            vm.monthtoday = montharray[month];

            SelectYearlyDownload();
            SelectMonthlyDownload();
            PreloaderService.Hide(); 
        }

 
        
        Metronic.init(); // init metronic core components
        Layout.init(); // init current layout   
    }

})();