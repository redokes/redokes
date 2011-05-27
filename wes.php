<?php 
$serverUrl = "wes";
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Redokes</title>
  <link rel="stylesheet" href="/css/wes-node.css" type="text/css" />
  <script src="http://<?php echo $serverUrl?>:8080/socket.io/socket.io.js"></script> 
  <script src="/js/ext/ext-all.js"></script> 
  <script src="/js/Redokes/bootstrap.js"></script> 
</head>
<body>
	<div id="test">
		testing
	</div>
	<script src="/js/wes-node.js"></script>
</body>
</html>