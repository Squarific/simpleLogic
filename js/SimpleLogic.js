var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.simpleLogic = SQUARIFIC.simpleLogic || {};
SQUARIFIC.simpleLogic.port = SQUARIFIC.simpleLogic.port || {};
SQUARIFIC.simpleLogic.node = SQUARIFIC.simpleLogic.node || {};

SQUARIFIC.simpleLogic.SimpleLogic = function SimpleLogic (canvas, overlayDiv) {
	var nodes = [];
	var canvasCtx = canvas.getContext("2d");
	this.overlayDiv = overlayDiv;
	
	this.eventHandlers = {};
	
	this.eventHandlers.mousedown = function mousedown (event) {
		if (event.target.node && (typeof event.target.node.propertys.mousedown !== "function" || !event.target.node.propertys.mousedown(event))) {
			this.draggingNode = event.target;
			event.target.draggingStartX = event.clientX - Math.floor(event.target.getBoundingClientRect().left);
			event.target.draggingStartY = event.clientY - Math.floor(event.target.getBoundingClientRect().top);
			event.preventDefault();
		}
	}.bind(this);
	
	this.eventHandlers.mouseup = function mouseup (event) {
		if (this.draggingNode && (this.draggingNode.node.x < 0 || this.draggingNode.node.y < 0)) {
			this.removeNode(this.draggingNode.node);
		}
		delete this.draggingNode;
	}.bind(this);
	
	this.eventHandlers.mousemove = function mousemove (event) {
		if (this.draggingNode && (typeof this.draggingNode.node.propertys.mousemove !== "function" || !this.draggingNode.node.propertys.mousemove(event, this.draggingNode))) {
			var x = event.clientX - Math.floor(overlayDiv.getBoundingClientRect().left) - this.draggingNode.draggingStartX,
				y = event.clientY - Math.floor(overlayDiv.getBoundingClientRect().top) - this.draggingNode.draggingStartY;
			x = Math.round(x / 10) * 10;
			y = Math.round(y / 10) * 10;
			this.draggingNode.node.x = x;
			this.draggingNode.node.y = y;
			event.preventDefault();
		}
	}.bind(this);
	
	overlayDiv.addEventListener("mousedown", this.eventHandlers.mousedown);
	document.addEventListener("mouseup", this.eventHandlers.mouseup);
	document.addEventListener("mousemove", this.eventHandlers.mousemove);

	this.update = function () {
		var updateTime = Date.now();
		for (var node = 0; node < nodes.length; node++) {
			if (!nodes[node].lastUpdate || nodes[node].lastUpdate < updateTime) {
				nodes[node].update(updateTime);
			}
		}
	};
	
	this.addNode = function (type, x, y) {
		var node = new SQUARIFIC.simpleLogic.Node({
			type: type,
			x: x,
			y: y
		});
		nodes.push(node);
		return node;
	};
	
	this.removeNode = function (node) {
		for (var k = 0; k < nodes.length; k++) {
			if (nodes[k] === node) {
				var div = document.getElementById(nodes[k].id);
				if (div) {
					div.parentNode.removeChild(div);
				}
				nodes.splice(k, 1);
				k--;
			} else {
				nodes[k].removeInput(node);
			}
		}
		delete this.draggingNode;
	};
	
	this.draw = function () {
		for (var k = 0; k < nodes.length; k++) {
			var div = document.getElementById(nodes[k].id);
			if (!div) {
				overlayDiv.appendChild(this.domElementOfNode(nodes[k]));
			}
			div.style.position = "absolute";
			div.style.left = nodes[k].x + "px";
			div.style.top = nodes[k].y + "px";
		}
	};
	
	this.domElementOfNode = function (node) {
		var div = document.createElement("div");
		div.id = node.id;
		div.className = "nodeContainer";
		
		image = div.appendChild(node.propertys.getImage(node));
		image.node = node;
		image.className = "draw_node position_node";
		image.id = node.id + "_image";
		
		var height = (image.height - node.propertys.inputs * 10) / (node.propertys.inputs + 1);
		for (var i = 0; i < node.propertys.inputs; i++) {
			var input = document.createElement("div");
			input.className = "draw_connect_div";
			input.style.position = "absolute";
			input.style.height = "10px";
			input.style.width = "5px";
			input.style.left = "-5px";
			input.style.top = height * (i + 1) + i * 10 + "px";
			div.appendChild(input);
		}
		
		var height = (image.height - node.propertys.outputs * 10) / (node.propertys.outputs + 1);
		for (var i = 0; i < node.propertys.outputs; i++) {
			var input = document.createElement("div");
			input.className = "draw_connect_div";
			input.style.position = "absolute";
			input.style.height = "10px";
			input.style.width = "5px";
			input.style.left = image.width + 2 + "px";
			input.style.top = height * (i + 1) + i * 10 + "px";
			div.appendChild(input);
		}
		
		return div;
	};
	
	this.tick = function () {
		this.update();
		this.draw();
		requestAnimationFrame(this.tick);
	}.bind(this);
	
	requestAnimationFrame(this.tick);
};

SQUARIFIC.simpleLogic.Node = function Node (settings) {
	var inputNodes = [];
	settings = settings || {};
	if (!SQUARIFIC.simpleLogic.nodes[settings.type]) {
		throw "Unknown node type";
	}
	
	this.propertys = SQUARIFIC.simpleLogic.nodes[settings.type];
	this.propertys.type = settings.type;
	
	this.outputs = this.propertys.defaultOutputs || [];
	for (var k = 0; k < this.propertys.outputs; k++) {
		this.outputs[k] = false;
	}
	
	this.lastUpdated = Date.now();
	this.x = settings.x;
	this.y = settings.y;
	this.id = settings.type + "_" + Date.now();
	
	this.getInputs = function getInputs (time) {
		var inputs = [];
		for (var k = 0; k < this.propertys.inputs; k++) {
			if (inputNodes[k]) {
				if (inputNodes[k].lastUpdate < time) {
					inputNodes[k].update(time);
				}
				inputs[k] = inputNodes[k].node.outputs[inputNodes[k].number];
			} else {
				inputs[k] = false;
			}
		}
		return inputs;
	};
	
	this.update = function (time) {
		this.lastUpdated = time;
		var inputs = this.getInputs(time);
		this.propertys.update(this, inputs, time);
	};
	
	this.addInput = function (node, nodeOutputNumber, inputNodeNumber) {
		inputNodes[inputNodeNumber] = {
			node: node,
			number: nodeOutputNumber
		};
	};
	
	this.removeInput = function (node) {
		for (var k = 0; k < inputNodes.length; k++) {
			if (inputNodes[k] == node) {
				inputNodes.splice(k, 1);
				k--;
			}
		}
	};
};

SQUARIFIC.simpleLogic.nodes = {
	AND: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = inputs[0] && inputs[1];
		},
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("AND");
			}
			return node.image;
		}
	},
	OR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = inputs[0] || inputs[1];
		},
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("OR");
			}
			return node.image;
		}
	},
	NOT: {
		inputs: 1,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = !inputs[0];
		},
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("NOT");
			}
			return node.image;
		}
	},
	BUTTON: {
		inputs:0,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
		},
		getImage: function (node) {
			if (!node.image) {
				var ctx = SQUARIFIC.simpleLogic.node.getBackground(50, 50, 5);
				ctx.beginPath();
				ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				ctx.fillStyle = "rgb(219, 43, 64)";
				ctx.fill();
				node.image = ctx.canvas;
				node.ctx = ctx;
			}
			document.addEventListener("mouseup", function () {
				node.outputs[0] = false;
				node.pressed = false;
				node.ctx.beginPath();
				node.ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				node.ctx.fillStyle = "rgb(219, 43, 64)";
				node.ctx.fill();
			}.bind(node));
			return node.image;
		},
		mousemove: function (event, nodeDiv) {
			if (nodeDiv.node.pressed) {
				return true;
			}
			return false;
		},
		mousedown: function (event) {
			var relX = event.clientX - Math.floor(event.target.getBoundingClientRect().left),
				relY = event.clientY - Math.floor(event.target.getBoundingClientRect().top);
			if ((relX - 25) * (relX - 25) + (relY - 25) * (relY - 25) < 225) {
				event.target.node.pressed = true;
				event.target.node.outputs[0] = true;
				event.target.node.ctx.beginPath();
				event.target.node.ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				event.target.node.ctx.fillStyle = "rgb(165, 26, 43)";
				event.target.node.ctx.fill();
			}
		}
	}
};

SQUARIFIC.simpleLogic.node.getBackground = function (width, height, border) {
	var ctx = SQUARIFIC.utils.newCtx(width, height, "rgb(248, 200, 47)");
	ctx.beginPath();
	ctx.fillStyle = "rgb(55, 55, 55)";
	ctx.rect(border, border, width - border - border, height - border - border);
	ctx.fill();
	return ctx;
};

SQUARIFIC.simpleLogic.port.getImage = function (text) {
	var width = 15 * text.length + 20,
		height = 50;
	var border = 5;
	var ctx = SQUARIFIC.simpleLogic.node.getBackground(width, height, border);
	SQUARIFIC.simpleLogic.port.textOnImage(ctx, text, border, height);
	return ctx.canvas;
};

SQUARIFIC.simpleLogic.port.textOnImage = function (ctx, text, border, height) {
	ctx.beginPath();
	ctx.font="20px 'Coda Caption'";
	ctx.fillStyle = "rgb(255, 255, 200)";
	ctx.fillText(text, border + border, height / 2 + 8);
};