<?php
	error_reporting(0);
	require("config.php");	switch ($_POST["action"]) {		case "newModule":			$database->query("INSERT INTO moduleList (name_maker, name, description, module) VALUES ('" . $database->real_escape_string($_POST["name_maker"]) . "', '" . $database->real_escape_string($_POST["name"]) . "', '" . $database->real_escape_string($_POST["description"]) . "', '" . $database->real_escape_string($_POST["module"]) . "')");			echo 'ok';		break;		default:
			switch ($_GET["action"]) {
				case "list":
					$query = $database->query("SELECT id, name_maker, name, description, module FROM moduleList");
					if (!$query)  {
						jsonError($database->error);
					}
					$list = array();
					while ($item = $query->fetch_assoc()) {
						$list[] = $item;
					}
					echo json_encode($list);
				break;								case "module":					$query = $database->query("SELECT module FROM moduleList WHERE id = " + $database->real_escape_string($_GET["id"]));					if (!$query) {						jsonError($database->error);					}					echo json_encode($query->fetch_assoc());				break;				
				default:
					echo '{"error": "Action \'' . $_GET["action"] . $_POST["action"] . '\' unknown"}';
				break;
			}		break;	}
?>