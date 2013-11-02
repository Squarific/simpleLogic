var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.simpleLogic = SQUARIFIC.simpleLogic || {};
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
				this.outputs[0] = false;
				this.pressed = false;
				this.ctx.beginPath();
				this.ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				this.ctx.fillStyle = "rgb(219, 43, 64)";
				this.ctx.fill();
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
	},
	LIGHT: {
		inputs: 1,
		outputs: 0,
		update: function (node, inputs, time) {
			if (inputs[0]) {
				node.ctx.beginPath();
				node.ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				node.ctx.fillStyle = "rgb(233, 34, 94)";
				node.ctx.fill();
			} else {
				node.ctx.beginPath();
				node.ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				node.ctx.fillStyle = "rgb(99, 55, 68)";
				node.ctx.fill();
			}
		},
		getImage: function (node) {
			if (!node.image) {
				var ctx = SQUARIFIC.simpleLogic.node.getBackground(50, 50, 5);
				ctx.beginPath();
				ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				ctx.fillStyle = "rgb(99, 55, 68)";
				ctx.fill();
				node.image = ctx.canvas;
				node.ctx = ctx;
			}
			return node.image;
		}
	}
};