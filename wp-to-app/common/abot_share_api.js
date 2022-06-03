
module.exports = {
	click_wxa_share:function(href, title, summary, imageUrl){
		console.log('我是微信消息分享',href);
		uni.share({
		    provider: "weixin",
		    scene: "WXSceneSession",
		    type: 0,
		    href: href,
		    title: title,
		    summary: summary,
		    imageUrl: imageUrl,
		    success: function (res) {
		        console.log("success:" + JSON.stringify(res));
		    },
		    fail: function (err) {
		        console.log("fail:" + JSON.stringify(err));
		    }
		});
	},
	click_wxa_circle_share:function(href, title, summary, imageUrl){
		console.log('我是微信朋友圈分享',href);
		uni.share({
		    provider: "weixin",
		    scene: "WXSceneTimeline",
		    type: 0,
		    href: href,
		    title: title,
		    summary: summary,
		    imageUrl: imageUrl,
		    success: function (res) {
		        console.log("success:" + JSON.stringify(res));
		    },
		    fail: function (err) {
		        console.log("fail:" + JSON.stringify(err));
		    }
		});
	},
	click_wxa_applet_share:function(href, title, path, imageUrl, account){
		
		console.log('我是微信小程序分享',account);
		console.log('我是微信小程序分享s',path);
		console.log('我是微信小程序分享ssss',imageUrl);
		console.log('我是微信小程序分享ss',href);
		uni.share({
		    provider: 'weixin',
		    scene: "WXSceneSession",
		    type: 5,
		    imageUrl: imageUrl,
		    title: title,
		    miniProgram: {
		        id: account,
		        path: path,
		        type: 0,
		        webUrl: href
		    },
		    success: ret => {
		        console.log('微信分享小程序',JSON.stringify(ret));
		    }
		});
	},
	//== 2020.10.13. 胡雨：将指定字符串(分享口令)复制到剪切板 ===
	//== 1，如果cmd_type等于 product，productid为商品ID。2，如果cmd_type等于 shang，productid为xianmaishangid
	click_wxa_command_copy:function(abotapi, cmd_type, productid, userid, sellerid){
		console.log("click_wxa_command_copy ====>>>> 88888");
		
		var post_data = {
				userid: userid,
				sellerid:sellerid,
			};
		
		if(cmd_type == 'product'){
			post_data.productid = productid;
		}
		else if(cmd_type == 'xianmaishang'){
			post_data.xianmaishangid = productid;
		}
		
		abotapi.abotRequest({
			url: abotapi.globalData.yanyubao_server_url + '/openapi/ShareKoulingData/create_command_str',
			data: post_data,
			success:function(res){
				console.log('res555555',res);
				
				uni.setClipboardData({
				    data: res.data.command_str,
				    success: function () {
				        console.log('success');
				    }
				});
				
				},
		});
		
		
	
	},
	//================= End ================
	click_wxa_system_share:function(summary, href){
		
		console.log('我是系统消息分享',href);
		
		uni.shareWithSystem({
		  summary: summary,
		  href: href,
		  success(){
		    // 分享完成，请注意此时不一定是成功分享
			console.log('分享系统成功');
		  },
		  fail(){
		    // 分享失败
			console.log('分享系统失败');
		  }
		})
	},
}
