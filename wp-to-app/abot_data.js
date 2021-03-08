const globalData = {
		xiaochengxu_appid: 'wx00d1e2843c3b3f77',
		default_sellerid : 'fJxSPaVgj',
		wxa_website_name : 'Wordpress转APP专用号',
		
		//平台相关的配置
		//  current_platform 定义当前的平台，用于服务器端识别
		//  支持 app  mp-weixin mp-baidu  mp-alipay  
		
		//current_platform : 'app-android',
		//current_platform : 'app-ios',
		current_platform : 'mp-weixin',
		//current_platform : 'mp-baidu',
		//current_platform : 'mp-alipay',
		//current_platform : 'h5',
		
		//问题反馈收集表
		url_for_feedback : 'https://cms.weiduke.com/Wap/Selfform/index/token/gwcuuk1411034699/id/298.shtml',
		img_url_for_weixinpay : 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2017/12/2017120214024867.png',
		img_url_for_alipay : 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2017/12/2017120214024865.jpg',
		
		//顶部导航栏背景颜色和文字颜色
		navigationBarBackgroundColor_fixed:1,	//是否固定导航栏颜色
		wxa_website_nav_font_color:"#ffffff",
		wxa_website_nav_bg_color:"#2d96ff",
		
		userInfo: {},
		isGetUserInfo:false,
		isGetOpenid:false,
		openid:'',
		
		weiduke_server_url: 'https://cms.weiduke.com',
		yanyubao_server_url: 'https://yanyubao.tseo.cn',
		
		//网站的网址，或者经过延誉宝转换后的网址（小程序平台安全业务域名需要）
		//#ifdef MP-WEIXIN
		wordpress_rest_api_url: 'https://cms.weiduke.com/openapi/Wordpress/restapi',
		//#endif
		
		//#ifndef MP-WEIXIN
		wordpress_rest_api_url: 'http://www.tseo.cn',
		//#endif
		
		show_yanyubao_module_list:0
};

module.exports = {
	globalData,
}
