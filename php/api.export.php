<?php 
	/********** PHP INIT **********/
	header('Access-Control-Allow-Origin: *');  
	header('Cache-Control: no-cache');
	set_time_limit(0);
	ini_set('memory_limit', '-1');
	ini_set('mysql.connect_timeout','0');
	ini_set('max_execution_time', '0');
	ini_set('date.timezone', 'Asia/Manila');  

	 
	include 'PHPExcel.php';
	include 'PHPExcel/Writer/Excel2007.php';

	/********** MySQLi Config **********/
	$mysqli = new mysqli("localhost", "root", "28rskad08dwR", "work_bistro_2016");
	$sql = "";


	// filters
	$email =  (!isset($_POST['email']) ) ? "" : $_POST['email'];  
	$gender =  (!isset($_POST['gender']) ) ? "" : $_POST['gender']; 
	$birthday =  (!isset($_POST['birthday']) ) ? "" : $_POST['birthday']; 
	$startAge =  (!isset($_POST['startAge']) ) ? "" : $_POST['startAge']; 
	$endAge =  (!isset($_POST['endAge']) ) ? "" : $_POST['endAge'];  

	$startDate = (!isset($_POST['startDate']) ) ? "" : $_POST['startDate']; 

	$endDate =  (!isset($_POST['endDate']) ) ? "" : $_POST['endDate']; 
	$locName = (!isset($_POST['locName']) ) ? "" : $_POST['locName'];  
	$memberID =  (!isset($_POST['memberID']) ) ? "" : $_POST['memberID']; 
	$startTime =  (!isset($_POST['startTime']) ) ? "" : $_POST['startTime']; 

	$brandID = (!isset($_POST['brandID']) ) ? "" : $_POST['brandID'];   


	$output = array();

	if ((!isset($_POST['function'])) || (!$_POST['function'])) {
		echo "error";
		return;
	} else {
		$function = $_POST['function'];
		$function = filter_var($function, FILTER_SANITIZE_URL);
	} 

	if($mysqli->connect_errno > 0){
	    die('Unable to connect to database [' . $mysqli->connect_error . ']');
	}

	$mydate=getdate(date("U"));
	$filename = date("m") ."-".date("d")."-".date("Y"); 

	// echo "exporting data: ".$filename;

	switch ($function) {

		/********** Registration **********/

		case 'export_cardregistration': 
			$filename = $filename."_cardregistration.xlsx";

			$sql = "SELECT  b.name as 'Restaurant', l.name as 'Branch', SUM(IF(m.activation IS NULL, 1, 0)) AS 'Total Activated', SUM(IF(m.activation IS NOT NULL, 1, 0)) AS 'Total Not Activated', SUM(IF(m.activation IS NULL, 2500, 0)) AS 'Total Sales' 
					 FROM memberstable m INNER JOIN loctable l ON m.locid = l.locid
					 LEFT JOIN brandtable b ON l.brandid = b.brandid
					 WHERE DATE(m.datereg) >= '".$startDate."' AND DATE(m.datereg) <= '".$endDate."'
					 GROUP BY b.name, l.name
					 ORDER BY 'Total Sales' DESC";
 
			break;

		case 'export_cardhistory_active':
			$filename = $filename."_cardhistory_active.xlsx";
			
			$sql = "SELECT qrcard as 'Card No.', email as 'Email', concat(fname, ' ', lname) as 'Name', dateofbirth as 'Birthday', gender as 'Gender', datereg as 'Registered Date', expiration as 'Expiration Date', servername as 'Server Name', totalpoints as 'Total Points', lasttransaction as 'Last Transaction', locid as 'Location ID' from memberstable where date(datereg) >= '".$startDate."' and date(datereg) <= '".$endDate."' and activation is null";

			break; 

		case 'export_cardhistory_inactive':
			$filename = $filename."_cardhistory_inactive.xlsx";
			
			$sql = "SELECT qrcard as 'Card No.', email as 'Email', concat(fname, ' ', lname) as 'Name', dateofbirth as 'Birthday', gender as 'Gender', datereg as 'Registered Date', expiration as 'Expiration Date', servername as 'Server Name', totalpoints as 'Total Points', lasttransaction as 'Last Transaction', locid as 'Location ID' from memberstable where date(datereg) >= '".$startDate."' and date(datereg) <= '".$endDate."' and activation is not null";

			break; 

		case 'export_cardhistory_expired':
			$filename = $filename."_cardhistory_expired.xlsx";
			
			$sql = "SELECT qrcard as 'Card No.', email as 'Email', concat(fname, ' ', lname) as 'Name', dateofbirth as 'Birthday', gender as 'Gender', datereg as 'Registered Date', expiration as 'Expiration Date', servername as 'Server Name', totalpoints as 'Total Points', lasttransaction as 'Last Transaction', locid as 'Location ID' from memberstable where date(datereg) >= '".$startDate."' and date(datereg) <= '".$endDate."' and now() > expiration";

			break; 


		/********** Demographics **********/ 
		case 'export_customerSummary': 

			$filename = $filename."_customerSummary.xlsx";

			$sql = "SELECT (CASE
                       WHEN mem.regtype = 'app' and mem.platform = 'android' THEN 'Android'
                       WHEN mem.regtype = 'app' and mem.platform = 'ios' THEN 'IOS'
                       else 'Card'
                   END) AS 'TYPE', mem.qrCard as 'QR Card',
                   mem.memberid as 'Member ID', mem.email as 'Email', concat(mem.fname, ' ', mem.lname) as 'Name',
                   DATE_FORMAT(mem.datereg, '%d-%M-%Y') as 'Date Registered', mem.dateofbirth as 'Birthday', CONCAT(UCASE(MID(mem.gender,1,1)),MID(mem.gender,2))as 'Gender', mem.mobilenum as 'Mobile', sum(e.amount) as 'loyaltySales', count(e.transactionid) as 'Loyalty Transaction Sales', DATE_FORMAT(MAX(e.dateAdded), '%d-%M-%Y') as 'Date Last Purchased'
                   
                   FROM memberstable mem left join earntable e 
                   on mem.memberid = e.memberid
                   where mem.activation is null and 
					DATE_FORMAT(mem.datereg, '%Y/%m/%d') >= '".$startDate."'
				AND DATE_FORMAT(mem.datereg, '%Y/%m/%d') <= '".$endDate."'
                   group by mem.memberid"; 
 
			break;

		case 'export_customerTransactionHistory':

			$filename = $filename."_customerTransactionHistory.xlsx";

			$sql = "SELECT e.transactiontype AS 'Type', e.memberid AS 'Member\'s Account No.', e.transactionid AS 'Transaction ID', 
						IFNULL(CONCAT(m.fname, ' ', m.lname),e.email) AS 'Member\'s Name', locname AS 'Branch of Purchase', dateAdded AS 'Date of Purchase', amount AS 'Sales Amount'
						FROM earntable e INNER JOIN memberstable m ON e.memberid = m.memberid
						WHERE e.amount > 0 AND e.memberid = '".$memberID."' ";
 
			break;


		/********** Sales **********/ 
		case 'export_salesreportsummary': 

			$filename = $filename."_salesreportsummary.xlsx";  
			$sql = "SELECT tmp.brandname as 'Restaurant', tmp.locname as 'Branch', COUNT(DISTINCT(tmp.memberid)) AS 'Total Member', SUM(tmp.amount) AS 'Total Amount', 
						COUNT(tmp.transactionid) AS 'Total Transaction'
						FROM
						(
						 SELECT brandname, locname, memberid, amount, transactionid FROM earntable
						 WHERE amount > 0 
						 AND DATE_FORMAT(dateAdded, '%Y/%m/%d') >= '".$startDate."'
						 AND DATE_FORMAT(dateAdded, '%Y/%m/%d') <= '".$endDate."'
						)
						AS tmp
						GROUP BY tmp.brandname, tmp.locname";

			break;  

		case 'export_salesreporthourly':
  
			$filename = $filename."_salesreporthourly.xlsx";
			$sql = "SELECT DATE(tmp.dateAdded) as 'DateAdded', DATE_FORMAT(tmp.dateAdded, '%H:00:00') AS Hour, COUNT(DISTINCT(tmp.memberid)) AS 'Members Count',
					SUM(tmp.amount) AS 'Total Loyalty Sales', COUNT(tmp.transactionid) AS 'Total Transactions'
					FROM
					(
					 SELECT dateAdded, memberid, amount, transactionid, locname FROM earntable WHERE amount > 0
					 AND DATE_FORMAT(dateAdded, '%Y/%m/%d %H:00:00') >= '".$startDate." 00:00:00' 
					 AND DATE_FORMAT(dateAdded, '%Y/%m/%d %H:00:00') <= '".$endDate." 23:59:59'
					 AND locID = '".$locName."' AND brandID = '".$brandID."'
					)
					AS tmp
					GROUP BY DATE(tmp.dateAdded), DATE_FORMAT(tmp.dateAdded, '%H:00:00')";

			break; 

		case 'export_salesreportmembers':
 
			$filename = $filename."_salesreportmembers.xlsx";
			$sql = "SELECT tmp.memberid as 'Member\'s Account No.', tmp.email as 'Email', SUM(tmp.amount) as 'Total Loyalty Sales'
						FROM
						(
						  SELECT memberid, email, amount
						  FROM earntable WHERE amount > 0 AND 
						  DATE_FORMAT(dateAdded, '%Y-%m-%d %H:00:00') >= '".$startDate." ".$startTime."'
						  AND DATE_FORMAT(dateAdded, '%Y-%m-%d %H:00:00') <= '".$startDate." ".substr($startTime,0,2).":59:59'
						  AND locID = '".$locName."' AND brandID = '".$brandID."'
						)
						AS tmp
						GROUP BY tmp.memberid;"; 


			break; 

		/********** Redemption **********/ 

		case 'export_redemptionSummary':
  
			$filename = $filename."_redemptionSummary.xlsx";

			$sql ="SELECT rdm.brandname as 'Restaurant', rdm.locName AS 'Branch', rdm.rcount AS 'Total Transactions', IFNULL(SUM(tmp.points),0) AS 'Total Earned Points', rdm.rpoints AS 'Total Redeemed Points'
					FROM
					(
						SELECT brandname, locName, points, COUNT(DISTINCT(memberid)) AS rcount, SUM(points) AS rpoints       
						FROM redeemtable 
						WHERE DATE_FORMAT(dateAdded, '%Y/%m/%d') >= '".$startDate."'
						AND DATE_FORMAT(dateAdded, '%Y/%m/%d') <= '".$endDate."'
						GROUP BY locName
					)
					AS rdm
					LEFT JOIN
					(
						SELECT brandname, locname, memberid, points, transactionid FROM earntable
												WHERE amount > 0 
												AND DATE_FORMAT(dateAdded, '%Y/%m/%d') >= '".$startDate."'
												AND DATE_FORMAT(dateAdded, '%Y/%m/%d') <= '".$endDate."'
					)
					AS tmp
					ON rdm.locname = tmp.locname
					GROUP BY rdm.brandname, rdm.locName"; 


			break; 

		case 'export_locationTransactions': 

			$filename = $filename."_locationTransactions.xlsx";

			$sql ="SELECT rdm.memberid AS 'Member ID', IFNULL(sum(tmp.points) ,0) as 'Earned Points', rdm.rpoints as 'Redeemed Points'
						from
						(
							select memberid, locname, sum(points) as rpoints
							from redeemtable
							where DATE_FORMAT(dateAdded, '%Y/%m/%d') >= '".$startDate."'
							AND DATE_FORMAT(dateAdded, '%Y/%m/%d') <= '".$endDate."'
							and locname = '".$locName."'
							group by memberid
						) 
						as rdm
						left join
						(
							select locname, memberid, points, transactionid from earntable
							where amount > 0 
						    and DATE_FORMAT(dateAdded, '%Y/%m/%d') >= '".$startDate."'
							AND DATE_FORMAT(dateAdded, '%Y/%m/%d') <= '".$endDate."'
							and locname = '".$locName."'
						)
						as tmp
						on rdm.memberid = tmp.memberid
						group by rdm.memberid"; 
						
			break; 



		/********** Customers **********/ 
		case 'export_customers_quarterlysales':
			$filename = $filename."_customers_quarterlysales.xlsx";
				
			$sql = "SELECT m.qrcard as 'Card No.', e.email as 'Email', sum(e.points) as 'Sales'
					 from earntable e inner join memberstable m on e.memberid=m.memberid
					 where quarter(e.dateadded) = quarter(now())
					 group by m.qrcard
					 order by sales desc limit 20";

			break;

		case 'export_customers_quarterlysales_all':
			$filename = $filename."_customers_quarterlysales_all.xlsx";
				
			$sql = "SELECT m.qrcard as 'Card No.', e.email as 'Email', sum(e.points) as 'Sales'
					 from earntable e inner join memberstable m on e.memberid=m.memberid
					 where quarter(e.dateadded) = quarter(now())
					 group by m.qrcard
					 order by sales";

			break;

		case 'export_customers_quarterlyvisits':
			$filename = $filename."_customers_quarterlyvisits.xlsx";
				
				$sql = "SELECT m.qrcard as 'Card No.', e.email as 'Email', count(e.earnid) as 'Visit'
						from earntable e inner join memberstable m on e.memberid=m.memberid
						where quarter(e.dateadded) = quarter(now())
						group by m.qrcard
						order by visit desc limit 20"; 
			break;

		case 'export_customers_quarterlyvisits_all':
			$filename = $filename."_customers_quarterlyvisits_all.xlsx";
				
				$sql = "SELECT m.qrcard as 'Card No.', e.email as 'Email', count(e.earnid) as 'Visit'
						from earntable e inner join memberstable m on e.memberid=m.memberid
						where quarter(e.dateadded) = quarter(now())
						group by m.qrcard
						order by visit"; 
			break;


		/********** Branches **********/

		case 'export_branch_quarterlysales':
			$filename = $filename."_branch_quarterlysales.xlsx";
				
			$sql = "SELECT brandname as 'Restaurant', locname as 'Branch', sum(points) as 'Sales' from earntable where quarter(dateadded) = quarter(now())
					 group by brandname, locname 
					 order by sales desc limit 10";

			break;

		case 'export_branch_quarterlysales_all':
			$filename = $filename."_branch_quarterlysales_all.xlsx";
				
			$sql = "SELECT brandname as 'Restaurant', locname as 'Branch', sum(points) as 'Sales' from earntable where quarter(dateadded) = quarter(now())
					 group by brandname, locname 
					 order by sales desc";

			break;

		case 'export_branch_quarterlyvisits':
			$filename = $filename."_branch_quarterlyvisits.xlsx";
			
			$sql = "SELECT brandname as 'Restaurant', locname as 'Branch', count(transactionid) as 'Visit' from earntable where quarter(dateadded) = quarter(now())
					 group by brandname, locname 
					 order by visit desc limit 10"; 
			break;

		case 'export_branch_quarterlyvisits_all':
			$filename = $filename."_branch_quarterlyvisits_all.xlsx";
			
			$sql = "SELECT brandname as 'Restaurant', locname as 'Branch', count(transactionid) as 'Visit' from earntable where quarter(dateadded) = quarter(now())
					 group by brandname, locname 
					 order by visit desc"; 
			break;



		/********** Vouchers **********/ 

		case 'export_redemptionVoucher':
			$filename = $filename."_redemptionVoucher.xlsx";

			$sql = "SELECT brandname as 'Restaurant', locname as 'Branch', NAME as 'Voucher', COUNT(name) as 'Total' FROM redeemvouchertable
						 WHERE DATE(dateadded) >= '".$startDate."' AND DATE(dateadded) <= '".$endDate."'
						GROUP BY brandname, locname, name"; 

			break;

		case 'export_customerRedemptionVoucher' :
			$filename = $filename."_customerRedemptionVoucher.xlsx";

			$sql = "SELECT r.memberid as 'Member ID', m.qrcard as 'CARD No.', r.email as 'Email', r.brandname as 'Restaurant', r.locname as 'Branch', r.name as 'Voucher', r.dateadded as 'Transaction Date'
					FROM redeemvouchertable r INNER JOIN memberstable m ON r.memberid=m.memberid
					WHERE DATE(r.dateadded) >= '".$startDate."' AND DATE(r.dateadded) <= '".$endDate."' 
					ORDER BY m.qrcard, r.dateadded";  

			break;



		/********** Spent **********/  

		case 'export_spentsummary':
			$filename = $filename."_spentsummary.xlsx";

			$sql = "SELECT tmp.email AS Email, tmp.qrcard AS 'Card Number', SUM(tmp.amount) AS 'Total Spend', COUNT(*) AS 'Total Transaction', FORMAT(AVG(TMP.amount),0) AS 'Average Spend'
			    FROM
			    (
			     SELECT m.image, m.qrcard, e.email, e.amount, e.points FROM earntable e INNER JOIN memberstable m ON e.memberid=m.memberid 
			     WHERE e.amount > 0 AND DATE(e.dateadded) >= '".$startDate."' AND DATE(e.dateadded) <= '".$endDate."' AND e.amount > 0 
			    )
			   AS tmp
				GROUP BY tmp.email  ORDER BY SUM(tmp.amount) DESC"; 

			break;

 

		/********** Special Report **********/ 
		case 'export_customerdetails':

			$filename = $filename."_customerdetails.xlsx";

			$filteredqry = "SELECT memberid as 'Members Acct No.', concat(fname, ' ', lname) as 'Members Name', gender as 'Gender', dateofbirth as 'Birthdate', 
				TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) as 'Age', 
				(case 
				    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) < 18 then 'Below 18'
				    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 18 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 25 then  '18 to 25'
				    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 26 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 35 then '26 to 35'
				    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 36 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 45 then  '36 to 45'
				    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 46 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 59 then  '46 to 59'
				    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) > 60  then  '60 and Above'
				end) as 'Age Bracket', 
				mobilenum as 'Mobile', email as 'Email'  from memberstable where ";

			// $filteredqry = "SELECT memberID as 'MemberID', email as 'Email', address1 as 'Address', CONCAT(fname, ' ', lname) as 'Name', DATE_FORMAT(dateofbirth, '%d-%M-%Y') as 'Birthday', gender as 'Gender', mobileNum as 'Mobile No.', totalPoints as 'Total Points' from memberstable where "; 
			
			$hasinitfilter = false; 

			if ($email != "") {
				$filteredqry .= " `email` LIKE '%" . $email. "%'";
				$hasinitfilter = true;
			} 

			if ($gender != "" && !$hasinitfilter) {
				$filteredqry .=  " `gender` = '" . $gender . "'";
				$hasinitfilter = true;
			}
			else if ($gender != "" && $hasinitfilter) { 	  
				$filteredqry .= " AND `gender` = '" . $gender . "'";
			}

			if ($birthday != "" && !$hasinitfilter) {
				$filteredqry .=  " DATE_FORMAT(dateOfBirth, '%c') = " .$birthday;
				$hasinitfilter = true;
			}
			else if ($birthday != "" && $hasinitfilter){  
				$filteredqry .= " AND DATE_FORMAT(dateOfBirth, '%c') = " .$birthday;
			} 

			if ($startAge != "" && !$hasinitfilter) {
				$filteredqry .=  " CAST(DATEDIFF(NOW(), DATE(`dateOfBirth`)) / 365.25 AS UNSIGNED) > " . $startAge . " AND CAST(DATEDIFF(NOW(), DATE(`dateOfBirth`)) / 365.25 AS UNSIGNED) < " . $endAge;
				$hasinitfilter = true;
			}
			else if ($startAge != "" && $hasinitfilter){  
				$filteredqry .=  " AND CAST(DATEDIFF(NOW(), DATE(`dateOfBirth`)) / 365.25 AS UNSIGNED) > " . $startAge . " AND CAST(DATEDIFF(NOW(), DATE(`dateOfBirth`)) / 365.25 AS UNSIGNED) < " . $endAge;
			}

			if ($startDate != "" && !$hasinitfilter) {
				$filteredqry .=  " DATE_FORMAT(dateReg, '%Y/%m/%d') >= '".$startDate."' AND DATE_FORMAT(dateReg, '%Y/%m/%d') <= '".$endDate."' ";
				$hasinitfilter = true;
			}
			else if ($startDate != "" && $hasinitfilter){  
				$filteredqry .=  " AND DATE_FORMAT(dateReg, '%Y/%m/%d') >= '".$startDate."' AND DATE_FORMAT(dateReg, '%Y/%m/%d') <= '".$endDate."' ";
			}


			$sql = $filteredqry;   

 			break; 

 		case 'export_customerHistoryTransactions':
 			
			$filename = $filename."_customerHistoryTransactions.xlsx";
 			$sql = "SELECT e.transactiontype as 'Type', e.memberid as 'Member ID', e.transactionid as 'Transaction ID', 
						IFNULL(concat(m.fname, ' ', m.lname),e.email) as 'Member\'s Name', locname as 'Branch', dateAdded as 'Date of Transaction', amount as 'Amount', points AS 'Snaps'
						from earntable e inner join memberstable m on e.memberid = m.memberid
						where e.memberid = '".$memberID."' ";

 			break;

	}// end switch


	if ($sql != "") {

		if(!$result = $mysqli->query($sql)){
		    die('There was an error running the query [' . $mysqli->error . ']');
		}

		// Initialize Excel
		$objPHPExcel = new PHPExcel();

		$objPHPExcel->getProperties()->setCreator("Appsolutely Inc");
		$objPHPExcel->getProperties()->setLastModifiedBy("CodeStitch");
		$objPHPExcel->getProperties()->setTitle("User Platform");
		$objPHPExcel->getProperties()->setTitle("Office 2007 XLSX Report");
		$objPHPExcel->getProperties()->setSubject("Office 2007 XLSX Statistics Report");
		$objPHPExcel->getProperties()->setDescription("Statistics report for merchant");

		$objPHPExcel->getSheet(0);  

		$header = 'a1:h1';  


		$headerArray = array();
		$inc = 0;

		if ($result->num_rows > 0) {

			while ($row = $result->fetch_assoc()) {

				$headCount = count($row);
				foreach ($row as $array_key => $array_value) {
			       $row[$array_key] = html_entity_decode($array_value, ENT_QUOTES, 'UTF-8');

			      $inc++;
		       	if ($inc<=$headCount) { 
		       		array_push($headerArray, $array_key);
					}

			   } 
				array_push($output, $row);
			}  
 
		 	$objPHPExcel->getActiveSheet()->fromArray($headerArray, ' ', 'A1');
		 	$objPHPExcel->getActiveSheet()->fromArray($output, ' ', 'A2');
 
			if (!isset($row['result'])) { 
				$objPHPExcel->getActiveSheet()->setTitle('report');  

				// SAVE
				$writer = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007'); 
				$writer->save(str_replace(__FILE__,'../excel/'.$filename,__FILE__));    
				echo json_encode(array(array("response"=>"Success", "filename"=>$filename)));  

			}
			else {
				echo json_encode(array(array("response"=>$row['result'])));
			} 
			
		} else { 
			echo json_encode(array(array("response"=>"Empty" )));
		}		

		$mysqli->close();
	}

?>