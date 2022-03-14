var input = new(class {
	constructor() {
		this.mouse = {
			position: {x:0,y:0},
			x: 0,
			y: 0,
			click: 0,

			_isMouseClicked: false,
			isMouseDown: function (m) {
				if (this.click == m && !this._isMouseClicked) {
					this._isMouseClicked = true;
					return true;
				}
				(this.click == 0) ? this._isMouseClicked = false : this._isMouseClicked = true;
				return false;
			},
			isMouseUp: function (m) {
				if (this.click == 0 && !this._isMouseClicked) {
					this._isMouseClicked = true;
					return true;
				}
				(this.click == m) ? this._isMouseClicked = false : this._isMouseClicked = true;
			}
		};
		this.keyboard = {
			char: "",
			code: 0,
			_isKeyClicked: false,
			isKeyDown: function (m) {
				if (this.code == m && !this._isMouseClicked) {
					this._isMouseClicked = true;
					return true;
				}
				(this.code == 0) ? this._isMouseClicked = false : this._isMouseClicked = true;
				return false;
			},
		};
		this.scroll = {
			y: 0
		};
	}
	aim(x, y, sizeX, sizeY) {
		if (mouse.pos[0] >= x && mouse.pos[1] >= y && mouse.pos[0] <= x + sizeX && mouse.pos[1] <= y + sizeY) {
			out = true;
		} else {
			out = false;
		}
		return out;
	}
})();

id = "canvas";
canv = undefined;
ctx = undefined;
width = undefined;
height = undefined;

function mouseMove(e) { }
function onWheel(e) { }

function canvcreate(style, w, h, id = "canvas") {
	canv = document.createElement("canvas");
	canv.id = id;
	canv.style = style;
	canv.width = w;
	canv.height = h;
	canv.addEventListener("mousemove", e => {
		input.mouse.x = e.offsetX;
		input.mouse.y = e.offsetY;
		input.mouse.position = {
			x: e.offsetX,
			y: e.offsetY
		};
		mouseMove(e);
	});
	canv.addEventListener("mousedown", e => {
		input.mouse.click = e.button + 1;
	});
	canv.addEventListener("mouseup", e => {
		input.mouse.click = 0;
	});
	document.addEventListener("keydown", e => {
		input.keyboard.code = e.keyCode;
		input.keyboard.char = e.key;
	});
	document.addEventListener("keyup", e => {
		input.keyboard.code = 0;
		input.keyboard.char = "";
	});
	canv.addEventListener("mousewheel", e => {
		input.scroll.y = e.deltaY/100;
		onWheel(e);
	});
	canv.oncontextmenu = function () { return false; }
	width = canv.width;
	height = canv.height
	document.body.appendChild(canv);
	id = id;
	canv = canv;
	ctx = canv.getContext("2d");
}

function inRgb(r, g, b, a = 1) {
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function rgbStringToArray(color) {
	let rgbcolors = color.slice(4, color.length - 1).split(',');
	return [parseFloat(rgbcolors[0]), parseFloat(rgbcolors[1]), parseFloat(rgbcolors[2]),1]
}
function rgbaStringToArray(color) {
	let rgbcolors = color.slice(5, color.length - 1).split(',');
	return [parseFloat(rgbcolors[0]), parseFloat(rgbcolors[1]), parseFloat(rgbcolors[2]), parseFloat(rgbcolors[3])]
}

var d = new(class draw {
	constructor() {}

	circle(x, y, r, fillcolor = "black", linecolor = "black", lineWidth = 1, filled = true, angles = [0, 360], direction = false) {
		let startLineWidth = ctx.lineWidth;
		let startColor = { fill: ctx.fillStyle, stroke: ctx.strokeStyle };

		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = linecolor;
		ctx.fillStyle = fillcolor;
		ctx.beginPath();
		ctx.arc(x, y, r, (angles[0] * Math.PI) / 180, (angles[1] * Math.PI) / 180, direction);
		if (filled)
			ctx.fill();
		else
			ctx.stroke();
		ctx.lineWidth = startLineWidth;
		ctx.fillColor = startColor.fill;
		ctx.strokeColor = startColor.stroke;
	}

	rect(x, y, w, h, fillcolor = "black", linecolor = "black", linewidth = 1, filled = true) {
		ctx.fillStyle = fillcolor;
		ctx.strokeStyle = linecolor;
		ctx.lineWidth = linewidth;
		if (filled) {
			ctx.fillRect(x, y, w, h);
		} else {
			ctx.strokeRect(x, y, w, h);
		}
	}

	line(x, y, x1, y1, clr = "black", lineWidth = 1) {
		ctx.fillStyle = clr;
		ctx.strokeStyle = clr;
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.moveTo(x, y);
		ctx.lineTo(x1, y1);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
	}
	
	ray(x, y, direction, length = 10, clr = "white", haveArrow = false, inLengthArrowSize = 0.6, inNormalArrowSize = 0.2, lineWidth = ctx.lineWidth) {
		let startLineWidth = ctx.lineWidth;

		direction = math.normalize(direction);

		ctx.lineWidth = lineWidth;
		d.line(x, y, x + direction.x * length, y + direction.y * length, clr);

		let normal = {x:-direction.y, y:direction.x};
		d.line(	x + direction.x * length, y + direction.y * length,
				x + direction.x * (length*inLengthArrowSize) + normal.x * (inNormalArrowSize*length), y + direction.y * (length*inLengthArrowSize) + normal.y * (inNormalArrowSize*length),clr);
		d.line(	x + direction.x * length, y + direction.y * length,
				x + direction.x * (length*inLengthArrowSize) - normal.x * (inNormalArrowSize*length), y + direction.y * (length*inLengthArrowSize) - normal.y * (inNormalArrowSize*length),clr);

		ctx.lineWidth = startLineWidth;
	}
	
	txt(text, x, y, font, color = "white", isStroke = false) {
		let startFont = ctx.font;
		let startColor = { fill: ctx.fillStyle, stroke: ctx.strokeStyle };
		
		ctx.font = font;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;

		if (!isStroke)
			ctx.fillText(text, x, y);
		else
			ctx.strokeText(text, x, y);
		
		ctx.font = startFont;
		ctx.fillColor = startColor.fill;
		ctx.strokeColor = startColor.stroke;
	}

	clear(clr) {
		canv.style.backgroundColor = clr;
		ctx.clearRect(0, 0, canv.width, canv.height);
	}

	drawImg(img, x, y, w, h, sx = 0, sy = 0, sw = w, sh = h) {
		ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
	}
})();

var math = new(class M {
	constructor() {}
	sin(x) {
		return Math.sin((x * Math.PI) / 180);
	}

	cos(x) {
		return Math.cos((x * Math.PI) / 180);
	}

	asin(x) {
		return Math.asin(x) * 180 / Math.PI;
	}

	acos(x) {
		return Math.acos(x) * 180 / Math.PI;
	}

	limit(x, min_x, max_x) {
		let out_x = x;
		if (x > max_x) {
			out_x = x - max_x * math.floor(x / max_x);
		}
		if (x < min_x) {
			out_x = x + max_x * math.floor(x / min_x);
		}
		return out_x;
	}

	normalize(x) {
		let d = Math.sqrt(Math.pow(x.x, 2) + Math.pow(x.y, 2));
		return {
			x: x.x / d,
			y: x.y / d
		};
	}

	sqrMagnitude(x) {
		return Math.pow(x.x,2)+Math.pow(x.y,2);
	}
	magnitude(x) {
		let d = Math.pow(x.x,2)+Math.pow(x.y,2);
		if (x.z != null) d += Math.pow(x.z,2);
		return Math.sqrt(d);
	}
	dot(a,b) {
		return a.x * b.x + a.y * b.y;
	}
	cross(a, b) {
		// let M1 = new Matrix([
		// 					[0,-a.z,a.y],
		// 					[a.z,0,-a.x],
		// 					[-a.y,a.x,0]]);
		// let M2 = new Matrix([[b.x], [b.y], [b.z]]);

		let c = {
			x: -a.z*b.y + a.y*b.z,
			y: a.z*b.x - a.x*b.z,
			z: -a.y*b.x + a.x*b.y
		};

		return c;
	}
	pseudoDot(a,b) {
		return a.x*b.y-b.x*a.y;
	}
	reflect(v, normal) {
		normal = math.normalize(normal);

		let dotProduct = v.x * normal.x + v.y * normal.y;

		return {x: v.x - 2 * dotProduct * normal.x,y: v.y - 2 * dotProduct * normal.y};
	}
	///-BASIC-///

	floor(x) {
		return Math.floor(x);
	}
	floorWithNegate(x) {
		return Math.sign(x)*Math.floor(Math.abs(x));
	}
	round(x) {
		return Math.round(x);
	}
	ceil(x) {
		return Math.ceil(x);
	}
	pow(x, y) {
		return Math.pow(x, y);
	}
	random() {
		return Math.random();
	}
	sqrt(x) {
		return Math.sqrt(x);
	}
	clamp(x,a,b) {
		if (x < a) return a;
		if (x > b) return b;
		return x;
	}

	///-BASIC-///

	distance(p0, p1) {
		return [Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2)), p0[0] - p1[0], p0[1] - p1[1]];
	}
	magnitude(v) {
		if (v.z != undefined) return Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
		return Math.sqrt(v.x*v.x+v.y*v.y);
	}
	lerp(a,b,c) {
		return a + (b - a) * c;
	}

	timer(tvar, max) {
		tvar -= 1;
		if (tvar == 0) {
			tvar = max;
			return true;
		} else {
			return false;
		}
	}

	inter(x, y, sizeX, sizeY, x1, y1, sizeX1, sizeY1) {
		if (x + sizeX > x1 && x < x1 + sizeX1 && y + sizeY > y1 && y < y1 + sizeY1) {
			return true;
		} else {
			return false;
		}
	}

	
	circleCollision(origin, direction, circlePosition, circleRadius = 1) {
		direction = math.normalize(direction);
		let deltaPosition = {
			x: circlePosition.x-origin.x,
			y: circlePosition.y-origin.y
		};
		let b = 2 * math.dot(direction, deltaPosition);
		let c = math.dot(deltaPosition, deltaPosition) - (circleRadius * circleRadius);
		let D = b * b - 4 * c;
		if (D > 0) {
			let t1 = (b-Math.sqrt(D))/2;
			let t2 = (b+Math.sqrt(D))/2;
			if (t1 > 0 && t2 > 0) {
				let x1 = {
					x: origin.x + direction.x * t1,
					y: origin.y + direction.y * t1
				};
				let x2 = {
					x: origin.x + direction.x * t2,
					y: origin.y + direction.y * t2
				};
				return [true, x1, x2, t1, t2];
			} else if (t1 < 0 && t2 < 0) {
				return [false];
			} else {
				let x = {
					x: origin.x + direction.x * t2,
					y: origin.y + direction.y * t2
				};
				return [true,x,0,t2,0];
			}
		} else if (D == 0) {
			let t = b/2;
			if (t > 0) {
				let x = {
					x: origin.x + direction.x * t,
					y: origin.y + direction.y * t
				};
				return [true, x, 0, t, 0];
			} else
				return [false];
		} else {
			return [false];
		}
	}
	dstToLine(lx1,ly1,lx2,ly2, x, y) {
		let delta1 = {
			x: lx2-lx1,
			y: ly2-ly1
		};
		let normal = math.normalize({x:-delta1.y,y:delta1.x});
		let delta2 = {
			x: x-lx1,
			y: y-ly1
		};
		return {byNormal: math.dot(delta2,normal), byLine: math.dot(delta2,math.normalize(delta1)), byLineNormalized: (math.dot(delta2,math.normalize(delta1))/math.magnitude(delta1))};
	}
	getEqDeriative(eq, x, d = 0.0001) {
		return (eq(x + d) - eq(x)) / d;
	}
})();
var v2d = new (class V {
	constructor(x = 0, y = 0) {
		if (typeof x == "object") {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
		this.vector = {x:this.x,y:this.y};
	}
	plus(v2) {
		return new vect2d(this.x+v2.x,this.y+v2.y);
	}
	mult(v,a) {
		return {x:v.x*a,y:v.y*a};
	}
	negate(apply = false) {
		if (apply) {
			this.x = -this.x;
			this.y = -this.y;
			return { x: -this.x, y: -this.y };
		} else {
			return { x: -this.x, y: -this.y };
		}
	}
	reflect(normal, refraction = 1) { 
		normal = math.normalize(normal);

		let dotProduct = v.x * normal.x + v.y * normal.y;

		return {x: v.x - 2 * dotProduct * normal.x * refraction,y: v.y - 2 * dotProduct * normal.y * refraction};
	}
	lineCollision(wp1, wp2, width = 1) {
		var vectorToP1 = math.distance([this.x, this.y],[wp1.x, wp1.y]);
		var wn = math.normalize({x: wp1.y-wp2.y, y: wp2.x-wp1.x});
		var projection = wn.x * vectorToP1[1] + wn.y * vectorToP1[2];
		
		var wlength = math.distance([wp1.x,wp1.y],[wp2.x,wp2.y])[0];

		if (Math.abs(projection) < width) {
			let dToP1 = math.distance([this.x,this.y],[wp1.x,wp1.y]);
			let dToP2 = math.distance([this.x,this.y],[wp2.x,wp2.y]);
			if (dToP1[0] < wlength && dToP2[0] < wlength)
				return true;
		}
		return false;
	}
	circleCollision(origin,circlePosition,circleRadius = 1) {
		return [false];
		let direction = math.normalize(this.vector);
		let deltaPosition = {
			x: circlePosition.x-origin.x,
			y: circlePosition.y-origin.y
		};
		let b = 2 * math.dot(direction, deltaPosition);
		let c = math.dot(deltaPosition, deltaPosition) - (circleRadius * circleRadius);
		let D = b * b - 4 * c;
		if (D > 0) {
			let t1 = (b-Math.sqrt(D))/2;
			let t2 = (b+Math.sqrt(D))/2;
			if (t1 > 0 && t2 > 0) {
				let x1 = {
					x: origin.x + direction.x * t1,
					y: origin.y + direction.y * t1
				};
				let x2 = {
					x: origin.x + direction.x * t2,
					y: origin.y + direction.y * t2
				};
				return [true, x1, x2, t1, t2];
			} else if (t1 < 0 && t2 < 0) {
				return [false];
			} else {
				let x = {
					x: origin.x + direction.x * t2,
					y: origin.y + direction.y * t2
				};
				return [true,x,0,t2,0];
			}
		} else if (D == 0) {
			let t = b/2;
			if (t > 0) {
				let x = {
					x: origin.x + direction.x * t,
					y: origin.y + direction.y * t
				};
				return [true, x, 0, t, 0];
			} else
				return [false];
		} else {
			return [false];
		}
	}
	dot(v2) { 
		return this.x * v2.x + this.y * v2.y;
	}
})();
// class Matrix {
// 	constructor(M) {
// 		this.matrix = M;
// 	}
// 	mult(M2) {
// 		let M3 = [];
// 		for (let i1 = 0; i1 < M.length; i1++) {
// 			for (let j1 = 0; j1 < M[i].length; j1++) {



// 			}
// 		}
// 		for (let i = 0; i < M.length; i++) {
// 			for (let j = 0; j < M[i].length; j++) {

				

// 			}
// 		}
// 	}
// }

var game = new(class {
	constructor() {
		this.prop = {};
	}
	img(src) {
		let img = new Image();
		img.src = src;
		return img;
	}
	animate(img, fragments = [
		[0, 0, 0, 0, 0]
	]) {
		var time = 0;
		var i = 0;
		return function (x, y) {
			ctx.drawImage(img, fragments[i][0], fragments[i][1], fragments[i][2], fragments[i][3], x, y, fragments[i][2], fragments[i][3]);
			if (time++ > fragments[i][4]) {
				i++;
				if (i >= fragments.length) i = 0;
				time = 0;
			}
		};
	}
})();
class v2 {
	x = 0;
	y = 0;
	constructor(x=0,y=0) {
		if (typeof x == "object") {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}
	mult(b) {
		return new v2(this.x*b,this.y*b);
	}
	plusV(b) {
		return new v2(this.x+b.x,this.y+b.y);
	}
	minusV(b) {
		return new v2(this.x-b.x,this.y-b.y);
	}
	negate() { 
		return new v2(-this.x,-this.y);
	}
	magnitude() {
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
	}
	normalize() {
		let magn = this.magnitude();
		return new v2(this.x/magn,this.y/magn);
	}
	divide(a) {
		return new v2(this.x/a,this.y/a);
	}
}

var debug_ = new (class {
	constructor() { }
	logVector(a) {
		if (typeof a == "number")
			return console.log("Number: " + a);
		if (typeof a.z == "undefined")
			return console.log("Vector2: "+ a.x + ", " + a.y);
		else
			return console.log("Vector3: "+ a.x + ", " + a.y + ", " + a.z);
	}

})();

class Slider {
	constructor(Position = { x: 0, y: 0 }, Label = "test", OnChange = new function (v) { },SimbolsCountByDot = 2,Length = 120,StartCurrentValue = 50,MinValue = -100,MaxValue = 100,ValueStep = 0) {
		this.label = Label;
		this.labelLength = ctx.measureText(this.label).width;

		this.position = Position;
		this.position.x += this.labelLength-4;
		this.length = Length;
		this.min = MinValue;
		this.max = MaxValue;
		this.step = ValueStep;

		this.simbolsCountByDot = SimbolsCountByDot;

		this.onChange = OnChange;

		this.stickPosition = StartCurrentValue/MaxValue;

		this.wasClicked = false;
	}
	draw() {
		d.line(this.position.x,this.position.y,this.position.x+this.length,this.position.y,"white");
		d.line(this.position.x,this.position.y-4,this.position.x,this.position.y+4,"white");
		d.line(this.position.x+this.length,this.position.y-4,this.position.x+this.length,this.position.y+4,"white");
		
		d.circle(this.position.x + this.stickPosition * this.length, this.position.y, 4, "white", "white", 1, false);
		d.circle(this.position.x + this.stickPosition * this.length, this.position.y, 3, "black", "black", 1, true);
		
		d.txt((this.min+this.stickPosition*(this.max-this.min)).toFixed(this.simbolsCountByDot),this.position.x + this.length + 5,this.position.y+9/3,"9px Arial");
		d.txt(this.label,this.position.x-this.labelLength-4,this.position.y+5,"","white");
	}
	control() {
		if (input.mouse.click == 1) {
			let dst = math.distance([input.mouse.position.x,input.mouse.position.y],[this.position.x+this.stickPosition*this.length,this.position.y]);
			let clickPos = -1;
			if (dst[0] < 4)
				this.wasClicked = true;
			if (Math.abs(dst[2]) < 4 && Math.abs(dst[1]) < this.length) {
				this.wasClicked = true;
				clickPos = (input.mouse.position.x - this.position.x) / this.length;
			}
			if (this.wasClicked) {
				if (clickPos != -1) {
					this.stickPosition = clickPos;
					clickPos = -1;
				}
				this.stickPosition = (input.mouse.position.x - this.position.x) / this.length;
				if (this.stickPosition > 1) this.stickPosition = 1;
				if (this.stickPosition < 0) this.stickPosition = 0;
				
				this.onChange((this.min+this.stickPosition*(this.max-this.min)));
			}
		}
		if (input.mouse.click == 0) {
			this.wasClicked = false;
		}
	}
	getResult() {
		return (this.min + this.stickPosition * (this.max - this.min));
	}
}
class Button {
	constructor(position,isToggle = false) {
		
	}
}
class Record {
	constructor() {
		this.recordedData = [];
		this.recordFrame = 0;
		this.recordedData[0] = [];

		this.replayFrame = 0;
	}
	AddData(newData) {
		this.recordedData[this.recordFrame].push(newData);
	}
	NextFrame() {
		this.recordFrame++;
		this.recordedData[this.recordFrame] = [];
	}
}
class GraphData {
	constructor(Value, XPosition, Color = "rgb(255,255,255)", Label = "") {
		this.value = Value;
		this.xpos = XPosition;
		this.color = Color;
		this.label = Label;
	}
	GetDeriative(x, d = 0.000001) {
		return (this.value(x + d) - this.value(x)) / d;
	}
}

//TODO Lines cut, not lines delete!
//TODO Auto step length calculation based on max pixel delta
//TODO Fix X display txt
class Graph {
	constructor(StartPosition,Width,Height,ScaleX = 10,ScaleY = 10) {
		this.startPosition = StartPosition;
		this.width = Width;
		this.height = Height;

		// this.dimensionsCount = 2;
		this.data = []; // By default have 2 dimensions
		this.equations = [];

		this.scaleX = ScaleX;
		this.scaleY = ScaleY;

		this.offsetX = 0;
		this.offsetY = 0;

		this.axisLinesSize = 8;
		this.needDrawNumbers = false;

		this.drawBackground = false;
		this.backgroundOpacity = 0.8;

		document.addEventListener("mousewheel", e => {
			this.OnScroll(e);
		});
		document.addEventListener("mousemove", e => {
			this.OnMouseDrag(e);
		});
	}
	Draw() {
		if (this.drawBackground)
			d.rect(this.startPosition.x,this.startPosition.y,this.width,-this.height,"rgba(0,0,0,"+this.backgroundOpacity+")");	

		d.rect(this.startPosition.x,this.startPosition.y,this.width,-this.height,"black","rgba(255,255,255,0.1)",2,false);

		if (this.offsetY >= 0 && this.offsetY <= this.height)
			d.ray(this.startPosition.x,this.startPosition.y-this.offsetY,{x:1,y:0},this.width,"white",true,0.95,0.015);

		if (this.offsetX >= 0 && this.offsetX <= this.width)
			d.ray(this.startPosition.x+this.offsetX,this.startPosition.y,{x:0,y:-1},this.height,"white",true,0.95,0.015);

		let visualScaleX = this.scaleX;
		if (visualScaleX > this.width/20) 
			visualScaleX = this.width/20;
		let visualScaleY = this.scaleY;
		if (visualScaleY > this.height/20) 
			visualScaleY = this.height/20;

		if (-this.offsetY <= 0 && -this.offsetY >= -this.height)
			d.txt(this.scaleX + " / " + (this.scaleX/visualScaleX),this.startPosition.x+this.width+5,this.startPosition.y-this.offsetY,"","white");

		if (this.offsetX >= 0 && this.offsetX <= this.width)
			d.txt(this.scaleY + " / " + (this.scaleY/visualScaleY),this.startPosition.x+this.offsetX,this.startPosition.y-this.height-5,"","white");
	
		for (let i = 0, c = 0; i < this.width; i+=Math.abs(this.width/visualScaleX), c++) {
			// if (this.offsetY > 0-this.axisLinesSize/2 && this.offsetY < this.height+this.axisLinesSize/2) {
				let x = this.startPosition.x+i+(this.offsetX%(this.width/visualScaleX));
				let y = this.startPosition.y-this.offsetY;
				d.line(x,y+this.axisLinesSize/2,x,y-this.axisLinesSize/2,"white");

				let fontSize = 10*5/Math.pow(this.scaleX,1/2);
				if (fontSize > 0) {
					let v = i/this.width*visualScaleX+math.floorWithNegate(-this.offsetX*visualScaleX/this.width);//(this.scaleX*this.scaleX/visualScaleX)
					d.txt(v.toFixed(1),x-8,y+16,11+"px Arial","rgba(255,255,255,0.4)");
				}
			// }
			d.line(this.startPosition.x+i+(this.offsetX%(this.width/visualScaleX)),this.startPosition.y, this.startPosition.x+i+(this.offsetX%(this.width/visualScaleX)),this.startPosition.y-this.height,"rgba(255,255,255,0.07)");
		}
		for (let i = 0, c = 0; i < this.height; i+=Math.abs(this.height/visualScaleY), c++) {
			if (this.offsetX > 0-this.axisLinesSize/2 && this.offsetX < this.width+this.axisLinesSize/2) {
				let x = this.startPosition.x+this.offsetX;
				let y = this.startPosition.y-i-(this.offsetY%(this.height/visualScaleY));
				d.line(x-this.axisLinesSize/2,y,x+this.axisLinesSize/2,y,"white");

				let fontSize = 10*5/Math.pow(this.scaleY,1/2);
				if (fontSize > 0) {
					let v = i/this.height*visualScaleY+math.floorWithNegate(-this.offsetY*visualScaleY/this.height);
					d.txt(v.toFixed(1),x-8,y+16,11+"px Arial","rgba(255,255,255,0.4)");
				}
			}
			d.line(this.startPosition.x,this.startPosition.y-i-(this.offsetY%(this.height/visualScaleY)),this.startPosition.x+this.width,this.startPosition.y-i-(this.offsetY%(this.height/visualScaleY)),"rgba(255,255,255,0.07)");
		}

		for (let i = 0; i < this.data.length; i++) {
			for (let j = 0; j < this.data[i].length; j++) {
				let x = (this.data[i][j].xpos)*this.width/this.scaleX+this.offsetX;
				let y = (this.data[i][j].value)*this.height/this.scaleY+this.offsetY;
				if (x >= 0 && y >= 0 && x <= this.width && y <= this.height) {
					// if (0.1/this.scaleY > 2)
					// 	d.circle(this.startPosition.x+x,this.startPosition.y-y,0.1/this.scaleY,this.data[i][j].color);
					if (j > 0) {
						let x2 = (this.data[i][j-1].xpos)*this.width/this.scaleX+this.offsetX;
						let y2 = (this.data[i][j-1].value)*this.height/this.scaleY+this.offsetY;
						if (x2 >= 0 && x2 >= 0 && x2 <= this.width && y2 <= this.height)
							d.line(this.startPosition.x+x,this.startPosition.y-y,this.startPosition.x+x2,this.startPosition.y-y2,this.data[i][j].color);
						
						let dd = this.IsHoverOnDataLine(this.startPosition.x+x,this.startPosition.y-y,this.startPosition.x+x2,this.startPosition.y-y2);
						let lineLength = math.magnitude({x:x2-x,y:y2-y});
						if (Math.abs(dd.byNormal) < 3 && (dd.byLine > 0 && dd.byLine < lineLength)) {
							let PosInGraph = this.GlobalToLocal(x,y);
							let pos = {x:this.startPosition.x+(x+x2)/2,y:this.startPosition.y-(y+y2)/2};
							d.txt(this.data[i][j].label,pos.x+13,pos.y-16,"","white");
							d.txt(PosInGraph.x.toFixed(2),pos.x+13,pos.y,"","white");
							d.txt(PosInGraph.y.toFixed(2),pos.x+13,pos.y+16,"","white");
						}
					}
				}
			}
		}
		for (let i = 0; i < this.equations.length; i++) {
			let dataToShow = {
				isExist: false,
				x:0,
				y:0
			};
			for (let gx = 0; gx < this.width; gx++) {
				let x = this.GlobalToLocal(gx, 0).x;
				let y = this.equations[i].value(x);
				let gy = y * this.height / this.scaleY + this.offsetY;
				// d.rect(this.startPosition.x + gx, this.startPosition.y - gy, 1.2, 1.2, "red");
				let gy2 = (this.equations[i].value(this.GlobalToLocal(gx-1, 0).x))*this.height/this.scaleY+this.offsetY;
				d.line(this.startPosition.x + gx, this.startPosition.y - gy, this.startPosition.x + gx - 1, this.startPosition.y - gy2, "red",1);
				
				// let g = ((x) => { return Math.sqrt(Math.pow(x-input.mouse.x,2)+Math.pow(y-input.mouse.y,2));});
				
				let onGraphMousePos = this.GlobalToLocal(input.mouse.x-this.startPosition.x,input.mouse.y-this.startPosition.y);
				if (Math.abs(onGraphMousePos.y-this.equations[i].value(onGraphMousePos.x)) < 0.1) {
					// d.txt(this.data[i][j].label,input.mouse.x,input.mouse.y,"","white");
					dataToShow.x = (onGraphMousePos.x).toFixed(2)
					dataToShow.y = this.equations[i].value(onGraphMousePos.x).toFixed(3);
					dataToShow.isExist = true;
				}
			}
			if (dataToShow.isExist) {
				d.txt("X: "+dataToShow.x,input.mouse.x+16,input.mouse.y+16,"","white");
				d.txt("Y: "+dataToShow.y,input.mouse.x+16,input.mouse.y+32,"","white");
			}
		}
		// for (let i = 0; i < this.equations.length; i++) {
		// 	for (let x = 0; x < this.width; x+=1) {
		// 		let x0 = this.startPosition.x+x;
		// 		let lx = x;

		// 		let y = this.equations[i].value(x/this.scaleX);
		// 		d.circle(x0,this.startPosition.y-y*this.height/this.scaleY,1,"red");
		// 	}
		// }
	}
	GlobalToLocal(x,y) {
		return {x:(x-this.offsetX)/(this.width/this.scaleX),y:-(y+this.offsetY)/(this.height/this.scaleY)};
	}
	GetYByLocalX(x, eqi = 0) {
		return this.equations[eqi].value(x);
	}
	IsHoverOnDataLine(x1,y1,x2,y2) {
		let delta1 = {x:x2-x1,y:y2-y1}; 
		let normal = math.normalize({x: -delta1.y, y: delta1.x});
		let delta2 = {x:input.mouse.x-x1, y:input.mouse.y-y1};
		let dot1 = math.dot(normal,delta2);
		let dot2 = math.dot(math.normalize(delta1),delta2);
		// d.ray(x1,y1,math.normalize(delta1),dot2,"red");
		// d.ray(x1,y1,normal,dot1);
		return {byNormal:dot1, byLine: dot2};
	}
	SortDataByXAxis() {

	}
	GetNewScale(x) {
		return x/2;
	}
	OnScroll(e) {
		if (input.mouse.x < this.startPosition.x || input.mouse.x > this.startPosition.x+this.width) return;
		if (input.mouse.y > this.startPosition.y || input.mouse.y < this.startPosition.y-this.height) return;

		let h1 = this.IsHoverXAxis(input.mouse.position.y);
		let h2 = this.IsHoverYAxis(input.mouse.position.x);
		if (h1) {
			this.scaleX += e.deltaY/100*this.GetNewScale(this.scaleX);
		}
		if (h2) {
			this.scaleY += e.deltaY/100*this.GetNewScale(this.scaleY);
		}
		if (!h1 && !h2) {
			let startOffsetX = this.offsetX;
			// this.offsetX -= (input.mouse.x-this.startPosition.x);
			// this.scaleX -= (this.offsetX-startOffsetX);
			this.scaleX += e.deltaY/100*this.GetNewScale(this.scaleX);
			this.scaleY += e.deltaY/100*this.GetNewScale(this.scaleY);


			// this.offsetY += (input.mouse.position.y-this.startPosition.y)*(e.deltaY/100);
		}
		// if (this.scaleX < 0.1)
		// 	this.scaleX = 0.1;
		// if (this.scaleY < 0.1)
		// 	this.scaleY = 0.1;
	}
	OnMouseDrag(e) {
		if (input.mouse.x < this.startPosition.x || input.mouse.x > this.startPosition.x+this.width) return;
		if (input.mouse.y > this.startPosition.y || input.mouse.y < this.startPosition.y-this.height) return;


		if (e.buttons == 2) {
			this.offsetX += e.movementX;
			this.offsetY += -e.movementY;
		}
	}
	IsHoverGraph() {
		if (input.mouse.x < this.startPosition.x || input.mouse.x > this.startPosition.x+this.width) return false;
		if (input.mouse.y > this.startPosition.y || input.mouse.y < this.startPosition.y-this.height) return false;
		return true;
	}
	IsHoverXAxis(mousePosY) {
		if (Math.abs((this.startPosition.y-this.offsetY)-mousePosY) < 4) {
			return true;
		}
		return false;
	}
	IsHoverYAxis(mousePosX) {
		if (Math.abs((this.startPosition.x+this.offsetX)-mousePosX) < 4) {
			return true;
		}
		return false;
	}
}