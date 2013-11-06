simpleLogic
===========
DEMO: http://www.squarific.com/simpleLogic

Node defenitions
================

nodes.js:

	nodes = {
		NAMEOFTHENODE: {
			inputs: INT (amount of inputs the node can handle),
			outputs: INT (amount of outputs the node can handle),
			defaultOutputs: Array of booleans, optional, defaults to a full array of false values,
			update: function (node, inputs, time) {
				/*node = reference to the new Node(),
				inputs = array of boolean values of the inputs
				time = time when the update cycle started (for pulsers, don't use Date.now() or equivalents)
				This function is supposed to set the node.outputs array and if needed update the image which should have been saved at node.image, but don't assume it is generated already if it is generated in getImage, the update cycle comes before the draw cycle!*/
			},
			getImage: function (node) {
				//this function should return an image or canvas that can be added to the dom, you can save it on the (node = new Node()) preferably on node.image
			},
			mousemove: function (event, nodeDiv) {
				//nodeDiv = div of the whole node
				//If this function returns true, the node can't be dragged
			},
			mousedown: function (event) {
				//if this function returns true, the node won't be dragged
			}
		}
	}
	
If you added a node to the nodes file you still need to add it to the index.html menu under one of the categories.

Donations
=========

Donations are much appreciated
1GTq2EtKs6qKQWQXD2S8UHfpgvptSXoNo7