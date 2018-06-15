define([
	'jquery',
	'underscore',
	'backbone',
	'http',
	'icheck'
	],
	function($, _, Backbone,http) {
	    
		var gridView = Backbone.View.extend({
           
			listHeadTemplate:_.template(
					  '<table id="<%=grid%>" class="table table-striped responsive-utilities jambo_table dataTable" style="table-layout: fixed">'+
		        		'<thead>'+
		        		  '<tr class="headings" role="row">'+
		        		  	'<%if(checkbox!=null && checkbox==true) {%>'+
		                    '<td width="55px" class="sorting_disabled">'+
		                    '<input type="checkbox" id="check-all" class="flat">'+
		                     '</td>'+
		                    '<%}%>'+
		                    '<% _.each(column,function(item,i){ %>'+
		                    '<td title="<%=item.name%>" id="<%=grid%>_t<%=i%>" class="<%if(item.nosort){%>  <%} else{%> <%=grid%>-grid-list sorting<%}%>  td-autocut t<%=i%>" style=" <%if(item.hide){%> display:none; <%} %> width: <%=item.width%>; vertical-align: middle;cursor:pointer " data-code="<%=item.colkey%>" data-asign="sorting"><%=item.name%>' +
		                    '</td>' +

		                    '<%})%>'+
                            /* '<td style="width:20px;vertical-align: middle;cursor:pointer" class="columns-list"><i class="fa fa-navicon"></i></td>'+*/
		                    '<td style="width:20px;vertical-align: middle;cursor:pointer;position: relative;" class="columns-list top_nav" >'+  
                               '<div class=""> <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="true">'+
                                   
                                  '<span class="fa fa-navicon" ></span> </a>'+
                                    '<ul class="dropdown-menu dropdown-usermenu animated fadeInDown pull-right" style="min-width: 120px">'+
                                  
                                    '<% _.each(column,function(item,i){%><li><a href="javascript:void(0);" style="padding: 5px 10px;"><input type="checkbox" class="<%=grid%>-col-view"  <%if(item.hide){%> <%}else{ %> checked<%} %> value="<%=grid%>_t<%=i%>"  /> <%=item.name%></a></li><%})%>'+
                                '</ul>'+
                            '</div>'+
                            '</td>'+
		                     '</tr>'+

		        		'</thead>'+
		        		'<tbody>'+
		        		'</tbody></table><div style="vertical-align: middle;" class="span12 center page" ></div>'
					),
           	listPageTemplate:_.template(
				'<div width="100%">'+
				   '<div  style="float: left;vertical-align: bottom;  <%if(hidePageNum){%> display:none; <%}%> "><ul><li class="prev"><label> 总&nbsp;<%=totalRecords%>&nbsp;条&nbsp;&nbsp;每页&nbsp;<%=pageSize%>&nbsp;条&nbsp;&nbsp;共&nbsp;<%=totalPages%>&nbsp;页</label>'+
                    '&nbsp;&nbsp;&nbsp;<label>显示 <select style="width: 60px;" name="<%=grid%>_num" id="<%=grid%>_num" aria-controls="example"><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option></select> 条</label></li>'+
				   '</ul></div>'+
				   '<div style="float: right;padding-right:2px"> <nav><ul style=" margin: 0px 0;" class="pagination">'+

                       '<% _.each(pageli,function(item,i){ %>'+
                    ' <li class="<%=item.className%>" data-code="<%=item.data%>">  <a href="javascript:void(0);"><%=item.text%></a></li>' +
                    '<%})%>'+
				   '</ul></nav></div>'+
				   '</div>'
			),

			listTemplate: _.template(
           '<% _.each(records,function(item,i){  %>'+
           '<tr >'+
	           '<%if(checkbox!=null && checkbox==true) {%>'+
	           '<td class="a-center "><input type="checkbox" value="<%=item[checkValue]%>" class="flat" name="table_records"></input></td>'+
	           '<%}%>'+
              '<% _.each(column,function(col,n){ %>'+
              '<td class="td-autocut <%=grid%>_t<%=n%>_body <%if(col.tbodyClass){%> <%=col.tbodyClass%> <%} %>" <%if(col.hide){%> style= "display:none;" <%}%>  <%if(col.align) {%>align="<%=col.align%>" <%}%> <%if(!col.isHideTitle){%>title="<%=item[col.colkey]%>"<%}%>> '+
              '<%if(col.renderData){%> ' +
                   ' <%= col.renderData(n,item[col.colkey],item,col.colkey) %>' +
                 '<%}else{%>' +
              ' <%=item[col.colkey]%>' +
              '<%}%>'+
              '</td><%})%><td></td>' +
            '</tr>' +
            '<%})%>'
        ),


        initialize : function() {
			var self = this;
			var model = this.model;
			self.initHeadBody();

			if (model.get('url')) {
				self.loadBodyData();
			} else if (model.get('records')) {
                model.set('totalrecords',model.get('records').length);
				self.createdTable();
			}



		},
		
		showLoading : function(target) {
			var self = this;
			var model = this.model;
			var str = '<div class="loading"></div>';
			target.append(str);
		},

		initHeadBody : function(){
		   var self = this;
	   	   var model = this.model;

           var gridBody = model.get('gridid');
	   	   var column = model.get('column');

	   	   var checkbox = model.get('checkbox');

	   	   var grid = gridBody+'_table';
           var headarr = self.listHeadTemplate({
        	   	checkbox : checkbox,
                grid : grid,
                column : column
           });

           $('#'+gridBody).html(headarr);

           //添加表头事件
           $('.'+grid+'-grid-list').click(function(e){
                 self.columnOrderBy(e);
           });

           //添加表头下拉隐藏列事件
           $('.'+grid+'-col-view').click(function(e){
           	    self.columnShowOrHide(e);
           });
		},

		loadBodyData : function() {
			var self = this;
			var model = this.model;
		
			var el = this.$el;
			var grid = model.get('gridid');
			var url = model.get('url');
			var column = model.get('column');

			var pagesize = model.get('pageSize');
			var pagenum = model.get('pageNow');
			
            if( model.get('sortname')){
            	url += '&sortdatafield=' + model.get('sortname');
            	url += '&sortorder=' + model.get('sortorder');
            }
            if(model.get('searchCondition')){
            	var param = model.get('searchCondition');
                param =_.pairs(param);
                var condition = '';
                _.each(param,function(item){

                   condition +='&'+item[0]+'='+item[1];
                });
                url += condition;

               // model.set('pageNow',1);
            }



            url +='&pagenum='+pagenum+'&pagesize='+pagesize+'&_t='+(new Date()).getTime() ;

            var postData =  url.substring(url.indexOf("?")+1, url.length);

			url = url.substring(0,url.indexOf("?"));

			http.post(url,postData).success(function(data) {

				var records = data.records;
                var totalrecords = data.totalrecords;
               /* records = _.each(records,function(val,key){
                	  var key = key.toUpperCase();
                      return {key:val};
                });*/
                model.set('totalrecords',totalrecords);
				model.set('records', records);

				self.createdTable();
			   // var count = '('+totalrecords+')';
			  //  $('.x_title h2 small').empty();
			   // $('.x_title h2 small').append(count);
			}).error(function(err) {
				console.info(err);
			});

		},

		createdTable : function() {

			var self = this;
			var model = this.model;
			
			var el = this.$el;
			var grid = model.get('gridid');
			var column = model.get('column');
			var un_order_row = model.get('un_order_row');
			var records = model.get('records');
			
			if (un_order_row) {
				var checkbox = model.get('checkbox');
				var checkValue = model.get('checkValue');
				var isShowTitle = model.get('isShowTitle');
				var un_array = null;
				 un_array = _.filter(records, function(v, k) {
					return k < un_order_row;
				})

				records = _.filter(records, function(v, k) {
					return k >= un_order_row;
				})
				model.set('records',records);
				var grid_t =  grid+'_table';
			    var  htmlarr = self.listTemplate({
			    	checkbox : checkbox,
			    	checkValue : checkValue,
					records : un_array,
					column : column,
					isShowTitle : isShowTitle,
					grid:grid_t
				});

				$('#' + grid + ' tbody').html(htmlarr);
                
			}
			model.set('currentRecords',records);
			self.changeTableBody(records);
			
		},

		changeTableBody : function(records){
            var self = this;
			var model = this.model;
			var el = this.$el;
			var grid = model.get('gridid');
			var column = model.get('column');
			var ispage = model.get('ispage');
            var htmlarr = '';
			var totalRecords = model.get('totalrecords');
			var pageSize = model.get("pageSize"); // 每页显示多少
			var un_order_row = model.get('un_order_row');
			var checkbox = model.get('checkbox');
			var checkValue = model.get('checkValue');
			var isShowTitle = model.get('isShowTitle');
         
			if (totalRecords <= pageSize) {
				ispage = false;
			}else{
				ispage = model.get('ispage');
			}

          var async = model.get("async");   //是否异步请求
          var _array = null;
			if (ispage) {


                if(async){
				    _array = records;

                 }else{
                 	var pageNow = model.get("pageNow");

					 _array = _.filter(records, function(v, i) {
						return (i >= (pageNow-1) * pageSize && i < pageNow * pageSize);
					});

				//	 var count = '('+records.length+')';
				//    $('.x_title h2 small').empty();
				//    $('.x_title h2 small').append(count);
                 }
                 var grid_t =  grid+'_table';
					htmlarr = self.listTemplate({
						checkbox : checkbox,
						checkValue : checkValue,
						records : _array,
						column : column,
						isShowTitle : isShowTitle,
						grid:grid_t
					});

					self.page(records);
					model.set("currentPageRecords",_array);

			} else {

				 _array = records;
				 var grid_t =  grid+'_table';
				htmlarr = self.listTemplate({
						checkbox : checkbox,
						checkValue : checkValue,
						records : _array,
						column : column,
						isShowTitle : isShowTitle,
						grid:grid_t
					});

				self.page(records);
				model.set("currentPageRecords",records);
			}
        
            //查出现有列表固定行
            if(un_order_row){
                 var tr_body = $('#' + grid + ' tbody  tr:lt('+un_order_row+')').prop("outerHTML");

                htmlarr = tr_body + htmlarr ;
             }
         
			$('#' + grid + ' tbody').html(htmlarr);
			$('#' + grid + ' tbody').closest('.chart-wp').on('dblclick',function(){
				$(this).toggleClass('enlargementPage');
			});
		/*	$('li input').each(function(index){
				if($(this).prop("checked")){
					$("."+$(this).val()).css("display","none");
				}else{
					$("."+$(this).val()).css("display","");
				}
			});*/
 
			if(checkbox){
				if ($("input.flat")[0]) {
			        $('input.flat').iCheck({
			            checkboxClass: 'icheckbox_flat-blue',
			            radioClass: 'iradio_flat-blue'
			        });
				}

				$('#' + grid + ' input#check-all').on('ifChecked', function () {
				    $("#" + grid + " input[name='table_records']").iCheck('check');
				});
				
				$('#' + grid + ' input#check-all').on('ifUnchecked', function () {
				    $("#" + grid + " input[name='table_records']").iCheck('uncheck');
				});

				$('#' + grid + ' input').on('ifChecked', function (index) {
					$(this).parent().parent().parent().addClass('selected');
				});
				
				$('#' + grid + ' input').on('ifUnchecked', function (index) {
					$(this).parent().parent().parent().removeClass('selected');
				});
				
				//点击行，选择行
				$('#' + grid + ' tbody  tr').on('click',function() {
					if($(this).hasClass("selected")){
		      		    $(this).find("input").iCheck('uncheck');
					    $(this).removeClass('selected');
		      	    }else{
		      	    	$(this).find("input").iCheck('check');
					    $(this).addClass('selected');
		      	    }
				});
				
			}

			//根据指定顺序排序颜色
			if(model.get('renderKey')!=null&&_array.length>0) {
                var key = model.get('renderKey');
                var index = -1;
                _.find(column,function(v,k){
                     if(v.colkey == key){
                        index = k;
                        return true;
                     }else{
                     	return false;
                     }
                });

				self.renderData(model.get('renderKey'), _array,index, grid);
			}
          

		},

		renderData : function(renderKey, records,index, grid) {
			var sortData = _.sortBy(records,renderKey);
			sortData = sortData.reverse();

		  $("#"+grid+" tbody tr td:nth-child("+(index+1)+")").each(function(){

		  	  if($(this).text() ==sortData[0][renderKey] ){
		  	  	$(this).parent().css('background-color', 'red');
		  	  }else  if($(this).text() ==sortData[1][renderKey] ){
		  	  	$(this).parent().css('background-color', 'orange');
		  	  }else  if($(this).text() ==sortData[2][renderKey] ){
		  	  	$(this).parent().css('background-color', 'yellow');

		  	  }
		  })


		},
        //列表头排序
	    columnOrderBy : function(e){
            var self = this;
            var model = this.model;

            var code = e.currentTarget.dataset.code;
            var asign = e.currentTarget.dataset.asign;
            var span = e.currentTarget.children[0];

	            if(asign=='descending'||asign=='sorting'){
	               e.currentTarget.dataset.asign = 'ascending';

	               e.currentTarget.className = model.get('gridid')+'-grid-list sorting_asc';
	               // 添加当前表头高亮显示
	            }else{
	               e.currentTarget.dataset.asign = 'descending';
	               e.currentTarget.className = model.get('gridid')+'-grid-list sorting_desc';

	            }
	        var async = model.get('async');
            if(async){ // 异常查找
            	var order = (asign=='descending'||asign=='sorting')?'asc':'desc' ;
                model.set('sortname',code);
                model.set('sortorder',order);

                self.gotoPage(1);
            }else{
                self.tableList(code,asign);
            }
      },
      //显示隐藏列
      columnShowOrHide : function(e){
      		  var self = this;
            var model = this.model;
            var code = e.currentTarget;
            var obj = e.currentTarget;
            var column = model.get('column');
            var grid = model.get('gridid');
             var value = obj.value;
            
             var st = grid+'_table_t';
             var index = value.substring(st.length,value.length);
           
             var col = column[parseInt(index)];
             if(obj.checked){
                $('#'+value).show();
                $('.'+value+'_body').show();
                col['hide'] = false;
             }else{
             	 $('#'+value).hide();
             	 $('.'+value+'_body').hide();
             	 col['hide'] = true;
             }
           
      },

        // 前端key值排序
		tableList : function(key, asign) {
			var self = this;
			var el = this.$el;
			var model = this.model;
			var records = model.get('currentRecords');
			var ispage = model.get('ispage');
			var column = model.get('column');

			var htmlarr = '';
			//var _array;

			var	_array = _.sortBy(records, key);

				if (asign == 'ascending') {
					_array = _array.reverse();
				}

			model.set("currentRecords", _array);
           self.changeTableBody(_array);

		},

		page : function(records) {
			var self = this;
			var model = this.model;
			var el = this.$el;
			var grid = model.get('gridid');
			//var jsonData = model.get('records');
			var jsonData = records;
			var totalRecords = 0;
			if(model.get('async')){
                totalRecords = model.get('totalrecords');
			}else{
                  totalRecords = records.length;
			}
			var pageSize = model.get("pageSize"); // 每页显示多少
			var totalPages = Math.ceil(totalRecords / pageSize); // 总页数
			var pageNow = model.get("pageNow");
			var pagecode = model.get("pagecode"); //默认显示10个分页;
			var hidePageNum = model.get("hidePageNum") ==null?false:true; //显示分页num
			var prev; //前一页
			var pageli; //中间页
			var next; // 后一页

			pageli = new Array();
			if (pageNow > 1) {

				prev = {
					id : 'pagNum_' + (pageNow - 1),
					className : 'pagNum_' + grid,
					data : (pageNow - 1),
					text : '上一页'
				};
			} else {

				prev = {
					id : 'pagNum_' + (pageNow - 1),
					className : 'prev disabled',
					data : (pageNow - 1),
					text : '上一页'
				};
			}
			pageli.push(prev);
			var pg = self.pagesIndex(pagecode, pageNow, totalPages);

			var startpage = pg.start;
			var endpage = pg.end;

			if (startpage != 1) {
				var start = {
					id : 'pagNum_1',
					className : 'pagNum_' + grid,
					data : 1,
					text : '1...'
				};
				pageli.push(start);
			}

			for (var i = startpage; i <= endpage; i++) {
				if (i == pageNow) {
					var p = {
						id : 'pagNum_' + i,
						className : 'active',
						data : i,
						text : i
					};
					pageli.push(p);

				} else {
					var p = {
						id : 'pagNum_' + i,
						className : 'pagNum_' + grid,
						data : i,
						text : i
					};
					pageli.push(p);
				}
				;

			}
			if (endpage != totalPages) {
				var p = {
					id : 'pagNum_' + totalPages,
					className : 'pagNum_' + grid,
					data : totalPages,
					text : '...' + totalPages
				};
				pageli.push(p);
			}
			if (pageNow >= totalPages) {

				var p = {
					id : 'pagNum_' + totalPages,
					className : 'prev disabled',
					data : totalPages,
					text : '下一页'
				};
				pageli.push(p);
			} else {

				var p = {
					id : 'pagNum_' + (pageNow + 1),
					className : 'pagNum_' + grid + ' next',
					data : (pageNow + 1),
					text : '下一页'
				};
				pageli.push(p);
			}

			var htmlarr = self.listPageTemplate({
				totalRecords : totalRecords,
				pageSize : pageSize,
				totalPages : totalPages,
				pageli : pageli,
				grid:grid,
				hidePageNum:hidePageNum
			});

			$('#'+grid+'_page').html(htmlarr);
		//	el.find('.page').html(htmlarr);

		    $('#'+grid+'_num').val(model.get('pageSize'));
				//切换每页显示行数
				 $('#'+grid+'_num').change(function(){
                  var pagesize = $(this).val();
                    model.set('pageSize',pagesize);
                    self.gotoPage(1);
                });

			//添加表头事件
			$('.pagNum_' + grid).click(function(e) {
				var num = Number(e.currentTarget.dataset.code);
				self.gotoPage(num);
			});

		},
        //页面跳转
		gotoPage : function(num) {
			var self = this;
			var model = this.model;
			var el = this.$el;

			var pageSize = model.get("pageSize");
			var pageSize = model.get("pageSize"); // 每页显示多少
			var async = model.get("async");       // 是否异步请求

			model.set('pageNow', num);
            if(async){
                 self.loadBodyData();
            }else{
//                var records = model.get('currentRecords');

            	var records = model.get('currentRecords');
				var param = model.get('searchCondition');
				if(param!=null && !param=='') {
					var keys = _.keys(param);
					var _array = _.filter(records, function(item){
						var flag = false;
						  for(var i=0;i<keys.length;i++){
							 if(item[keys[i]].indexOf(param[keys[i]])>-1){
								flag = true ;
								break;
							 }
						  }
						  return flag;
					});
					var total = _array.length;
					model.set('totalRecords',total);
					self.changeTableBody(_array);
				} else {
					self.changeTableBody(records);
				}
            }


		},

		/**
		 * 这是一个分页工具 主要用于显示页码,得到返回来的 开始页码和结束页码 pagecode 要获得记录的开始索引 即 开始页码 pageNow
		 * 当前页 pageCount 总页数
		 *
		 */
		pagesIndex : function(pagecode, pageNow, pageCount) {

			pagecode = parseInt(pagecode, 10);
			pageNow = parseInt(pageNow, 10);
			pageCount = parseInt(pageCount, 10);
			var startpage = pageNow - (pagecode % 2 == 0 ? pagecode / 2 - 1 : pagecode / 2);
			var endpage = pageNow + pagecode / 2;
			if (startpage < 1) {
				startpage = 1;
				if (pageCount >= pagecode)
					endpage = pagecode;
				else
					endpage = pageCount;
			}
			if (endpage > pageCount) {
				endpage = pageCount;
				if ((endpage - pagecode) > 0)
					startpage = endpage - pagecode + 1;
				else
					startpage = 1;
			}
			;
			var se = {
				start : startpage,
				end : endpage
			};
			return se;
		},

		// 查询列表数据

		searchGrid : function(param) {
			var self = this;
			var model = this.model;
			var el = this.$el;
            var column = model.get('column');
              model.set('searchCondition',param);
              model.set('pageNow',1);
		    if(model.get("async")){
                self.loadBodyData();
		    }else{
		    	 var keys = _.keys(param);

		    	var records = model.get('records');
				var _array = _.filter(records, function(item){
					var flag = false;
					  for(var i=0;i<keys.length;i++){
	                     if(item[keys[i]].indexOf(param[keys[i]])>-1){
	                     	flag = true ;
	                     	break;
	                     }
					  }
	                  return flag;
				});
				 // model.set('pageNow', 1);
				// model.set('currentRecords',_array);
				var total = _array.length;
                 model.set('totalRecords',total);
				self.changeTableBody(_array);
				return _array;
			}


		},

		// 获取选中行对应字段的数据
		getGridSelected : function(col){
            var self = this;
			var model = this.model;
			var grid = model.get('gridid');
            var currentRecords = model.get('currentPageRecords');
            var values = new Array() ;

             $('#'+grid+' tbody tr').each(function(k,e){

                    if(e.className == 'selected'){

                       // values.push(k);
                      var key = _.find(currentRecords,function(num,n){
                           return k==n?true:false;
                      });
                      values.push(key[col]);
                    }
             });

            return values;
		},
		

	});


	return gridView;
	

});