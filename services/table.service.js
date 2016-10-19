(function(){
	'use strict';

	angular
		.module('app')
		.factory('TableService', TableService);

	TableService.$inject = ['NgTableParams'];
	function TableService(NgTableParams){
		var service = {};

		service.CreateTable = CreateTable;

		return service;

		// Public functions
		function CreateTable(data, tableParams){
			var count = (data.length > 10) ? [40, 80, 100, 150] : [];
         var tableParams = new NgTableParams({
             page: 1, 
             count: 10
         }, { 
             paginationMaxBlocks: 15,
             paginationMinBlocks: 2, 
             counts: count,
             dataset: data
         }); 
         return tableParams;
		}

	}

})();