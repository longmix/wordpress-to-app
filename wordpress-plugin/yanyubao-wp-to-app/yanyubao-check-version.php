<?php

//Disable error reporting
//error_reporting(0);

//Report runtime errors
error_reporting(E_ERROR | E_PARSE);

//Report all errors
//error_reporting(E_ALL);


// http://xxxxxx/wp-content/plugins/yanyubao-wp-to-app/yanyubao-check-version.php?check_plugin_version=1
if($_REQUEST['check_plugin_version']){
	echo json_encode(array('plugin_name'=>'yanyubao-wp-to-app', 'version'=>'1.2.0', 'date'=>date('Y-m-d H:i:s')));
	exit;
}
