(function(){
	'use strict';

	angular
		.module('app')
		.factory('ChartService', ChartService);

	ChartService.$inject = ['$rootScope'];
	function ChartService($rootScope){
		var service = {};

		service.CreateBarChart_Single = CreateBarChart_Single; 
		service.CreateLineChart_Multiple = CreateLineChart_Multiple; 

		return service;  

      //public functions
      function CreateBarChart_Single(chartname, data, categoryField, graphTitle, graphValue, balloonText, depth, angle, rotate){

      	return AmCharts.makeChart(chartname, {
			    "theme": "light",
			    "type": "serial", 
		       "color":"#000", 
			    "dataProvider": data,
			    "categoryField": categoryField, 
			    "graphs": [{
			        "balloonText": balloonText,
			        "fillAlphas": 1,
			        "lineAlpha": 0.2,
			        "title": graphTitle,
			        "type": "column",
			        "valueField": graphValue
			    }],
			    "depth3D": depth,
			    "angle": angle,
			    "rotate": rotate,
			    "categoryAxis": {
			        "gridPosition": "start",
			        "fillAlpha": 0.05,
			        "position": "left"
			    },
			    "export": {
			    	"enabled": true
			     }
			});
      }

      function CreateLineChart_Multiple (chartname, data, categoryField, graphconfig){
      	return AmCharts.makeChart(chartname, {
	         "theme": "light",
	         "type": "serial", 
	         "color":"#000", 
	         "dataProvider": data,
	         "categoryField": categoryField,
	         "fontSize":10,
	         "legend": {
	            "align": "left",
	            "equalWidths": false,
	            "periodValueText": "Total: [[value.sum]]",
	            "valueAlign": "left",
	            "valueText": "[[value]] ([[percents]]%)",
	            "valueWidth": 100
	         },
	         "graphs": graphconfig,
	         "plotAreaBorderAlpha": 0,
	         "marginLeft": 0,
	         "marginBottom": 0,
	         "chartCursor": {
               "cursorAlpha": 0,
               "zoomable": false
	         }, 
	         "categoryAxis": {
	            "startOnAxis": true,
	            "axisColor": "#DADADA",
	            "gridAlpha": 0.07
	         },
	         "export": {
	            "enabled": true
	         } 
		   });
      }   
 

	}

})();