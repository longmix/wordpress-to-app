<?php
//点赞
add_action( 'rest_api_init', function () {
  register_rest_route( 'yanyubao-wp-api/v1', 'post/like', array(
    'methods' => 'POST',
    'callback' => 'abot_wp2app_postLike'
  ) );
} );


function abot_wp2app_postLike($request) {
    $userid= $request['userid'];
    $postid=$request['postid'];

    if(empty($userid) || empty($postid) )
    {
        return new WP_Error( 'error', 'userid or postid is empty', array( 'status' => 500 ) );
    }
    else if(get_post($postid)==null)
    {
         return new WP_Error( 'error', 'post id is error ', array( 'status' => 500 ) );
    }
    
	if(!check_yanyubao_userid_exist($userid))
	{
	    return new WP_Error( 'error', 'Not allowed to submit', array( 'status' => 500 ) );
	    
		
	}
	
	
	
	if(is_wp_error(get_post($postid)))
	{
	     return new WP_Error( 'error', 'post id is error ', array( 'status' => 500 ) );
	}
	
	
	
	$data = abot_wp2app_post_like_json($userid,$postid); 
    if (empty($data)) {
		return new WP_Error( 'error', 'post like error', array( 'status' => 404 ) );
    }
    
    $response = new WP_REST_Response($data);
    $response->set_status( 200 ); 
    
    return $response;

}


function abot_wp2app_post_like_json($userid,$postid) { 
    $userid = "_".get_yanyubao_userid($userid);
    
    $postmeta = get_post_meta($postid, $userid,true);
    
    if (empty($postmeta))
    {
        
        if(add_post_meta($postid, $userid,'like', true))
        {
            $result["code"]="success";
            $result["message"]= "post  like success  ";
            $result["status"]="200";    
            return $result;
        
        }
        else
        {
            $result["code"]="success";
            $result["message"]= "post like error";
            $result["status"]="500";                   
            return $result;
        }
        
        
        
    }
    else
    {
            $result["code"]="success";
            $result["message"]= "you have  posted like ";
            $result["status"]="501";                   
            return $result;
        
    }
    
}


add_action( 'rest_api_init', function () {
  register_rest_route( 'yanyubao-wp-api/v1', 'post/islike', array(
    'methods' => 'POST',
    'callback' => 'abot_wp2app_getIsLike'
  ) );
} );



function abot_wp2app_getIsLike($request) {
    $userid= $request['userid'];
    $postid=$request['postid'];

    if(empty($userid) || empty($postid) )
    {
        return new WP_Error( 'error', 'userid or postid is empty', array( 'status' => 500 ) );
    }
    else if(get_post($postid)==null)
    {
         return new WP_Error( 'error', 'post id is error ', array( 'status' => 500 ) );
    }
    
    else
    { 
        if(!check_yanyubao_userid_exist($userid))
        {
            return new WP_Error( 'error', 'Not allowed to submit', array( 'status' => 500 ) );
        }
        else if(is_wp_error(get_post($postid)))
        {
             return new WP_Error( 'error', 'post id is error ', array( 'status' => 500 ) );
        }
        else
        {
        
            $data = abot_wp2app_post_islike_json($userid,$postid); 
            if (empty($data)) {
                return new WP_Error( 'error', 'post like error', array( 'status' => 404 ) );
              }
             $response = new WP_REST_Response($data);
             $response->set_status( 200 ); 
             return $response;
            
        }
        
    
    }

}


function abot_wp2app_post_islike_json($userid,$postid) {
    $userid = "_".get_yanyubao_userid($userid); 
    $postmeta = get_post_meta($postid, $userid,true);
    if (!empty($postmeta))
    {
        
            $result["code"]="success";
            $result["message"]= "you have  posted like ";
            $result["status"]="200";                   
            return $result;
        
        
    }
    else
    {
            $result["code"]="success";
            $result["message"]= "you have not  posted like ";
            $result["status"]="501";                   
            return $result;
        
    }
    
}



add_action( 'rest_api_init', function () {
  register_rest_route( 'yanyubao-wp-api/v1', 'post/mylike', array(
    'methods' => 'GET',
    'callback' => 'abot_wp2app_getmyLike'
  ) );
} );



function abot_wp2app_getmyLike($request) {
    $userid= $request['userid'];   

    if(empty($userid))
    {
        return new WP_Error( 'error', 'userid is empty', array( 'status' => 500 ) );
    }
    
    else
    { 
        if(!check_yanyubao_userid_exist($userid))
        {
            return new WP_Error( 'error', 'Not allowed to submit', array( 'status' => 500 ) );
           
        	
        }        
        
        
        $data = abot_wp2app_post_mylike_json($userid);
        if (empty($data)) {
        	return new WP_Error( 'error', 'post like error', array( 'status' => 404 ) );
        }
        $response = new WP_REST_Response($data);
        $response->set_status( 200 );
        
        return $response;
        
    
    }

}


function abot_wp2app_post_mylike_json($userid) {
    global $wpdb;
    $sql ="SELECT * from ".$wpdb->posts."  where ID in  
(SELECT post_id from ".$wpdb->postmeta." where meta_value='like' and meta_key = '_".get_yanyubao_userid($userid)."') ORDER BY post_date desc LIMIT 20";        
        $_posts = $wpdb->get_results($sql);
        $posts =array();
        foreach ($_posts as $post) {
            
            $_data["post_id"]  =$post->ID;
            $_data["post_title"]  =$post->post_title;
            $posts[]=$_data;
        }

        $result["code"]="success";
        $result["message"]= "get  comments success";
        $result["status"]="200";
        $result["data"]=$posts;                   
        return $result;         

}   