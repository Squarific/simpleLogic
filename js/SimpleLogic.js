var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.simpleLogic = SQUARIFIC.simpleLogic || {};
SQUARIFIC.simpleLogic.port = SQUARIFIC.simpleLogic.port || {};
SQUARIFIC.simpleLogic.node = SQUARIFIC.simpleLogic.node || {};

SQUARIFIC.simpleLogic.SimpleLogic = function SimpleLogic (canvas, overlayDiv) {
	var nodes = [];
	this.nodes = nodes;
	var canvasCtx = canvas.getContext("2d");
	this.overlayDiv = overlayDiv;
	var settings = {};
	settings.connectionWidth = 8;
	
	this.eventHandlers = {};
	
	this.eventHandlers.mousedown = function mousedown (event) {
		if (typeof event.target.connectingInput === "number") {
			this.connecting = {node: event.target.node, input: event.target.connectingInput};
			event.preventDefault();
		} else if(typeof event.target.connectingOutput === "number") {
			this.connecting = {node: event.target.node, output: event.target.connectingOutput};
			event.preventDefault();
		} else if (event.target.node && (typeof event.target.node.propertys.mousedown !== "function" || !event.target.node.propertys.mousedown(event))) {
			this.draggingNode = event.target;
			event.target.draggingStartX = event.clientX - Math.floor(event.target.getBoundingClientRect().left);
			event.target.draggingStartY = event.clientY - Math.floor(event.target.getBoundingClientRect().top);
			event.preventDefault();
		}
	}.bind(this);
	
	this.eventHandlers.mouseup = function mouseup (event) {
		if (this.connecting) {
			if (typeof this.connecting.input === "number") {
				if (typeof event.target.connectingOutput === "number") {
					this.connecting.node.addInput(event.target.node, event.target.connectingOutput, this.connecting.input);
				}
			} else {
				if (typeof event.target.connectingInput === "number") {
					event.target.node.addInput(this.connecting.node, this.connecting.output, event.target.connectingInput);
				}
			}
		} else if (this.draggingNode && (this.draggingNode.node.x < 0 || this.draggingNode.node.y < 0)) {
			this.removeNode(this.draggingNode.node);
		}
		delete this.draggingNode;
		delete this.connecting;
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
		this.mouseX = event.clientX - Math.floor(overlayDiv.getBoundingClientRect().left);
		this.mouseY = event.clientY - Math.floor(overlayDiv.getBoundingClientRect().top);
	}.bind(this);
	
	this.eventHandlers.resize = function resize (event) {
		canvas.width = parseInt(window.innerWidth * .8);
		canvas.height = window.innerHeight;
	};
	
	overlayDiv.addEventListener("mousedown", this.eventHandlers.mousedown);
	document.addEventListener("mouseup", this.eventHandlers.mouseup);
	document.addEventListener("mousemove", this.eventHandlers.mousemove);
	window.addEventListener("resize", this.eventHandlers.resize);

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

	this.inputCoords = function inputCoords (node, input) {
		var image = node.propertys.getImage(node);
		var height = (image.height - node.propertys.inputs * 10) / (node.propertys.inputs + 1);
		var x = node.x - 2,
			y = node.y + height * (input + 1) + input * 10 + 5;
		return [x, y];
	};

	this.outputCoords = function outputCoords (node, output) {
		var image = node.propertys.getImage(node);
		var height = (image.height - node.propertys.outputs * 10) / (node.propertys.outputs + 1);
		var x = node.x + image.width + 2,
			y = node.y + height * (output + 1) + output * 10 + 5;
		return [x, y];
	};

	this.draw = function () {
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		canvasCtx.lineWidth = "5";
		for (var k = 0; k < nodes.length; k++) {
			var div = document.getElementById(nodes[k].id);
			if (!div) {
				div = overlayDiv.appendChild(this.domElementOfNode(nodes[k]));
			}
			div.style.position = "absolute";
			div.style.left = nodes[k].x + "px";
			div.style.top = nodes[k].y + "px";
			
			for (var i = 0; i < nodes[k].inputs.length; i++) {
				if (nodes[k].inputs[i]) {
					var inputCoords = this.inputCoords(nodes[k], i);
					var outputCoords = this.outputCoords(nodes[k].inputs[i].node, nodes[k].inputs[i].number);
					canvasCtx.beginPath();
					canvasCtx.moveTo(inputCoords[0], inputCoords[1]);
					canvasCtx.lineTo(outputCoords[0], outputCoords[1]);
					canvasCtx.strokeStyle = (nodes[k].inputs[i].node.outputs[nodes[k].inputs[i].number]) ? "rgb(55, 173, 50)" : "rgb(75, 37, 37)";
					canvasCtx.stroke();
				}
			}
		}
		
		if (this.connecting) {
			canvasCtx.beginPath();
			if (typeof this.connecting.output === "number") {
				var coords = this.outputCoords(this.connecting.node, this.connecting.output);
			} else {
				var coords = this.inputCoords(this.connecting.node, this.connecting.input);
			}
			canvasCtx.moveTo(coords[0], coords[1]);
			canvasCtx.lineTo(this.mouseX, this.mouseY);
			canvasCtx.lineWidth = "5";
			canvasCtx.strokeStyle = "rgb(44, 156, 143)";
			canvasCtx.stroke();
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
			input.style.width = settings.connectionWidth + "px";
			input.style.left = -settings.connectionWidth + "px";
			input.style.top = height * (i + 1) + i * 10 + "px";
			input.node = node;
			input.connectingInput = i;
			input.addEventListener("click", function (number, event) {
				event.target.node.removeInput(number);
			}.bind(this, i));
			div.appendChild(input);
		}
		
		var height = (image.height - node.propertys.outputs * 10) / (node.propertys.outputs + 1);
		for (var i = 0; i < node.propertys.outputs; i++) {
			var input = document.createElement("div");
			input.className = "draw_connect_div";
			input.style.position = "absolute";
			input.style.height = "10px";
			input.style.width = settings.connectionWidth + "px";
			input.style.left = image.width + 2 + "px";
			input.style.top = height * (i + 1) + i * 10 + "px";
			input.node = node;
			input.connectingOutput = i;
			input.addEventListener("click", function (number, event) {
				this.removeConnectionsFromOutput(event.target.node, number);
			}.bind(this, i));
			div.appendChild(input);
		}
		
		return div;
	};
	
	this.removeConnectionsFromOutput = function removeConnections (node, number) {
		for (var k = 0; k < nodes.length; k++) {
			nodes[k].removeInput(node, number);
		}
	};
	
	this.tick = function () {
		this.update();
		this.draw();
		requestAnimationFrame(this.tick);
	}.bind(this);
	
	requestAnimationFrame(this.tick);
};

SQUARIFIC.simpleLogic.Node = function Node (settings) {
	settings = settings || {};
	if (!SQUARIFIC.simpleLogic.nodes[settings.type]) {
		throw "Unknown node type";
	}
	
	this.propertys = SQUARIFIC.simpleLogic.nodes[settings.type];
	this.propertys.type = settings.type;
	
	this.inputNodes = [];
	this.inputs = this.inputNodes;
	this.outputs = [];
	for (var k = 0; k < this.propertys.defaultOutputs; k++) {
		this.outputs[k] = this.propertys.defaultOutputs[k];
	}
	
	this.lastUpdated = Date.now();
	this.x = settings.x;
	this.y = settings.y;
	this.id = settings.type + "_" + Date.now();
	
	this.getInputs = function getInputs (time) {
		var inputs = [];
		for (var k = 0; k < this.propertys.inputs; k++) {
			if (this.inputNodes[k]) {
				if (this.inputNodes[k].lastUpdate < time) {
					this.inputNodes[k].update(time);
				}
				inputs[k] = this.inputNodes[k].node.outputs[this.inputNodes[k].number];
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
		this.inputNodes[inputNodeNumber] = {
			node: node,
			number: nodeOutputNumber
		};
	};
	
	this.removeInput = function (node, outputNumber) {
		if (typeof node !== "number") {
			for (var k = 0; k < this.inputNodes.length; k++) {
				if (this.inputNodes[k] && this.inputNodes[k].node == node && (typeof outputNumber !== "number" || this.inputNodes[k].number === outputNumber)) {
					delete this.inputNodes[k];
				}
			}
		} else {
			delete this.inputNodes[node];
		}
	};
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
	var width = 12 * text.length + 32,
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