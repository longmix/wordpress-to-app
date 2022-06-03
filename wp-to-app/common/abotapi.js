
//封装为一个方法
const isNullOrUndefined = obj=>obj===null || obj === undefined  || obj === '';

const is_obj_0_or_1= (obj) => {if(obj == 0) return 0; else if(obj == 1) return 1; return -1;}

//const abotRequest ;

module.exports = {
	abotRequest :function (params) {
		
		var __this = this;
	
		console.log('准备请求：' + params.url);
		
		uni.request({
			url: params.url,
			method: params.method || 'POST',
			dataType: params.dataType || 'json',
			data: params.data || {},
			header: {
			  'Content-Type': 'application/x-www-form-urlencoded',
			},
			success(res) {
			  console.log('HTTP Request to ' + params.url);
			  console.log('with data ', params.data);
			  
			  console.log('with data ', params.data);
			  
			  if(res && (JSON.stringify(res).length > 512) ){
				  var res002 = JSON.stringify(res);
				  console.log('get result 001 ==>>', res002.substring(0, 500)+'......' );
			  }
			  else{				  
				  console.log('get result 002 ==>>', res);
			  }
			  
			  //== 2021.7.31. 统一拦拦截超时的接口 ==
			  if(!params.dataType || (params.dataType == 'json')){
				  
				  if(res.data && res.data.code && (res.data.code == -1)){
					  
					  
					  console.log('检测到登录超时，需要重新登录，并登陆后返回到首页。');
					  
					  __this.del_user_info();
					 
					  uni.showModal({
					 	title: '提示',
					 	content:'登录超时，请重新登录',
					 	showCancel: false,
					 	success: function (res) {
							
							var last_url = '/pages/index/index';
							
							__this.goto_user_login(last_url, 'normal');
						},
					 });
					 
					 return; 
				  }
			  }
			  //========== End ====================
			  

			  if (params.success) {
				params.success(res);
			  }
			  
			},
			fail(res) {
			  if (params.fail) {
				params.fail(res);
			  }
			},
			complete(res) {
			  if (params.complete) {
				params.complete(res);
			  }
			},
		});
	},
	
	isNullOrUndefined,

	current_chat_gui:"",
	current_chat_page:"", 		
	current_chat_handle: "",
	
	
		
	socketMsgHandle: function (current_chat_gui, current_chat_page, msg) {
	   //缓存返回数据
	   console.log('current_chat_gui',current_chat_gui)
		  console.log('current_chat_page',current_chat_page)
		  if(current_chat_gui ){		  
			  if(current_chat_page=='/pages/msg/msg'){
				  
				  current_chat_gui.getLastMsg();
				  
			  }	 else if (current_chat_page=='/pages/msg/chat/chat'){
				  
				  current_chat_gui.getNewMsg(msg);
				  
			  } else if (current_chat_page=='/pages/friendInfo/friendList'){
					
				  if(msg.chat_type == 2 || msg.chat_type == 6){
					  
					  current_chat_gui.getFriendList(msg);
				  }				  
				  
			  } else if (current_chat_page=='/pages/friendInfo/friendList') {
					current_chat_gui.getNewMsg(msg);
			  }
				  
		  }	
		  
	 },
	 
	 
	/**
	* 坐标转换，百度地图坐标转换成腾讯地图坐标
	* lng 腾讯经度（pointy）
	* lat 腾讯纬度（pointx）
	* 经度>纬度
	*/
	bMapToQQMap:function (lng, lat) {
	
	    if (lng == null || lng == '' || lat == null || lat == '')
	        return [lng, lat];
	
	    var x_pi = 3.14159265358979324;
	    var x = parseFloat(lng) - 0.0065;
	    var y = parseFloat(lat) - 0.006;
	    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	    var lng = (z * Math.cos(theta)).toFixed(7);
	    var lat = (z * Math.sin(theta)).toFixed(7);
	
	    return [lng, lat];
	
	},
	
	/**
	* 坐标转换，腾讯地图转换成百度地图坐标
	* lng 腾讯经度（pointy）
	* lat 腾讯纬度（pointx）
	* 经度>纬度
	*/
	
	qqMapToBMap:function(lng, lat) {
	
	    if (lng == null || lng == '' || lat == null || lat == '')
	        return [lng, lat];
	
	    var x_pi = 3.14159265358979324;
	    var x = parseFloat(lng);
	    var y = parseFloat(lat);
	    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	    var lng = (z * Math.cos(theta) + 0.0065).toFixed(5);
	    var lat = (z * Math.sin(theta) + 0.006).toFixed(5);
	    return [lng, lat];
	
	},

	set_current_weiduke_token: function (weiduke_token) {
	    if (!weiduke_token) {
			return;
	    }
	
	    console.log("设置weiduke_token：" + weiduke_token);
	
	    //缓存返回数据
	    uni.setStorageSync("current_weiduke_token", weiduke_token);
	},

	get_current_weiduke_token: function () {
	    var weiduke_token = uni.getStorageSync("current_weiduke_token");
	    console.log("获取weiduke_token：" + weiduke_token);
	
	    if (!weiduke_token) {
			weiduke_token = null;
	    }
	
	    return weiduke_token;
	},	
	
	
	toRad: function (d) {
	    return d * Math.PI / 180;
	},
	 
	getDistance: function (lat1, lng1, lat2, lng2) {
		
		var dis = 0;
		var radLat1 = this.toRad(lat1);
		var radLat2 = this.toRad(lat2);
		var deltaLat = radLat1 - radLat2;
		var deltaLng = this.toRad(lng1) - this.toRad(lng2);
		
		var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) *
		Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2),
		2)));
		return dis * 6378137;
	},
	//将两个对象合并
    json_add:function(a,b){
 
        if(a==undefined || a.length==0) return b;
		if(b==undefined || b.length==0) return a;
		
		var s_a=JSON.stringify(a);
		var s_b=JSON.stringify(b);
		var c=s_a.substring(0,s_a.length-1)+","+s_b.substring(1);
		return JSON.parse(c);
	},
	goBack:function(){
		console.log(Router);
		this.$router.go(-1);
	},
	getCookie:function(name){
		// #ifdef H5
		var strcookie = document.cookie;
		var arrcookie = strcookie.split("; ");
		for (var i = 0; i < arrcookie.length; i++) {
			var arr = arrcookie[i].split("=");
			if (arr[0] == name) {
				return arr[1];
			}
		}
		return "";
		// #endif
		
	},
	getAuthCode:function(){
		 
		var authcode=uni.getStorageSync("authcode");
		if(!authcode){
			authcode=this.getCookie("authcode");
		}
		return authcode;
	},
	setAuthCode:function($authcode){
		uni.setStorageSync("authcode",$authcode);
	},
	getAuthCodeLong:function(){
		var authcode=uni.getStorageSync("authcodeLong");
		if(!authcode){
			authcode=this.getCookie("authcodeLong");
		}
		return authcode;
	},
	setAuthCodeLong:function($authcode){
		uni.setStorageSync("authcodeLong",$authcode);
	},
	getLoginCode:function(){
		return uni.getStorageSync("loginCode");
	},
	setLoginCode:function(code){
		uni.setStorageSync("loginCode",code)
	},
	getS2cScid:function(){
		return uni.getStorageSync("s2c_scid");
	},
	setS2cScid:function(v){
		uni.setStorageSync("s2c_scid",v);
	},
	fromapp:function(){
		//var $paltform= uni.platform();
		return "uniapp";
	},
	isWeixin:function(){
		// #ifdef H5
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        }
		// #endif
		return false;
	},
	get:function(ops){
		var ops=ops;
		if(ops.data==undefined){
			ops.data={
				authcode:this.getAuthCode(),
				fromapp:this.fromapp(),
				ajax:1
			};
		}else{
			ops.data.authcode=this.getAuthCode();
			ops.data.fromapp=this.fromapp();
			ops.data.ajax=1;
		}
		
		uni.request({
			url:ops.url,
			method:"GET",
			data:ops.data,
			success:function(rs){
				
				if(rs.data.error==1000){
					uni.navigateTo({
						url:"../../pages/login/index"
					})
				}else{
					ops.success(rs.data);
				}
			}
		})
	},
	post:function(ops){
		var callback=callback;
		var ops=ops;
		if(ops.url.indexOf("?") >= 0){
			ops.url+="&ajax=1&authcode="+this.getAuthCode()+"&fromapp="+this.fromapp();
		}else{
			ops.url+="?ajax=1&authcode="+this.getAuthCode()+"&fromapp="+this.fromapp();
		}
		
		uni.request({
			url:ops.url,
			data:ops.data,
			method:"POST",
			header:{
				"content-type":"application/x-www-form-urlencoded"
			},
			success:function(rs){
				if(rs.data.error==1000){
					uni.navigateTo({
						url:"../../pages/login/index"
					})
				}else{
					ops.success(rs.data);
				}
			}	
		})
	},
	goHome:function(){
		uni.redirectTo({
			url:"../index/index"
		})
		/*
		uni.switchTab({
			url:"../index/index",
		})
		*/
	},
	goCart:function(){
		uni.switchTab({
			url:"../cart/index",
		})
	},
	goUser:function(){
		uni.switchTab({
			url:"../user/index",
		})
	},
	goProduct:function(){
		uni.switchTab({
			url:"../product/index",
		})
	},
	goFenlei:function(){
		uni.switchTab({
			url:"../fenlei/index",
		})
	},
	goLogin:function(){
		uni.navigateTo({
			url:"/pages/login/login.vue"
		})
	},
	goH5WeiXin:function(backurl){
		// #ifdef H5
		var url=document.location.href.split('#')[0]+"#"+backurl;
		window.location=this.apiHost+'/index.php?m=open_weixin&a=Geturl&backurl='+encodeURIComponent(url);
		// #endif
		
	},
	html:function(html){
		if(html==''|| html==null) return '';
		html=html.replace(' style="','  xstyle="');
		html=html.replace(/<img /g,'<img style="max-width:100%;height:auto;"');
		html=html.replace(/&hellip;/g,'');
		html=html.replace(' class="brush:html;toolbar:false"'," ");
		html=html.replace(/<pre /g,'<pre style="border:1px solid #eee;padding:10px;max-height:300px;overflow:auto;" ');
		
		html=html.replace(/<pre /g,"<div ");
		html=html.replace("</pre>","</div>");
		html=html.replace(/\n/g,"<br />");
		html=html.replace(/<iframe /,'<div style="display:none" ');
		html=html.replace(/<\/iframe>/,'</div>');
		html=html.replace("<section ","<div ");
		html=html.replace("</section>","</div>");
		 
		//console.log(html);
		return html;
	},
	
	get_xianmaishang_setting_list: function (callback_function) {
		var that = this;
		console.log('111111111111111 get_xianmaishang_setting_list')
	
	    var xianmaishang_setting_list = uni.getStorageSync("get_xianmaishang_setting_list_str_" + this.globalData.default_sellerid);
		var user_console_setting = uni.getStorageSync("user_console_setting_str_" + this.globalData.default_sellerid);
	
	    if (xianmaishang_setting_list) {
	      
			//刷新界面
			typeof callback_function == "function" && callback_function(user_console_setting,xianmaishang_setting_list);
			return;
	    }
	
	    this.abotRequest({
			url: that.globalData.yanyubao_server_url + '/openapi/XianmaiShangData/get_setting_list',
			method: 'post',
			data: {
				sellerid: that.globalData.default_sellerid
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				
				console.log('sssssss',res);
				if (res.data.code == 1) {
					var xianmaishang_setting_list = res.data.data;
					var user_console_setting = res.data.data.user_console_setting;
	
					uni.setStorageSync('get_xianmaishang_setting_list_str_' + that.globalData.default_sellerid, xianmaishang_setting_list);
					uni.setStorageSync('user_console_setting_str_' + that.globalData.default_sellerid, user_console_setting);
	
	
	
					if (callback_function) {
						typeof callback_function == "function" && callback_function(user_console_setting,xianmaishang_setting_list);
					}
		// 			uni.setStorage({
		// 				key: 'get_xianmaishang_setting_list_str_' + that.globalData.default_sellerid,
		// 				data: xianmaishang_setting_list,
		// 				success: function (res) {
		// 					console.log('异步保存成功');
		
		// 					if (callback_function) {
		// 						typeof callback_function == "function" && callback_function(xianmaishang_setting_list);
		// 					}
		// 				}
		// 			})
	          
				}
			},
			fail: function (e) {
				uni.showToast({
					title: '网络异常！',
					duration: 2000
				});
			},
	    });
	},
	get_xianmaishang_setting_list_remove:function(){		
		uni.removeStorageSync("get_xianmaishang_setting_list_str_" + this.globalData.default_sellerid);
		uni.removeStorageSync("user_console_setting_str_" + this.globalData.default_sellerid);
	},
	get_shop_info_from_server_remove:function(){
		console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
		uni.removeStorageSync("shop_info_from_server_str_" + this.globalData.default_sellerid);
	},
	get_shop_info_from_server: function (callback_function) {
		var that = this;
		console.log('111111111111111 get_shop_info_from_server')
	
	    var shop_list = uni.getStorageSync("shop_info_from_server_str_" + this.globalData.default_sellerid);
	
	    if (shop_list) {
	      
			//刷新界面
			typeof callback_function == "function" && callback_function(shop_list);
			return;
	    }
	
	    this.abotRequest({
			url: that.globalData.yanyubao_server_url + '/openapi/ShopAppV2Data/get_shop_info',
			method: 'post',
			data: {
				sellerid: that.globalData.default_sellerid,
				platform: that.globalData.current_platform
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				if (res.data.code == 1) {
					var shop_list = res.data.data;
					that.globalData.shop_name = shop_list.shop_name;
	
					uni.setStorage({
						key: 'shop_info_from_server_str_' + that.globalData.default_sellerid,
						data: shop_list,
						success: function (res) {
							console.log('异步保存成功');
		
							if (callback_function) {
								typeof callback_function == "function" && callback_function(shop_list);
							}	
						}
					})
	          
				}
			},
			fail: function (e) {
				uni.showToast({
					title: '网络异常！',
					duration: 2000
				});
			},
	    });
	},
	
	
	
	
	set_option_list_str : function (that, callback_function) {
		var that002 = this;
		this.set_shop_option_data(that, function(that, option_data){
			if(option_data && option_data.code && (option_data.code == 1)){
				
				var option_list = option_data.option_list;		
				that002.globalData.option_list = option_list;
				
				
				//刷新界面
				typeof callback_function == "function" && callback_function(that, option_list);
			}
		});
		
	},
	
	set_shop_option_data_remove:function(){
		uni.removeStorageSync('shop_option_data_' + this.globalData.default_sellerid);
	},
	
	set_shop_option_data : function (that, callback_function) {
		//如果不是调试状态
		if(!this.system_debug_flag){
			// #ifdef MP-WEIXIN
			this.globalData.current_platform = 'mp-weixin'
			// #endif
			// #ifdef MP-BAIDU
			this.globalData.current_platform = 'mp-baidu'
			// #endif
			// #ifdef MP-ALIPAY
			this.globalData.current_platform = 'mp-alipay'
			// #endif
			// #ifdef H5
			this.globalData.current_platform = 'h5'
			// #endif
		}
		
		console.log('当前调试开关：' + this.system_debug_flag);
		console.log('当前平台名称：' + this.globalData.current_platform);
		
		
		
		
		var currentTime = (new Date()).getTime();//获取当前时间
				
		if (uni.getStorageSync('shop_option_data_' + this.globalData.default_sellerid) && (currentTime - uni.getStorageSync("shop_option_data_time")) < 3600 * 1000) {
		  
			var option_data = JSON.parse(uni.getStorageSync('shop_option_data_' + this.globalData.default_sellerid));
			
			this.__get_ext_setting_from_server();
			this.__get_and_set_color();

			//刷新界面
			typeof callback_function == "function" && callback_function(that, option_data);
				
		} else {
				
				
			var that002 = this;
			
			var post_data = {
					sellerid: that002.globalData.default_sellerid,
					platform: that002.globalData.current_platform,
					version_code: that002.globalData.version_code,	//2020.12.22.
					xiaochengxu_appid: that002.globalData.xiaochengxu_appid,  //2021.6.10.
					weixin_open_platform_appid:that002.globalData.weixin_open_platform_appid,	//2020.12.28. 
				};
				
			if(that002.globalData.current_template_name){
				post_data.current_template_name = that002.globalData.current_template_name;
			}
			
			if(!that002.globalData.yanyubao_basic_config_url){
				that002.globalData.yanyubao_basic_config_url = '/openapi/ShopAppV2Data/get_shop_option';
			}
				
			this.abotRequest({
				//url: this.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=get_shop_option',
				url: that002.globalData.yanyubao_server_url + that002.globalData.yanyubao_basic_config_url,
				method: 'post',
				data: post_data,
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					var option_data = res.data;
					
					if(option_data.code != 1){
						console.log(that002.globalData.yanyubao_basic_config_url + '错误！！！！！！！======>>>>', res);
						return;
					}
					
					//如果是固定了导航条颜色
					if (that002.globalData.navigationBarBackgroundColor_fixed == 1){
						
						if(that002.globalData.navigationBar_font_color && that002.globalData.navigationBar_bg_color){
							option_data.option_list.wxa_shop_nav_font_color = that002.globalData.navigationBar_font_color;
							option_data.option_list.wxa_shop_nav_bg_color = that002.globalData.navigationBar_bg_color;
						}
						else{
							console.log('保存商城选项数据=========>>>>>但是没有设置这两项，所以导航栏之外无效。');
						}
						
						console.log('保存商城选项数据=========>>>>>固定导航栏背景和文字颜色', option_data);
					}
					
					//2020.12.24. 剪切板功能
					if(option_data && option_data.option_list && (option_data.option_list.share_kouling_status == 1)){
						that002.globalData.share_kouling_status = 1;
						console.log('此项目启用了剪切板功能！！！！！');
					}
					else{
						that002.globalData.share_kouling_status = 0;
						console.log('此项目禁用了剪切板功能！！！！！');
					}
				
					//保存到本地
					var shop_option_data = JSON.stringify(option_data);
				
					//缓存返回数据
					uni.setStorageSync('shop_option_data_' + that002.globalData.default_sellerid, shop_option_data);
					var currentTime = (new Date()).getTime();//获取当前时间
					uni.setStorageSync("shop_option_data_time", currentTime);
				
					console.log('保存商城选项数据=========>>>>>：', option_data);
					
					that002.__get_ext_setting_from_server();
					that002.__get_and_set_color();
					
					
					//判断是否是关闭状态，如果是，跳转到指定page，并显示关站提示。
					if(option_data.shutdown_website_status == 1){
						//跳转到网站关闭的提示页面
						uni.reLaunch({
							url:'/pages/main/shutdown_website'
						})
						return;
					}
					
				
					//刷新界面
					typeof callback_function == "function" && callback_function(that, option_data);
				
				},
				fail: function (e) {
					uni.showToast({
						title: '网络异常！',
						duration: 2000
					});
				},
			});
		}
	},
	
	
	
	set_current_openid: function (openid) {
		if (!openid) {
			return;
		}
				   
		console.log("设置openid：" + openid);
				   
		//缓存返回数据
		uni.setStorageSync("current_openid", openid);
	},
	get_current_openid: function () {
		var openid = uni.getStorageSync("current_openid");
		console.log("获取openid：" + openid);
				   
		if (!openid) {
			openid = null;
		}
				   
		return openid;
	},
	set_user_info: function (user_info) {
		console.log("准备保存用户数据：");
		console.log(user_info);
				   
		var user_info_str = JSON.stringify(user_info);
				   
		//缓存返回数据
		uni.setStorageSync("wxa_user_info", user_info_str);
				   
		//console.log('111111111111111111');
		//console.log(uni.getStorageSync("wxa_user_info"));
	},
	
	
	get_user_info: function () {
		//缓存返回数据
		var user_info_str = uni.getStorageSync("wxa_user_info");
				   
		//console.log("获取小程序用户数据：" + user_info_str + '333333333');
				   
		if (!user_info_str) {
			return null;
		}
				   
		return JSON.parse(user_info_str);
	},
	del_user_info: function () {
		//缓存返回数据
		uni.removeStorageSync("wxa_user_info");
				   
	},
	
	/**
	 * @param {Object} user_account_info
	 * 
	 * {"userid":"106","usersn":"pySyyykae","role_flag":"1","account":"test001","status":"1","mobile":"13112341234","email":"13112341234@163.com","headimgurl":"http:\/\/thirdwx.qlogo.cn\/mmopen\/lBUgNe3635GjPicZOETHbKibq5sMdE1CibT6ltMlY53vzId42hQGodlfdQSRXhvOfJNnub0ujNJSH7kGdNM57Fx5khUItayibWtN\/132","nickname":"\u5c06\u519b","fenxiao_info":{"fenxiaoid":"142","userid":"106","password002":null,"sellerid":"104","parentid":"0","nickname":"\u5c06\u519b","headimgurl":"http:\/\/thirdwx.qlogo.cn\/mmopen\/lBUgNe3635GjPicZOETHbKibq5sMdE1CibT6ltMlY53vzId42hQGodlfdQSRXhvOfJNnub0ujNJSH7kGdNM57Fx5khUItayibWtN\/132","shopname":null,"shopicon":null,"balance":"401525","balance2":"1335722","balance_zengsong":"1600","balance_zengsong2":"55000","balance_hongbao":"0","score":"521","score_sum":"0","status":"1","supplier_sequence":"10","is_delete":"0","is_invite_agree":"1","birthday":"1995-03-06","member_level":"0","member_no":"1041234106131","idcardno":"","sex":"1","email":"","alipay_account":"","alipay_name":"","bank_account":"","bank_name":"","bank_branch":"","bank_company":"","province":"-1","city":"-1","district":"-1","address":"","createtime":"1466583551","createip":"220.248.77.138","updatetime":"1610693768","updateip":"220.248.77.138","shengshiqu":" -  - ","balance_yuan":"4015.25","balance_zengsong_yuan":"16.00","level_id":"10","level_name":"SaaS\u4e91\u4ee3\u7406\u5546","level_memo":"SaaS\u4e91\u4ee3\u7406\u5546"},"extend_info":{"VIPhuiyuan":"","beizhulianxifangshi":""},"extend_info_display":{"VIP\u4f1a\u5458\u7b49\u7ea7":"","\u5907\u6ce8\u8054\u7cfb\u65b9\u5f0f":""},"extend_info_time":"1603249180","balance":"4015.25","balance_zengsong":"16.00","status_count1":"153","status_count2":"68","status_count3":"0","status_count4":"23","status_count_hahading":"4"}
	 * 
	 */
	set_user_account_info: function (user_account_info) {
		console.log("准备保存用户账号数据：");
		console.log(user_account_info);
				   
		var user_account_info_str = JSON.stringify(user_account_info);
				   
		//缓存返回数据
		uni.setStorageSync("user_account_info", user_account_info_str);
				   
	}, 
	

	get_user_account_info: function () {
	   //缓存返回数据
	   var user_account_info_str = uni.getStorageSync("user_account_info");
				   
	   //console.log("获取用户账号数据：" + user_account_info_str + '333333333');
				   
	   if (!user_account_info_str) {
	     return null;
	   }
				   
	   return JSON.parse(user_account_info_str);
	 },
	 
	 
	
	 
	   /**
	    * page_type normal/switchTab
		* 
		* 如果是服务器返回-1（登录超时），调用此函数前务必调用 this.abotapi.del_user_info()
		* 否则会造成死循环。
	    */
	goto_user_login: function (last_url, var_list=null, ret_page=''){
		
		var userInfo = this.get_user_info();
		
		console.log('goto_user_login:');
		console.log(userInfo);
 
		if ((!userInfo) || (!userInfo.userid)) {
 
			uni.showModal({
				title: '提示',
				content:'请先登录',
				showCancel: false,
				success: function (res) {
					
					console.log('准备跳转到登录页面===>>>login_last_url===>>>', last_url);
					console.log('准备跳转到登录页面===>>>login_var_list===>>>', var_list);
					console.log('准备跳转到登录页面===>>>login_ret_page===>>>', ret_page);
	 
					if (last_url) {
						//uni.setStorageSync('last_url', last_url);
						//uni.setStorageSync('page_type', page_type);
						
						
						
						uni.setStorageSync('login_last_url', last_url);
						uni.setStorageSync('login_var_list', var_list);
						uni.setStorageSync('login_ret_page', ret_page);
					}
					/*
					uni.redirectTo({
						 url: '/pages/login/login',
					});*/
					
					uni.navigateTo({
						 url: '/pages/login/login',
					});
			
				}
			})
			
			return ;
			
		}; 
		
		
		this.call_h5browser_or_other_goto_url(last_url, var_list, ret_page);
	
		return;
	},
	
	 /**
	   * page_type normal/switchTab
	   * 获取用户的头像和昵称
	   */
	goto_get_userinfo: function (last_url){
	    var userInfo = this.get_user_info();
	    if (!userInfo){
	      return false;
	    }
	
	    var is_get_userinfo = userInfo.is_get_userinfo;
	    console.log('goto_get_userinfo ====>>>>  is_get_userinfo', is_get_userinfo)
		
	    if (!is_get_userinfo) {
	      if (last_url) {
	        uni.setStorageSync('get_userinfo_last_url', last_url);
	      }
		  
		  //如果不是在微信平台上，获取头像和昵称没有意义，跳转到个人设置界面去补充
		  // #ifndef MP-WEIXIN
		  //单独处理 is_get_userinfo：如果登录的时候已经获取了，那么不再提示设置头像和昵称
		  var user_account_info = this.get_user_account_info();
		  if(user_account_info && user_account_info.fenxiao_info){
			  if(user_account_info.fenxiao_info.nickname && user_account_info.fenxiao_info.headimgurl){
				  userInfo.is_get_userinfo = 1;
				  this.set_user_info(userInfo);
				  
				  return false;
			  }
			
			//否则跳转到个人设置界面
			uni.showModal({
				title:'提示',
				content:'请先设置头像和昵称',
				showCancel:false,
				success:function(res){
					if(res.confirm){
						
					}
					
					uni.navigateTo({
					  url: '/pages/user/setting/setting',
					});
				}
			})
			
			return true;
			 
		  }
		  
		  // #endif
		  
		  
		  
	      // #ifdef MP-WEIXIN
	      uni.navigateTo({
	        url: '/pages/login/login_get_userinfo',
	      });
	
	      return true;
		  // #endif
		  
	    }
	
	    return false;
	},
	
	getUserInfo: function (cb) {
	    var that = this
	    if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
	    } else {
			//读取缓存中的userid checkstr openid
			that.globalData.userInfo = that.get_user_info();
			console.log('当前登录信息：');
			console.log(that.globalData.userInfo);
	
			typeof cb == "function" && cb(that.globalData.userInfo);
	
	    }
	},
	
	
	
	
	check_user_login: function () {
		var user_info_str = uni.getStorageSync("wxa_user_info");
	    console.log("获取小程序用户数据：" + user_info_str);
	    if (user_info_str) {
			var user_info = JSON.parse(user_info_str);
			if (user_info) {
				if (user_info.userid > 0) {
					return;
				}
			}
	    }
		
		    //如果userid等于0,则提示绑定手机号
		    console.log("需要用户登录");
		    uni.navigateTo({
		      url: '/pages/login/login'
		    });
		
		    return true;
	},
	
	
	set_current_parentid: function(parentid){
	    if(!parentid){
			return;
	    }
		
		if(parseInt(parentid) == 0){
			console.log("设置parentid，但是int类型为0 ===>>>" + parentid);
			return;
		}
	
	    console.log("设置parentid：" + parentid);
	
	    //缓存返回数据
		uni.setStorageSync("current_parentid", parentid);
	},
	
	
	
	get_current_parentid: function(){
	    var parentid = uni.getStorageSync("current_parentid");
	    console.log("获取parentid：" + parentid);
	
		if(!parentid){
			parentid = 0;
	    }
	
	    return parentid;
	},
	
	set_sellerid: function (sellerid) {
	    console.log("设置sellerid：" + sellerid);
	
	    //缓存返回数据
	    uni.setStorageSync("current_sellerid", sellerid);
		
		this.globalData.default_sellerid = sellerid;
	},
	
	del_sellerid: function(){
		uni.removeStorageSync('current_sellerid');
	},
	
	get_sellerid: function () {
	    if (this.globalData.force_sellerid == 1){
			return this.globalData.default_sellerid
	    }
		
	    //缓存返回数据
	    var sellerid = uni.getStorageSync("current_sellerid");
	
	    console.log("获取sellerid：" + sellerid);
	
	    if ((sellerid == null) || (sellerid.length == 0)) {
			var that = this
			sellerid = that.globalData.default_sellerid;
			console.log("0000000000000000000获取sellerid不成功，使用默认sellerid：" + that.globalData.default_sellerid + ' ==>>  ' + sellerid);
	    }
	
	    return sellerid;
	},
	
	getColor:function(){
		//这个函数的功能已经被    get_and_set_color 替代，并且在 这个文件中调用，不会被外部使用。
		var shop_option_data = uni.getStorageSync('shop_option_data_' + this.globalData.default_sellerid);
			
		//console.log("获取商城选项数据====：", shop_option_data);
			
		if (!shop_option_data) {
			return null;
		}
		
		var option_data =  JSON.parse(shop_option_data);
		var option_list = option_data.option_list;
		
		return option_list.wxa_shop_nav_bg_color;
	},	
	__get_and_set_color:function(){
		//从本地读取
	    var shop_option_data = uni.getStorageSync('shop_option_data_' + this.globalData.default_sellerid);
	
	    //console.log("获取商城选项数据====：", shop_option_data);
	
	    if (!shop_option_data) {
			//return null;
	
			uni.showToast({
				title: '数据更新中……',
				//icon:'loading'
				duration:2000
			});
	
	
			return;
	    }
	    
	    
	    var option_data =  JSON.parse(shop_option_data);
		
		var option_list = option_data.option_list;
	
	    this.globalData.option_list = option_list;
	
	    console.log('111111111111111111111111111111::' + this.globalData.navigationBarBackgroundColor_fixed);
	
	    if (this.globalData.navigationBarBackgroundColor_fixed != 1){
	
			if (option_list && option_list.wxa_shop_nav_font_color && option_list.wxa_shop_nav_bg_color) {
				
				console.log('oplist-----', option_list.wxa_shop_nav_bg_color);
				
				
				uni.setNavigationBarColor({
					frontColor: option_list.wxa_shop_nav_font_color,
					backgroundColor: option_list.wxa_shop_nav_bg_color,
	
					// animation: {
					//   duration: 40,
					//   timingFunc: 'easeIn'
					// }
				});
			}
			else{
				uni.setNavigationBarColor({
					frontColor: this.globalData.navigationBar_font_color,
					backgroundColor: this.globalData.navigationBar_bg_color,
				});
			}
	    }
		else{
			uni.setNavigationBarColor({
				frontColor: this.globalData.navigationBar_font_color,
				backgroundColor: this.globalData.navigationBar_bg_color,
			});
		}
		
		
		//2020.7.29. 隐藏底部导航的选项
		if(option_list && (option_list.wxa_hidden_tabbar == 1)){
			uni.hideTabBar({
				animation: false,
			});
		}
		else{
			uni.showTabBar({
				animation: false,
			});
		}
	
	    
	    return option_list.wxa_shop_nav_bg_color;
	    /*uni.setTabBarStyle({
	      color: '#858585',
	      selectedColor: option_list.wxa_shop_nav_font_color,
	      backgroundColor: '#ffffff',
	      borderStyle: 'white'
	    })*/
	  
	},
	__get_ext_setting_from_server:function(){
		
		var shop_option_data = uni.getStorageSync('shop_option_data_' + this.globalData.default_sellerid);
			
		
			
		if (!shop_option_data) {
			//return null;
			
			uni.showToast({
				title: '数据更新中……',
				//icon:'loading'
				duration:2000
			});
			
			
			return;
		}
		
		
		var option_data =  JSON.parse(shop_option_data);
		
		var option_list = option_data.option_list;
		
		//console.log("__get_ext_setting_from_server 获取商城选项数据====：", option_list);
		
		
		
		if (option_list.kefu_telephone) {
		  this.globalData.kefu_telephone = option_list.kefu_telephone;
		}
		if (option_list.kefu_qq) {
		  this.globalData.kefu_qq = option_list.kefu_qq;
		}
		if (option_list.kefu_website) {
		  this.globalData.kefu_website = option_list.kefu_website;
		}
		if (option_list.kefu_gongzhonghao) {
		  this.globalData.kefu_gongzhonghao = option_list.kefu_gongzhonghao;
		}
		
		
		if (option_list.copyright_text) {
			
		  this.globalData.default_copyright_text = option_list.copyright_text;
		  
		  console.log('this.globalData.default_copyright_text ==>> ', this.globalData.default_copyright_text);
		}
		
		//首页
		this.globalData.is_index_index_in_tabbar = is_obj_0_or_1(this.globalData.is_index_index_in_tabbar);
		//会员中心
		this.globalData.is_tabbar_user_in_tabbar = is_obj_0_or_1(this.globalData.is_tabbar_user_in_tabbar);
		
		//购物车在底部导航栏（如果购物车在底部导航栏，请务必选择此项，避免向购物车跳转失败）
		this.globalData.is_shop_cart_in_tabbar = is_obj_0_or_1(this.globalData.is_shop_cart_in_tabbar);
		
		//商品分类是否在底部导航
		this.globalData.is_category_category_in_tabbar = is_obj_0_or_1(this.globalData.is_category_category_in_tabbar);
		
		//判断发布的栏目在底部导航  1就是在底部导航
		this.globalData.is_publish_index_in_tabbar = is_obj_0_or_1(this.globalData.is_publish_index_in_tabbar);
		//判断文章列表在底部导航   1就是在底部导航
		this.globalData.is_publish_list_in_tabbar = is_obj_0_or_1(this.globalData.is_publish_list_in_tabbar);
		
		//2020.10.27.
		//会员列表（在壹道助残这个小程序中用到）
		this.globalData.is_member_list_in_tabbar = is_obj_0_or_1(this.globalData.is_member_list_in_tabbar);
		//实体商家列表（附近商家列表）
		this.globalData.is_xianmai_shang_list_in_tabbar = is_obj_0_or_1(this.globalData.is_xianmai_shang_list_in_tabbar);
		
		console.log('this.globalData.is_index_index_in_tabbar===>>>'+this.globalData.is_index_index_in_tabbar);
		console.log('option_list.is_index_index_in_tabbar===>>>'+option_list.is_index_index_in_tabbar);
		
		if ((this.globalData.is_index_index_in_tabbar == -1) && !isNullOrUndefined(option_list.is_index_index_in_tabbar)) {
		  this.globalData.is_index_index_in_tabbar = option_list.is_index_index_in_tabbar;
		}
		if(!this.globalData.is_index_index_in_tabbar){
			this.globalData.is_index_index_in_tabbar = 0;
		}
		
		if ((this.globalData.is_tabbar_user_in_tabbar == -1) && !isNullOrUndefined(option_list.is_tabbar_user_in_tabbar)) {
		  this.globalData.is_tabbar_user_in_tabbar = option_list.is_tabbar_user_in_tabbar;
		}
		if(!this.globalData.is_tabbar_user_in_tabbar){
			this.globalData.is_tabbar_user_in_tabbar = 0;
		}

		if ((this.globalData.is_shop_cart_in_tabbar == -1) && !isNullOrUndefined(option_list.is_shop_cart_in_tabbar)) {
		  this.globalData.is_shop_cart_in_tabbar = option_list.is_shop_cart_in_tabbar;
		}
		if(!this.globalData.is_shop_cart_in_tabbar){
			this.globalData.is_shop_cart_in_tabbar = 0;
		}
		
		//商品分类 这个页面的标记，服务器端和VUE端的变量名称不一致
		if ((this.globalData.is_category_category_in_tabbar == -1) && !isNullOrUndefined(option_list.is_category_index_in_tabbar)) {
		  this.globalData.is_category_category_in_tabbar = option_list.is_category_index_in_tabbar;
		}
		if(!this.globalData.is_category_category_in_tabbar){
			this.globalData.is_category_category_in_tabbar = 0;
		}
		
		if ((this.globalData.is_publish_index_in_tabbar == -1) && !isNullOrUndefined(option_list.is_publish_index_in_tabbar)) {
		  this.globalData.is_publish_index_in_tabbar = option_list.is_publish_index_in_tabbar;
		}
		if(!this.globalData.is_publish_index_in_tabbar){
			this.globalData.is_publish_index_in_tabbar = 0;
		}
		
		if ((this.globalData.is_publish_list_in_tabbar == -1) && !isNullOrUndefined(option_list.is_publish_list_in_tabbar)) {
		  this.globalData.is_publish_list_in_tabbar = option_list.is_publish_list_in_tabbar;
		}
		if(!this.globalData.is_publish_list_in_tabbar){
			this.globalData.is_publish_list_in_tabbar = 0;
		}
		
		if ((this.globalData.is_member_list_in_tabbar == -1) && !isNullOrUndefined(option_list.is_member_list_in_tabbar)) {
		  this.globalData.is_member_list_in_tabbar = option_list.is_member_list_in_tabbar;
		}
		if(!this.globalData.is_member_list_in_tabbar){
			this.globalData.is_member_list_in_tabbar = 0;
		}
		
		if ((this.globalData.is_xianmai_shang_list_in_tabbar == -1) && !isNullOrUndefined(option_list.is_xianmai_shang_list_in_tabbar)) {
		  this.globalData.is_xianmai_shang_list_in_tabbar = option_list.is_xianmai_shang_list_in_tabbar;
		}
		if(!this.globalData.is_xianmai_shang_list_in_tabbar){
			this.globalData.is_xianmai_shang_list_in_tabbar = 0;
		}
		
		
		
	},
	
	
	getFaquanSetting: function (that, callback_function) {
		var currentTime = (new Date()).getTime();//获取当前时间
	
		if (uni.getStorageSync("cms_faquan_setting") && (currentTime - uni.getStorageSync("cms_faquan_setting_time")) < 3600 * 1000) {
	
			var cms_faquan_setting = JSON.parse(uni.getStorageSync("cms_faquan_setting"))
	
			//this.globalData.cms_faquan_setting = cms_faquan_setting;
			console.log(' this.globalData.option_list===========', cms_faquan_setting)
			//刷新界面
			typeof callback_function == "function" && callback_function(that, cms_faquan_setting);
	
			return;
	    } 
	
	    var that002 = this;
	
	    this.abotRequest({
			url: that002.globalData.yanyubao_server_url + '/openapi/FaquanData/get_faquan_setting',
			method: 'post',
			data: {
				sellerid: that002.globalData.default_sellerid
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				var cms_faquan_setting = res.data.data;
				//保存到本地
				var cms_faquan_setting_str = JSON.stringify(cms_faquan_setting);
		
				//缓存返回数据
				uni.setStorageSync("cms_faquan_setting", cms_faquan_setting_str);
				var currentTime = (new Date()).getTime();//获取当前时间
				uni.setStorageSync("cms_faquan_setting_time", currentTime);
		
				console.log('保存乖乖兽选项：' + cms_faquan_setting_str);
		
				//刷新界面
				typeof callback_function == "function" && callback_function(that, cms_faquan_setting);
		
			},
			fail: function (e) {
				uni.showToast({
					title: '网络异常！',
					duration: 2000
				});
			},
	    });
	
	},

	
	
	
	set_o2o_basic_data_option_str: function (that, callback_function) {
	
	    var currentTime = (new Date()).getTime();//获取当前时间
	
	    console.log('uni.getStorageSync("o2o_basic_data_option_str")', uni.getStorageSync("o2o_basic_data_option_str"),'88888')
	    if (uni.getStorageSync("o2o_basic_data_option_str") && (currentTime - uni.getStorageSync("o2o_basic_data_option_str_time")) < 3600 * 1000) {
	
			var o2o_basic_data_option = JSON.parse(uni.getStorageSync("o2o_basic_data_option_str"))
	
			this.globalData.o2o_basic_data_option = o2o_basic_data_option;
			console.log(' this.globalData.o2o_basic_data_option===========', this.globalData.o2o_basic_data_option)
			//刷新界面
			typeof callback_function == "function" && callback_function(that, o2o_basic_data_option);
	
	    } else {
			var that002 = this;
	
			this.abotRequest({
				url: this.globalData.yanyubao_server_url + '/openapi/O2OAddressData/get_basic_data_option',
				method: 'post',
				data: {
					sellerid: this.globalData.default_sellerid
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					var o2o_basic_data_option = res.data;
		
					that002.globalData.o2o_basic_data_option = o2o_basic_data_option;
		
		
					//保存到本地
					var o2o_basic_data_option_str = JSON.stringify(o2o_basic_data_option);
		
					//缓存返回数据
					uni.setStorageSync("o2o_basic_data_option_str", o2o_basic_data_option_str);
					var currentTime = (new Date()).getTime();//获取当前时间
					uni.setStorageSync("o2o_basic_data_option_str_time", currentTime);
		
					console.log('保存商城选项：' + o2o_basic_data_option_str);
		
					//刷新界面
					typeof callback_function == "function" && callback_function(that, o2o_basic_data_option);
		
				},
				fail: function (e) {
					uni.showToast({
						title: '网络异常！',
						duration: 2000
					});
				},
			});
		}
	},
	
	
	httpPost: function (url, data, cbSuccess, cbError) {
	    console.log('准备请求网址：：：：' + url);
		console.log(data);
	
	    //发起网络请求
	    this.abotRequest({
			url: url,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "POST",
			data: data,
			success: function (request_res) {
				console.log('请求成功，返回内容如下：：：：');
				console.log(request_res);
	
				typeof cbSuccess == "function" && cbSuccess(request_res);
			},
			fail: function (request_res) {
				console.log('请求失败，返回内容如下：：：：');
				console.log(request_res);
				typeof cbError == "function" && cbError(request_res);
			},
			complete: function () {
				console.log('请求完成' + url);
			}
	    })
	
	},
	
	
	
	
	
			//调用H5browser打开网页
    call_h5browser_or_other_goto_url: function (url, var_list=null, ret_page='') {
		console.log('call_h5browser_or_other_goto_url : url :'+ url);
		console.log('call_h5browser_or_other_goto_url : var_list :', var_list);
   
		if (url.indexOf("%ensellerid%") != -1) {
			url = url.replace('%ensellerid%', this.get_sellerid());
		}
   
		if (url.indexOf("%wxa_appid%") != -1) {
			url = url.replace('%wxa_appid%', this.globalData.xiaochengxu_appid);
		}
   
		if (url.indexOf("%wxa_openid%") != -1) {
			url = url.replace('%wxa_openid%', this.get_current_openid());
		}
		
		if((url.indexOf("%oneclicklogin%") != -1) || (url.indexOf("%refresh_token%") != -1)) {
			var userInfo = this.get_user_info();
			if(!userInfo){
				
				this.goto_user_login('/pages/index/index');
				
				return;
			}
			
			console.log('call_h5browser_or_other_goto_url ===>>>获取oneclicklogin 的值 ');
			
			var that = this;
			
			var new_url = this.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=one_click_login_str';
			
			if (url.indexOf("%refresh_token%") != -1){
				new_url = this.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=generate_refresh_token_value_for_other_system';
			}
			
			this.abotRequest({
				url: new_url,
				method: 'post',
				data: {
				  sellerid: this.get_sellerid(),
				  checkstr: userInfo.checkstr,
				  userid: userInfo.userid
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},		
				success: function (res) {
				  //--init data        
				  var code = res.data.code;
				  if (code == 1) {
					  
					if(res.data.oneclicklogin){
						url = url.replace('%oneclicklogin%', encodeURIComponent(res.data.oneclicklogin));
					}
					
					if (res.data.refresh_token){
					  url = url.replace('%refresh_token%', encodeURIComponent(res.data.refresh_token));
					}
		
					that.call_h5browser_or_other_goto_url(url, var_list, ret_page);
				  }
				},
				fail: function (res) {
		
				}
			 });
		
			 return;
		}
			
   
		//判断各种跳转条件
		if (url.indexOf('switchTab') == 0) {
			
			var arr = url.split(" ");
			if (arr.length >= 2) {
				var new_url = arr[1];
				uni.switchTab({
					url: new_url,
				})
			}
		}
		else if (url.indexOf('navigateTo') == 0) {
			
			var arr = url.split(" ");
			if (arr.length >= 2) {
				var new_url = arr[1];
				uni.navigateTo({
					url: new_url
				})
			}
		}
		else if (url.indexOf('redirectTo') == 0) {
		  var arr = url.split(" ");
	
		  console.log('redirectTo ========>>>> ', arr);
	
		  if (arr.length >= 2) {
			var new_url = arr[1];
			uni.redirectTo({
			  url: new_url,
			})
		  }
		}
		else if ((url == '/pages/index/index') || (url == '/pages/category/category') 
			|| (url == '/pages/cart/cart') || (url == '/pages/tabbar/user') 
			||(url == '/pages/publish/publish_index')||(url == '/pages/publish/publish_list')
			|| (url == '/pages/member/list') || (url == '/pages/shopList/shopList')) {
				
			
			console.log('spec url=====>>>>>>>'+url);
				
			if((url == '/pages/index/index') && (this.globalData.is_index_index_in_tabbar == 1)){
				console.log('is_index_index_in_tabbar====>>>>', this.globalData.is_index_index_in_tabbar);
				
				uni.switchTab({
					url: url,
				})
			}
			else if((url == '/pages/category/category') && (this.globalData.is_category_category_in_tabbar == 1)){
				uni.switchTab({
					url: url,
				})
			}
			else if((url == '/pages/cart/cart') && (this.globalData.is_shop_cart_in_tabbar == 1)){
				uni.switchTab({
					url: url,
				})
			}
			else if((url == '/pages/tabbar/user') && (this.globalData.is_tabbar_user_in_tabbar == 1)){
				console.log('is_tabbar_user_in_tabbar====>>>>', this.globalData.is_tabbar_user_in_tabbar);
				
				uni.switchTab({
					url: url,
					success: (res) => {
						console.log('success ==>>');
						console.log(res);
					},
					fail: (res) => {
						console.log('fail ==>>');
						console.log(res);
					}
				})
			}
			else if((url == '/pages/publish/publish_index') && (this.globalData.is_publish_index_in_tabbar == 1)){
				uni.switchTab({
					url: url,
				})
			}
			else if((url == '/pages/publish/publish_list') && (this.globalData.is_publish_list_in_tabbar == 1)){
				uni.switchTab({
					url: url,
				})
			}
			else if((url == '/pages/member/list') && (this.globalData.is_member_list_in_tabbar == 1)){
				uni.switchTab({
					url: url,
				})
			}
			else if((url == '/pages/shopList/shopList') && (this.globalData.is_xianmai_shang_list_in_tabbar == 1)){
				uni.switchTab({
					url: url,
				})
			}
			else{
				
				//console.log('url=====不是switchTab，使用 redirectTo 跳转>>>>>>>'+url);
				console.log('url=====不是switchTab，使用 navigateTo 跳转>>>>>>>'+url);
				
				uni.navigateTo({				
					url:url
				})
			}
			
			
		}
		else if (url == '/pages/help/detail') {
			var browser_cache_id = uni.getStorageSync('browser_cache_id');
			if (browser_cache_id) {
				uni.navigateTo({
					url: url + '?id=' + browser_cache_id,
				})
			} else {
				uni.showToast({
					title: '无浏览记录',
				})
			}
		}
		else if (url == 'duorenpintuan') {
			
			var url1 = 'https://yanyubao.tseo.cn/Home/DuorenPintuan/pintuan_list/ensellerid/' + this.get_sellerid() + '.html?click_type=Wxa';
			uni.navigateTo({
				url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1) + '&ret_page=' + ret_page,
			})
		} else if (url == 'fenxiangkanjia') {
			
			var productid = 0;
			if (var_list && var_list.productid) {
   
				var url1 = 'https://yanyubao.tseo.cn/Home/ShareKanjia/share_list/productid/' + var_list.productid + '.html?click_type=Wxa';
				uni.navigateTo({
					url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1) + '&ret_page=' + ret_page,
				})
   
			}
   
		} 
		else if ((url.indexOf('http://') == 0)
			||(url.indexOf('https://') == 0)
			||(url.indexOf('/hybrid/html/') == 0)) {
				
			console.log('abotapi.js call_h5browser_or_other_goto_url ==>> 准备跳转网址：'+url);
			
			if((this.globalData.current_platform == 'mp-weixin')
				||(this.globalData.current_platform == 'mp-baidu')
				||(this.globalData.current_platform == 'mp-alipay')){
				//如果是小程序平台的本地hybrid请求
				if(url.indexOf('/hybrid/html/') == 0){
					uni.showToast({
						title:'不合法本地路径'
					})
					
					return;
				}
				
				
				var is_domain_in_allow_list = false;
				
				console.log('call_h5browser_or..==>>this.globalData==>>', this.globalData);
				
				
				if(this.globalData.option_list 
					&& (this.globalData.option_list.wxa_domain_allow_list)){
						
					for(var ii=0; ii<this.globalData.option_list.wxa_domain_allow_list.length; ii++){
						if(url.indexOf(this.globalData.option_list.wxa_domain_allow_list[ii]) == 0){
							is_domain_in_allow_list = true;
							break;
						}
					}	
				}
				else{
					is_domain_in_allow_list = true;
				}
				
				
				if(!is_domain_in_allow_list){
					uni.setClipboardData({
						data: url,
						success: function () {
						    console.log('小程序中将链接复制到剪切板');
							
							uni.showToast({
								title:'链接已经复制'
							})
						}
					})
					
					return;
				}
				
			}
			
			var new_url = '/pages/h5browser/h5browser?url=' + encodeURIComponent(url);
			if(ret_page){
				new_url +=  '&ret_page=' + ret_page;
			}
			
			if (url.indexOf('#redirectTo') != -1){
				//如果指定了跳转方式为 #redirectTo
				url = url.replace(/#redirectTo/, '');
				uni.redirectTo({
					url: new_url,
				})
			}
			else{
				uni.navigateTo({
					url: new_url,
				})
			}
		}
		else if (url.indexOf('miniprogram') == 0) {
			
			var arr = url.split(" ");
			if (arr.length >= 3) {
				var appid = arr[2];
				var pagepath = arr[3];
				var extraData = null;
				
				if (arr[4]) {
					extraData = arr[4];
				}
	   
				var extraData_obj = null;
				if (extraData) {
					extraData_obj = JSON.parse(extraData);
				}
	   
				//console.log('1111111111111', extraData)
				
				// #ifdef APP-PLUS
					plus.share.getServices(
						function(res){ 
							var sweixin = null;  
							for(var i=0;i<res.length;i++){  
								var t = res[i];  
								
								//查找服务名称为 weixin  的service
								if(t.id != 'weixin'){  
									continue;
								}
								
								sweixin = t;
								
								var xiaochengxu_account = appid;
								
								uni.showModal({
									title:'提示',
									content:'即将跳转微信',
									showCancel:false,
									success(res) {
										//唤醒微信小程序  type 可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。 
										sweixin.launchMiniProgram({
											id: xiaochengxu_account,
											path:pagepath,
											type: 0,
											webUrl:'https://www.abot.cn'
										});
										
										uni.navigateBack({
											delta:1
										})
									}
								});
								
								return;
								
							}
							
							if(!sweixin){
								uni.showModal({
									title:'没有找到微信',
									content:'唤起微信支付失败',
									success(res) {
										if(res.confirm){
										}
									}
								});
								
							}  
						},
						function(res){  
							console.log(JSON.stringify(res));
							
							uni.showToast({
								title:'没有检测到微信'
							})
						}
					);
					
				
				// #endif
				
				// #ifdef MP
					uni.navigateToMiniProgram({
						appId: appid,
						envVersion: 'release',
						path: pagepath,
						extraData: extraData_obj,
						success(res) {
							// 打开成功
						},
						fail: function (res) {
							uni.showModal({
								title: '跳转小程序失败',
								content: res.errMsg,
								showCancel: false
							})
						   
							console.log('跳转小程序失败：', res);
						}
					})
				
				// #endif
	   
				
			}
		}
		else if (url.indexOf('tel:') == 0) {
		  url = url.replace(/tel:/, '');
			
		  uni.makePhoneCall({
			phoneNumber: url,
		  })
		}
		else if (url.indexOf('wxa_api') == 0){
			//如果是执行微信小程序的api接口
			var arr = url.split(" ");
			if (arr.length < 2) {
				return;
			}
			
			// #ifdef APP-PLUS
				//通过plus向微信小程序跳转
				
				//跳转到小程序中的网址
				var wxa_path = 'pages/h5browser/h5browser';
				
				//读取所有的参数
				wxa_path = wxa_path + '?url=' + encodeURIComponent(url);
				
				console.log('即将跳转到微信小程序中去执行接口===>>>>'+ url);
				
				var __this = this; 
				
				plus.share.getServices(
					function(res){ 
						var sweixin = null; 
						
						
						 
						for(var i=0;i<res.length;i++){  
							var t = res[i];  
							if(t.id == 'weixin'){  
								sweixin = t;
								
								uni.showModal({
									title:'提示',
									content:'即将跳转到微信',
									showCancel:false,
									success(res) {
										//唤醒微信小程序  type 可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。 
										sweixin.launchMiniProgram({
											id: __this.globalData.xiaochengxu_account,
											path:wxa_path,
											type: 0,
											webUrl:'https://www.abot.cn'
										});
										
										uni.navigateBack({
											delta:1
										})
									}
								});
								
								return;
							}  
						}
						
						if(!sweixin){
							uni.showModal({
								title:'没有找到微信服务',
								content:'唤起手机中的微信',
								success(res) {
									if(res.confirm){
									}
								}
							});
							
						}  
					},
					function(res){  
						console.log('没有检测到微信' + JSON.stringify(res));
						
						uni.showToast({
							title:'没有检测到微信'
						})
					}
				);
				
			// #endif
			
			// #ifdef MP-WEIXIN
				var api_name = arr[1];
				//var api_params = JSON.parse(arr[2]);
				
				if(api_name == 'openChannelsActivity'){
					//打开视频号视频
					var finderUserName = arr[2];
					var feedId = arr[3];
					
					wx.openChannelsActivity({
						finderUserName: finderUserName,
						feedId: arr[3],
						success:function(){
							console.log('打开视频号视频成功');
						},
						fail:function(res){
							console.log('打开视频号视频失败');
							
							uni.showModal({
								title:'失败',
								content:JSON.stringify(res),
								showCancel:false
								
							});
						},
						complete:function(){
							console.log('打开视频号视频结束');
						}
						
					});
				}
				else if(api_name == 'openChannelsEvent'){
					//打开视频号活动页
					var finderUserName = arr[2];
					var feedId = arr[3];
					
					wx.openChannelsEvent({
						finderUserName: finderUserName,
						eventId: arr[3],
						success:function(){
							console.log('打开视频号活动页成功');
						},
						fail:function(res){
							console.log('打开视频号活动页失败');
							
							uni.showModal({
								title:'失败',
								content:JSON.stringify(res),
								showCancel:false
								
							});
						},
						complete:function(){
							console.log('打开视频号活动页结束');
						}
						
					});
				}
				else if(api_name == 'openChannelsLive'){
					//打开视频号直播
					var finderUserName = arr[2];
					
					wx.getChannelsLiveInfo({
						finderUserName: finderUserName,
						success:function(res){
							console.log('获取直播信息成功', res);
							
							if(res && (res.status == 2)){
								//直播进行中
								
								
								wx.openChannelsLive({
									finderUserName: finderUserName,
									success:function(){
										console.log('打开视频号直播成功');
									},
									fail:function(res){
										console.log('打开视频号直播失败');
										
										uni.showModal({
											title:'失败',
											content:JSON.stringify(res),
											showCancel:false
											
										});
									},
									complete:function(){
										console.log('打开视频号直播结束');
									}
									
								});
								
								
								
							}
							else{
								uni.showModal({
									title:'提示',
									content:'直播已经结束',
									showCancel:false
								})
							}
							
							
						},
						fail:function(res){
							console.log('获取直播信息失败', res);
							
							uni.showModal({
								title:'失败',
								content:'没有获取到直播信息',
								showCancel:false
								
							});
						}
					});
					
					
					
				}
				else if(api_name == 'openChannelsUserProfile'){
					//打开视频号主页
					var finderUserName = arr[2];
					
					wx.openChannelsUserProfile({
						finderUserName: finderUserName,
						success:function(){
							console.log('打开视频号主页成功');
						},
						fail:function(res){
							console.log('打开视频号主页失败');
							
							uni.showModal({
								title:'失败',
								content:JSON.stringify(res),
								showCancel:false
								
							});
						},
						complete:function(){
							console.log('打开视频号主页结束');
						}
						
					});
				}
			// #endif
			
			// #ifndef APP-PLUS | MP-WEIXIN
				uni.showModal({
					title: '提示',
					content: '暂不支持此功能',
					showCancel:false
				})
			// #endif
			
			
			
		}
		
		else {
			uni.navigateTo({
				url: url
			})
		}
		
		console.log('call_h5browser_or_other_goto_url 执行完毕');
   
	},
	
	jump_to_fankui_url:function(){
		let url
		this.set_option_list_str(this,function(that,cb_params){
			url = '/pages/publish/publish_write?form_type=2&token='+cb_params.cms_token+'&formid='+cb_params.fankui_form_id;	
		});
		return url;
	},
	
	// 清除缓存
	clearStorage:function(){
		uni.removeStorageSync('shop_option_data_' + this.globalData.default_sellerid);
		uni.removeStorageSync("coordinate_array");
		uni.removeStorageSync("cata_list");
		uni.removeStorageSync("spec_list");
		
		uni.removeStorageSync('all_shang_jingwei_list');
			
	    uni.removeStorage({
	      key: 'latestMsgList_cache',
	      success(res) {
	        uni.showToast({
	          icon: 'none',
	          title: '清除成功',
	        })
	      }
	    })
	
	    uni.removeStorage({
	      key: 'friendList_cache',
	      success(res) {
	        uni.showToast({
	          icon: 'none',
	          title: '清除成功',
	        })
	      }
	    }) 
		
		uni.removeStorage({
		  key: 'shop_info_from_server_str_' + this.get_sellerid(),
		  success(res) {
		    uni.showToast({
		      icon: 'none',
		      title: '清除成功',
		    })
		  }
		}) 
	  },
	
	
}
