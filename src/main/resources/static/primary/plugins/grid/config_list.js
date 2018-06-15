define([
	'jquery',
	'underscore',
	'backbone',
	'http',
	'plugins/grid/gridList',
	'plugins/grid/model/gridModel',
	'layer'

	],
	function($, _, Backbone, http,gridList, gridModel,layer) {
		var gridView = null;
		var config = null;
		var configView = Backbone.View.extend({
			
			
			/**
			 * [initialize 初始化]
			 * @return {[type]} []
			*/
			initialize : function() {
				var self = this;
				self.refreshChange();
			},
			refreshChange : function(){
				var self = this;
				var model = this.model;
				
                 //加载列表
                 self.configGrid();

                
			},
	      
	      /**
	       * 获取列表配置
	       */
			configGrid : function(){
               var self = this;
			   var model = this.model;
			   var el = this.$el;

			    config = model.get('config');

                   /*加载按钮*/
                   if(config.insertButton){
                       $('.addForm').parent().show();
                   }
                    if(config.modifyButton){
                       $('.modifyForm').parent().show();
                   }
                    if(config.deleteButton){
                       $('.deleteForm').parent().show();
                   }
                    if(config.exportButton){
                       $('.dropdown').show();
                   }
			     /*加载列表*/
                  var show_colstr = config.show_colstr.split(',');
                  var sql_field = config.sql_field.toLowerCase().split(',');
                  var titlestr = config.titlestr.split(',');
                  var col_width =config.col_width.split(',');
               
                  var columns = new Array();

                  for(var i=0;i<show_colstr.length;i++){
                    var col_obj ={} ;
                    var index = show_colstr[i];
                    col_obj['colkey'] = sql_field[index];
                    col_obj.name = titlestr[index] ;
                    col_obj.width =col_width[index];
                    columns.push(col_obj);
                  }
              
                  gridView = new gridList({
                        el : $('.custom-wraper'),
                      model :new gridModel({
                        gridid :config.code,
                        pageSize : config.page_row,
                        checkbox:true,
                        async:false,
                        url: config.request_url+'?beanName='+config.beanName,
                        column : columns
                      })});

			},
          
          //新增表单
          addBase : function(){
            var self = this;
			var model = this.model;
        
           var url = model.get('insertFormUrl')+'?formCode='+model.get('formCode')+'&isTop=true';
            layer.open({
            	title:'新增',
		        type: 2,
		        area: ['780px', '360px'],
		        content: url
		    });

          },
          //修改表单
           modifyBase : function(){
	           	var self = this;
				var model = this.model;
	           var tablePk = model.get('tablePk');
	           var id = gridView.getGridSelected('ID');
	           if(id.length!=1){
                   layer.msg('请选择一条记录修改');
	           }else{

	           	   var url = model.get('modifyFormUrl')+'?formCode='+model.get('formCode')+'&isTop=true'+'&'+tablePk+'='+id;
		            layer.open({
		            	title:'修改',
				        type: 2,
				        area: ['780px', '360px'],
				        content: url
				    });
	           }
             
	          
           },

           //删除列表数据
           deleteBase : function(){
           	   	var self = this;
				var model = this.model;
	           var tablePk = model.get('tablePk');
	           var tableName = model.get('tableName');
	           var id = gridView.getGridSelected('ID');

	           if(id.length<1){
                  layer.msg('请选择删除记录');
	           }else{
	           	    var url = model.get('deleteFormUrl')+'?tb=' + tableName + "&field=" + tablePk + "&value=" + escape(id.join(','));
				
	                layer.confirm('您确定要删除此条信息吗？', {icon: 3, title:'提示'}, function(index){
					    //do something
					    http.del(url).success(function(data){
					    	  layer.msg('删除成功');
					    	  self.gridrefresh();
					    	 
					    	}).error(function(err) {
					    		//console.debug(err);
        					});
					   layer.close(index);
					});
	           }
	         
           },
          // 列表刷新
          gridrefresh:function(){
              
              gridView.loadBodyData();
          },
     
         // 列表查询
          searchList:function(){
              	var self = this;
				var model = this.model;
				var el = this.$el;
               var searchData = $('#searchText').val();
               var searchName = model.get('searchName').toUpperCase().split(',');
               var param=new Array ;
               for(var i=0;i<searchName.length;i++){
                 //  param[searchName[i]]:searchData
                  param.push(searchData);
               }
               param =_.object(searchName,param);
            
              gridView.searchGrid(param);

          },


			/**
			 * 导出Grid报表
			 * 
			 * @param type
			 *            报表类型
			 */
		 exportGridReport:function(type)
			{   
				var self = this;
				var model = this.model;
				var paras = gridView.model.get('url');

				paras = paras.substring(paras.indexOf("?"));
				var param = gridView.model.get('searchCondition');
				if(param){
	                param =_.pairs(param);
	                var condition = '';
	                _.each(param,function(item){

	                   condition +='&'+item[0]+'='+item[1];
	                });
	               paras +=condition;
				}
				paras = encodeURI(paras);
				var url =model.get('exportFormUrl') + paras + "&gridReport=" + type;

				//if(isXMLCheckbox||isXMLRadio) url +="&filter=1" ;

				if(document.getElementById("_export_frame")==null){
				    $("body:eq(0)").append('<iframe id="_export_frame" style="display: none" src="about:blank"></iframe>');
				}
				$("#_export_frame").attr("src", url);

				/*
				 * setTimeout(function() { $("#_export_frame").attr("src", "about:blank");//
				 * 避免IE状态栏读取状态栏显示不正常 }, 30000);
				 */
			}  ,
	
//------------------------------------------------------告警区域end----------------------------------------------------------------------//
		});

       

		return configView;

});