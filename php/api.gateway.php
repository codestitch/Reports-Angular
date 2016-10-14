<?php
	/********** PHP INIT **********/
	header('Cache-Control: no-cache');
	set_time_limit(0);
	ini_set('memory_limit', '-1');
	ini_set('mysql.connect_timeout','0');
	ini_set('max_execution_time', '0');
	ini_set('date.timezone', 'Asia/Manila');
	
	require_once('../../php/api/cipher/cipher.class.php');
	require_once('../../php/api/settings/config.php');
	$path = PATH."reports.php"; 

	// $path = str_replace("/reports/php", "", PATH)."reports.php"; 
	$data = [];


	if ($_SERVER['REQUEST_METHOD'] == 'POST')
	{
		$data = json_decode(file_get_contents("php://input")); 
	}
	else{
		echo json_encode(array(array("response"=>"Error", "errorCode"=>"400", "description"=>"Request Method Error.")));
		return;
		die();
	}


	if ((!isset($data->function)) || (!$data->function)) {
		echo json_encode(array(array("response"=>"Error", "errorCode"=>"400", "description"=>"No Function Found.")));
		return;
		die();
	}

	$function = $data->function; 
	$key = randomizer(32);
	$iv = randomizer(16);

	$cipher = NEW cipher($key, $iv);

	switch ($function) { 

		case 'login':
			$username = "";
			$password = ""; 

			if ((!isset($data->username)) || (!$data->username)) {
				echo json_encode(array(array("response"=>"Error", "description"=>"Invalid Username/Password.")));
				return;
				die();
			} else {
				$username = filter_var($data->username, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
				$username = $cipher->encrypt($username);
			}

			if ((!isset($data->password)) || (!$data->password)) {
				echo json_encode(array(array("response"=>"Error", "description"=>"Invalid Username/Password.")));
				return;
				die();
			} else {
				$password = filter_var($data->password, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
				$password = $cipher->encrypt($password);
			} 

			$function = $cipher->encrypt("login");
			$params = "oauth=".urlencode($key)."&token=".urlencode($iv)."&username=".urlencode($username)."&password=".urlencode($password);
			$url = $path."?function=".urlencode($function);
			$cURL = curl_init();
			curl_setopt($cURL, CURLOPT_URL, $url);
			curl_setopt($cURL, CURLOPT_POST, 1);
			curl_setopt($cURL, CURLOPT_POSTFIELDS, $params);
			curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);
			$server_output = curl_exec ($cURL);
			curl_close ($cURL);
			$output = json_decode($server_output);
 
			if (($output[0]->response) == "Success") { 
				echo $server_output;
			} else {
				echo $server_output;
			}

			break; 


		default:
			# code...
			break;
	}

	/********** Randomizer **********/
	function randomizer($len, $norepeat = true) {
	    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    $max = strlen($chars) - 1;

	    if ($norepeat && $len > $max + 1) {
	        throw new Exception("Non repetitive random string can't be longer than charset");
	    }

	    $rand_chars = array();

	    while ($len) {
	        $picked = $chars[mt_rand(0, $max)];

	        if ($norepeat) {
	            if (!array_key_exists($picked, $rand_chars)) {
	                $rand_chars[$picked] = true;
	                $len--;
	            }
	        }
	        else {
	            $rand_chars[] = $picked;
	            $len--;
	        }
	    }

	    return implode('', $norepeat ? array_keys($rand_chars) : $rand_chars);   
	}
	

?>