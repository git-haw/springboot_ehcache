/**
 * Created by Administrator on 2017-1-5.
 */
define([ 'jquery', 'underscore', 'backbone', 'http', 'gridList',  'gridModel' ,'layer','form','common','jquery-validate','datetimepicker' ],
		function($, _, Backbone, http, gridList, gridModel,layer) {
	var meetingGridView = null;
	var meetingListView = Backbone.View.extend({
		/**
		 * [initialize 初始化]
		 *
		 * @return {[type]} []
		 */
		initialize : function() {
			var self = this;
			var model = this.model;
			self.getMeetingList();
		},

		events : {
			'click .addMeetingForm' : 'addMeeting',
			'click .modifyMeetingForm' : 'modifyMeeting',
			'click .deleteMeetingForm' : 'deleteMeeting',
			'click .searchMeetingButton' : 'searchMeetingList',
		},

		getMeetingList : function() {
			var model = this.model;
			var self = this;
			var url = model.get('demoListUrl');
			meetingGridView = new gridList({
                el : $('.custom-wraper'),
                model :new gridModel({
                    gridid :'meeting_paging',
                    pageSize : 10,
                    checkbox:true,
                    async:true,
                    url: url,
                    column : [{
            			colkey : "id",
            			name : "id",
            			hide : true
            		},{
            			colkey : "name",
            			name : "会议标题",
            			align : "left",
            			width : "100%"
            		},{
            			colkey : "start_time",
            			name : "开始时间",
            			align : "left",
            			width : "100px",
            			renderData : function(rowindex, data, rowdata, column) {
                            if(data){
                                return new Date(data).format("yyyy-MM-dd");
                            }
                        }
            		},{
            			colkey : "end_time",
            			name : "结束时间",
            			align : "left",
            			width : "100px",
            			renderData : function(rowindex, data, rowdata, column) {
                            if(data){
                                return new Date(data).format("yyyy-MM-dd");
                            }
                        }
            		},{
            			colkey : "linkman",
            			name : "会议联系人",
            			align : "left",
            			width : "90px"
            		},{
            			colkey : "registration_mode",
            			name : "报名模式",
            			align : "left",
            			width : "80px",
            			renderData : function(rowindex, data, rowdata, column) {
            				if(data=="1"){
            					return "先到先得";
            				}else if(data=="2"){
            					return "择优选择";
            				}
            			}
            		},{
            			colkey : "registration_closing_time",
            			name : "报名截止时间",
            			align : "left",
            			width : "100px",
            			renderData : function(rowindex, data, rowdata, column) {
                            if(data){
                                return new Date(data).format("yyyy-MM-dd");
                            }
                        }
            		},{
            			colkey : "status",
            			name : "状态",
            			align : "left",
                		width : "80px",
                		renderData : function(rowindex, data, rowdata, column) {
                			if(data=="-1"){
            					return "取消会议";
            				}else if(data=="0"){
            					return "创建";
            				}
                        }
            		}]
                })
			});
		},

		//新增表单
		addMeeting : function(){
			var self = this;
			var model = this.model;
			var url = model.get('addMeetingUrl');
			addMeetingLayer = layer.open({
				title : "新增",
				type : 1,
				closeBtn: 1,
				area : [ "550px", "600px" ],
				content : CommnUtil.ajax(url),
				success:function(){
					buildAddLayer(model);
				},
		        btn:['确认','关闭'],
                yes: function(index) {
                	var v = $("#addMeetingForm").validate({
	                	rules:{
	                		'meetingFormMap.name':{required:true},
	                        'meetingFormMap.registration_count':{digits:true}
	                    },messages:{
	                    	'meetingFormMap.name':{required:"会议标题不能为空"},
	                        'meetingFormMap.registration_count':{digits:"只能输入数字"}
	                    },
	                     onfocusout:false
	                });

	                var check = v.form();
	                if(check){
	                	$("#addMeetingForm").ajaxSubmit({
	                		dataType : "json",
	                		success : function(result) {
	                    		if(result=="success"){
	                    			layer.close(addMeetingLayer);
	                    			layer.msg("添加成功");
	        		                self.gridrefresh();
	                    		}else{
	                    			layer.msg("添加失败");
	                            	self.gridrefresh();
	                    		}
	    					}
	                	});
                	}
				},
				btn2: function(){
	            	self.gridrefresh();
	            },
				cancel: function(){
                	self.gridrefresh();
                }
			});

		},

		//修改表单
		modifyMeeting : function(){
			var self = this;
			var model = this.model;
			var id = meetingGridView.getGridSelected('id');
			if(id.length!=1){
				layer.msg('请选择一条记录修改');
			}else{
				var url = model.get('addMeetingUrl')+'?id='+id;
        		modifyMeetingLayer = layer.open({
    				title : "修改",
    				type : 1,
    				closeBtn: 1,
    				area : [ "550px", "600px" ],
    				content : CommnUtil.ajax(url),
    				success:function(){
    					if($("#start_time").val()!=null && $("#start_time").val()!=""){
    						$("#start_time").val(new Date(parseInt($("#start_time").val())).format("yyyy-MM-dd hh:mm:ss"));
    					}
    					if($("#end_time").val()!=null && $("#end_time").val()!=""){
    						$("#end_time").val(new Date(parseInt($("#end_time").val())).format("yyyy-MM-dd hh:mm:ss"));
    					}
    					if($("#registration_closing_time").val()!=null && $("#registration_closing_time").val()!=""){
    						$("#registration_closing_time").val(new Date(parseInt($("#registration_closing_time").val())).format("yyyy-MM-dd hh:mm:ss"));
    					}
    					if($("#sign_up_time").val()!=null && $("#sign_up_time").val()!=""){
    						$("#sign_up_time").val(new Date(parseInt($("#sign_up_time").val())).format("yyyy-MM-dd hh:mm:ss"));
    					}
    					buildAddLayer(model);
    				},
    		        btn:['确认','关闭'],
                    yes: function(index) {
                    	var v = $("#addMeetingForm").validate({
    	                	rules:{
    	                        name:{required:true},
    	                        registration_count:{digits:true}
    	                    },messages:{
    	                        name:{required:"会议标题不能为空"},
    	                        registration_count:{digits:"只能输入数字"}
    	                    },
		                 	onfocusout:false
                    	});

                    	var check = v.form();
		                if(check){
	                    	$("#addMeetingForm").ajaxSubmit({
	                    		dataType : "json",
	                    		success : function(result) {
	                        		if(result=="success"){
	                        			layer.close(modifyMeetingLayer);
	                        			layer.msg("保存成功");
	            		                self.gridrefresh();
	                        		}else{
	                        			layer.msg("保存失败");
	                                	self.gridrefresh();
	                        		}
	        					}
	                    	});
                    	}
    				},
    				btn2: function(){
		            	self.gridrefresh();
		            },
    				cancel: function(){
		            	self.gridrefresh();
		            }
    			});
            }
		},

		//删除列表数据
		deleteMeeting : function(){
			var self = this;
			var model = this.model;
			var id = meetingGridView.getGridSelected('id');

			if(id.length<1){
				layer.msg('请选择删除记录');
			}else{
				var url = model.get('cancelMeetingUrl')+'?ids='+ escape(id.join(','));
                layer.confirm('您确定要删除所选记录吗？', {icon: 3, title:'提示'}, function(index){
				    //do something
				    http.del(url).success(function(data){
				    	layer.msg('删除成功');
				    	self.gridrefresh();
				    }).error(function(err) {
            			layer.msg("删除失败");
    				});
				    layer.close(index);
				});
            }
		},

        // 列表查询
        searchMeetingList:function(){
    	    var self = this;
    	    var model = this.model;
    	    var el = this.$el;
    	    var searchData = $('#searchText').val();
    	    var searchName =new Array;
    	    searchName.push('name');
    	    var param=new Array ;
    	    param.push(searchData);

    	    param =_.object(searchName,param);

    	    meetingGridView.searchGrid(param);
        },

        // 列表刷新
        gridrefresh:function(){
    	    meetingGridView.loadBodyData();
        },

        //编辑会议
		editMeeting : function(){
			var self = this;
			var model = this.model;
			var id = meetingGridView.getGridSelected('id');
			if(id.length!=1){
				layer.msg('请选择一条记录编辑');
			}else{
        		editMeetingLayer = layer.tab({
    				area : ["1000px","600px"],
      			    tab: [{
      			        title: '座位区域管理',
    				    //content : CommnUtil.ajax(model.get('seatAreaListUrl') + '?meeting_id='+id),
    				    content : CommnUtil.ajax(rootPath + '/sys/seatArea/listUI.shtml?id='+id)
      			    }, {
      			        title: '与会角色管理',
      			        content : CommnUtil.ajax(model.get('meetingToRoleListUrl') + '?meeting_id='+id),
      			    }, {
      			        title: '报名页管理',
      			        content : CommnUtil.ajax(rootPath + '/sys/meetingtoitem/list.shtml?meeting_id='+id)
      			    }, {
        			    title: '门票管理',
        			    content : CommnUtil.ajax(rootPath + '/sys/meetingticket/ticket.shtml?meeting_id='+id),
          			}, {
      			        title: '签到页管理',
      			        content : CommnUtil.ajax(rootPath + '/meetingresource/toSigninPageList.shtml?meeting_id='+id)
      			    }, {
      			        title: '报名名单管理',
      			        content: CommnUtil.ajax(rootPath + '/sys/meetingImport/listUI.shtml?id='+id)
      			    }, {
      			        title: '会议提醒管理',
      			      	content: CommnUtil.ajax(rootPath + '/meetingremind/listUI.shtml?id='+id)
      			    }],
    				cancel: function(){
		            	self.gridrefresh();
		            }
    			});
			    $(".layui-layer-tab .layui-layer-content").css("clear","both");
            }
		},

		viewMeeting : function(){
			var self = this;
			var model = this.model;
			var id = meetingGridView.getGridSelected('id');
			var now = new Date().getTime();
			if(id.length!=1){
				layer.msg('请选择一条记录');
			} else{
				viewMeetingLayer = layer.open({
					title: '签到管理',
    				type : 1,
    				closeBtn: 1,
					area : ["1280px","600px"],
					content : CommnUtil.ajax(rootPath + '/meetingregistration/toMeetingRegistrationPage.shtml?meeting_id='+id+'&siginFlag=true')
				});
			}
		},

	});

	return meetingListView;
});

function buildAddLayer(model){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
	};

	$('.form_datetime').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1
    });

	$("#address").click(function() {
		var url = model.get('addressListUrl');
		address = layer.open({
			title : "会议场地列表",
			type : 1,
			closeBtn : 1,
			area : [ "950px", "600px" ],
			content : CommnUtil.ajax(url),
			btn:['确认','关闭'],
            yes: function(index) {
      			if ($("#meeting_address_paging_table tr.selected").length != 1) {
      				layer.msg('请选择一条记录');
      			} else {
      				$("#address_id").val($("#meeting_address_paging_table tr.selected td:eq(1)").attr("title"));
      				$("#address").val($("#meeting_address_paging_table tr.selected td:eq(2)").attr("title"));
      				layer.close(address);
      			}
			}
		});
	});

	$(".new-remove").click(function(){
		$(this).parent().parent().find("input").val("");
	});
}