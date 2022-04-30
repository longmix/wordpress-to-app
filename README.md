# Wordpress网站转APP和小程序

本项目旨在将Wordpress网站转成原生的APP和小程序项目，而不是简单粗暴的H5套用。同时，集成了一些会员登录和会员卡的功能，避免了与移动端浏览器相同的用户体验，极大提高了提高苹果应用商店和微信小程序、百度智能小程序的审核通过率。

之前已经预报过，本项目即将合并到“通版商城V2”这个项目中，后续不会有大的版本更新了。“通版商城V2”提供强大的智能建站功能，管理后台功能丰富，同样支持APP和微信、支付宝、百度等小程序自动生成，将于近期上传到github上，之前已经有一些人拿到了项目源代码。



## 在线预览

![在线预览](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/7-%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88.jpg)



## 项目概况


### 项目主页

* 项目的设置和使用说明发布在这里：_需要注册才能查看，使用手机号码登录即可_。

   [https://yanyubao.tseo.cn/Supplier/WordpressMgr/index/setting_type/source_code.html](https://yanyubao.tseo.cn/Supplier/WordpressMgr/index/setting_type/source_code.html)

* 主页镜像：定期同步项目主页内容，更新略有延迟

  [http://www.abot.cn/2616.html]

  [http://www.abot.cn/2616.html]: http://www.abot.cn/2616.html "WordPress转小程序 WordPress转APP"


### 源代码下载

* 最新的代码发布在Github上，喜欢记得点个小星星！

  [https://github.com/longmix/wordpress-to-app](https://github.com/longmix/wordpress-to-app)


* 考虑到Github在国内访问速度较慢，也可以通过国内的Gitee查看。
  [https://gitee.com/longmix/wordpress-to-app](https://gitee.com/longmix/wordpress-to-app)


* 因为是uniapp项目，所以也直接直接在uniapp网站上下载。

  [https://ext.dcloud.net.cn/plugin?id=1542](https://ext.dcloud.net.cn/plugin?id=1542)

### 功能扩展：Wordpress企业211主题

* 产品介绍和客户案例
  
  [http://www.abot.cn/446.html](http://www.abot.cn/446.html)

* 延誉宝企业211主题使用帮助
  
  [http://www.abot.cn/qiye211themehelp](http://www.abot.cn/qiye211themehelp)


### 问题与交流

**使用上的问题和疑问，请用微信扫码查看其他开发者的提问和回复记录，也可以在文章末尾写留言。**

<img src="https://gitee.com/longmix/wordpress-to-app/raw/master/docs/0-%E4%B8%87%E8%83%BD%E7%9A%84CTO%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%A4%E6%B5%81.png" width="150px">


---

## 常用路径设置说明

如果你不会代码开发，那么在后台设置和挂接这些路径链接，即可以将你的WordPress网站组织成个性化的，功能丰富的小程序或者手机APP，APP完全符合苹果应用商店（App Store）的上架要求。

### 小程序内链接设置

* **主要跳转链接**：可直接挂在底部导航栏：
  - 首页 /pages/index/index
  - 个人中心 /pages/index/usercenter
  - 分类列表和标签列表 /pages/index/topic
  - 关于页面 /pages/about/about

* **跳转文章列表**：支持以下参数：
  - /pages/wordpress/list?categoryID=1234
    > categoryID为分类ID，可以在Wordpress网站后台找到。
  - /pages/wordpress/list?search=延誉宝，则按照关键词“延誉宝”搜素指定的文章并形成列表，需要做URL编码。
  - /pages/wordpress/list?categorySlug=ebiz，显示分类别名为“ebiz”的文章列表。
  - /pages/wordpress/list?tag_id=167&tag_name=延誉宝，显示内容中包含标签ID为167的文章列表，多个标签ID用半角逗号分开；同时将标签名称显示为“延誉宝”。
  - /pages/wordpress/list?action=my_favorite，显示我的收藏。
  - /pages/wordpress/list?action=my_like，显示我的点赞。
    > 可以（1）追加参数“categoryName=文章分类”指定显示的文章分类名称；（2）追加参数 “categorySrc=http开头的图片网址”指定文章列表上方显示的头部图片。

* **其他重要路径链接**
* 跳转文章详情  
  - /pages/wordpress/detail?id=1234
  - id为文章ID，可以在Wordpress网站后台找到。

* 跳转页面详情 
  - /pages/wordpress/page?id=1234
  - id为页面ID，可以在Wordpress网站后台找到。

* 个人资料页面（有退出登录的按钮）  
  - /pages/user/userinfo 
  - 可以修改个人资料，也可以退出登录

* 修改账号和密码  
  - /pages/user/usersetting?account=1  
  - 可以从个人资料页面跳转过来，也可以直接挂接。

* 修改昵称  
  - /pages/user/usersetting?nickname=1  
  - 可以从个人资料页面跳转过来，也可以直接挂接。

* 修改手机号  
  - /pages/user/usersetting?mobile=1  
  - 可以从个人资料页面跳转过来，也可以直接挂接。

* “关于”页面  
  - switchTab pages/about/about
  - 需要增加 switchTab，没有其他特殊要求。

* 自定义页面 【[设置选项]】
  - 入口01： /pages/welcome_page/welcome_page?scene=1234@4321@cms
    > 1234为CMS的文章ID，4321为推荐者的userid，可以设置为0，cms为平台标志，支持cms和pic两个值。
  - 入口02： /pages/welcome_page/welcome_page?parentid=4321&data_url=https%3A%2F%2Fyanyubao.tseo.cn%2Fopenapi%2FTestData%2Fwelcome_data
    > parentid为推荐者的userid，data_url为获取的要显示的内容。 

[设置选项]:http://127.0.0.1/yanyubao_server/index.php?g=Supplier&m=WelcomePageMgr&a=index&setting_type=index "自定义页面的设置选型"

* 万能表单  【[设置选项]】
  - 支持对万能表单和文章自定义属性的挂接， 点击设置选型查看详情。
  - CMS万能表单：/pages/publish/publish_write?form_type=2&token=abcdefg&formid=1234
    > token为CMS控制台的项目token，设置路径为： 系统设置 > 全局配置选项 >商城头条token， 【 点击这里设置】，formid为CMS控制台的表单ID。



### Tab页面和非Tab页面跳转

* 如果页面被tabBar包含，那么跳转的时候，需要指定，具体格式为：

  _switchTab [pagepath]_

  用空格分开，switchTab跳转的页面，不能带任何多余的参数，即不可以出现“?”及其后面的内容。
  
  > 例如：跳转到用户中心的链接，可以设置为  &nbsp;&nbsp; switchTab /pages/index/usercenter 

  > 例如：跳转到关于页面的链接，可以设置为  &nbsp;&nbsp; switchTab pages/about/about

* 如果页面没有被tabBar包含，那么跳转的时候，需要指定，具体格式为：

  _navigateTo [pagepath]_

  用空格分开，navigateTo跳转的页面，可以带参数，参数放在“?”后面。



### 跳转到H5页面链接设置

* 跳转到H5页面，直接填写https://开头的网址，需要说明的是，对应的域名必须是在小程序登记的业务域名中，否则无法显示页面。

  > http链接中支持的变量有：%oneclicklogin%， %ensellerid%，  %wxa_appid%， %wxa_openid%，具体说明如下：

    - %oneclicklogin%一键登录获取用户信息参数， 
    - %ensellerid%商户编码，  
    - %wxa_appid%小程序appid， 
    - %wxa_openid%微信公众号粉丝openid。

* 可以跳转到H5的具体的应用
  - 跳转到“我的余额”  https://yanyubao.tseo.cn/User/agent_income.html?oneclicklogin=%oneclicklogin%

  - 跳转到“我的赠款”  https://yanyubao.tseo.cn/User/my_balance_zengsong.html?oneclicklogin=%oneclicklogin%

  - 跳转到“我的积分”  https://yanyubao.tseo.cn/User/score.html?oneclicklogin=%oneclicklogin%

* 嵌入H5网页的时候，如果页面内设置了头部导航栏，会与小程序默认的导航栏重复，影响页面美观。
  > 在延誉宝系统的H5页面中，我们都做了自动判断，如果被小程序中引用，会自动隐藏H5的导航栏；如果是在APP中引用延誉宝的H5，请在页面网址中增加参数“hidden_nav_header_h5=1”以达到隐藏的目的。

* 跳转H5网页默认方式为“navigateTo”，即小程序的左上角会显示返回的箭头图标；可以指定使用“redirectTo”跳转，跳转后左上角显示的是小房子图标，用于快速回到首页。 
  - 对于H5页面内需要反复跳转的网页应用，建议使用redirectTo跳转，以避免用户反复点击返回键产生疑惑。
  - 设置方式：在H5网页的末尾添加“#redirectTo”。
    > 例如：	https://app.tseo.cn/o2owaimai/Merchant/MerchantWap/index/ensellerid/pQNNmSkaq?refresh_token_value=%refresh_token%&synchronize_userid=1
  - 支持“redirectTo”的跳转设置为：	
    > https://app.tseo.cn/o2owaimai/Merchant/MerchantWap/index/ensellerid/pQNNmSkaq?refresh_token_value=%refresh_token%&synchronize_userid=1#redirectTo


### 跳转到其他小程序链接设置

* 跳转到其他小程序，使用填写以下格式：
  ```
    miniprogram [url] [appid] [pagepath] [extraData]
  ```
  用空格分开，具体的参数含义为：
  - [url]替换为网址，[appid]替换为要跳转的小程序，
  - [pagepath]替换为小程序的路径，可以包含参数，如 /pages/detail/detail?id=1577
  - [extraData]为模板小程序应用级别的参数（App.onLaunch，App.onShow中获取），如 {"sellerid":"abcdef","userid":"1234"}，内容中不能留空格，变量名称和变量值必须用双引号。

* 小程序官方平台最新的升级，要求跳转其他小程序需要先申明要跳转的小程序ID，所以这里的appid，需要在发布小程序新版本的时候添加，登录延誉宝CMS后的设置路径为：
    ```
    项目设置 &gt;&gt;小程序版本控制
    ```

    [如果已经登录，点击这里设置](http://cms.weiduke.com/User/WechatThirdMiniProgram/wxa_version_ctrl.shtml)。
    
---

## 二次开发文档

如果你会简单的代码开发，最好了解一点微信小程序的开发工具，那么，接下来的文档完全可以简单读懂。


### 源代码：自定义开发和重新编译

源代码的编译和二次开发，在uniapp环境操作，具体的步骤如下：

1. **下载项目源代码：**

通过uniapp网站或github或延誉服务器下载，建议通过github下载最新版本的源代码。

2. **在HBuilder X中打开项目。**

3. **修改配置：**  
  * 【必改】打开项目根目录下的 abot_data.js，如下图所示：
    - 修改 default_sellerid 为自己的延誉宝商户编号；
    - 修改xiaochengxu_appid为自己的小程序appid；
    - 修改current_platform为当前要发布的平台名称，可以设置的值有： app， h5， mp-weixin，  mp-alipay，   mp-baidu。


![源代码修改](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/5-%E8%AE%BE%E7%BD%AEabot_data.png)

  * 【选改】在项目根目录下，打开pages.json，

     - 找到 navigationBarTitleText 将值改为自己的网站名称，还可以自定义标题文字的颜色和顶部导航的背景色。

   > _备注：微信小程序、百度智能小程序、支付宝小程序对应的appid各不相同，请不要填错了。_

4. **通过 HBuilder X将项目导入到不同的小程序开发环境中编译并提交发布。**




### WordPress网站中如何设置？

建议在Wordpress网站中安装我们的插件，可以提供以下丰富的功能扩展：
  - 自定义内容分类的图标、简介。
  - 自定义每篇文章在文章列表中丰富的展示形式，包括小图片形式和横幅图片形式等。
  - 自动生成文章分享的二维码或者小程序码海报。
  - 丰富的百度小程序和微信小程序SEO优化功能。

安装WordPress插件的操作步骤如下：

1. **下载Wordpress插件**

   包括“WP转APP和小程序”和“WP-PostViews”两个插件，并在后台启用，如下图所示：

[![WP后台插件列表截图](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/1-%E4%B8%8B%E8%BD%BDWordPress%E6%8F%92%E4%BB%B6.jfif)](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/1-%E4%B8%8B%E8%BD%BDWordPress%E6%8F%92%E4%BB%B6.jfif)


  - 下载插件“WP转APP和小程序”： [https://github.com/longmix/wordpress-to-app/blob/master/wordpress-plugin/yanyubao-wp-to-app.zip](https://github.com/longmix/wordpress-to-app/blob/master/wordpress-plugin/yanyubao-wp-to-app.zip)

  - 下载插件“WP-PostViews”：[https://yanyubao.tseo.cn/download/wordpress-plugin/wp-postviews.zip](https://yanyubao.tseo.cn/download/wordpress-plugin/wp-postviews.zip)

    ```
    查看缓存空间大小： http://cms.weiduke.com/index.php/openapi/Wordpress/restapi_cache_list_size?sellerid=pQNNmSkaq
    删除所有缓存： http://cms.weiduke.com/index.php/openapi/Wordpress/restapi_cache_list_clear?sellerid=pQNNmSkaq
    删除指定缓存： http://cms.weiduke.com/index.php/openapi/Wordpress/restapi_cache_list_clear?sellerid=pQNNmSkaq&cacheurl=%2Fwp-json%2Fwp%2Fv2%2Fposts%2F123456
    其中cacheurl为对应的实际请求网址。
    删除指定缓存： http://cms.weiduke.com/index.php/openapi/Wordpress/restapi_cache_list_clear?sellerid=pQNNmSkaq&cacheidmd5=5b06a23afe028d41e039bdde03d47701
    其中cacheidmd5为对应的实际请求网址的md5字符串。
    ```


 2. **在Wordpress后台的路径“设置>>网站转APP设置”中**，

  - （1）填写延誉宝商户编号“pQNNmSkaq”，如上图，如果没有编号，登录延誉宝后台获取。

  - （2）设置默认的文章分类的封面，如上图。


3.  **在Wordpress后台的路径“文章>>分类目录”中，** 

    增加或编辑某个目录的时候，设置目录封面，也可以自定义封面，如下图。

[![WP后台插件列表截图](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/3-%E8%AE%BE%E7%BD%AEAPP%E5%B0%81%E9%9D%A2.jpg)](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/3-%E8%AE%BE%E7%BD%AEAPP%E5%B0%81%E9%9D%A2.jpg)

4. **设置电子会员卡，路径为：“信息中心>>电子会员卡”。**

    电子会员卡的设置非常简单，帮助手册是针对不懂技术的用户制作的，查看地址为：

    > [http://www.abot.cn/627.html](http://www.abot.cn/627.html)
    
    所以对于开发者来说，属于傻瓜文档！



## 更多关于此项目的案例请参考下图

![在线预览](https://gitee.com/longmix/wordpress-to-app/raw/master/docs/9-%E6%9B%B4%E5%A4%9A%E6%A1%88%E4%BE%8B.png)


## 常见问题（FAQ）

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

**2021.1.20.**

1、登录页面和用户中心增加了返回首页的按钮。

2、优化微信小程序中sitemap.json的结构。
