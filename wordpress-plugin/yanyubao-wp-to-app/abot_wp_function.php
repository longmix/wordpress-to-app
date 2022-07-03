<?php

if(!defined('ABOT_WP_FUNCTION_EXIST')){
	
	define('ABOT_WP_FUNCTION_EXIST', 1);
	
	function abot_wp_log($info){
		$cip = '';
	
		if(!empty($_SERVER["HTTP_CLIENT_IP"]))
			$cip = $_SERVER["HTTP_CLIENT_IP"];
		else if(!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
			$cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
		else if(!empty($_SERVER["REMOTE_ADDR"]))
			$cip = $_SERVER["REMOTE_ADDR"];
		else
			$cip = "Can not Get IP";
	
		$_filehandle = fopen("abot_wp_log_".date('Y-m-d').".log","a+");
	
		$log_str = "";
		if(is_array($info) || is_object($info)){
			$log_str = print_r($info, true)."\n";
		}
		else{
			$log_str = $info;
		}
	
		if(!fwrite($_filehandle, date('Y-m-d H:i:s') ."\t". $cip. "\t".$log_str ."\n" )){
			die("Failure to Log.");
		}
	
		fclose($_filehandle);
	}
	
	/**
	 * 读写缓存
	 *
	 * @param unknown $cache_name  缓存名称
	 * @param string $cache_content  缓存内容，不填则读取，填null则删除
	 * @param number $expire_time   缓存的超时时间，默认不超时
	 *
	 * @return Ambigous <>|boolean|Ambigous <unknown>
	 *
	 * 测试函数
	 *
	
	 $cache_name = 'test001.001';
	 $content = 'abcdefg';
	 $content = array('aa'=>'1111', 'bb'=>'222');
	
	 abot_wp_cache($cache_name, $content);
	 abot_wp_cache($cache_name, $content, 10);
	
	 echo abot_wp_cache($cache_name);
	 exit;
	
	 *
	 *
	 */
	function abot_wp_cache($cache_name, $cache_content='', $expire_time=0){
		$cache_name = md5($cache_name);
	
		$cache_file_path = 'temp/abot_wp_cache/' . $cache_name . '.php';
	
		if($cache_content){
	
			if(!is_dir('temp/')){
				mkdir('temp/');
			}
			if(!is_dir('temp/abot_wp_cache/')){
				mkdir('temp/abot_wp_cache/');
			}
	
	
	
			$content = "<?php\r\n";
			$content .= "\$data = " . var_export($cache_content, true) . ";\r\n";
	
			if($expire_time){
				$expire_time = time() + $expire_time;
				$content .= "\$expire = " . $expire_time . ";\r\n";
			}
			else{
				$content .= "\$expire = " . '0' . ";\r\n";
			}
	
			$content .= "?>";
			file_put_contents($cache_file_path, $content, LOCK_EX);
		}
		else if($cache_content === null){
			//$cache_file_path = 'temp/abot_wp_cache/' . $cache_name . '.php';
	
			unlink($cache_file_path);
		}
		else{
	
			static $result = array();
	
			//var_dump($result);
	
			if (!empty($result[$cache_name]))
			{
				return $result[$cache_name];
			}
	
			$cache_file_path = 'temp/abot_wp_cache/' . $cache_name . '.php';
	
			//var_dump($cache_file_path); var_dump(file_exists($cache_file_path));
	
			if (file_exists($cache_file_path))
			{
					
				include_once($cache_file_path);
					
				//var_dump($data);
					
				//如果过期了，则删除文件
				if(($expire > 0) && ($expire < time())){
					unlink($cache_file_path);
	
					return false;
				}
					
				$result[$cache_name] = $data;
					
				return $result[$cache_name];
			}
	
			return false;
		}
	}
	
	/**
	 * 发起http请求
	 * @param unknown $url
	 * @param string $data
	 * @param number $timeout
	 * @return mixed
	 */
	function abot_wp_http_request($url, $data=null, $timeout=20){
		$ch = curl_init();
	
		if (!$header){
			$header = array(
					"Accept-Charset: utf-8",
			);
		}
	
		curl_setopt($ch, CURLOPT_URL, $url);
	
		if($data){
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		}
		else{
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
		}
	
	
	
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
		$temp = curl_exec($ch);
	
		abot_wp_log("AbotFunction::curlPost ==>>>[$url]---[". print_r($data, true) ."]==>>[$temp]");
	
		return $temp;
	}
	
	
	
}


