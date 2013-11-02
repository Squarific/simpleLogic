function loadMenu (target) {
	var items = document.getElementsByClassName("node");
	for (var k = 0; k < items.length; k++) {
		if (items[k].id) {
			var item = new SQUARIFIC.simpleLogic.Node({type: items[k].id});
			var image = item.propertys.getImage(item);
			image.className = "draw_node";
			items[k].appendChild(image);
			image.addEventListener("mousedown", function (target, event) {			
				var x = event.clientX - Math.floor(target.overlayDiv.getBoundingClientRect().left) - (event.clientX - Math.floor(event.target.getBoundingClientRect().left)),
				y = event.clientY - Math.floor(target.overlayDiv.getBoundingClientRect().top) - (event.clientY - Math.floor(event.target.getBoundingClientRect().top));
				x = Math.round(x / 10) * 10;
				y = Math.round(y / 10) * 10;
				
				var node = target.addNode(this, x, y);
				
				target.overlayDiv.appendChild(target.domElementOfNode(node));
				
				var image = document.getElementById(node.id + "_image");
				target.draggingNode = image;
				image.draggingStartX = event.clientX - Math.floor(event.target.getBoundingClientRect().left);
				image.draggingStartY = event.clientY - Math.floor(event.target.getBoundingClientRect().top);
				
				event.preventDefault();
			}.bind(items[k].id, target));
		}
	}
}