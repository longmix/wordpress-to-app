<?php 
//获取文章的第一张图片
function abot_wp2app_get_post_content_first_image($post_content){
	if(!$post_content){
		$the_post		= get_post();
		$post_content	= $the_post->post_content;
	} 

	preg_match_all( '/class=[\'"].*?wp-image-([\d]*)[\'"]/i', $post_content, $matches );
	if( $matches && isset($matches[1]) && isset($matches[1][0]) ){	
		$image_id = $matches[1][0];
		if($image_url = abot_wp2app_get_post_image_url($image_id)){
			return $image_url;
		}
	}

	preg_match_all('|<img.*?src=[\'"](.*?)[\'"].*?>|i', do_shortcode($post_content), $matches);
	if( $matches && isset($matches[1]) && isset($matches[1][0]) ){	   
		return $matches[1][0];
	}
}


//获取文章所有的图片
function abot_wp2app_get_post_content_all_image_list($post_content){
	if(!$post_content){
		$the_post		= get_post();
		$post_content	= $the_post->post_content;
	}

	preg_match_all('|<img.*?src=[\'"](.*?)[\'"].*?>|i', do_shortcode($post_content), $matches);
	if( $matches && isset($matches[1]) ){
		return $matches[1];
	}
	
	return false;
}



//获取文章图片的地址（将多媒体库中的ID，转为完整的图片网址）
function abot_wp2app_get_post_image_url($image_id, $size='full'){
	if($thumb = wp_get_attachment_image_src($image_id, $size)){
		return $thumb[0];
	}
	return false;	
}


// http://www.tseo.cn/wp-json/wp/v2/posts/1001
// https://www.abot.cn/wp-json/wp/v2/posts/2865
// http://www.tseo.cn/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&page=1
// https://www.abot.cn/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&page=1&categories=129

function abot_wp2app_getPostImages($post_content,$post_id){
	
	$_data = array();  
	
	
	//首先获取原来的公司官网设定好的缩略图，如果有，则直接使用
	$content_first_image = get_post_meta($post_id, 'icon_big640_image', true);
	
	if(strlen($content_first_image) == 0){
		$content_first_image = abot_wp2app_get_post_content_first_image($post_content);
	}
    
    if(empty($content_first_image))
    {
        $content_first_image = '';
    }
    
    

    $post_thumbnail_image_150 = '';
    $post_medium_image_300 = '';
    $post_thumbnail_image_624 = ''; 
    $post_thumbnail_image = '';
    
    $post_thumbnail_image_150 = get_post_meta($post_id, 'post_thumbnail_image_150', true);
    $post_medium_image_300 = get_post_meta($post_id, 'post_medium_image_300', true);
    $post_thumbnail_image_624 = get_post_meta($post_id, 'post_thumbnail_image_624', true);
    $post_thumbnail_image = get_post_meta($post_id, 'post_thumbnail_image', true);
    
    //如果这些缩略图不存在，则查找并创建新的
    if(!$post_thumbnail_image_150 || !$post_medium_image_300 || 
    		!$post_thumbnail_image_624 || !$post_thumbnail_image){
    	
    	
    	// get_post_thumbnail_id()函数主要是用来获取文章缩略图ID，通过该函数，如果当前文章设置了特色图像，就可以返回该特色图像的ID，如果没有设置则返回null值。
    	$thumbnail_id = get_post_thumbnail_id($post_id);
    	
    	//var_dump($thumbnail_id);
    	
    	
    	if($thumbnail_id ){
    		$thumb = wp_get_attachment_image_src($thumbnail_id, 'thumbnail');
    		$post_thumbnail_image = $thumb[0];
    	
    		if(empty($content_first_image))
    		{
    			$content_first_image = $post_thumbnail_image;
    		}
    	}
    	
    	
    	
    	
    	if(strlen($content_first_image)){
    		$attachments = get_attached_media( 'image', $post_id ); //查找文章的附件
    		
    		abot_wp_log('$attachments ===>>>'.print_r($attachments, true));
    		abot_wp_log('$content_first_image ===>>>'.print_r($content_first_image, true));
    		
    		
    		$index = array_keys($attachments);
    		
    		$flag=0;
    	
    		for ($i = 0; $i < sizeof($index); $i++) {
    			
    			$arr =$attachments[$index[$i]];
    			
    			$imageName = $arr->{"post_title"};
    			
    			abot_wp_log('$arr ===>>>'.print_r($arr, true));
    			abot_wp_log('$imageName ===>>>'.print_r($imageName, true));
    			
    			if($imageName && (strpos($content_first_image, $imageName)!==false)){  //附件的名称如果和第一张图片相同,就取这个附件的缩略图
    				$post_thumbnail_image_150 = wp_get_attachment_image_url($arr->{"ID"},'thumbnail');
    				$post_medium_image_300 = wp_get_attachment_image_url($arr->{"ID"},'medium');
    				$post_thumbnail_image_624 = wp_get_attachment_image_url($arr->{"ID"},'post-thumbnail');
    				
    				$id =$arr->{"ID"};
    				
    				$flag++;
    				
    				break;
    			}
    		}
    	
    		if($flag > 0)
    		{
    			$post_thumbnail_image = $post_thumbnail_image_150;
    		}
    		else
    		{
    			$post_thumbnail_image = $content_first_image;
    			
    			//设置三张图片的缩略图
    			$post_thumbnail_image_150 = plugin_dir_url(__FILE__).'timthumb.php?src='.urlencode($post_thumbnail_image).'&w='.'150';
    			$post_medium_image_300 = plugin_dir_url(__FILE__).'timthumb.php?src='.urlencode($post_thumbnail_image).'&w='.'300';
    			$post_thumbnail_image_624 = plugin_dir_url(__FILE__).'timthumb.php?src='.urlencode($post_thumbnail_image).'&w='.'624';
    			
    			$log_str = '通过自动缩略图插件：post_thumbnail_image_150==>>'.$post_thumbnail_image_150;
    			$log_str .= '  post_medium_image_300==>>'.$post_medium_image_300;
    			$log_str .= '  post_thumbnail_image_624==>>'.$post_thumbnail_image_624;
    			
    			abot_wp_log($log_str);
    		}
    	}
    	 
    	
    	//设置 图片的 默认值
    	if(strlen($post_thumbnail_image) == 0){
    		 
    		$category_thumbnail_image = get_option('yanyubao_category_default_cover');
    		if (!$category_thumbnail_image){
    			$category_thumbnail_image = 'http://www.tseo.cn/wp-content/uploads/2019/12/Tu_Pian_1.png';
    		}
    		 
    		$post_thumbnail_image = $category_thumbnail_image;
    	}
    	if(strlen($content_first_image) == 0){
    		 
    		$category_thumbnail_image = get_option('yanyubao_category_default_cover');
    		if (!$category_thumbnail_image){
    			$category_thumbnail_image = 'http://www.tseo.cn/wp-content/uploads/2019/12/Tu_Pian_1.png';
    		}
    		 
    		$content_first_image = $category_thumbnail_image;
    	}
    	
    	$log_str = '准备保存：post_thumbnail_image_150==>>'.$post_thumbnail_image_150;
    	$log_str .= '  post_medium_image_300==>>'.$post_medium_image_300;
    	$log_str .= '  post_thumbnail_image_624==>>'.$post_thumbnail_image_624;
    	$log_str .= '  post_thumbnail_image==>>'.$post_thumbnail_image;
    	$log_str .= '  icon_big640_image==>>'.$content_first_image;
    	abot_wp_log($log_str);
    	
    	
    	
    	//    && (strlen(trim(get_post_meta($post_id, 'post_thumbnail_image_150'))) > 0 )
    	if(get_post_meta($post_id, 'post_thumbnail_image_150')){
    		update_post_meta($post_id, 'post_thumbnail_image_150', $post_thumbnail_image_150);    		
    	}
    	else{
    		add_post_meta($post_id, 'post_thumbnail_image_150', $post_thumbnail_image_150, true);
    	}
    	
    	if(get_post_meta($post_id, 'post_medium_image_300')){
    		update_post_meta($post_id, 'post_medium_image_300', $post_medium_image_300);
    	}
    	else{
    		add_post_meta($post_id, 'post_medium_image_300', $post_medium_image_300, true);
    	}
    	
    	if(get_post_meta($post_id, 'post_thumbnail_image_624')){
    		update_post_meta($post_id, 'post_thumbnail_image_624', $post_thumbnail_image_624);
    	}
    	else{
    		add_post_meta($post_id, 'post_thumbnail_image_624', $post_thumbnail_image_624, true);
    	}
    	
    	if(get_post_meta($post_id, 'post_thumbnail_image')){
    		update_post_meta($post_id, 'post_thumbnail_image', $post_thumbnail_image);
    	}
    	else{
    		add_post_meta($post_id, 'post_thumbnail_image', $post_thumbnail_image, true);
    	}
    	//同时更新默认的缩略图
    	if(get_post_meta($post_id, 'icon_big640_image')){
    		update_post_meta($post_id, 'icon_big640_image', $content_first_image);
    	}
    	else{
    		add_post_meta($post_id, 'icon_big640_image', $content_first_image, true);
    	}
    	
    	
    	
    }

    
    if(strlen($post_medium_image_300)>0)
    {
    	$_data['post_medium_image_300'] = $post_medium_image_300;
    }
    else
    {
    	$_data['post_medium_image_300'] = $content_first_image;
    }
     
    if(strlen($post_thumbnail_image_624)>0)
    {
    	$_data['post_thumbnail_image_624'] = $post_thumbnail_image_624;
    }
    else
    {
    	$_data['post_thumbnail_image_624'] = $content_first_image;
    }
     
    $_data['post_thumbnail_image'] = $post_thumbnail_image;
     
    
    
    $_data['content_first_image'] = $content_first_image;
    
    
    
    
    //=============== 针对百度小程序的三张信息流推送的图片 Begin =============
    //图片列表
    $_data['mp_baidu_seo_image'] = get_post_meta($post_id, 'mp_baidu_seo_image', true);
    
    abot_wp_log('$_data  mp_baidu_seo_image 001====>>>'. $_data['mp_baidu_seo_image']);
    
    //如果没有设置百度SEO的图标，则先尝试从文章中自动提取三张
    if(!is_string($_data['mp_baidu_seo_image']) 
    		|| (strlen($_data['mp_baidu_seo_image']) < 10)  ){
    	
    	abot_wp_log('$_data  mp_baidu_seo_image 不存在====>>>准备提取图片');
    	
    	
    	$content_all_image_list = abot_wp2app_get_post_content_all_image_list($post_content);
    	
    	//if($post_id == 1001){
    	//	var_dump($content_all_image_list);exit;
    	//}
    	
    	if(count($content_all_image_list) >= 3){
    		$_data['mp_baidu_seo_image'] = '';
    		
    		$_data['mp_baidu_seo_image'] .= $content_all_image_list[0];
    		$_data['mp_baidu_seo_image'] .= ' ';
    		$_data['mp_baidu_seo_image'] .= $content_all_image_list[1];
    		$_data['mp_baidu_seo_image'] .= ' ';
    		$_data['mp_baidu_seo_image'] .= $content_all_image_list[2];
    		
    		abot_wp_log('$_data  mp_baidu_seo_image 提取的图片为====>>>'.$_data['mp_baidu_seo_image']);
    		
    		if(get_post_meta($post_id, 'mp_baidu_seo_image')){
    			update_post_meta($post_id, 'mp_baidu_seo_image', $_data['mp_baidu_seo_image']);
    			
    			abot_wp_log('$_data  mp_baidu_seo_image 记录已经存在，更新。');
    		}
    		else{
    			//add_post_meta($post_id, 'mp_baidu_seo_image', implode(' ', $_data['mp_baidu_seo_image']), true);
    			add_post_meta($post_id, 'mp_baidu_seo_image', $_data['mp_baidu_seo_image'], true);
    			
    			abot_wp_log('$_data  mp_baidu_seo_image 记录记录不存在，创建。');
    		}
    		
    	}
    	
    }
    
    
    //var_dump($_data['mp_baidu_seo_image']);exit;
    
    //2021.7.22. 如果文章中没有匹配到大约等于3张的图片
    if(!is_string($_data['mp_baidu_seo_image']) 
    		|| (strlen($_data['mp_baidu_seo_image']) < 10)  ){
    	
    	abot_wp_log('$_data  mp_baidu_seo_image 不存在====>>>但是文章内容中图片小于三张，准备使用缩略图');
    	
    	
    	//如果没有设置百度SEO的图标，则默认使用缩略图
    	$_data['mp_baidu_seo_image'] = array($_data['post_thumbnail_image']);
    	
    	if(get_post_meta($post_id, 'mp_baidu_seo_image')){
    		update_post_meta($post_id, 'mp_baidu_seo_image', implode(' ', $_data['mp_baidu_seo_image']));
    	}
    	else{
    		add_post_meta($post_id, 'mp_baidu_seo_image', implode(' ', $_data['mp_baidu_seo_image']), true);
    	}
    	
    }
    
    
    
    abot_wp_log('$_data  mp_baidu_seo_image 002====>>>'. $_data['mp_baidu_seo_image']);
    
    
    //执行到这里，$_data['mp_baidu_seo_image'] 肯定有值。   将空格分开的URL转为数组
    if(is_string($_data['mp_baidu_seo_image'])){
    	$temp_list = explode(' ', $_data['mp_baidu_seo_image']);
    	
    	$_data['mp_baidu_seo_image'] = array();
    	
    	foreach ($temp_list as $temp_item){
    		$_data['mp_baidu_seo_image'][] = $temp_item;
    	}
    }
    
    
    $_data['mp_baidu_seo_video'] = get_post_meta($post_id, 'mp_baidu_seo_video', true);
    if(strlen($_data['mp_baidu_seo_video']) < 10){
    	$_data['mp_baidu_seo_video'] = array();
    }
    else{
    	$_data['mp_baidu_seo_video'] = json_decode($_data['mp_baidu_seo_video'], true);
    
    	$_data['mp_baidu_seo_video'] = array();
    }
    //============== End =====================
    
    
    
    
	// 将  //www.abot.cn/xxxxx 转为   http://www.abot.cn/xxxxx
    foreach ($_data as $key=>$value){
    	
    	if(is_string($value) && (substr($value, 0, 2) == '//') ){
    		$_data[$key] = 'http:'.$value;
    	}
    }
    
    
    
    return  $_data;
}



function abot_wp2app_get_content_post($url,$post_data=array(),$header=array()){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);  // 从证书中检查SSL加密算法是否存在
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_AUTOREFERER,true);
    $content = curl_exec($ch);
    $info = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL);
    $code = curl_getinfo($ch,CURLINFO_HTTP_CODE);
    curl_close($ch);
    if($code == "200"){
        return $content;
    }else{
        return "错误码：".$code;
    }
}


//发起https请求
function abot_wp2app_https_request($url)
{
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($curl,  CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_TIMEOUT, 500);  
	$data = curl_exec($curl);
	if (curl_errno($curl)){
		return 'ERROR';
	}
	curl_close($curl);
	return $data;
}


/**
 * 将userid的数字转成字符串
 * @param unknown $userid
 * @return string
 */
function get_yanyubao_userid($userid){
	return 'yanyubao_userid_'.$userid;
}


/**
 * 检查延誉宝的openid是否存在，如果不存在，创建一条新记录
 * @param unknown $userid
 * @param string $author_name
 * @param string $author_url
 * @return boolean
 */
function check_yanyubao_userid_exist($userid, $author_name='', $author_url=''){
	if(!username_exists('yanyubao_userid_'.$userid))
	{
		//return new WP_Error( 'error', 'Not allowed to submit', array('status' => 500 ));
	
		//=====去延誉宝验证openid是否存在====
		$sellersn = get_option('yanyubao_sellersn');
		if ($sellersn){
			$url = 'http://yanyubao.tseo.cn/openapi/WordpressData/is_userid_exist';
			
			$post_data = array();
			$post_data['sellerid'] = $sellersn;
			$post_data['userid'] = $userid;
			
			$ret_str = abot_wp2app_get_content_post($url, $post_data);
			
			$ret_obj =  json_decode($ret_str, true);
			if ($ret_obj && ($ret_obj['code'] != 1)){
				//return new WP_Error( 'error', 'Not allowed to submit', array('status' => 500 ));
				
				return false;
			}
			
		} 
		
		//======End========
	}
	
	
	
	$userdata = array(
			'user_login'  =>  'yanyubao_userid_'.$userid,
			'nickname'=> $author_name,
			'user_nicename'=> 'yanyubao_userid_'.$userid,
			'display_name' => $author_url,
			'user_pass'   =>  NULL
	);
		
	$user_id = wp_insert_user( $userdata ) ;
	
	return true;
}

//等比例缩小图片，处理二维码
function abot_wp2app_PicCompress($src,$out_with=100){
    // 获取图片基本信息
    list($width, $height, $type, $attr) = getimagesize($src);
    // 获取图片后缀名
    $pictype = image_type_to_extension($type,false);
    // 拼接方法
    $imagecreatefrom = "imagecreatefrom".$pictype;
    // 打开传入的图片
    $in_pic = $imagecreatefrom($src);
    // 压缩后的图片长宽
    $new_width = $out_with;
    $new_height = $out_with/$width*$height;
    // 生成中间图片
    $temp = imagecreatetruecolor($new_width,$new_height);
    // 图片按比例合并在一起。
    imagecopyresampled($temp,$in_pic,0,0,0,0,$new_width,$new_height,$width,$height);
    // 销毁输入图片
    imagedestroy($in_pic);

    return $temp;

}

//添加文字到图片上，需要设置字体
function abot_wp2app_FontToPic($text,$font,$font_size=10,$pic_hight=50,$pic_width=300){
    // header("Content-type: image/jpeg");
    mb_internal_encoding("UTF-8");
    $im =imagecreate($pic_width,$pic_hight);
    $background_color = ImageColorAllocate ($im, 255, 255, 255);
    $col = imagecolorallocate($im, 0, 0, 0);
    $come=$text;
    /*水平居中（换行），固定字号*/
    $txt_max_width = intval(0.9*$pic_width);
    $content = "";
    for ($i=0;$i<mb_strlen($come);$i++) {
        $letter[] = mb_substr($come, $i, 1);
    }
    // var_dump($letter);die;
    foreach ($letter as $l) {
        $teststr = $content." ".$l;
        $testbox = imagettfbbox($font_size,0,$font,$teststr);
        // var_dump($testbox);die;
        // 判断拼接后的字符串是否超过预设的宽度
        if (($testbox[2] > $txt_max_width) && ($content !== "")) {
            $content .= "\n";
        }
        $content .= $l;
    }
    $test = explode("\n",$content);
    // var_dump($test);die;
    // $fbox = imagettfbbox(10,0,$font,$come);
    // echo  1;die;
    $txt_width = $testbox[2]-$testbox[0];

    $txt_height = $testbox[0]-$testbox[7];

    $y = ($pic_hight * 0.8)-((count($test)-1)*$txt_height); // baseline of text at 90% of $img_height
    // var_dump($txt_height);die;
    // imagettftext($im,$font_size,0,$x,$y,$col,$font,$content); //写 TTF 文字到图中
    foreach ($test as $key => $value) {
        $textbox = imagettfbbox($font_size,0,$font,$value);
        $txt_height = $textbox[0]-$textbox[7];
        $text_width = $textbox[2]-$textbox[0];
        $x = ($pic_width - $text_width) / 2;
        imagettftext($im,$font_size,0,$x,$y,$col,$font,$value);
        $y = $y+$txt_height+2; // 加2为调整行距
    }

    return $im;

}
/** 画圆角
 * @param $radius 圆角位置
 * @param $color_r 色值0-255
 * @param $color_g 色值0-255
 * @param $color_b 色值0-255
 * @return resource 返回圆角
 */
function abot_wp2app_get_lt_rounder_corner($radius, $color_r, $color_g, $color_b)
{
    // 创建一个正方形的图像
    $img = imagecreatetruecolor($radius, $radius);
    // 图像的背景
    $bgcolor = imagecolorallocate($img, $color_r, $color_g, $color_b);
    $fgcolor = imagecolorallocate($img, 0, 0, 0);
    imagefill($img, 0, 0, $bgcolor);
    // $radius,$radius：以图像的右下角开始画弧
    // $radius*2, $radius*2：已宽度、高度画弧
    // 180, 270：指定了角度的起始和结束点
    // fgcolor：指定颜色
    imagefilledarc($img, $radius, $radius, $radius * 2, $radius * 2, 180, 270, $fgcolor, IMG_ARC_PIE);
    // 将弧角图片的颜色设置为透明
    imagecolortransparent($img, $fgcolor);
    return $img;
}
/**
 * @param $im  大的背景图，也是我们的画板
 * @param $lt_corner 我们画的圆角
 * @param $radius  圆角的程度
 * @param $image_h 图片的高
 * @param $image_w 图片的宽
 */
function abot_wp2app_myradus($im, $lift, $top, $lt_corner, $radius, $image_h, $image_w)
{
/// lt(左上角)
    imagecopymerge($im, $lt_corner, $lift, $top, 0, 0, $radius, $radius, 100);
// lb(左下角)
    $lb_corner = imagerotate($lt_corner, 90, 0);
    imagecopymerge($im, $lb_corner, $lift, $image_h - $radius + $top, 0, 0, $radius, $radius, 100);
// rb(右上角)
    $rb_corner = imagerotate($lt_corner, 180, 0);
    imagecopymerge($im, $rb_corner, $image_w + $lift - $radius, $image_h + $top - $radius, 0, 0, $radius, $radius, 100);
// rt(右下角)
    $rt_corner = imagerotate($lt_corner, 270, 0);
    imagecopymerge($im, $rt_corner, $image_w - $radius + $lift, $top, 0, 0, $radius, $radius, 100);
}




