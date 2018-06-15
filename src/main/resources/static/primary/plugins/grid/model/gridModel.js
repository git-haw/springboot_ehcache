

define([
	'jquery',
	'backbone'
	],
	function($,Backbone) {

		var gridModel = Backbone.Model.extend({
			defaults : {
				gridid: null,
				column: null,
				ispage:true,
				pageSize:10,
				pageNow:1,  
				pagecode:10,
				records : null,
				initOrderByKey:null,
			    url:null,
			    un_order_row:null,
			    currentPageRecords:null,
			    renderKey:null,
			    isShowTitle : true,
			    totalrecords:0,
			    async:false,
			    sortname:null,
			    sortorder:null,
			    searchCondition:null,
			    hidePageNum:null
			}
		});

		return gridModel;

});