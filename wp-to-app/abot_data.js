const globalData = {
		weiduke_server_url: 'https://cms.weiduke.com',
		yanyubao_server_url: 'https://yanyubao.tseo.cn',
		yanyubao_basic_config_url: '/openapi/WordpressData/get_option_list',
	
		
		default_sellerid : 'pQNNmSkaq',
		wxa_website_name : '软件开发记',
		version_str : 'Ver 1.8.5 Build 182',
		version_code : 182,
		
		
		force_sellerid:0,
		
		baidu_smartapp_appid:'17837086',		//百度小程序的名称：  延誉宝SaaS云
			
		xiaochengxu_appid: 'wxa36bafa53080cac8',			//微信小程序的appid，软件开发记
		xiaochengxu_account: ' gh_157de81d9528',				//微信小程序的账号
		weixin_open_platform_appid: 'wx029e1ddb38b4c630--',	//微信开放平台中登记的APP对应的appid（务必与manifest中的配置一致）

		default_copyright_text:'延誉宝 @ 版权所有',
		
		//平台相关的配置
		//  current_platform 定义当前的平台，用于服务器端识别
		//  支持 app  mp-weixin mp-baidu  mp-alipay  
		// 百度小程序的发行版记得在 app.json中的根节点增加  "useSwanNews": true
		
		//current_platform : 'app-android',
		//current_platform : 'app-ios',
		current_platform : 'mp-weixin',
		//current_platform : 'mp-baidu',
		//current_platform : 'mp-alipay',
		//current_platform : 'h5',
		
		//问题反馈收集表
		url_for_feedback : '/pages/publish/publish_write?form_type=2&token=gwcuuk1411034699&formid=298',
		img_url_for_weixinpay : 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2017/12/2017120214024867.png',
		img_url_for_alipay : 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2017/12/2017120214024865.jpg',
		
		//顶部导航栏背景颜色和文字颜色
		navigationBarBackgroundColor_fixed:0,	//是否固定导航栏颜色
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
};

module.exports = {
	globalData,
}
