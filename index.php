<?php 
//$serverUrl = "redokes.com";
$serverUrl = "jared";
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Redokes</title>
<link rel="stylesheet" href="css/styles.css" type="text/css" />
<script src="http://<?php echo $serverUrl?>:8080/socket.io/socket.io.js"></script> 
<script src="/js/ext/ext.js"></script>
<script src="/js/Redokes/bootstrap.js"></script>
<script type="text/javascript">
	Ext.onReady(function(){
		var client = Ext.create('Redokes.socket.Client', {
			url: '<?php echo $serverUrl; ?>'
		});
		console.log(client);
	});  
</script> 
</head>
<body>
	<div class="user-toolbar">
		Name: <input id="name" type="text" /> Message: <input id="message" type="text" />
	</div>
	<div class="user-bubble"></div>
</body>
</html>