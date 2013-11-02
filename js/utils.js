var SQUARIFIC = SQUARIFIC || {};
SQUARIFIC.utils = SQUARIFIC.utils || {};

SQUARIFIC.utils.newCtx = function newCtx (width, height, bckcolor) {
	var ctx = document.createElement("canvas");
	ctx.width = width;
	ctx.height = height;
	ctx = ctx.getContext("2d");
	if (bckcolor) {
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.fillStyle = bckcolor;
		ctx.fill();
	}
	return ctx;
};