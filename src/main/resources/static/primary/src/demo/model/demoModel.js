/**
 * Created by Administrator on 2017-1-5.
 */
define([
	'jquery',
	'underscore',
	'backbone'
	],
	function($, _, Backbone) {

		var demoModel = Backbone.Model.extend({
			defaults : {
				 demoListUrl : "url"
			}
		});

		return demoModel;

});