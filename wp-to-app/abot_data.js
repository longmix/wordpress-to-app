const globalData = {
		weiduke_server_url: 'https://cms.weiduke.com',
		yanyubao_server_url: 'https://yanyubao.tseo.cn',
		yanyubao_basic_config_url: '/openapi/WordpressData/get_option_list',
	
		
		default_sellerid : 'fJxSPaVgj',
		wxa_website_name : 'Wordpress转APP专用号',
		version_str : 'Ver 1.4.1 Build 136',
		version_code : 136,
		
		
		force_sellerid:0,
			
		baidu_smartapp_appid:'17837086',
		
		xiaochengxu_appid: 'wx3b4958c4ec41868f',			//微信小程序的appid
		xiaochengxu_account: 'gh_a95e5a0852aa',				//微信小程序的账号
		weixin_open_platform_appid: 'wx029e1ddb38b4c630',	//微信开放平台中登记的APP对应的appid（务必与manifest中的配置一致）

		default_copyright_text:'延誉宝 @ 版权所有',
		
		//平台相关的配置
		//  current_platform 定义当前的平台，用于服务器端识别
		//  支持 app  mp-weixin mp-baidu  mp-alipay  
		// 百度小程序的发行版记得在 app.json中增加  "useSwanNews": true
		
		//current_platform : 'app-android',
		//current_platform : 'app-ios',
		//current_platform : 'mp-weixin',
		//current_platform : 'mp-baidu',
		//current_platform : 'mp-alipay',
		current_platform : 'h5',
		
		//顶部导航栏背景颜色和文字颜色
		navigationBarBackgroundColor_fixed:1,	//是否固定导航栏颜色
		navigationBar_font_color:"#ffffff",
		navigationBar_bg_color:"#2d96ff",
		
		userInfo: {},
		isGetUserInfo:false,
		isGetOpenid:false,
		openid:'',
		
		
		
		//网站的网址，或者经过延誉宝转换后的网址（小程序平台安全业务域名需要）
		//#ifdef MP-BAIDU | H5
		//wordpress_rest_api_url: 'http://www.tseo.cn',
		//#endif
		
		//#ifndef MP-BAIDU | H5
		//wordpress_rest_api_url: 'https://cms.weiduke.com/openapi/Wordpress/restapi',
		//#endif
		
		wordpress_rest_api_url: 'https://yanyubao.tseo.cn/openapi/Wordpress/restapi',
		//wordpress_rest_api_url: 'http://www.tseo.cn',

		//问题反馈收集表
		url_for_feedback : 'https://cms.weiduke.com/Wap/Selfform/index/token/gwcuuk1411034699/id/298.shtml',
		//微信收款二维码
		img_url_for_weixinpay : 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2017/12/2017120214024867.png',
		//支付宝收款二维码
		img_url_for_alipay : 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2017/12/2017120214024865.jpg',
		
		//隐私协议
		yinsixieyi_url : 'http://cms.weiduke.com/Wap/Index/content/classid/658/token/eblkvm1492166970/id/8172.shtml',
		
		
};

module.exports = {
	globalData,
}
