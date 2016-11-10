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
                           HasData();
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
                        else{
                           NoData();
                        } 
                   });
         }

         function SelectMonthlyDownload(){ 
               QueryService.GetMonthlyDownload()
                   .then( function(result){
                        if (result[0].response == "Success") { 
                           HasData2
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
                        else{
                           NoData2();
                        }
                   });
         }

         function HasData(){
            document.getElementById('noDatadiv').className = "hide-element";
            document.getElementById('yearlyChart').className = "chart";
         }

         function NoData(){ 
            document.getElementById('noDatadiv').className = "display-element";
            document.getElementById('yearlyChart').className = "hide-element";
         }

         function HasData2(){
            document.getElementById('noDatadiv2').className = "hide-element";
            document.getElementById('monthlyChart').className = "chart";
         }

         function NoData2(){ 
            document.getElementById('noDatadiv2').className = "display-element";
            document.getElementById('monthlyChart').className = "hide-element";
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