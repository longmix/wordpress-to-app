# wordpress-to-app
Wordpress网站转APP和小程序


# 项目概况


## 项目主页

项目的设置和使用说明发布在这里：

[https://yanyubao.tseo.cn/Supplier/WordpressMgr/index/setting_type/source_code.html](https://yanyubao.tseo.cn/Supplier/WordpressMgr/index/setting_type/source_code.html)

需要注册才能查看，使用手机号码登录即可。


## 最新代码

最新的代码发布在Github上，喜欢记得点个小星星！

[https://github.com/longmix/wordpress-to-app](https://github.com/longmix/wordpress-to-app)


因为是uniapp项目，所以也直接直接在uniapp网站上下载。

[https://ext.dcloud.net.cn/plugin?id=1542](https://ext.dcloud.net.cn/plugin?id=1542)


## 问题与交流

使用上的问题和疑问，请用微信扫码查看其他开发者的提问和回复记录，也可以在文章末尾写留言。

<img src="http://www.tseo.cn/wp-content/uploads/2020/04/9be115d08294dd9f1eb588d52d662dde.png" width="150px">


## 主要升级记录

**2020.3.6.**

1.删除了部分页面多余css代码

2.对部分页面的布局进行调整

3.对多个页面添加注释


**2020.3.9.**

完善二维码海报功能


**2020.4.28.**

客服按钮支持自定义图片；


**2020.5.18.**

1、升级文章详情内容展示的组件；

2、可以自定义首页功能图标是否显示；

**2020.5.23.**

1、新增万能表单功能；

2、可以在服务器端控制给不同小程序平台返回不同的配置。



# 项目设置说明

## 服务器：设置说明

1、**下载Wordpress插件**，包括“WP转APP和小程序”和“WP-PostViews”两个插件，并在后台启用，

如下图所示：
[![WP后台插件列表截图](http://www.tseo.cn/wp-content/uploads/2020/03/Wordpress_Zhuan_APP_Xiao_Cheng_Xu_-01_Fu_Ben.jpg)](http://www.tseo.cn/wp-content/uploads/2020/03/Wordpress_Zhuan_APP_Xiao_Cheng_Xu_-01_Fu_Ben.jpg)


下载插件“WP转APP和小程序”： [https://yanyubao.tseo.cn/download/wordpress-plugin/yanyubao-wp-to-app.zip](https://yanyubao.tseo.cn/download/wordpress-plugin/yanyubao-wp-to-app.zip)

下载插件“WP-PostViews”：[https://yanyubao.tseo.cn/download/wordpress-plugin/wp-postviews.zip](https://yanyubao.tseo.cn/download/wordpress-plugin/wp-postviews.zip)


 2、**在Wordpress后台的路径“设置>>网站转APP设置”中**，

（1）填写延誉宝商户编号“pQNNmSkaq”，如上图，如果没有编号，登录延誉宝后台获取。

（2）设置默认的文章分类的封面，如上图。

3、**在Wordpress后台的路径“文章>>分类目录”中，**增加或编辑某个目录的时候，设置目录封面，也可以自定义封面，如下图。

[![WP后台插件列表截图](http://www.tseo.cn/wp-content/uploads/2020/03/Wordpress_Zhuan_APP_Xiao_Cheng_Xu_-03_Fu_Ben.jpg)](http://www.tseo.cn/wp-content/uploads/2020/03/Wordpress_Zhuan_APP_Xiao_Cheng_Xu_-03_Fu_Ben.jpg)

4、**设置电子会员卡，路径为：“信息中心>>电子会员卡”。**

电子会员卡的设置非常简单，帮助手册是针对不懂技术的用户制作的，查看地址为：

[http://www.abot.cn/627.html](http://www.abot.cn/627.html)，所以对于开发者来说，属于傻瓜文档！


## 源代码：自定义开发和重新编译


1、**下载项目源代码：**

通过uniapp网站或github或延誉服务器下载。

2、**在HBuilder X中打开项目。**

3、**修改配置：**

（1）【必改】打开common/abotapi.js，如下图所示：

> 修改 default_sellerid 为自己的延誉宝商户编号；
修改xiaochengxu_appid为自己的小程序appid；
修改current_platform为当前要发布的平台名称，可以设置的值有： app， h5， mp-weixin，  mp-alipay，   mp-baidu。


![源代码修改](http://www.tseo.cn/wp-content/uploads/2020/03/TIM_Jie_Tu_20200331145423.png)

（2）【选改】在项目根目录下，打开pages.json，

> 找到 navigationBarTitleText 将值改为自己的网站名称，还可以自定义标题文字的颜色和顶部导航的背景色。

_备注：微信小程序、百度智能小程序、支付宝小程序对应的appid各不相同，请不要填错了。_

4、**通过 HBuilder X将项目导入到不同的小程序开发环境中编译并提交发布。**

# 链接设置说明

## 小程序内链接设置

跳转文章列表  /pages/list/list?categoryID=1234，categoryID为分类ID，可以在Wordpress网站后台找到。

跳转文章详情  /pages/tabBar/index/detail?id=1234，id为文章ID，可以在Wordpress网站后台找到。

按关键词搜索文章  /pages/list/list?search=abcd，abcd为搜索的关键词，需要做URL编码。

个人资料页面（有退出登录的按钮）  /pages/userinfo/userinfo ，可以修改个人资料，也可以退出登录

修改账号和密码  /pages/usersetting/usersetting?account=1  可以从个人资料页面跳转过来，也可以直接挂接。

修改昵称  /pages/usersetting/usersetting?nickname=1  可以从个人资料页面跳转过来，也可以直接挂接。

修改手机号  /pages/usersetting/usersetting?mobile=1  可以从个人资料页面跳转过来，也可以直接挂接。

“关于”页面  switchTab pages/tabBar/about/about，需要增加 switchTab，没有其他特殊要求。


## Tab页面和非Tab页面跳转

如果页面被tabBar包含，那么跳转的时候，需要指定，具体格式为：

_switchTab [pagepath]_

用空格分开，switchTab跳转的页面，不能带任何多余的参数，即不可以出现“?”及其后面的内容。

例如：跳转到用户中心的链接，可以设置为  &nbsp;&nbsp; switchTab /pages/tabBar/usercenter/usercenter

例如：跳转到关于页面的链接，可以设置为  &nbsp;&nbsp; switchTab pages/tabBar/about/about
 

如果页面没有被tabBar包含，那么跳转的时候，需要指定，具体格式为：

_navigateTo [pagepath]_

用空格分开，navigateTo跳转的页面，可以带参数，参数放在“?”后面。


## 跳转到H5页面链接设置

跳转到H5页面，直接填写https://开头的网址，需要说明的是，对应的域名必须是在小程序登记的业务域名中，否则无法显示页面。

http链接中支持的变量有：%oneclicklogin%， %ensellerid%，  %wxa_appid%， %wxa_openid%。

%oneclicklogin%一键登录获取用户信息参数， %ensellerid%商户编码，  %wxa_appid%小程序appid， %wxa_openid%微信公众号粉丝openid。


跳转到“我的余额”  https://yanyubao.tseo.cn/User/agent_income.html?oneclicklogin=%oneclicklogin%

跳转到“我的赠款”  https://yanyubao.tseo.cn/User/my_balance_zengsong.html?oneclicklogin=%oneclicklogin%

跳转到“我的积分”  https://yanyubao.tseo.cn/User/score.html?oneclicklogin=%oneclicklogin%


嵌入H5网页的时候，如果页面内设置了头部导航栏，会与小程序默认的导航栏重复，影响页面美观；在延誉宝系统的H5页面中，我们都做了自动判断，如果被小程序中引用，会自动隐藏H5的导航栏；

如果是在APP中引用延誉宝的H5，请在页面网址中增加参数“hidden_nav_header_h5=1”以达到隐藏的目的。


## 跳转到其他小程序链接设置

跳转到其他小程序，使用填写以下格式：

_ miniprogram [url] [appid] [pagepath] [extraData]_

用空格分开，

[url]替换为网址，[appid]替换为要跳转的小程序，

[pagepath]替换为小程序的路径，可以包含参数，如 /pages/detail/detail?id=1577

[extraData]为模板小程序应用级别的参数（App.onLaunch，App.onShow中获取），如 {"sellerid":"abcdef","userid":"1234"}，内容中不能留空格，变量名称和变量值必须用双引号。


小程序官方平台最新的升级，要求跳转其他小程序需要先申明要跳转的小程序ID，所以这里的appid，

需要在发布小程序新版本的时候添加，登录延誉宝CMS后的设置路径为：

项目设置 &gt;&gt;小程序版本控制。[如果已经登录，点击这里设置](http://cms.weiduke.com/User/WechatThirdMiniProgram/wxa_version_ctrl.shtml)。


# 在线预览

![在线预览](http://saas.tseo.cn/staticsvc/uploads/2020/03/26/21945247ab3e1e5df10c8daaec620f993352.jpg)


# 常见问题（FAQ）

**网站转APP和小程序这个项目是免费的吗？**
 是的，网站转APP和小程序这个项目免费且开源（开放源代码）。

关于开源的说明：客户端是完全开源的，方便个性化的二次开发以及编译发布；同时，我们也提供基于小程序第三方开放服务商模式的自动生成小程序。

 因为受到SSL证书等安全限制，同时需要解决大并发、高频访问等，所以基于多点部署的服务器端应用想开源几乎是不现实。

虽然SaaS云服务维护成本和技术成本比普通服务器高，但是这个项目目前的政策依然是“免费”。

**为什么需要设置商户编号？**
 基于运营监管政策的需要，几乎所有网站都面临内容审查的压力；同时，基于Wordpress网站的各种垃圾评论插件层出不穷，
 所以要求访问者登录后才可以评论和点赞是非常必要的。

 设置延誉宝的商户编号，可以一键集成用户登录和身份认证等复杂功能，减少开发难度，降低上线门槛。

**个人中心必须显示会员卡功能吗，可以隐藏吗？**
 个人中心的会员卡功能没有隐藏选项，当然，你可以自定义开发，删除和隐藏这些功能，因为这个项目是开源的，小程序和APP客户端可以自由定制。

将网站转为APP和小程序（包括微信小程序、支付宝小程序、百度智能小程序、抖音小程序等），不可以认为只是简单的将内容展示形式做个改变， 因为那样在用户体验上没有任何提升，使用手机浏览器完全可以实现相同的效果。

 个人中心集成会员卡功能，是延誉宝“网站转APP和小程序”解决方案的亮点，提现了APP和小程序为访问者提供新功能的目的，所以推荐保留会员卡功能。
 
