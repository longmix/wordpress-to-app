==项目概况

====项目主页

项目的设置和使用说明发布在这里：
https://yanyubao.tseo.cn/Supplier/WordpressMgr/index/setting_type/source_code.html
需要注册用户才能访问，使用手机号码登录即可。

====最新代码

最新的代码发布在Github上，喜欢记得点个小星星！
https://github.com/longmix/wordpress-to-app


==项目设置说明

====服务器：设置说明

1、下载Wordpress插件，包括“WP转APP和小程序”和“WP-PostViews”两个插件，并在后台启用，
如下图所示：
WP后台插件列表截图

下载插件“WP转APP和小程序”： https://yanyubao.tseo.cn/download/wordpress-plugin/yanyubao-wp-to-app.zip
下载插件“WP-PostViews”：https://yanyubao.tseo.cn/download/wordpress-plugin/wp-postviews.zip

2、在Wordpress后台的路径“设置>>网站转APP设置”中，
（1）填写延誉宝商户编号“pQNNmSkaq”，如上图，如果没有编号，登录延誉宝后台获取。
（2）设置默认的文章分类的封面，如上图。

3、在Wordpress后台的路径“文章>>分类目录”中，增加或编辑某个目录的时候，设置目录封面，也可以自定义封面，如下图。 WP后台插件列表截图

4、设置电子会员卡，路径为：“信息中心>>电子会员卡”。
电子会员卡的设置非常简单，帮助手册是针对不懂技术的用户制作的，查看地址为： http://www.abot.cn/627.html，所以对于开发者来说，属于傻瓜文档！


====源代码：自定义开发和重新编译

1、下载项目源代码：（uniapp网站或github或延誉服务器下载）

2、在HBuilder X中打开项目。

3、修改配置：
（1）在项目根目录下，打开pages.json，找到 navigationBarTitleText 将值改为自己的网站名称，还可以自定义标题文字的颜色和顶部导航的背景色。
（2）打开common/abotapi.js，
修改 default_sellerid 为自己的延誉宝商户编号；
修改xiaochengxu_appid为自己的小程序appid；
修改current_platform为当前要发布的平台名称，可以设置的值有： app， h5， mp-weixin， mp-alipay， mp-baidu。

备注：微信小程序、百度智能小程序、支付宝小程序对应的appid各不相同，请不要填错了。

4、通过 HBuilder X将项目导入到不同的小程序开发环境中编译并提交发布。


==链接设置说明

====小程序内链接设置

跳转文章列表 /pages/list/list?categoryID=1234，categoryID为分类ID，可以在Wordpress网站后台找到。
跳转文章详情 /pages/tabBar/index/detail?id=1234，id为文章ID，可以在Wordpress网站后台找到。
按关键词搜索文章 /pages/list/list?search=abcd，abcd为搜索的关键词，需要做URL编码。
个人资料页面（有退出登录的按钮） /pages/userinfo/userinfo ，可以修改个人资料，也可以退出登录
修改账号和密码 /pages/usersetting/usersetting?account=1 可以从个人资料页面跳转过来，也可以直接挂接。
修改昵称 /pages/usersetting/usersetting?nickname=1 可以从个人资料页面跳转过来，也可以直接挂接。
修改手机号 /pages/usersetting/usersetting?mobile=1 可以从个人资料页面跳转过来，也可以直接挂接。
“关于”页面 switchTab pages/tabBar/about/about，需要增加 switchTab，没有其他特殊要求。


====Tab页面和非Tab页面跳转

如果页面被tabBar包含，那么跳转的时候，需要指定，具体格式为：
switchTab [pagepath]
用空格分开，switchTab跳转的页面，不能带任何多余的参数，即不可以出现“?”及其后面的内容。
例如：跳转到用户中心的链接，可以设置为    switchTab /pages/tabBar/usercenter/usercenter
例如：跳转到关于页面的链接，可以设置为    switchTab pages/tabBar/about/about

如果页面没有被tabBar包含，那么跳转的时候，需要指定，具体格式为：
navigateTo [pagepath]
用空格分开，navigateTo跳转的页面，可以带参数，参数放在“?”后面。

====跳转到H5页面链接设置

跳转到H5页面，直接填写https://开头的网址，需要说明的是，对应的域名必须是在小程序登记的业务域名中，否则无法显示页面。
http链接中支持的变量有：%oneclicklogin%， %ensellerid%， %wxa_appid%， %wxa_openid%。
%oneclicklogin%一键登录获取用户信息参数， %ensellerid%商户编码， %wxa_appid%小程序appid， %wxa_openid%微信公众号粉丝openid。

跳转到“我的余额” https://yanyubao.tseo.cn/User/agent_income.html?oneclicklogin=%oneclicklogin%
跳转到“我的赠款” https://yanyubao.tseo.cn/User/my_balance_zengsong.html?oneclicklogin=%oneclicklogin%
跳转到“我的积分” https://yanyubao.tseo.cn/User/score.html?oneclicklogin=%oneclicklogin%

嵌入H5网页的时候，如果页面内设置了头部导航栏，会与小程序默认的导航栏重复，影响页面美观；在延誉宝系统的H5页面中，我们都做了自动判断，如果被小程序中引用，会自动隐藏H5的导航栏； 如果是在APP中引用延誉宝的H5，请在页面网址中增加参数“hidden_nav_header_h5=1”以达到隐藏的目的。

====跳转到其他小程序链接设置

跳转到其他小程序，使用填写以下格式：
miniprogram [url] [appid] [pagepath] [extraData]
用空格分开，
[url]替换为网址，[appid]替换为要跳转的小程序，
[pagepath]替换为小程序的路径，可以包含参数，如 /pages/detail/detail?id=1577
[extraData]为模板小程序应用级别的参数（App.onLaunch，App.onShow中获取），如 {"sellerid":"abcdef","userid":"1234"}，内容中不能留空格，变量名称和变量值必须用双引号。

小程序官方平台最新的升级，要求跳转其他小程序需要先申明要跳转的小程序ID，所以这里的appid， 需要在发布小程序新版本的时候添加，登录延誉宝CMS后的设置路径为： 项目设置 >>小程序版本控制。如果已经登录，点击这里设置。