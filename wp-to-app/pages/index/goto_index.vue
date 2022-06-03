<template>
	<view>
		
	</view>
</template>

<script>
	/**
	 * //用于设置默认的sellerid，然后向 index/index跳转。
	 * 因为从项目中的其他页面向index/index跳转的时候，index/index在tabbar，不能带参数
	 * 所以这里通过写storage，实现sellerid的传递。
	 * 
	 * /pages/index/goto_index?sellerid=pQNNmSkaq
	 * /pages/index/goto_index?scene=pQNNmSkaq
	 * /pages/index/goto_index?scene=sellerid_pQNNmSkaq
	 * 
	 */
	export default {
		data() {
			return {
			    
			};
		},
		onLoad(options) {
			
			console.log('aaaaaaaaaaaaaa');
			
			var sellerid = null;
			
			if (options && options.sellerid) {
				sellerid = options.sellerid;
				console.log('sellerid 02：' + sellerid);
			}
			else if(options && options.scene){
				var sellerid_scene = decodeURIComponent(options.scene);
				if (sellerid_scene && (sellerid_scene.indexOf('sellerid_') != -1) ) {
				  sellerid = sellerid_scene.replace('sellerid_', '');
				}
				else if (sellerid_scene && (sellerid_scene.indexOf('parentid_') == -1) ) {
				  sellerid = sellerid_scene;
				}
				
			}
			
				
			console.log('sellerid 05：' + sellerid);
				
			if (this.abotapi.globalData.force_sellerid == 1) {
			  sellerid = this.abotapi.globalData.default_sellerid;
			  
			  console.log('sellerid 06 （强制设置）：' + sellerid);
			}
				
			
			
			if(sellerid){
				this.abotapi.globalData.default_sellerid = sellerid
				this.abotapi.set_sellerid(sellerid);
			}	
			
			//========  End =======
			
			var var_list = Object();
			this.abotapi.call_h5browser_or_other_goto_url('/pages/index/index', var_list);
			
			
			//通过  redirectTo 跳转，模板页面应该添加一个返回首页的链接，不然在APP中会出现跳不回去的情况
			uni.reLaunch({
				url: '/pages/index/index',
				fail: (res) => {
					console.log(res);
				},
				success: (res) => {
					console.log(res);
				}
			})
			
		},
		onShow: () => {
			console.log('index/Liar onShow !');
			
			
		}
	}
</script>

<style>
</style>
