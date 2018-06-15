define([
	'jquery',
	'backbone'
	],
	function($,Backbone) {

		var listModel = Backbone.Model.extend({
			defaults : {
				listid: null,
				config:null,
				formfig:null
            
			}
		});

		return listModel;

});