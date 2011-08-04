<?php 
//$serverUrl = "redokes.com";
$serverUrl = "jared";
session_start();
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Redokes</title>
<link rel="stylesheet" href="/js/ext/resources/css/ext-all.css" type="text/css" />
<link rel="stylesheet" href="/css/styles.css" type="text/css" />
<script src="http://<?php echo $serverUrl?>:8080/socket.io/socket.io.js"></script> 
<script src="/js/ext/ext-all.js"></script>
<script src="/js/Redokes/bootstrap.js"></script>
<script src="/js/RedokesClient.js"></script>
<script type="text/javascript">
	Ext.onReady(function(){
		var client = new RedokesClient({
			url: '<?php echo $serverUrl; ?>',
			data:{
				applicationSessionId: '<?php echo session_id(); ?>'
			}
		});
	});  
</script> 
</head>
<body>
	<?php echo session_id(); ?>
</body>
</html>