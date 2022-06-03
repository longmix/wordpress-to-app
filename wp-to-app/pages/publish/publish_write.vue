<template>
	<view>
		
		<view style="margin-bottom: 50rpx; padding-bottom: 50rpx;">
			<view class='wenzhang_detail'>
			    <image style="width: 100%;" v-if="form_logourl"
					:src="form_logourl" mode="widthFix"></image>
			    <view v-if="form_intro" 
					style="margin: 20rpx;font-size: 28rpx;color: #555;word-break: break-word;">{{form_intro}}</view>

			    <view class="wxParse"> 
			        <scroll-view  scroll-y='true'>

					   <!-- #ifdef MP-ALIPAY -->
					   			<rich-text :nodes="content_array_html"></rich-text>
					   <!-- #endif -->
					   
					   <!-- #ifdef H5 -->
					   			<view v-html="content_v_html" ></view>
					   <!-- #endif -->
					   
					   <!-- #ifndef MP-ALIPAY | H5 -->
					   			<!-- 富媒体组件 2021.1.18. -->
					   			<!-- rich-text  和 v-html 都有各自的优缺点 -->
					   			<u-parse v-if="content_html" 
					   				:content="content_html" 
					   				@preview="index_rich_html_preview_image" 
					   				@navigate="index_rich_html_click_link" />
					   <!-- #endif -->
					   
					   
			        </scroll-view>
			    </view>
			</view>
			
			
			<!--平铺广告图片start-->
			<view style='width:100%;background-color: #fff;margin-top: 20rpx;' 
				v-if="(ad_img_list != null)||(ad_img_list != '')">
			     <block  v-for="item in ad_img_list" :key="item.swiperid">
			      <image style='width:100%;vertical-align: middle;' 
					mode="widthFix" bindtap="go_to_ad_img_url" 
					:src='item.image' :data-url="item.url"></image>
			     </block>
			</view>
			<!--平铺广告图片end-->
			
			
			<view class="main-body" v-if="show_input_list == 1">
				
				<form @submit="formSubmit">
					<block v-for="item in input_field_list" :key="item.fieldname">
						<!-- 帖子的固定字段开始 -->
						<block v-if="form_type == 3">
							<view class="input_flex" v-if="item.fieldname == 'imgimg_title'" style="overflow: auto;padding:35rpx 40rpx 20rpx 40rpx;background-color: #FFFFFF;border-bottom: 1rpx solid #EEEEEE;">
								<view class="input-flex-label w60" style="float: left;">标题<label class="FH">*</label></view>
								<input style="float: left;width: 70%;margin-top: -4rpx; border:1rpx solid #a2a2a2;" 
									name="imgimg_title" maxlength="40" 
									placeholder-style="color:#c3c3c3" 
									placeholder="请输入标题" />
							</view>
							
							<view class="uni-textarea002" style="" v-if="item.fieldname == 'imgimg_content'">
								<view style="padding: 16rpx 34rpx;font-size: 32rpx;background-color: #FFFFFF;">{{item.displayname}}</view>
								<textarea style="padding: 16rpx 34rpx; border:1rpx solid #a2a2a2;" :name="item.fieldname" 
									maxlength="-1"
									placeholder='请在此填写详细说明' /><!-- placeholder-style="color:#D3D3D3;font-size:15px;" -->
							</view>
							
							<view style="" v-if="item.fieldname == 'imgimg_picture_list'">
								<!-- 上传图片 -->
								<view style="display: flex;flex-wrap:wrap;">
									<!-- 放上传的图片 -->
									<view style="width: 32%;height: 250rpx;position: relative;" v-for="(items,index) in imgArray" :key="items">
										<view style="width: 100%;position: absolute;z-index: 1;">
											<image @tap="delectImg(index)"  style="width: 50rpx;height: 50rpx;position: absolute;right:0" src="../../static/img/delete_red.png"></image>
										</view>
										
										<image style="width: 100%;height: 100%;" mode="aspectFit" :src="items" ></image>
									</view>
									
									
									<view style="margin: 2px 10px 2px 17px;width: 250rpx;height: 250rpx;position: relative;" @tap="uploading_img()">
										<image style="width: 100%;height: 100%;border: 1px solid #eee;" src="../../static/img/add.png"></image>
									</view>
									
								</view>
								
							</view>
						</block>
						<!-- 帖子的固定字段结束 -->
						
						<view class="box_1" v-if="item.inputtype == 'text'">
							<view class="input-flex-label w60" style="float: left;">{{item.displayname}}
								<label class="FH" v-if="item.require == 1">*</label>
							</view>
							<input :name="item.fieldname" maxlength="40" placeholder-style="color:#c3c3c3" :placeholder="item.errortip" />
						</view>
						
						<view class="box_1" v-if="item.inputtype == 'select'">
							<picker @change="bindPickerChange" :value="index" :range="item.options" :data-fieldname="item.fieldname">
								<view style="overflow: auto;">
									<view class="box_2">
										<text>{{item.displayname}}</text><label class="FH" v-if="item.require == 1">*</label>
									</view>
									<view class="box_3">
										<text class="box_text">{{item.options[item.index]}}</text>
										<image v-if="!item.options[item.index]" 
											style="width: 40rpx;    margin-top: 10rpx;margin-left: 100rpx;" mode="widthFix" src="../../static/img/x_right.png"></image>
									</view>
								</view>
							</picker>
							<input :name="item.fieldname" :value="item.options[item.index]" :hidden='true' style="display:none;" />
						</view>
						
						<view class="box-checkbox" v-if="item.inputtype == 'checkbox'">
							<checkbox-group @change="checkboxChange" :name="item.fieldname" :data-name="item.fieldname">
								<view style="overflow: auto;margin-bottom:40rpx;">
									<view class="box_2">
										<text>{{item.displayname}}</text>
										<label class="FH" v-if="item.require == 1">*</label>
									</view>
								</view>
								<label v-for="(item02,index) in item.options" :key="item02.value">
									<view style="margin-left: 34rpx;float: left;">
										<checkbox :value="item02">
											<view>{{item02}}</view>
										</checkbox>
									</view>
								</label>
							</checkbox-group>
						</view>
						
						<!-- 文件或图片类型 -->
						<view class="box-file-upload" v-if="item.inputtype == 'file'" >							
							<view style="overflow: auto;margin-bottom:40rpx;">
								<view class="box_2">
									<text>{{item.displayname}}</text>
									<label class="FH" v-if="item.require == 1">*</label>
								</view>
							</view>
							
							<image  
								:src="image_list[item.fieldname]?image_list[item.fieldname]:img_upload_default_icon"
								mode="widthFix" 
								:name="item.fieldname" 
								:data-name="item.fieldname"
								@click="upLoadimgs"
								style="width: 200px;margin: 0px auto;display: block;"></image>
								
								
								<input type="hidden" :name="item.fieldname" 
								:value="image_list[item.fieldname]"
								style='display:none'>
								
								
							<view class="error_tips" v-if="item.errortip">
								<view style="color:#cbcbcb ;font-size: 20rpx">{{item.errortip}}</view>
							</view>
							
							<view @click="upLoadimgs" :data-name="item.fieldname"
								:data-seq="item.image_list_seq" class="up_images"
								:style="{backgroundColor:wxa_shop_nav_bg_color}">上传图片</view>
							
							
						</view>	
						
						<!-- 日期时间类型 -->
						<view class="box_1" v-if="item.inputtype == 'date'" >
							<view class="box_2">
								<text>{{item.displayname}}</text>
								<label class="FH" v-if="item.require == 1">*</label>
							</view>
							<biaofun-datetime-picker
								placeholder="请选择时间"
								:defaultValue="time_start_end[item.fieldname]"
								fields="minute"
								:name="item.fieldname + '_time_picker'" 
								:data-name="item.fieldname"
								@change="changeDatetimePicker"
								:change_name="item.fieldname"
							></biaofun-datetime-picker>
							<input type="text" style="display: none;" 
								:name="item.fieldname" 
								:value="time_start_end[item.fieldname]">
						</view>						
						
						<!-- <view class="input-flex" style="overflow: auto;border-bottom: #DDDDDD 1rpx solid;padding:17px 20px 10px" v-if="item.inputtype== 'date' || item.inputtype== 'text' && item.fieldname != 'imgimg_title'">
							<view class="input-flex-label w60" style="float: left;">{{item.displayname}}<label class="FH" v-if="item.require == 1">*</label></view>
								<input :type='item.inputtype'  
									:name="item.fieldname" 
									style="float: left;width: 70%;" 
									placeholder="点此输入" 
									value="" 
									v-if="item.inputtype== 'text'"/>
								  <picker mode="date" :value="date" :start="startDate" style="margin-left: 55%;margin-top: 6rpx;" :type='item.inputtype' :end="endDate" @change="bindDateChange"  :data-fieldname='item.fieldname' v-if="item.inputtype== 'date'">
									<view class="uni-input">{{date}}</view>
								</picker> 
							
							
							
						</view>
						--> 
						
						
						<view class="uni-textarea002" style="padding: 0rpx 40rpx;" 
							v-if="item.fieldname != 'imgimg_content' && item.inputtype == 'textarea'">
							<view class="box_2" style="float:left;background-color: #FFFFFF;padding: 20rpx 0rpx;">
								<text>{{item.displayname}}</text>
								<label class="FH" v-if="item.require == 1">*</label>
							</view>
							<view style="float:left;clear:both;width: 100%;padding: 5rpx;">
								<textarea :name="item.fieldname" :placeholder="item.errortip" 
									maxlength="-1"
									style="border: 1px solid #a2a2a2;" /><!-- placeholder-style="color:#D3D3D3;font-size:15px;" -->
							</view>
						</view>
						
						
						
						
					
					</block>
					
					
					<!-- <upimg-box></upimg-box> -->
					<view class="fabu_xuzhi_block" v-if="publish_write_fabu_xuzhi"> 
					
						<checkbox-group name='fabu_xuzhi' style="zoom:70%;margin-right: 8rpx;">
								<checkbox value="1">
									
								</checkbox>
						</checkbox-group>
						<view>我已阅读并同意<text @click="show_knows" style="color: #007AFF;">《内容规范》</text></view>
					</view>
					<button formType="submit" class="btn-row-submit"
						:style="{backgroundColor:wxa_shop_nav_bg_color}">{{submit_text}}</button>
				</form>
				
				<!-- 发布须知的弹层 -->
				<view class="zhezhao" v-if="is_know_showed==true"></view>
				<view class="kcrzxy" v-if="is_know_showed==true">
				    <view class="kcrzxyhd" :style="{background:wxa_shop_nav_bg_color, fontSize:'26rpx'}">内容规范</view>
				    <scroll-view scrollY class="kcrzxybd" style="height: 600rpx;">
				        <textarea :value="publish_write_fabu_xuzhi" 
							disabled="disabled"
							style="width: 100%;font-size:26rpx;" 
							auto-height='true' 
							maxlength="-1"></textarea>
				    </scroll-view>
				    <view @click="show_knows" class="queren" :style="{background:wxa_shop_nav_bg_color, fontSize:'26rpx'}">确定</view>
				</view>
				
			</view><!-- End of main-body -->
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import biaofunDatetimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue';
	
	import uParse from '@/components/gaoyia-parse/parse.vue'
	
	import md5 from '../../common/md5.min.js'
	
	// #ifdef MP-ALIPAY
		import parseHtml from "../../common/html-parser.js"
	// #endif
	
	export default {
		components:{
			uParse,
			biaofunDatetimePicker
		},
		
		data:function(){
			
			const currentDate = this.getDate({
				format: true
			})
					
			return {
				pageData:{},
				
				formid:'',
				
				is_know_showed:false,
				
				hezuodiqu: [],
				tigongziyuan:[],
				xunqiuziyuan:[],
				youxiaoshijian:[],
				tigongziyuanmiaoshu:[],
				xunqiuziyuanmiaoshu:[],
				lianxifangshi:[],
				
				inputtype:'',
				
				show_input_list:0,
				input_field_list:[],
				
				red:'red',
				index:0,
				data2:'',
				imgArray:[],//存放上传图片的数组
				submit_text:'提交信息',
				catename:'',
				date: currentDate,
				input_youxiaoshijian: '',
				bg_color:'',
				checkbox_field_value_list:[],
				
				form_type:3,
				submit_url:'', //即将提交表单的url 如果没有就用默认
				
				wxa_shop_nav_bg_color:'',
				publish_write_fabu_xuzhi:'',//发帖须知
				
				current_params_str:'',
				
				//微读客CMS平台的万能表单中定义的表单的logo、简介和内容
				form_logourl:'',
				form_intro:'',
				
				
				content_html:'<div></div>',	//文章的html内容
				
				content_v_html:'',	//文章的html内容（经过Filter过滤的，在H5中使用
				content_array_html:'',//文章的html内容（经过分析，转成array的。
				
				
				
				//首页 > 功能扩展 > 万能表单 中定义的平铺广告图片
				ad_img_list:'',
				
				cms_token:'',
				
				current_options: null,
				
				//图片和文件上传相关
				img_upload_default_icon:'../../static/img/add.png',				
				image_list:[],
				//image_list_seq:0,
				
				time_start_end:[],
			}
			
		},
		
		computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
			
		onLoad: function (options) {
			console.log('sssssss ===>>>',  options)
			
			//this.image_list['shenfenzhengzhengmian'] = 'http://saas.tseo.cn/staticsvc/uploads/2021/03/12/622af3fba321397b0b0a9761ba738c3a2211.jpg';
			
			this.current_options = options;
			
			
			var that = this;
			
			//=====分析参数=====
			if(options){
			  var arr = Object.keys(options);
			  var options_len = arr.length;
		
			  if (options_len > 0){
				var params_str = '';
		
				for(var key in options){
				  params_str += key+'='+options[key]+'&';
				}
				params_str = params_str.substr(0, params_str.length - 1);
		
				that.current_params_str = params_str;
			  }
			}
			//===== End ======
			
			this.form_typ = 3;
			//console.log('options',options);
			
			if(options.form_type){
				this.form_type = options.form_type;
			}
			
			if(options.submit_url){
				this.submit_url = options.submit_url;
			}
			
			if(options.form_type && options.form_type == 2){
				this.formid = options.formid; //栏目页面跳转带过来的参数  栏目id
			}
			else{
				this.formid = options.cataid; //栏目页面跳转带过来的参数  栏目id
			}
			
			//2021.2.4.  如果参数设置了CMS token，则不适用系统设置的
			if(options.token){
				this.cms_token = options.token;
			}
			
			this.catename = options.name; //栏目页面跳转带过来的参数  栏目名称
			
			this.abotapi.set_option_list_str(that, function(that002, shop_option_data){
				console.log('shop_option_data',shop_option_data);
				
				
				that002.publish_write_fabu_xuzhi = shop_option_data.publish_write_fabu_xuzhi;
				that002.wxa_shop_nav_bg_color = shop_option_data.wxa_shop_nav_bg_color;
				
				console.log('======>>>>>that002.wxa_shop_nav_bg_color ====>>>'+that002.wxa_shop_nav_bg_color);
				
				
				if(!that002.cms_token){					
					that002.cms_token = shop_option_data.cms_token;
				}
				
				
				that.getWriteFormInputList();
				
			});
			
			
			
			//判断登录（如果不是 2 万能表单，其他情况都要求用户登录后才能进入填写表单）
			var userInfo = that.abotapi.get_user_info();
				
			if(( (this.form_type != 2) || ((this.form_type == 2) && options.mustlogin && (options.mustlogin == 1) ) ) 
				&& (!userInfo || !userInfo.userid)){
				
				
				//var last_url = '/pages/publish/publish_write?classid='+this.formid+'&name='+this.catename+'&submit_url='+this.submit_url+'&form_type='+this.form_type;
				var last_url = '/pages/publish/publish_write';
				if(that.current_params_str.length > 5){
					last_url = '/pages/publish/publish_write?'+that.current_params_str;
				}
				
				this.abotapi.goto_user_login(last_url, 'normal');
								
			}
			
			
			//2020.5.7. 加载图片平铺广告
			this.abotapi.abotRequest({
			  url: that.abotapi.globalData.yanyubao_server_url + '/index.php/openapi/SelfformData/get_ad_list',
			  data: {
				sellerid: that.abotapi.get_sellerid(),
			  },
			  success: function (res) {
				if(res.data && (res.data.code == 1)){
				  var ad_img_list = res.data.ad_img_list;
		
				  that.ad_img_list = ad_img_list;
				}
		
		
			  },
			});
			
			
		},
		onShow: function(){
			console.log('sssssss',2)
			var that = this;
			
			
			
			//end
			 
		},
		onReady: function () {
			
		},
		methods: {
			
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let hours = date.getHours();
				let minutes = date.getMinutes();
 
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				
				
				return `${year}-${month}-${day} ${hours}:${minutes}`; 
				
				
				
			},			
			
			//提交表单数据
			formSubmit:function(e){
				
				if(e.detail.value.fabu_xuzhi && (e.detail.value.fabu_xuzhi[0] != 1) ){
					uni.showToast({
						title:'请阅读发布须知',
					})
					return;
				}
				
				
				var that=this;
				
				var input_value_list = e.detail.value;
				console.log('input-value', input_value_list);
				//input_value_list.input_youxiaoshijian = this.date;
				
				var picture_list = encodeURIComponent(JSON.stringify(this.imgArray));
				
				//将checkbox的值追加到要提交的数组上
				
				for(var key in that.checkbox_field_value_list){
					
					input_value_list[key] = that.checkbox_field_value_list[key];
					
				}
				
				//检查必填字段
				for(var form_key in e.detail.value){
					
					for(var keys in that.input_field_list){
						console.log('456 form_key ===>>>',form_key);
						console.log('123',that.input_field_list);
						if(form_key == that.input_field_list[keys]['fieldname']){
							if(that.input_field_list[keys]['require'] == 1){
								//判断是否为必填（是）
								console.log('888889===>>', e.detail.value[form_key]);
								if(!e.detail.value[form_key]){
									uni.showToast({
										title:'请填写'+that.input_field_list[keys]['displayname']
									})
									return;
								}
							}
						}
						
					}
					
				}
				
				
				var input_value_list_json = encodeURIComponent(JSON.stringify(input_value_list));			
				var userInfo = that.abotapi.get_user_info();
				
				var submit_url =  '';
				var post_data = {}
				
				if(that.form_type == 1){//延誉宝会员扩展属性
					submit_url = that.abotapi.globalData.yanyubao_server_url+'/index.php/Yanyubao/ShopAppWxa/user_set_ext_info_list';
					
					post_data = {
						sellerid:that.abotapi.get_sellerid(),
						userid: userInfo.userid,
						checkstr: userInfo.checkstr,
					}
					console.log('e.detail.value',e.detail.value);
					for(var key in e.detail.value){
						
						post_data[key] = e.detail.value[key];
					}
					console.log('858899',post_data);
				}else if(that.form_type == 2){//微读客的万能表单
					submit_url = that.abotapi.globalData.weiduke_server_url+'/index.php/openapi/SelfformData/submit_data_url_selfform';
					
					post_data = {
						sellerid:that.abotapi.get_sellerid(),
						token:that.cms_token,
						formid:that.formid,
						openid:this.abotapi.get_current_openid(),
					}
					
					var userInfo = that.abotapi.get_user_info();
					if(userInfo){
						post_data.userid = userInfo.userid;
					}
					
					for(var key in e.detail.value){
						
						post_data[key] = e.detail.value[key];
					}
					console.log('858899',post_data);
				}else if(that.form_type == 3){	//微读客的帖子
					submit_url = that.abotapi.globalData.weiduke_server_url+'/index.php/openapi/ArticleImgApi/add_article_item';
					
					post_data = {
						sellerid:that.abotapi.get_sellerid(),
						classid:that.formid,
						userid: userInfo.userid,
						checkstr: userInfo.checkstr,
						token: that.cms_token,
						input_value:input_value_list_json,
						picture_list:picture_list,
					}
					
				}
				
				//如果设置了提交地址，则以这个数据保存地址为准
				if(that.submit_url){
					submit_url = that.submit_url;
					
					//因为数据要外送第三方，所以将checkstr设置成假的
					post_data.checkstr = 'mock_checkstr';
				}
				
				
				//检查是否有隐藏域 （其他参数）
				//var hidden_list = [];
				for(var key in that.current_options){
					if((key == 'form_type')||(key == 'submit_url')||(key == 'formid')
						|| (key == 'cataid') || (key == 'sellerid') || (key == 'token')){
						continue;
					}
		  
					//hidden_list[key] = options[key];
					post_data[key] = that.current_options[key];
				}
				
				
				console.log('11111111111111111111====>>完整的提交数据01：', post_data);
				
				
				that.abotapi.abotRequest({
					url:submit_url,
					data:post_data,
					success: function(res) {
						if(res.data.code == 1){
							
							uni.showModal({
								title:'提交成功',
								content: res.data.msg,
								showCancel:false,
								success: function (res01) {
									
									that.abotapi.call_h5browser_or_other_goto_url('/pages/index/index')
									
								}
							});
							
							/*
							uni.showToast({
								 title: res.data.msg,
							});
							
							setTimeout(function(){
								
								//uni.reLaunch({
								//	url:"../publish/publish_list"
								//});
								
								that.abotapi.call_h5browser_or_other_goto_url('/pages/index/index')
								
							},1000);*/
						}
						else if(res.data.code == -1){
							
							uni.showModal({
								title:'登录超时',
								content: '请重新登录',
								success: function (res) {
									
									that.abotapi.del_user_info();
									
									
									if(res.confirm){
										var last_url = '/pages/index/index';
										that.abotapi.goto_user_login(last_url, 'switchTab');
									}
									
								}
							})
							
							console.log('登录超时');
							return;
						}else{
							uni.showModal({
								title:'提交失败',
								content: res.data.msg,
								showCancel:false,
								success: function (res01) {
									
								}
							})
						}
										
					}
				
				});
			
			},
			toCooperationArea:function(){
				
			},
			//关闭发布须知的遮罩层
			show_knows: function(e) {
					var is_know_showed = this.is_know_showed;
					
					this.is_know_showed = !is_know_showed;
					
			},
			getWriteFormInputList:function(){
				
				
				
				
				var that = this;
				
				
				//console.log('that.formid ===>>>', that.formid);
				
				if( (that.form_type == 3) && (!that.formid) ){
					return;
				}
				
				//form_type 判断那个url
				var url = '';
				if(that.form_type == 1){
					//会员扩展属性 延誉宝
					url = that.abotapi.globalData.yanyubao_server_url+'/openapi/SupplierData/supplier_input_list';
					
					var post_data = {
						sellerid: that.abotapi.globalData.default_sellerid,
					};
					
				}else if(that.form_type == 2){
					//CMS万能表单  微读客
					url = that.abotapi.globalData.weiduke_server_url+'/openapi/SelfformData/get_selfform_option';
					
					var post_data = {
						selfform_type: 'selfform',
						token: that.cms_token,
						formid:that.formid
					};
					
				}else if(that.form_type == 3){
					//帖子属性   微读客
					url = that.abotapi.globalData.weiduke_server_url+'/openapi/SelfformData/get_selfform_option';
					
					var post_data = {
						selfform_type: 'img_classify',
						token: that.cms_token,
						formid:that.formid
					};
				}
				
				
				
				
				
				// 微读客获取文章列表  				
				that.abotapi.abotRequest({
					url:url,
					data:post_data,
					success(res) {
						
						if(res.data.code == 1){
							
							
							if(res.data.submit_text){
								that.submit_text = res.data.submit_text;
							}
							if(res.data.title){
								uni.setNavigationBarTitle({
									title: res.data.title,
								})
							}
							
							if(res.data.logourl){
							    that.form_logourl = res.data.logourl;
							}
							
							if (res.data.intro) {
								that.form_intro = res.data.intro;
							}
							
							if(res.data.content){
								
								that.content_html = res.data.content;
												
								
								//v-html使用
								that.content_v_html = that.content_html;
								
								//console.log('that.content_v_html====>>>>111', that.content_v_html);
								
								const filter = that.$options.filters["formatRichText"];
								that.content_v_html = filter(that.content_v_html);
								
								//设置百度小程序中的页面SEO信息
								// #ifdef MP-BAIDU				
									//2021.7.22. 删除所有的超链接和对应的超链文本
									that.content_html = that.content_html.replace(/(<\/?a.*?>)[^>]*<\/a>/g, '');
											
								// #endif	
								
								
								// #ifdef MP-ALIPAY						
									let data001 = that.content_html;
									let newArr = [];
									let arr = parseHtml(data001);
									arr.forEach((item, index)=>{
										newArr.push(item);
									});
									
									//console.log('arr arr arr====>>>>', arr);
									//console.log('newArr newArr newArr====>>>>', newArr);
									
									//rich-text使用
									that.content_array_html = newArr;
								// #endif
								
							}
							
							var list = res.data.data;
							
							var image_list_seq = 0;
							
							for(var i=0; i<list.length; i++){
								
								if(list[i].options){
									if(that.form_type != 1){
										list[i].options = list[i].options.split('|');
									}
									
									
									list[i].index = 0;
									
									if(list[i].inputtype == 'select'){
										list[i].options.unshift('');
									}
									else if(list[i].inputtype == 'checkbox'){
										
									}
								}
								
								if(list[i].inputtype == 'file'){
									list[i].image_list_seq = image_list_seq;
									
									image_list_seq ++;
								}
																					
							}
								
							that.input_field_list = list;
							
							that.show_input_list = 1;
								
						}
										
					}

				});
			},
			    
			uploading_img:function(){
				//上传图片，调用延誉宝接口返回图片存在   that.imgArray
				var that = this;
				var userInfo = that.abotapi.get_user_info();
				
				//判断已经上传几张，超过9张提示不可以上传
				var imgArray = that.imgArray;
				
				if(imgArray.length >= 9){
					uni.showToast({
						 title: '最多上传9张',
						 duration: 2000
					});
					return;
				}
				
				uni.chooseImage({
					
				    success: function (chooseImageRes) {
						console.log('chooseImageRes',chooseImageRes);
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log('chooseImageRes',tempFilePaths[2]);
						for(let i = 0; i < tempFilePaths.length;i++){
							uni.uploadFile({
							    url: that.abotapi.globalData.yanyubao_server_url + '/openapi/ShopAppV2Data/upload_video_or_img', //仅为示例，非真实的接口地址
							    filePath: tempFilePaths[i],
							    name: 'file',
							    formData: {
							        'sellerid': that.abotapi.globalData.default_sellerid,
									'type': 0,
									'checkstr': userInfo.checkstr,
									'userid': userInfo.userid,
							    },
							    success: function (uploadFileRes) {
									var JSON_uploadFileRes = JSON.parse(uploadFileRes.data);
									var imgArray = that.imgArray;
									
									imgArray.push(JSON_uploadFileRes.url);
									
									that.imgArray = imgArray;
									
							    }
							});
						}
				        
				    }
				});
			},
			
			delectImg:function(index){
				//删除上传图片数组里面的某一张图片
				
				var imgArray = this.imgArray;
				imgArray.splice(index,1);
				
				this.imgArray = imgArray;
				
			},
			
			bindPickerChangeshengArr: function (e) {
			    
			    var that = this;
			   
			    var region_Id = ++e.detail.value;
			    
			    that.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=region_get',
					data: {
						region_id: ++region_Id,
					},
					method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
					header: {// 设置请求的 header
						'Content-Type':  'application/x-www-form-urlencoded'
					},
					success: function (res) {
						// success
						// var code = res.data.code;
						that.city = res.data.data;
						if(res.data.code==1){
							var hArr = [];
							var hId = [];
							hArr.push('请选择');
							hId.push('0');
							for (var i = 0; i < that.city.length; i++) {
								hArr.push(that.city[i].region_name);
								hId.push(that.city[i].region_id);
							}
							this.province = region_Id;
							this.shi = res.data.data;
							this.shengArr = hArr;
							this.shengId = hId;
							
							
						}
					},
					fail: function () {
						// fail
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
					},
			
			    })
			},
			
			checkboxChange: function (e) {
				
				var that = this;
				var values = e.detail.value;
				
				//组合checkbox的值，关键是xml中要加 data-name，这样才能取到name
				
				var fieldname = e.currentTarget.dataset.name;
				var field_value_str = '';
				
				if(values.length > 0){
					field_value_str = values.join('|');
				}
				that.checkbox_field_value_list[fieldname] = field_value_str;
			},
			
			
			
			
			
			
			bindPickerChange:function(e){
				var that = this;
				var fieldname = e.currentTarget.dataset.fieldname;
				var list = that.input_field_list;
				var index = e.detail.value;
				
				for(var i=0; i<list.length; i++){
					
					if(list[i].fieldname == fieldname){
						list[i].index = index;
					}
																																					
				}
				
				
			},

			bindDateChange: function(e) {
								
				this.date = e.target.value;
				console.log('wadawda', e);
			},
			upLoadimgs: function(a) {
				console.log('wadad', a);
				
				var current_fieldname = a.currentTarget.dataset.name;
				var current_seq = a.currentTarget.dataset.seq;
				
				console.log('current_fieldname====>>>>'+ current_fieldname);
				console.log('current_fieldname====>>>>'+ typeof(current_fieldname));
				
		
				//return;
				
				var that = this;
				
				var userInfo = this.abotapi.get_user_info();
				
				var formData = {};
				formData.sellerid = that.abotapi.globalData.default_sellerid;
				
				if(userInfo && userInfo.userid){
					formData.checkstr = userInfo.checkstr;
					formData.userid = userInfo.userid;
				}
				
				//  
				
				/* that.image_list[current_fieldname] = 'http://saas.tseo.cn/staticsvc/uploads/2021/03/15/aab466fa19913d99c39f5fe8ee67aed44201.jpg';
				
				console.log('image_list ===>>', that.image_list);
				console.log('image_list ===>>', that.image_list[current_fieldname]);
				
				that.$forceUpdate();
				
				return;
				 */
				
				uni.chooseImage({
					// count:  允许上传的照片数量
					count: 1,
					// sizeType:  original 原图，compressed 压缩图，默认二者都有
					//sizeType: "original",
					sizeType: "compressed",
					success(res) {
						console.log(res, 'aaaaa8888')
			
						var filepath = res.tempFilePaths[0];
						
						console.log('8888888888', res.tempFilePaths[0])
						console.log('8888888888===>', that.abotapi.globalData.yanyubao_server_url);
						
						uni.uploadFile({
							url: that.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=upload_image_file_by_user',
							filePath: filepath,
							name: 'file',
							formData: formData,
							success: function(res) {
			
								console.log('res===>>', res.data);
								
								var obj = JSON.parse(res.data);
								
								
								that.image_list[current_fieldname] = obj.img_url;
								that.$forceUpdate();
								console.log('image_list ===>>', that.image_list);
								console.log('image_list ===>>', that.image_list[current_fieldname]);
								
			
							}
						});
			
					}
			
			
				});
			
			
			},
			
			auto_information_anchor:function(){
				
				var userInfo = this.abotapi.get_user_account_info();
				
				/* var now_time = new Date();
				
				this.now_time =  now_time.getFullYear() + "-" + (now_time.getMonth() + 1) + "-" + now_time.getDate() 
				+" " + now_time.getHours() + ":" + now_time.getMinutes();
				
				var end_time = now_time.getFullYear() + "-" + (now_time.getMonth() + 1) + "-" + (now_time.getDate() + 1) 
				+" " + now_time.getHours() + ":" + now_time.getMinutes();
				
				console.log('wwadwad', this.now_time, end_time); */
				
				//直播开始时间
				var timestamp = (new Date()).valueOf();
				timestamp += 15*60*1000;
				
				var date_time = util.formatTime(new Date(timestamp));
				var hour_time = util.formatTime2(new Date(timestamp));
				
				this.defaultValue_end = date_time + ' ' + hour_time;			
								
			},
			changeDatetimePicker: function(date,change_name) {
				
				
					//选择的时间
					this.time_start_end[change_name] = date.f3;
					
					this.$forceUpdate();	// 强制刷新数组元素
				
					console.log('选择的日期时间的change_name：', change_name);
					
					console.log('选择的日期时间数据：', date);
			},
			
			//富媒体 图片被点击
			index_rich_html_preview_image:function(img_src, e){
			},
			
			//富媒体 链接点击事件
			index_rich_html_click_link:function(new_url, e){
				
				console.log('index_rich_html_click_link====>>>>>', new_url);
				
				this.abotapi.call_h5browser_or_other_goto_url(new_url);
				
				
			},

			
		},		
		filters: {
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img标签里的style、width、height属性
			 * 2.img标签添加style属性：max-width:100%;height:auto
			 * 3.修改所有style里的width属性为max-width:100%
			 * 4.去掉<br/>标签
			 * @param html
			 * @returns {void|string|*}
			 */
			formatRichText (html) { //控制小程序中图片大小
				let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					return match;
				});
				//newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				
				newContent = newContent.replace(/<p[^>]*>/gi, '<p style="margin:10px;">');
				
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;vertical-align: middle;"');
				
				newContent = newContent.replace(/<h1[^>]*>/gi, '<h1 class="wxParse-h1">');
				newContent = newContent.replace(/<h2[^>]*>/gi, '<h2 class="wxParse-h2">');
				
				return newContent;
			}
			
		},
		
	}
</script>

<style>
	@import url("@/components/gaoyia-parse/parse.css");
	
	.wxParse {
		width: 95%;
		margin: 0 auto;
	}
	
	.FH{
		color: red;
	}
	
	.fabu_xuzhi_block{
		display: flex;
		font-size: 24rpx;
		color: #666;
		align-items: center;
		margin: 20rpx 34rpx 20rpx 50rpx;
		clear: both;
		
	}
	
	.btn-row-submit{
		width: 90%;
		margin-left: 5%;
		border-radius: 5px;
		background-color: #fff;
		margin: 20rpx auto;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #07c160;
		color: #fff;
		font-size: 32rpx

	}
	.input-flex-label{
	    width: 26%;
	    line-height: 60rpx;
	    font-size: 30rpx;
	}
	.bk888888{
		color: #333;
		margin-left: 77%;
		line-height: 43rpx;
	}
	
	.textarea_flex{
		padding: 40rpx;
		border-bottom: 1px solid #FFFFFF;
	}
	.box_1{
		overflow: auto;
		font-size: 30rpx;
		padding: 20rpx 40rpx;
		border-bottom: 1px solid #EEEEEE;
		background: #FFFFFF;
		height: 80rpx;
		line-height: 80rpx;
	}
	
	.box-file-upload {
		overflow: auto;
		font-size: 30rpx;
		padding: 20rpx 40rpx;
		border-bottom: 1px solid #EEEEEE;
		background: #FFFFFF;
	}
	
	.box-checkbox {
		overflow: auto;
		font-size: 30rpx;
		padding: 20rpx 40rpx;
		border-bottom: 1px solid #EEEEEE;
		background: #FFFFFF;
	}
	
	
	.box_1 input {
		float: left;
		width: 70%;
		margin-top: -4rpx;
		border: 1rpx solid #a2a2a2;
		height: 60rpx;
	}
	
	.box_2{
		float: left;
		font-size: 30rpx;
	}
	.box_3{
		float: left;
		margin-left:40rpx;
	}
	
	.box_text{
		/* position: relative; */
		/* top: -8rpx; */
		color: #666666;
	}
	.uni-textarea002{
		background: #FFFFFF;
		height: 430rpx;
	}
	
	.uni-textarea002 textarea{
		padding: 8rpx;
		font-size: 30rpx;
		width: 100%;
		
	}
	
	
	.input-flex{
		/* background: #FFFFFF; */
	}
	
	.zhezhao {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0,0,0,0.7);
	z-index: 998;
	
	}
	.kcrzxy {
	width: 70%;
	left: 50%;
	top: 15%;
	position: fixed;
	transform: translate(-50%,0);
	background: #fff;
	border-radius: 10px;
	z-index: 999;
	
	}
	
	.kcrzxyhd {
	text-align: center;
	font-size: 30rpx;
	background: #f44444;
	height: 70rpx;
	line-height: 70rpx;
	color: white;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	
	}
	
	.kcrzxybd {
	font-size: 28rpx;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	
	}
	
	scroll-view {
	display: block;
	width: 100%;
	
	}
	
	.queren {
	position: relative;	
	width: 30%;
	left: 35%;
	font-size: 30rpx;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	color: white;
	background: #f44444;
	border-radius: 10rpx;
	margin: 5px 0;
	
	}

	.up_images{
	float: right;
	background-color: #67C23A;
	padding: 10rpx;
	border-radius: 5px;
	color: #fff;
	}
	.error_tips{
		display: flex;
		float: left;
		margin-right: 15rpx;
		line-height: 60rpx;
	}



</style>
