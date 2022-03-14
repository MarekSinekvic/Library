canvcreate("", 500, 500);
canv.width = window.innerWidth;
canv.height = window.innerHeight;
window.onresize = function () {
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
}


var startTime = new Date();
var deltaTime = 0;
var frame = 0;
var rFps = 0;

var frameCountForSample = 5;
var fps = 0;



function render() {
	deltaTime = (new Date() - startTime);
	startTime = new Date();
	fps += 1000/deltaTime;
	if (frame % frameCountForSample == 0) {
		rFps = fps/frameCountForSample;
		fps = 0;
	}
	
	d.clear("black");
	d.txt(Math.round(rFps),1,16, "","white");
	frame++;
	requestAnimationFrame(render);
};
requestAnimationFrame(render);