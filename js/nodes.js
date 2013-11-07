var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.simpleLogic = SQUARIFIC.simpleLogic || {};
SQUARIFIC.simpleLogic.nodes = {
	REPEATER: {
		inputs: 1,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = inputs[0];
		},
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("REPEATER");
			}
			return node.image;
		}
	},
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
	NAND: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = !(inputs[0] && inputs[1]);
		},
		getImage: function (node) {
			if(!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("NAND");
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
	NOR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = !(inputs[0] || inputs[1]);
		},
		getImage: function (node) {
			if(!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("NOR");
			}
			return node.image;
		}
	},
	XOR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = inputs[0] ? !inputs[1] : inputs[1];
		},
		getImage: function (node) {
			if(!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("XOR");
			}
			return node.image;
		}
	},
	XNOR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (node, inputs, time) {
			node.outputs[0] = inputs[0] ? inputs[1] : !inputs[1];
		},
		getImage: function (node) {
			if(!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("XNOR");
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
			node.image.addEventListener("mousemove", function (event) {
				var relX = event.clientX - Math.floor(event.target.getBoundingClientRect().left),
				relY = event.clientY - Math.floor(event.target.getBoundingClientRect().top);
				if ((relX - 25) * (relX - 25) + (relY - 25) * (relY - 25) < 225) {
					event.target.style.cursor = "pointer";
				} else {
					event.target.style.cursor = "auto";
				}
			});
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
			if (!node.ctx) {
				node.propertys.getImage(node);
			}
			if (node.lastInput !== inputs[0]) {
				if (inputs[0]) {
					node.ctx.beginPath();
					node.ctx.arc(25, 25, 14, 0, 2 * Math.PI);
					node.ctx.fillStyle = "rgb(233, 34, 94)";
					node.ctx.fill();
				} else {
					node.ctx.beginPath();
					node.ctx.arc(25, 25, 15, 0, 2 * Math.PI);
					node.ctx.fillStyle = "rgb(99, 55, 68)";
					node.ctx.fill();
				}
				node.lastInput = inputs[0];
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
	},
	RGBLIGHT: {
		inputs: 3,
		outputs: 0,
		update: function (node, inputs, time) {
			node.lastInputs = node.lastInputs || [];
			if (!node.ctx) {
				node.propertys.getImage(node);
			}
			if (node.lastInputs[0] !== inputs[0] || node.lastInputs[1] !== inputs[1] || node.lastInputs[2] !== inputs[2]) {
				node.ctx.beginPath();
				node.ctx.arc(25, 25, 14, 0, 2 * Math.PI);
				node.ctx.fillStyle = "rgb(" + (20 + 235 * (inputs[0] ? 1 : 0)) + ", " + (20 + 235 * (inputs[1] ? 1 : 0)) + ", " + (20 + 235 * (inputs[2] ? 1 : 0)) + ")";
				node.ctx.fill();
				node.lastInputs = [inputs[0], inputs[1], inputs[2]];
			}
		},
		getImage: function (node) {
			if (!node.image) {
				var ctx = SQUARIFIC.simpleLogic.node.getBackground(50, 50, 5);
				ctx.beginPath();
				ctx.arc(25, 25, 15, 0, 2 * Math.PI);
				ctx.fillStyle = "rgb(20, 20, 20)";
				ctx.fill();
				node.image = ctx.canvas;
				node.ctx = ctx;
			}
			return node.image;
		}
	},
	SQUARERGBLIGHT: {
		inputs: 3,
		outputs: 0,
		update: function (node, inputs, time) {
			if (!node.ctx) {
				node.propertys.getImage(node);
			}
			node.lastInputs = node.lastInputs || [];
			if (node.lastInputs[0] !== inputs[0] || node.lastInputs[1] !== inputs[1] || node.lastInputs[2] !== inputs[2]) {
				node.ctx.beginPath();
				node.ctx.rect(0, 0, 40, 40);
				node.ctx.fillStyle = "rgb(" + (20 + 235 * (inputs[0] ? 1 : 0)) + ", " + (20 + 235 * (inputs[1] ? 1 : 0)) + ", " + (20 + 235 * (inputs[2] ? 1 : 0)) + ")";
				node.ctx.fill();
				node.lastInputs = [inputs[0], inputs[1], inputs[2]];
			}
		},
		getImage: function (node) {
			if (!node.image) {
				var ctx = SQUARIFIC.simpleLogic.node.getBackground(40, 40, 5);
				ctx.beginPath();
				ctx.rect(0, 0, 40, 40);
				ctx.fillStyle = "rgb(20, 20, 20)";
				ctx.fill();
				node.image = ctx.canvas;
				node.ctx = ctx;
			}
			return node.image;
		}
	},
	DIGITDISPLAY: {
		inputs: 4,
		outputs: 0,
		update: function (node, inputs, time) {
			node.lastInputs = node.lastInputs || [];
			if (!node.ctx) {
				node.propertys.getImage(node);
			}
			if (node.lastInputs[0] !== inputs[0] || node.lastInputs[1] !== inputs[1] || node.lastInputs[2] !== inputs[2] || node.lastInputs[3] !== inputs[3]) {
				var number = "";
				for (var k = 0; k < inputs.length; k++) {
					number += inputs[k] ? 1 : 0;
				}
				number = parseInt(number, 2).toString(16);
				node.ctx.beginPath();
				node.ctx.rect(5, 5, 40, 70);
				node.ctx.fillStyle = "rgb(55, 55, 55)";
				node.ctx.fill();
				node.ctx.font="50px 'Coda Caption'";
				node.ctx.fillStyle = "rgb(219, 43, 64)";
				node.ctx.fillText(number.toUpperCase(), 10, 60);
				node.lastInputs = [inputs[0], inputs[1], inputs[2], inputs[3]];
			}
		},
		getImage: function (node) {
			if (!node.image) {
				var ctx = SQUARIFIC.simpleLogic.node.getBackground(50, 80, 5);
				ctx.font="50px 'Coda Caption'";
				ctx.fillStyle = "rgb(219, 43, 64)";
				ctx.fillText("0", 10, 60);
				node.image = ctx.canvas;
				node.ctx = ctx;
			}
			return node.image;
		}
	},
	LEVER: {
		inputs: 0,
		outputs: 1,
		update: function () {
		},
		getImage: function (node) {
			if (!node.image) {
				var ctx = SQUARIFIC.simpleLogic.node.getBackground(50, 50, 5);
				ctx.beginPath();
				ctx.rect(20, 10, 10, 30);
				ctx.fillStyle = "gray";
				ctx.fill();
				node.image = ctx.canvas;
				node.image.addEventListener("click", function () {
					this.outputs[0] = !this.outputs[0];
					ctx.beginPath();
					ctx.rect(20, 10, 10, 30);
					ctx.fillStyle = (this.outputs[0]) ? "#739228" : "gray";
					ctx.fill();
				}.bind(node));
				node.ctx = ctx;
				node.image.style.cursor = "pointer";
			}
			return node.image;
		}
	},
	PULSER: {
		inputs: 0,
		outputs: 4,
		update: function (node, inputs, time) {
			node.outputs[0] = !(Math.floor(time / 100) % 2);
			node.outputs[1] = !(Math.floor(time / 200) % 2);
			node.outputs[2] = !(Math.floor(time / 500) % 2);
			node.outputs[3] = !(Math.floor(time / 1000) % 2);
		},
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("PULSER, 100, 200, 500, 1000");
			}
			return node.image;
		}
	},
	SRFF: {
		inputs: 3,
		outputs: 2,
		defaultOutputs: [false, true],
		update: (function () {
			var c = false;
			return function (node, inputs, time) {
				if (!c && node.inputs[2] && node.inputs[0] != node.inputs[1]) {
	    				node.outputs[1] = !(node.outputs[0] = node.inputs[0]);
				}
				c = node.inputs[2];
			};
		})(),
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("SR FLIP-FLOP");
			}
			return node.image;
		}
	},
	TFF: {
		inputs: 2,
		outputs: 2,
		defaultOutputs: [false, true],
		update: (function () {
			var c = false;
			return function (node, inputs, time) {
				if (!c && node.inputs[1] && node.inputs[0]) {
	    				node.outputs[1] = !(node.outputs[0] = !node.outputs[0]);
				}
				c = node.inputs[1];
			};
		})(),
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("T FLIP-FLOP");
			}
			return node.image;
		}
	},
	JKFF: {
		inputs: 3,
		outputs: 2,
		defaultOutputs: [false, true],
		update: (function () {
			var c = false;
			return function (node, inputs, time) {
				if (!c && node.inputs[2] && (node.inputs[0] || node.inputs[1])) {
					node.outputs[1] = !(node.outputs[0] = (node.inputs[0] && node.inputs[1] ? !node.outputs[0] : node.inputs[0]));
				}
				c = node.inputs[2];
			};
		})(),
		getImage: function (node) {
			if (!node.image) {
				node.image = SQUARIFIC.simpleLogic.port.getImage("JK FLIP-FLOP");
			}
			return node.image;
		}
	}
};
