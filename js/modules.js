function reloadmodules () {
	var modules = document.getElementById("modules_list");
	if (!modules.loading) {
		modules.loading = true;
		while (modules.firstChild) {
			modules.removeChild(modules.firstChild);
		}
		modules.appendChild(document.createTextNode("Loading..."));
		var request = new XMLHttpRequest();
		request.addEventListener("readystatechange", function () {
			if (request.readyState == 4) {
				modules.loading = false;
				if (request.status !== 200) {
					while (modules.firstChild) {
						modules.removeChild(modules.firstChild);
					}
					modules.appendChild(document.createTextNode("Failed to load modules. Connection error."));
				} else {
					try {
						var mods = JSON.parse(request.responseText);;
					} catch (e) {
						while (modules.firstChild) {
							modules.removeChild(modules.firstChild);
						}
						modules.appendChild(document.createTextNode("Failed to load modules. JSON error. '" + e + "'"));
						return;
					}
					while (modules.firstChild) {
						modules.removeChild(modules.firstChild);
					}
					modules.appendChild(document.createTextNode("Click on the module to add it to your current workfield. These modules are made by other people, you can share your own too!"));
					for (var k = 0; k < mods.length; k++) {
						modules.appendChild(domFromMod(mods[k]));
					}
				}
			}
		});
		request.open("GET", "php/action.php?action=list");
		request.send();
	}
}

function domFromMod (mod) {
	var div = document.createElement("div");
	div.className = "module";
	div.appendChild(document.createTextNode(mod.name + " MADE BY " + mod.name_maker));
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createTextNode("Description: " + mod.description));
	div.addEventListener("click", function (event) {
		document.getElementById("modules").style.display = "none";
		simpleLogic.addModule(event.target.module);
	});
	div.module = mod.module;
	return div;
}

function uploadmodule () {
	var username = encodeURIComponent(document.getElementById('module_username').value),
		name = encodeURIComponent(document.getElementById('module_name').value),
		description = encodeURIComponent(document.getElementById('module_description').value),
		module = encodeURIComponent(simpleLogic.toJSONString());
	var error = document.getElementById('upload_error');
	while (error.firstChild) {
		error.removeChild(error.firstChild);
	}
	error.appendChild(document.createTextNode("Uploading..."));
	var request = new XMLHttpRequest();
	request.addEventListener("readystatechange", function () {
		if (request.readyState == 4) {
			while (error.firstChild) {
				error.removeChild(error.firstChild);
			}
			if (request.status !== 200) {
				error.appendChild(document.createTextNode("Failed to upload module. Connection error."));
			} else {
				if (request.responseText === "ok") {
					error.appendChild(document.createTextNode("Uploaded succesfully."));
				} else {
					error.appendChild(document.createTextNode("Error: " + request.responseText));
				}
			}
		}
	});
	request.open("POST", "php/action.php");
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.send("action=newModule&name_maker=" + username + "&name=" + name + "&description=" + description + "&module=" + module);
}