<?php 
	/********** PHP INIT **********/
	header('Access-Control-Allow-Origin: *');  
	header('Cache-Control: no-cache');
	set_time_limit(0);
	ini_set('memory_limit', '-1');
	ini_set('mysql.connect_timeout','0');
	ini_set('max_execution_time', '0');
	ini_set('date.timezone', 'Asia/Manila'); 

	/********** MySQLi Config **********/
	$mysqli = new mysqli("localhost", "root", "28rskad08dwR", "work_bistro_2016");
	$sql = "";

	/********** Parameters **********/
	if ((!isset($_GET['function'])) || (!$_GET['function'])) {
		echo "error";
		return;
	} else {
		$function = $_GET['function'];
		$function = filter_var($function, FILTER_SANITIZE_URL);
	} 

	if($mysqli->connect_errno > 0){
	    die('Unable to connect to database [' . $mysqli->connect_error . ']');
	}

	$startDate = (!isset($_GET['startDate']) ) ? "" : $_GET['startDate'];
	$endDate = (!isset($_GET['endDate']) ) ? "" : $_GET['endDate']; 
	$locName = (!isset($_GET['locName']) ) ? "" : filter_var($_GET['locName'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH); 
	$locID = (!isset($_GET['locID']) ) ? "" : $_GET['locID']; 
	$startTime = (!isset($_GET['startTime']) ) ? "" : $_GET['startTime']; 
	$memberID = (!isset($_GET['memberID']) ) ? "" : $_GET['memberID'];   

	// filters
	$email = (!isset($_GET['email']) ) ? "" : $_GET['email'];
	$qrApp = (!isset($_GET['qrApp']) ) ? "" : $_GET['qrApp'];  
	$gender = (!isset($_GET['gender']) ) ? "" : $_GET['gender'];  
	$birthday = (!isset($_GET['birthday']) ) ? "" : $_GET['birthday'];   
	$startAge = (!isset($_GET['startAge']) ) ? "" : $_GET['startAge'];   
	$endAge = (!isset($_GET['endAge']) ) ? "" : $_GET['endAge'];   

	$table = (!isset($_GET['table']) ) ? "" : $_GET['table'];   
	$brandID = (!isset($_GET['brandID']) ) ? "" : $_GET['brandID'];   

	// echo "startDate: ".$startDate;
	// echo "endDate: ".$endDate; 
	$output = array();

	switch ($function) {

		/********** Downloads **********/ 

		case 'get_downloads_yearly':
			$sql = "SELECT monthname(dateAdded) as Month, 
			      SUM(CASE 
			             WHEN platform = 'android' THEN 1
			             ELSE 0
			           END) AS Android,
			       SUM(CASE 
			             WHEN platform = 'ios' THEN 1
			             ELSE 0
			           END) AS iOS
					from devicetokens where year(dateAdded) = YEAR(NOW()) group BY EXTRACT(YEAR_MONTH FROM dateAdded)";

			break;

		case 'get_downloads_monthly':
			
			$sql = "SELECT concat('Week  ', week(dateAdded)) as Week,
				      SUM(CASE 
				             WHEN platform = 'android' THEN 1
				             ELSE 0
				           END) AS Android,
				       SUM(CASE 
				             WHEN platform = 'ios' THEN 1
				             ELSE 0
				           END) AS iOS
				from devicetokens where year(dateAdded) = year(now()) and month(dateAdded) = month(now()) group by Week";

			break;
			


		/********** Registration **********/

		case 'get_cardregistration_daily': 

			$sql = "SELECT SUM(IF(activation IS NULL, 1, 0)) AS 'activatedCard',
				SUM(IF(activation IS NULL, 2500, 0)) AS 'cardSales',
				SUM(IF(activation IS NOT NULL, 1, 0)) AS 'unactivatedCard', 
				SUM(IF(NOW() > expiration, 1, 0)) AS 'expiredCard'
				FROM memberstable where date(datereg) = date(now())";  
                   
			break;

		case 'get_cardregistration_weekly': 

			$sql = "SELECT SUM(IF(activation IS NULL, 1, 0)) AS 'activatedCard',
				SUM(IF(activation IS NULL, 2500, 0)) AS 'cardSales',
				SUM(IF(activation IS NOT NULL, 1, 0)) AS 'unactivatedCard', 
				SUM(IF(NOW() > expiration, 1, 0)) AS 'expiredCard'
				FROM memberstable where week(datereg) = week(now())";  
                   
			break;

		case 'get_cardregistration_monthly': 

			$sql = "SELECT SUM(IF(activation IS NULL, 1, 0)) AS 'activatedCard',
				SUM(IF(activation IS NULL, 2500, 0)) AS 'cardSales',
				SUM(IF(activation IS NOT NULL, 1, 0)) AS 'unactivatedCard', 
				SUM(IF(NOW() > expiration, 1, 0)) AS 'expiredCard'
				FROM memberstable where month(datereg) = month(now())";  
                   
			break;

		case 'get_cardregistration_quarterly': 

			$sql = "SELECT SUM(IF(activation IS NULL, 1, 0)) AS 'activatedCard',
				SUM(IF(activation IS NULL, 2500, 0)) AS 'cardSales',
				SUM(IF(activation IS NOT NULL, 1, 0)) AS 'unactivatedCard', 
				SUM(IF(NOW() > expiration, 1, 0)) AS 'expiredCard'
				FROM memberstable where quarter(datereg) = quarter(now())";  
                   
			break;

		case 'get_cardregistration_yearly': 

			$sql = "SELECT SUM(IF(activation IS NULL, 1, 0)) AS 'activatedCard',
				SUM(IF(activation IS NULL, 2500, 0)) AS 'cardSales',
				SUM(IF(activation IS NOT NULL, 1, 0)) AS 'unactivatedCard', 
				SUM(IF(NOW() > expiration, 1, 0)) AS 'expiredCard'
				FROM memberstable where year(datereg) = year(now())";  
                   
			break;

		case 'get_cardregistration_summary':
			
			$sql = "SELECT  b.name, l.name as 'branch', SUM(IF(m.activation IS NULL, 1, 0)) AS registered, SUM(IF(m.activation IS NOT NULL, 1, 0)) AS notactivated, SUM(IF(m.activation IS NULL, 2500, 0)) AS cardsales 
			 FROM memberstable m INNER JOIN loctable l ON m.locid = l.locid
			 LEFT JOIN brandtable b ON l.brandid = b.brandid
			 WHERE DATE(m.datereg) >= '".$startDate."' AND DATE(m.datereg) <= '".$endDate."'
			 GROUP BY b.name, l.name
			 ORDER BY cardsales DESC";

			break;

		case 'get_cardhistory_active': 
			
			$sql = "SELECT m.image, m.qrcard, m.email, concat(m.fname, ' ',m.lname) as name, m.dateofbirth, m.gender, m.datereg, m.expiration, m.servername, m.totalpoints, m.lasttransaction, b.name, l.name
				from memberstable m inner join loctable l on m.locid = l.locid
				left join brandtable b on l.brandid = b.brandid 
				where date(m.datereg) >= '".$startDate."' and date(m.datereg) <= '".$endDate."'
				and m.activation is null";
 
			break; 

		case 'get_cardhistory_inactive':
			
			$sql = "SELECT m.image, m.qrcard, m.email, concat(m.fname, ' ',m.lname) as name, m.dateofbirth, m.gender, m.datereg, m.expiration, m.servername, m.totalpoints, m.lasttransaction, b.name, l.name
				from memberstable m inner join loctable l on m.locid = l.locid
				left join brandtable b on l.brandid = b.brandid 
				where date(m.datereg) >= '".$startDate."' and date(m.datereg) <= '".$endDate."'
				and m.activation is not null";

			break;

		case 'get_cardhistory_expired':
			
			$sql = "SELECT m.image, m.qrcard, m.email, concat(m.fname, ' ',m.lname), m.dateofbirth, m.gender, m.datereg, m.expiration, m.servername, m.totalpoints, m.lasttransaction, b.name, l.name
				from memberstable m inner join loctable l on m.locid = l.locid
				left join brandtable b on l.brandid = b.brandid 
				where date(m.datereg) >= '".$startDate."' and date(m.datereg) <= '".$endDate."'
				and now() > m.expiration";

			break; 
			

		case 'get_customerSummary': 

			$sql = "SELECT (CASE
                       WHEN mem.regtype = 'app' and mem.platform = 'android' THEN 'Android'
                       WHEN mem.regtype = 'app' and mem.platform = 'ios' THEN 'IOS'
                       else 'Card'
                   END) AS 'TYPE', mem.qrCard,
                   mem.memberid as 'memberID', mem.email as 'email', concat(mem.fname, ' ', mem.lname) as 'name',
                   DATE_FORMAT(mem.datereg, '%d-%M-%Y') as 'dateReg', mem.dateofbirth as 'birthdate', CONCAT(UCASE(MID(mem.gender,1,1)),MID(mem.gender,2))as 'gender', mem.mobilenum as 'Mobile', sum(e.amount) as 'loyaltySales', count(e.transactionid) as 'loyaltyTrans', DATE_FORMAT(MAX(e.dateAdded), '%d-%M-%Y') as 'lastPurchase'
                   FROM memberstable mem left join earntable e 
                   on mem.memberid = e.memberid
                   where mem.activation is null and 
							DATE_FORMAT(mem.datereg, '%Y/%m/%d') >= '".$startDate."'
						AND DATE_FORMAT(mem.datereg, '%Y/%m/%d') <= '".$endDate."'
                   group by mem.memberid";  
                   
			break; 



		/********** Demographics **********/
		case 'get_userPlatformRegistration':

			$sql = "SELECT `platform` AS 'v_platform', 
						COUNT(`id`) AS 'total' FROM `memberstable` 
						WHERE `platform` IN ('android', 'ios', 'web') AND BINARY `activation` IS NULL GROUP BY `platform`";

			break; 

		case 'get_userGender':

			$sql = "SELECT `gender`, COUNT(`id`) AS 'count' FROM `memberstable` WHERE `gender` IN ('male','female') GROUP BY `gender`";
			
			break;

		case 'get_userAge':

			$sql = "SELECT ( CASE
				  WHEN `age` > 0 AND `age` <= 18 THEN '18 Below'
				  WHEN `age` >= 19 AND `age` <= 31 THEN '19 - 31'
				  WHEN `age` >= 32 AND `age` <= 45 THEN '32 - 45'
				  WHEN `age` >= 46 AND `age` <= 60 THEN '46 - 60'
				  WHEN `age` >= 61 THEN '61 and above'
				 END
				) AS `label`,
					SUM(`dummyTable`.`count`) AS 'count'
				FROM (
					 SELECT CAST(DATEDIFF(NOW(), DATE(`dateOfBirth`)) / 365.25 AS UNSIGNED) AS `age`, COUNT(`id`) AS `count`
					 FROM `memberstable`
					 WHERE BINARY `dateOfBirth` != '0000-00-00' AND BINARY `dateOfBirth` IS NOT NULL
					 AND BINARY `activation` IS NULL 
					 GROUP BY `age`
				) `dummyTable`
				WHERE BINARY `age` > 0
				GROUP BY `label`";
 
			break;
		
		case 'get_userInformation' :

			$filteredqry = "SELECT memberID, concat(fname, ' ', lname) as 'name', gender as 'gender', totalPoints, image, expiration, qrCard, dateofbirth as 'dateofbirth', 
					TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) as 'Age',
					(case 
					    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) < 18 then 'Below 18'
					    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 18 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 25 then  '18 to 25'
					    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 26 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 35 then '26 to 35'
					    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 36 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 45 then  '36 to 45'
					    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) >= 46 and TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) <= 59 then  '46 to 59'
					    when TIMESTAMPDIFF(YEAR, dateofbirth, CURDATE()) > 60  then  '60 and Above'
					end) as 'agebracket', 
					mobilenum as 'mobile', email from memberstable where "; 
 
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

			$filteredqry .= " AND activation IS NULL";
			
			$sql = $filteredqry;  
			
 			break;

		case 'get_customerTransactionHistory':
 			
 			$sql = "SELECT e.brandName, e.transactiontype as 'type', e.memberid as 'memberID', e.transactionid as 'transactionID', 
						IFNULL(concat(m.fname, ' ', m.lname),e.email) as 'name', locname as 'branch', e.dateAdded as 'date', amount as 'amount', points AS 'points'
						from earntable e inner join memberstable m on e.memberid = m.memberid
						WHERE e.amount > 0 AND e.memberid = '".$memberID."' ";
						
 			break; 

 		case 'get_customerProfileDetail':
 			
 			$sql = "SELECT memberID, image, email, concat(fname, ' ', lname) as name, address1 as address, DATE_FORMAT(dateofbirth, '%d-%M-%Y') as 'dateofbirth' , gender as gender, 
					mobilenum as mobile, totalpoints, DATE_FORMAT(expiration, '%d-%M-%Y') as expiration, qrCard
					from memberstable where `email` = '" . $email. "'";

 			break; 
 
		

		/********** Sales **********/
		case 'get_salesprogress': 

			$sql = "SELECT m.month as month, IFNULL(sum(e.points),0) as points, IFNULL(sum(e.amount),0) as sales
					 FROM (
					 SELECT 'January' AS MONTH
					 UNION SELECT 'February' AS MONTH
					 UNION SELECT 'March' AS MONTH
					 UNION SELECT 'April' AS MONTH
					 UNION SELECT 'May' AS MONTH
					 UNION SELECT 'June' AS MONTH
					 UNION SELECT 'July' AS MONTH
					 UNION SELECT 'August' AS MONTH
					 UNION SELECT 'September' AS MONTH
					 UNION SELECT 'October' AS MONTH
					 UNION SELECT 'November' AS MONTH
					 UNION SELECT 'December' AS MONTH
					 ) AS m
					 LEFT JOIN earntable e ON m.month = DATE_FORMAT(e.dateadded, '%M') and year(e.dateadded) = year(now())
					 group by month order by STR_TO_DATE(m.month, '%M')"; 

			break;  

		case 'get_salessummary': 

			$sql = "SELECT tmp.brandname, tmp.locname, COUNT(DISTINCT(tmp.memberid)) AS totalMember, SUM(tmp.amount) AS totalAmount, 
                     COUNT(tmp.transactionid) AS totalTransaction
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

		case 'get_salesperhourly':
  
			$sql = "SELECT DATE(tmp.dateAdded) as dateAdded, DATE_FORMAT(tmp.dateAdded, '%H:00:00') AS Hour, COUNT(DISTINCT(tmp.memberid)) AS 'MembersCount',
					SUM(tmp.amount) AS 'TotalLoyaltySales', COUNT(tmp.transactionid) AS 'TotalTransactions'
					FROM
					(
					 SELECT dateAdded, memberid, amount, transactionid, locname FROM earntable WHERE amount > 0
					 AND DATE_FORMAT(dateAdded, '%Y/%m/%d %H:00:00') >= '".$startDate." 00:00:00' 
					 AND DATE_FORMAT(dateAdded, '%Y/%m/%d %H:00:00') <= '".$endDate." 23:59:59'
					 AND locID = '".$locID."' AND brandID = '".$brandID."'
					)
					AS tmp
					GROUP BY DATE(tmp.dateAdded), DATE_FORMAT(tmp.dateAdded, '%H:00:00')";  

			break; 

		case 'get_salesperbranch':
 
			$sql = "SELECT tmp.memberid, tmp.email, SUM(tmp.amount) as amount
						FROM
						(
						  SELECT memberid, email, amount
						  FROM earntable WHERE amount > 0 AND 
						  DATE_FORMAT(dateAdded, '%Y-%m-%d %H:00:00') >= '".$startDate." ".$startTime."'
						  AND DATE_FORMAT(dateAdded, '%Y-%m-%d %H:00:00') <= '".$startDate." ".substr($startTime,0,2).":59:59'
						  AND  locID = '".$locID."' AND brandID = '".$brandID."'
						)
						AS tmp
						GROUP BY tmp.memberid;"; 
 
			break; 

 
		/********** Redemption **********/ 
		case 'get_rewards_comparison' :

			$sql = " select u.m as 'month', sum(IF(u.tag='E',u.p,0)) as epoints, sum(IF(u.tag='R',u.p,0)) as rpoints
			 FROM 
			 (
			  SELECT m.month as m, IFNULL(sum(e.points),0) as p, 'E' as tag
			  FROM 
			  (
			  SELECT 'January' AS MONTH
			  UNION SELECT 'February' AS MONTH
			  UNION SELECT 'March' AS MONTH
			  UNION SELECT 'April' AS MONTH
			  UNION SELECT 'May' AS MONTH
			  UNION SELECT 'June' AS MONTH
			  UNION SELECT 'July' AS MONTH
			  UNION SELECT 'August' AS MONTH
			  UNION SELECT 'September' AS MONTH
			  UNION SELECT 'October' AS MONTH
			  UNION SELECT 'November' AS MONTH
			  UNION SELECT 'December' AS MONTH
			  ) AS m
			  LEFT JOIN earntable e ON m.month = DATE_FORMAT(e.dateadded, '%M')
			  group by m  
			UNION
			  SELECT m.month as m, IFNULL(sum(r.points),0) as p, 'R' as tag
			  FROM 
			  (
			  SELECT 'January' AS MONTH
			  UNION SELECT 'February' AS MONTH
			  UNION SELECT 'March' AS MONTH
			  UNION SELECT 'April' AS MONTH
			  UNION SELECT 'May' AS MONTH
			  UNION SELECT 'June' AS MONTH
			  UNION SELECT 'July' AS MONTH
			  UNION SELECT 'August' AS MONTH
			  UNION SELECT 'September' AS MONTH
			  UNION SELECT 'October' AS MONTH
			  UNION SELECT 'November' AS MONTH
			  UNION SELECT 'December' AS MONTH
			  ) AS m
			  LEFT JOIN redeemtable r ON m.month = DATE_FORMAT(r.dateadded, '%M')
			  group by m 
			 ) as u
			 group by u.m ORDER BY STR_TO_DATE(u.m, '%M')";

			break;


		case 'get_branchRedemption':

			$sql = "SELECT rdm.brandname, rdm.locName AS 'branch', rdm.rcount AS 'totalMember', IFNULL(SUM(tmp.points),0) AS 'earnedpoints', rdm.rpoints AS 'redeemedpoints'
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


		case 'get_customerRedemption' :

			$sql = "SELECT r.memberid, m.qrcard, m.email, r.brandname, r.locname, r.points, r.dateadded
			     FROM redeemtable r INNER JOIN memberstable m ON r.memberid=m.memberid
			     WHERE DATE(r.dateadded) >= '".$startDate."' AND DATE(r.dateadded) <= '".$endDate."' 
			     ORDER BY m.qrcard, r.dateadded";

			break;

		case 'get_locationTransactions':  

			$sql ="SELECT rdm.memberid, IFNULL(sum(tmp.points) ,0) as 'points', rdm.rpoints as 'redeemedSnaps'
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

		case 'get_customers_quarterlysales':
				
				$sql = "SELECT m.image, m.qrcard, e.email, sum(e.amount) as sales
						 from earntable e inner join memberstable m on e.memberid=m.memberid
						 where quarter(e.dateadded) = quarter(now())
						 group by m.qrcard
						 order by sales desc limit 20";

			break;

		case 'get_customers_quarterlyvisits':
				
				$sql = "SELECT m.image, m.qrcard, e.email, count(e.earnid) as visit
						from earntable e inner join memberstable m on e.memberid=m.memberid
						where quarter(e.dateadded) = quarter(now())
						group by m.qrcard
						order by visit desc limit 20"; 
			break;


		case 'get_customer_transactions':

			$sql = "SELECT tmp.qrcard, tmp.email, SUM(tmp.amount) AS totalAmount, SUM(tmp.points) AS points, COUNT(tmp.transactionid) AS totalTransaction
                     FROM
                     (
                      SELECT m.qrcard, m.email, e.memberid, e.amount, e.points, e.transactionid FROM earntable e INNER JOIN memberstable m ON e.memberid = m.memberid
                      WHERE e.amount > 0 
                      AND DATE(e.dateAdded) >= '".$startDate."'
                      AND DATE(e.dateAdded) <= '".$endDate."'
                     )
                     AS tmp
					GROUP BY tmp.qrcard, tmp.email ORDER BY points DESC"; 

      	break;


		/********** Branches **********/

		case 'get_branch_quarterlysales':
				
			$sql = "SELECT brandname, locname, sum(amount) as sales from earntable where quarter(dateadded) = quarter(now())
					 group by brandname, locname 
					 order by sales desc limit 10";

			break;

		case 'get_branch_quarterlyvisits':
			
			$sql = "SELECT brandname, locname, count(transactionid) as visit from earntable where quarter(dateadded) = quarter(now())
					 group by brandname, locname 
					 order by visit desc limit 10"; 
			break; 


		case 'get_branchsalessummary': 

			$sql = "SELECT tmp.brandname, tmp.locname, COUNT(DISTINCT(tmp.memberid)) AS totalMember, SUM(tmp.amount) AS totalAmount, 
                     COUNT(tmp.transactionid) AS totalTransaction
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

		/********** Vouchers **********/ 

		case 'get_redemptionVoucher':

			$sql = "SELECT brandname, locname, NAME as 'name', COUNT(name) as 'total' FROM redeemvouchertable
						 WHERE DATE(dateadded) >= '".$startDate."' AND DATE(dateadded) <= '".$endDate."'
						GROUP BY brandname, locname, name";

			break;

		case 'get_customerRedemptionVoucher' :

			$sql = "SELECT r.memberid, m.qrcard, r.email, r.brandname, r.locname, r.name, r.dateadded
					FROM redeemvouchertable r INNER JOIN memberstable m ON r.memberid=m.memberid
					WHERE DATE(r.dateadded) >= '".$startDate."' AND DATE(r.dateadded) <= '".$endDate."' 
					ORDER BY m.qrcard, r.dateadded"; 

			break;

		case 'get_redemptionVoucher_yearly' :

			$sql = "SELECT name, count(*) as redemption from redeemvouchertable 
					where year(dateadded) = year(now())
					group by name order by redemption desc"; 

			break;

		case 'get_redemptionVoucher_quarterly' :

			$sql = "SELECT name, count(*) as redemption from redeemvouchertable 
				where quarter(dateadded) = quarter(now())
				group by name order by redemption desc"; 

			break;

		case 'get_redemptionVoucher_monthly' :

			$sql = "SELECT name, count(*) as redemption from redeemvouchertable 
				where month(dateadded) = month(now())
				group by name order by redemption desc"; 

			break;

		case 'get_redemptionVoucher_weekly' :

			$sql = "SELECT name, count(*) as redemption from redeemvouchertable 
				where week(dateadded) = week(now())
				group by name order by redemption desc"; 

			break;

		case 'get_redemptionVoucher_daily' :

			$sql = "SELECT name, count(*) as redemption from redeemvouchertable 
				where date(dateadded) = date(now())
				group by name order by redemption desc"; 

			break;
 

		/********** Spent **********/ 

		case 'get_spent_daily' :

			$sql = "SELECT SUM(`amount`) AS `totalSales`, COUNT(distinct(memberID)) AS `totalMember`, COUNT(`memberID`) AS `totalTransaction`, SUM(`amount`)/COUNT(`memberID`) AS `averageSpend` FROM `earntable` WHERE BINARY `amount` > 0 and date(dateadded) = date(now())"; 

			break;

		case 'get_spent_weekly' :

			$sql = "SELECT SUM(`amount`) AS `totalSales`, COUNT(distinct(memberID)) AS `totalMember`, COUNT(`memberID`) AS `totalTransaction`, SUM(`amount`)/COUNT(`memberID`) AS `averageSpend` FROM `earntable` WHERE BINARY `amount` > 0 and week(dateadded) = week(now())"; 

			break;

		case 'get_spent_monthly' :

			$sql = "SELECT SUM(`amount`) AS `totalSales`, COUNT(distinct(memberID)) AS `totalMember`, COUNT(`memberID`) AS `totalTransaction`, SUM(`amount`)/COUNT(`memberID`) AS `averageSpend` FROM `earntable` WHERE BINARY `amount` > 0 and month(dateadded) = month(now())"; 

			break;

		case 'get_spent_quarterly' :

			$sql = "SELECT SUM(`amount`) AS `totalSales`, COUNT(distinct(memberID)) AS `totalMember`, COUNT(`memberID`) AS `totalTransaction`, SUM(`amount`)/COUNT(`memberID`) AS `averageSpend` FROM `earntable` WHERE BINARY `amount` > 0 and quarter(dateadded) = quarter(now())"; 

			break;

		case 'get_spent_yearly' :

			$sql = "SELECT SUM(`amount`) AS `totalSales`, COUNT(distinct(memberID)) AS `totalMember`, COUNT(`memberID`) AS `totalTransaction`, SUM(`amount`)/COUNT(`memberID`) AS `averageSpend` FROM `earntable` WHERE BINARY `amount` > 0 and year(dateadded) = year(now())"; 

			break;

		case 'get_spent_summary':

			$sql = "SELECT tmp.image, tmp.qrcard, tmp.email, SUM(tmp.amount) AS 'totalSpend', COUNT(*) AS 'totalTransaction', AVG(TMP.amount) AS 'averageSpend'
			    FROM
			    (
			     SELECT m.image, m.qrcard, e.email, e.amount, e.points FROM earntable e INNER JOIN memberstable m ON e.memberid=m.memberid 
			     WHERE e.amount > 0 AND DATE(e.dateadded) >= '".$startDate."' AND DATE(e.dateadded) <= '".$endDate."' AND e.amount > 0 
			    )
			   AS tmp
				GROUP BY tmp.email  ORDER BY SUM(tmp.amount) DESC";

			break;
 

		/********** JSON **********/
 		case 'gettablerecords':
 
			$sql = "SELECT DISTINCT * from ".$table." ORDER BY name ASC";    

			break;

		case 'getrecord':

 			if ($table == 'loctable') {
				$sql = "SELECT DISTINCT * from ".$table." WHERE `brandID` = '" . $brandID. "' ORDER BY name ASC";  
 			}

 			break;
	}

	// If not empty
	if ($sql != "") {

		if(!$result = $mysqli->query($sql)){
		    die('There was an error running the query [' . $mysqli->error . ']');
		}

		if ($result->num_rows > 0) {
			while ($row = $result->fetch_assoc()) {
				foreach ($row as $array_key => $array_value) {
			       $row[$array_key] = html_entity_decode($array_value, ENT_QUOTES, 'UTF-8');
			    } 
				array_push($output, $row);
			}  
			
			echo json_encode(array(array("response"=>"Success", "data"=>$output)), JSON_NUMERIC_CHECK);
			
		} else { 
			echo json_encode(array(array("response"=>"Empty")));
		}		

		$mysqli->close();
	}
 

?>