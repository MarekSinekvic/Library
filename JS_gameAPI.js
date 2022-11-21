var input = new (class {
	constructor() {
		this.mouse = {
			position: { x: 0, y: 0 },
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
wgl = undefined;
width = undefined;
height = undefined;

function mouseMove(e) { }
function onWheel(e) { }

function canvcreate(style, w, h, isWebGL = false, id = "canvas") {
	/** @type {HTMLCanvasElement} */
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
		input.scroll.y = e.deltaY / 100;
		onWheel(e);
	});
	canv.oncontextmenu = function () { return false; }
	width = canv.width;
	height = canv.height
	document.body.appendChild(canv);
	id = id;
	canv = canv;
	if (!isWebGL)
		ctx = canv.getContext("2d");
	else {
		/** @type {WebGLRenderingContext} */
		wgl = canv.getContext("webgl2");

		wgl.viewport(0, 0, canv.width, canv.height);
	}
}

function inRgb(r, g, b, a = 1) {
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function rgbStringToArray(color) {
	let rgbcolors = color.slice(4, color.length - 1).split(',');
	return [parseFloat(rgbcolors[0]), parseFloat(rgbcolors[1]), parseFloat(rgbcolors[2]), 1]
}
function rgbaStringToArray(color) {
	let rgbcolors = color.slice(5, color.length - 1).split(',');
	return [parseFloat(rgbcolors[0]), parseFloat(rgbcolors[1]), parseFloat(rgbcolors[2]), parseFloat(rgbcolors[3])]
}

var d = new (class draw {
	constructor() { }

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

	ray(x, y, direction, length = 10, clr = "white", withCtxPath = true, inLengthArrowSize = 0.6, inNormalArrowSize = 0.2, lineWidth = ctx.lineWidth) {
		let startLineWidth = ctx.lineWidth;

		direction = math.normalize(direction);

		ctx.lineWidth = lineWidth;

		let normal = { x: -direction.y, y: direction.x };

		if (withCtxPath) {
			ctx.strokeStyle = clr;
			ctx.beginPath();
		}
		ctx.moveTo(x, y);

		ctx.lineTo(x + direction.x * length, y + direction.y * length);

		ctx.lineTo(x + direction.x * (length * inLengthArrowSize) + normal.x * (inNormalArrowSize * length), y + direction.y * (length * inLengthArrowSize) + normal.y * (inNormalArrowSize * length));
		ctx.moveTo(x + direction.x * length, y + direction.y * length);
		ctx.lineTo(x + direction.x * (length * inLengthArrowSize) - normal.x * (inNormalArrowSize * length), y + direction.y * (length * inLengthArrowSize) - normal.y * (inNormalArrowSize * length));

		if (withCtxPath)
			ctx.stroke();

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
	Matrix(M) {

	}

	clear(clr) {
		canv.style.backgroundColor = clr;
		ctx.clearRect(0, 0, canv.width, canv.height);
	}

	drawImg(img, x, y, w, h, sx = 0, sy = 0, sw = w, sh = h) {
		ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
	}
})();
var gld = new (class {
	constructor() {

	}
	clear(color = [0, 0, 0, 1]) {
		wgl.clearColor(color[0], color[1], color[2], color[3]);
		wgl.clear(wgl.COLOR_BUFFER_BIT);
	}
	rect() {

	}
})();

var math = new (class M {
	constructor() {
		for (let i = 0; i < 10000; i++) {
			this.randoms.push(Math.random());
		}
	}
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
		if (Array.isArray(x)) {
			let magn = this.magnitude(x);
			let y = [];
			for (let i = 0; i < x.length; i++) {
				y[i] = x[i] / magn;
			}
			return y;
		}
		if (typeof (x.z) == "number") {
			let d = Math.sqrt(x.x * x.x + x.y * x.y + x.z * x.z);
			return {
				x: x.x / d,
				y: x.y / d,
				z: x.z / d
			};
		}
		let d = Math.sqrt(Math.pow(x.x, 2) + Math.pow(x.y, 2));
		return {
			x: x.x / d,
			y: x.y / d
		};
	}

	sqrMagnitude(x) {
		return Math.pow(x.x, 2) + Math.pow(x.y, 2);
	}
	magnitude(x) {
		if (Array.isArray(x)) {
			let l = 0;
			for (let i = 0; i < x.length; i++) {
				l += x[i] * x[i];
			}
			return Math.sqrt(l);
		} else {
			let d = Math.pow(x.x, 2) + Math.pow(x.y, 2);
			if (x.z != null) d += Math.pow(x.z, 2);
			return Math.sqrt(d);
		}
	}
	dot(a, b) {
		if (Array.isArray(a)) {
			let v = 0;
			for (let i = 0; i < a.length; i++) {
				v += a[i] * b[i];
			}
			return v;
		}
		if (typeof (a.z) == "number") {
			if (typeof (a.w) == "number")
				return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
			return a.x * b.x + a.y * b.y + a.z * b.z;
		}
		return a.x * b.x + a.y * b.y;
	}
	cross(a, b) {
		// let M1 = new Matrix([
		// 					[0,-a.z,a.y],
		// 					[a.z,0,-a.x],
		// 					[-a.y,a.x,0]]);
		// let M2 = new Matrix([[b.x], [b.y], [b.z]]);

		let c = {
			x: -a.z * b.y + a.y * b.z,
			y: a.z * b.x - a.x * b.z,
			z: -a.y * b.x + a.x * b.y
		};

		return c;
	}
	pseudoDot(a, b) {
		return a.x * b.y - b.x * a.y;
	}
	reflect(v, normal) {
		normal = math.normalize(normal);

		let dotProduct = v.x * normal.x + v.y * normal.y;
		dotProduct = Math.abs(dotProduct);

		return { x: v.x - 2 * dotProduct * normal.x, y: v.y - 2 * dotProduct * normal.y };
	}
	distanceToLine(target, p1, p2) {
		if (p1.length == 2) {
			let delta = [p2[0] - p1[0], p2[1] - p1[1]];
			let M = Math.sqrt(delta[0] ** 2 + delta[1] ** 2);
			// if (M == 0) return Math.sqrt((target[0] - p1[0]) ** 2 + (target[1] - p1[1]) ** 2 + (target[2] - p1[2]) ** 2);
			let N = [delta[0] / M, delta[1] / M];

			let tInLine = -(N[0] * (p1[0] - target[0]) + N[1] * (p1[1] - target[1]));
			// tInLine /= M;

			if (tInLine < 0) {
				// return math.magnitude([p1[0] - target[0], p1[1] - target[1]]);
				return Math.sqrt((p1[0] - target[0]) ** 2 + (p1[1] - target[1]) ** 2);
			}
			if (tInLine > M) {
				// return math.magnitude([p2[0] - target[0], p2[1] - target[1]]);
				return Math.sqrt((p2[0] - target[0]) ** 2 + (p2[1] - target[1]) ** 2);
			}
			// let tFromLine = math.dot(N, [-target[1] + p1[1], target[0] - p1[0]]);
			// let tFromLine = N[0] * (p1[1] - target[1]) + N[1] * (target[0] - p1[0]);
			let tFromLine = Math.sqrt(((target[0] - p1[0]) ** 2 + (target[1] - p1[1]) ** 2) - tInLine ** 2);
			return Math.abs(tFromLine);
		} else if(p1.length == 3) {
			let delta = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
			let M = Math.sqrt(delta[0] ** 2 + delta[1] ** 2 + delta[2] ** 2);
			// if (M == 0) return Math.sqrt((target[0] - p1[0]) ** 2 + (target[1] - p1[1]) ** 2 + (target[2] - p1[2]) ** 2);
			let N = [delta[0] / M, delta[1] / M, delta[2] / M];

			let tInLine = -(N[0] * (p1[0] - target[0]) + N[1] * (p1[1] - target[1]) + N[2] * (p1[2] - target[2]));
			// tInLine /= M;

			if (tInLine < 0) {
				// return math.magnitude([p1[0] - target[0], p1[1] - target[1]]);
				return Math.sqrt((p1[0] - target[0]) ** 2 + (p1[1] - target[1]) ** 2 + (p1[2] - target[2]) ** 2);
			}
			if (tInLine > M) {
				// return math.magnitude([p2[0] - target[0], p2[1] - target[1]]);
				return Math.sqrt((p2[0] - target[0]) ** 2 + (p2[1] - target[1]) ** 2 + (p2[2] - target[2]) ** 2);
			}
			// let tFromLine = math.dot(N, [-target[1] + p1[1], target[0] - p1[0]]);
			// let tFromLine = N[0] * (p1[1] - target[1]) + N[1] * (target[0] - p1[0]);
			let tFromLine = Math.sqrt(((target[0] - p1[0]) ** 2 + (target[1] - p1[1]) ** 2 + (target[2] - p1[2]) ** 2) - tInLine ** 2);
			return Math.abs(tFromLine);
		}
		return "dimension"
	}
	///-BASIC-///

	floor(x) {
		return Math.floor(x);
	}
	floorWithNegate(x) {
		return Math.sign(x) * Math.floor(Math.abs(x));
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
	sqrt(x) {
		return Math.sqrt(x);
	}
	clamp(x, a, b) {
		if (x < a) return a;
		if (x > b) return b;
		return x;
	}

	///-BASIC-///

	distance(p0, p1) {
		return [Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2)), p0[0] - p1[0], p0[1] - p1[1]];
	}
	lerp(a, b, t) {
		if (Array.isArray(a) && Array.isArray(b)) {
			let c = [];
			for (let i = 0; i < a.length; i++) {
				c.push(a[i] + (b[i] - a[i]) * t);
			}
			return c;
		}
		if (typeof a == "object") {
			return {
				x: a.x + (b.x - a.x) * t,
				y: a.y + (b.y - a.y) * t
			};
		}
		return a + (b - a) * t;
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
			x: circlePosition.x - origin.x,
			y: circlePosition.y - origin.y
		};
		let b = 2 * math.dot(direction, deltaPosition);
		let c = math.dot(deltaPosition, deltaPosition) - (circleRadius * circleRadius);
		let D = b * b - 4 * c;
		if (D > 0) {
			let t1 = (b - Math.sqrt(D)) / 2;
			let t2 = (b + Math.sqrt(D)) / 2;
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
				return [true, x, 0, t2, 0];
			}
		} else if (D == 0) {
			let t = b / 2;
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
	dstToLine(lx1, ly1, lx2, ly2, x, y) {
		let delta1 = {
			x: lx2 - lx1,
			y: ly2 - ly1
		};
		let normal = math.normalize({ x: -delta1.y, y: delta1.x });
		let delta2 = {
			x: x - lx1,
			y: y - ly1
		};
		return { byNormal: math.dot(delta2, normal), byLine: math.dot(delta2, math.normalize(delta1)), byLineNormalized: (math.dot(delta2, math.normalize(delta1)) / math.magnitude(delta1)) };
	}
	getEqDeriative(eq, x, d = 0.000001) {
		return (eq(x + d) - eq(x)) / d;
	}
	getXzEqDeriative(eq, x, z, d = 0.000001) {
		return {
			x: (eq(x + d, z) - eq(x, z)) / d,
			z: (eq(x, z + d) - eq(x, z)) / d
		};
	}
	frac(a) {
		return a - Math.floor(a);
	}
	// random(x = 0,y = 0,z = 0,w= 0) {
	// 	return this.frac(Math.sin(math.dot({x:x,y:y,z:z,w:w},{x:102.9898,y:708.233,z:153.8465,w:9845.8465}))*43758.5453123);
	// }
	randoms = [];
	getRandomFromArray(i) {
		if (i > 30000) {
			i = i % this.randoms.length;
		}
		if (i > this.randoms.length - 1) {
			let l = this.randoms.length
			for (let j = 0; j < i - l + 1; j++) {
				this.randoms.push(Math.random());
			}
			return this.randoms[i];
		} else {
			return this.randoms[i];
		}
	}
	hash(i) {
		return (i * 651959 + 19698) % 1682;
	}
	random(point) { // point is in N dimensions
		let dot = 0;
		for (let i = 0; i < point.length; i++) {
			dot += point[i] * this.hash(i);
		}
		return math.frac(Math.sin(dot) * 1.);
	}
	RandomVector(DimsCount = 2, seed = -1) {
		let v = [];
		let leng = 0;
		for (let i = 0; i < DimsCount; i++) {
			let c = Math.random();
			v.push(c);
			leng += c * c;
		}
		leng = Math.sqrt(leng);
		for (let i = 0; i < DimsCount; i++) {
			v[i] = v[i] / leng;
		}
		return v;
	}
	SimplexSmooth(x) {
		return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
	}
	SimplexNoise0(x, y, z = 0, w = 0) { // dims = []
		let pointInGrid = {
			x: Math.floor(x),
			y: Math.floor(y),
			z: Math.floor(z),
			w: Math.floor(w)
		};
		let localPoint = {
			x: x - pointInGrid.x,
			y: y - pointInGrid.y,
			z: z - pointInGrid.z,
			w: w - pointInGrid.w
		};

		let cubeVertexCount = Math.pow(2, 4);
		let cubePoints = [];
		for (let i = 0; i < cubeVertexCount; i++) {
			cubePoints.push({ // 1,2,4,8 = 2 ** n; n - dimension
				x: Math.floor(i / 1) % 2,
				y: Math.floor(i / 2) % 2,
				z: Math.floor(i / 4) % 2,
				w: Math.floor(i / 8) % 2
			});
		}

		let randomVectors = [];
		for (let i = 0; i < cubeVertexCount; i++) {
			let rx = -1 + math.random([(cubePoints[i].x + pointInGrid.x) * 1000, (cubePoints[i].y + pointInGrid.y) * 100, (cubePoints[i].z + pointInGrid.z) * 10, (cubePoints[i].w + pointInGrid.w)]) * 2;
			let ry = -1 + math.random([(cubePoints[i].x + pointInGrid.x) * 100, (cubePoints[i].y + pointInGrid.y) * 1000, (cubePoints[i].z + pointInGrid.z) * 10, (cubePoints[i].w + pointInGrid.w)]) * 2;
			let rz = -1 + math.random([(cubePoints[i].x + pointInGrid.x) * 10, (cubePoints[i].y + pointInGrid.y) * 100, (cubePoints[i].z + pointInGrid.z) * 1000, (cubePoints[i].w + pointInGrid.w)]) * 2;
			let rw = -1 + math.random([(cubePoints[i].x + pointInGrid.x), (cubePoints[i].y + pointInGrid.y) * 10, (cubePoints[i].z + pointInGrid.z) * 100, (cubePoints[i].w + pointInGrid.w) * 1000]) * 2;

			let leng = Math.sqrt(rx * rx + ry * ry + rz * rz + rw * rw);
			randomVectors.push({
				x: rx / leng,
				y: ry / leng,
				z: rz / leng,
				w: rw / leng
			});
		}

		let dots = [];
		for (let i = 0; i < cubeVertexCount; i++) {
			let dir = {
				x: localPoint.x - cubePoints[i].x,
				y: localPoint.y - cubePoints[i].y,
				z: localPoint.z - cubePoints[i].z,
				w: localPoint.w - cubePoints[i].w,
			};
			dots.push(dir.x * randomVectors[i].x + dir.y * randomVectors[i].y + dir.z * randomVectors[i].z + dir.w * randomVectors[i].w);
		}

		localPoint.x = this.SimplexSmooth(localPoint.x);
		localPoint.y = this.SimplexSmooth(localPoint.y);
		localPoint.z = this.SimplexSmooth(localPoint.z);
		localPoint.w = this.SimplexSmooth(localPoint.w);

		let xlerp1 = math.lerp(dots[0], dots[1], localPoint.x);
		let xlerp2 = math.lerp(dots[2], dots[3], localPoint.x);
		let xlerp3 = math.lerp(dots[4], dots[5], localPoint.x);
		let xlerp4 = math.lerp(dots[6], dots[7], localPoint.x);
		let xlerp5 = math.lerp(dots[8], dots[9], localPoint.x);
		let xlerp6 = math.lerp(dots[10], dots[11], localPoint.x);
		let xlerp7 = math.lerp(dots[12], dots[13], localPoint.x);
		let xlerp8 = math.lerp(dots[14], dots[15], localPoint.x);

		let ylerp1 = math.lerp(xlerp1, xlerp2, localPoint.y);
		let ylerp2 = math.lerp(xlerp3, xlerp4, localPoint.y);
		let ylerp3 = math.lerp(xlerp5, xlerp6, localPoint.y);
		let ylerp4 = math.lerp(xlerp7, xlerp8, localPoint.y);

		let zlerp1 = math.lerp(ylerp1, ylerp2, localPoint.z);
		let zlerp2 = math.lerp(ylerp3, ylerp4, localPoint.z);

		let lerp1 = math.lerp(zlerp1, zlerp2, localPoint.w);
		return [lerp1];
	}
	SimplexNoise(point) { // dims = []
		let pointInGrid = [];
		for (let i = 0; i < point.length; i++) {
			pointInGrid.push(Math.floor(point[i]));
		}
		let localPoint = [];
		for (let i = 0; i < pointInGrid.length; i++) {
			localPoint.push(point[i] - pointInGrid[i]);
		}

		let cubeVertexCount = Math.pow(2, point.length);
		let cubePoints = [];
		for (let i = 0; i < cubeVertexCount; i++) {
			let cubePoint = [];
			for (let j = 0; j < point.length; j++) {
				cubePoint.push(Math.floor(i / Math.pow(2, j)) % 2);
			}
			cubePoints.push(cubePoint);
		}


		let randomVectors = [];
		for (let i = 0; i < cubeVertexCount; i++) {
			let randomVector = [];
			let leng = 0;
			let randIndex = 0;
			for (let j = 0; j < point.length; j++) {
				let x = (cubePoints[i][j] + pointInGrid[j]);
				randIndex += Math.pow(10, j) * x;
			}
			for (let j = 0; j < point.length; j++) {
				let x = (cubePoints[i][j] + pointInGrid[j]);
				// let v = -1 + this.random([randIndex]) * 2;
				let v = -1 + this.getRandomFromArray(Math.abs(randIndex)) * 2; // randIndex**2
				randomVector.push(v);
				leng += v * v;
			}
			leng = Math.sqrt(leng);
			for (let j = 0; j < randomVector.length; j++) {
				randomVector[j] /= leng;
			}
			randomVectors.push(randomVector);
		}

		let dots = [];
		for (let i = 0; i < cubeVertexCount; i++) {
			let dir = [];
			for (let j = 0; j < point.length; j++) {
				dir.push(localPoint[j] - cubePoints[i][j]);
			}
			let dot = 0;
			for (let j = 0; j < point.length; j++) {
				dot += dir[j] * randomVectors[i][j];
			}
			dots.push(dot);
		}

		for (let i = 0; i < localPoint.length; i++) {
			localPoint[i] = this.SimplexSmooth(localPoint[i]);
		}

		let lerps = [];
		for (let i = 0; i < Math.pow(2, point.length); i += 2) {
			lerps.push(this.lerp(dots[i], dots[i + 1], localPoint[0]));
		}

		for (let i = 0; lerps.length > 1; i++) {
			let newLerp = [];
			for (let j = 0; j < lerps.length; j += 2) {
				newLerp.push(math.lerp(lerps[j], lerps[j + 1], localPoint[i + 1]));
			}
			lerps = newLerp;
		}
		return lerps[0];
	}
	FBM(point, octavesCount = 1) {
		let v = 0;
		let freq = 1, intens = 1;
		for (let t = 0; t < octavesCount; t++) {
			v += this.SimplexNoise(this.mult(point, freq)) * intens;
			freq *= 2;
			intens *= 0.5;
		}
		return v / octavesCount;
	}
	mult(a, b) {
		if (Array.isArray(a) && typeof (b) == "number") {
			for (let i = 0; i < a.length; i++) {
				a[i] *= b;
			}
			return a;
		}
		return a;
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
		this.vector = { x: this.x, y: this.y };
	}
	plus(v2) {
		return new vect2d(this.x + v2.x, this.y + v2.y);
	}
	mult(v, a) {
		return { x: v.x * a, y: v.y * a };
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

		return { x: v.x - 2 * dotProduct * normal.x * refraction, y: v.y - 2 * dotProduct * normal.y * refraction };
	}
	lineCollision(wp1, wp2, width = 1) {
		var vectorToP1 = math.distance([this.x, this.y], [wp1.x, wp1.y]);
		var wn = math.normalize({ x: wp1.y - wp2.y, y: wp2.x - wp1.x });
		var projection = wn.x * vectorToP1[1] + wn.y * vectorToP1[2];

		var wlength = math.distance([wp1.x, wp1.y], [wp2.x, wp2.y])[0];

		if (Math.abs(projection) < width) {
			let dToP1 = math.distance([this.x, this.y], [wp1.x, wp1.y]);
			let dToP2 = math.distance([this.x, this.y], [wp2.x, wp2.y]);
			if (dToP1[0] < wlength && dToP2[0] < wlength)
				return true;
		}
		return false;
	}
	circleCollision(origin, circlePosition, circleRadius = 1) {
		return [false];
		let direction = math.normalize(this.vector);
		let deltaPosition = {
			x: circlePosition.x - origin.x,
			y: circlePosition.y - origin.y
		};
		let b = 2 * math.dot(direction, deltaPosition);
		let c = math.dot(deltaPosition, deltaPosition) - (circleRadius * circleRadius);
		let D = b * b - 4 * c;
		if (D > 0) {
			let t1 = (b - Math.sqrt(D)) / 2;
			let t2 = (b + Math.sqrt(D)) / 2;
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
				return [true, x, 0, t2, 0];
			}
		} else if (D == 0) {
			let t = b / 2;
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

var game = new (class {
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
	constructor(x = 0, y = 0) {
		if (typeof x == "object") {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}
	mult(b) {
		return new v2(this.x * b, this.y * b);
	}
	plusV(b) {
		return new v2(this.x + b.x, this.y + b.y);
	}
	minusV(b) {
		return new v2(this.x - b.x, this.y - b.y);
	}
	negate() {
		return new v2(-this.x, -this.y);
	}
	magnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
	normalize() {
		let magn = this.magnitude();
		return new v2(this.x / magn, this.y / magn);
	}
	divide(a) {
		return new v2(this.x / a, this.y / a);
	}
}

var debug_ = new (class {
	constructor() { }
	logVector(a) {
		if (typeof a == "number")
			return console.log("Number: " + a);
		if (typeof a.z == "undefined")
			return console.log("Vector2: " + a.x + ", " + a.y);
		else
			return console.log("Vector3: " + a.x + ", " + a.y + ", " + a.z);
	}

})();

class Slider {
	constructor(Position = { x: 0, y: 0 }, Label = "test", OnChange = new function (v) { }, SimbolsCountByDot = 2, Length = 120, StartCurrentValue = 50, MinValue = -100, MaxValue = 100, ValueStep = 0) {
		this.label = Label;
		this.labelLength = ctx.measureText(this.label).width;

		this.position = Position;
		this.position.x += this.labelLength - 4;
		this.length = Length - ctx.measureText(Label).width - ctx.measureText((Math.pow(10, SimbolsCountByDot + 1) - 1).toString()).width;
		this.min = MinValue;
		this.max = MaxValue;
		this.step = ValueStep;

		this.simbolsCountByDot = SimbolsCountByDot;

		this.onChange = OnChange;

		this.stickPosition = StartCurrentValue / MaxValue;

		this.wasClicked = false;
	}
	draw() {
		d.line(this.position.x, this.position.y, this.position.x + this.length, this.position.y, "white");
		d.line(this.position.x, this.position.y - 4, this.position.x, this.position.y + 4, "white");
		d.line(this.position.x + this.length, this.position.y - 4, this.position.x + this.length, this.position.y + 4, "white");

		d.circle(this.position.x + this.stickPosition * this.length, this.position.y, 4, "white", "white", 1, false);
		d.circle(this.position.x + this.stickPosition * this.length, this.position.y, 3, "black", "black", 1, true);

		d.txt((this.min + this.stickPosition * (this.max - this.min)).toFixed(this.simbolsCountByDot), this.position.x + this.length + 5, this.position.y + 9 / 3, "9px Arial");
		d.txt(this.label, this.position.x - this.labelLength - 4, this.position.y + 5, "", "white");
	}
	control() {
		if (input.mouse.click == 1) {
			let dst = math.distance([input.mouse.position.x, input.mouse.position.y], [this.position.x + this.stickPosition * this.length, this.position.y]);
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

				this.onChange((this.min + this.stickPosition * (this.max - this.min)));
			}
		}
		if (input.mouse.click == 0) {
			this.wasClicked = false;
		}
	}
	setStickPosition(t) {
		this.stickPosition = (this.min - t) / (this.min - this.max);
	}
	isHoverOnSlider(point) {
		let dst = math.distance([input.mouse.position.x, input.mouse.position.y], [this.position.x + this.stickPosition * this.length, this.position.y]);
		if (Math.abs(dst[2]) < 4 && Math.abs(dst[1]) < this.length) {
			return true;
		}
		return false;
	}
	getResult() {
		return (this.min + this.stickPosition * (this.max - this.min));
	}
}
class Toggle {
	constructor(Position, TextSize, StartState = false, TextOnFalse = "FALSE", TextOnTrue = "TRUE") {
		this.position = Position;
		this.size = TextSize;
		this.state = StartState;

		this.textOnFalse = TextOnFalse;
		this.textOnTrue = TextOnTrue;

		document.addEventListener("mousedown", (e) => { this.OnClick(e) });
	}
	GetBordersRect() {
		let width = 0;
		let startFont = ctx.font;
		ctx.font = this.size + "px Arial";
		if (this.state)
			width = ctx.measureText(this.textOnTrue).width;
		else
			width = ctx.measureText(this.textOnFalse).width;

		ctx.font = startFont;
		return {
			x: this.position.x - 5,
			y: this.position.y - 5,
			w: width + 5 * 2,
			h: this.size + 5 * 2
		};
	}
	OnClick(e) {
		let bordersRect = this.GetBordersRect();
		if (e.offsetX > bordersRect.x && e.offsetX < bordersRect.x + bordersRect.w &&
			e.offsetY > bordersRect.y && e.offsetY < bordersRect.y + bordersRect.h) {

			this.state = !this.state;
		}
	}
	Draw() {
		let bordersRect = this.GetBordersRect();
		d.rect(bordersRect.x, bordersRect.y, bordersRect.w, bordersRect.h, (this.state) ? "white" : "black", "white", 1, true);
		d.rect(bordersRect.x, bordersRect.y, bordersRect.w, bordersRect.h, "black", "white", 1, false);

		let startFont = ctx.font;
		ctx.font = this.size + "px Arial";
		let width = 0;
		if (this.state) {
			width = ctx.measureText(this.textOnTrue).width;
			d.txt(this.textOnTrue, this.position.x, this.position.y + this.size - 3, this.size + "px Arial", "black", false);
		} else {
			width = ctx.measureText(this.textOnFalse).width;
			d.txt(this.textOnFalse, this.position.x, this.position.y + this.size - 3, this.size + "px Arial", "white", true);
		}
		ctx.font = startFont;
	}
}
class Button {
	constructor(position, isToggle = false) {

	}
}
class Record {
	constructor() {
		this.recordedData = [];

		this.camera = new Camera();
		this.Replay = {
			startTime: new Date(),
			FPS: 0,
			frameSlider: new Slider({ x: 60, y: canv.height - 10 }, "Frame", (v) => { this.Replay.replayFrame = v; }, 1, canv.width - 60 - 10, this.replayFrame, 0, 1, 1),
			startReplayFrame: 0,
			replaySpeed: 1,
			isReplay: false,
			replayFrame: 0,
			replayToggle: new Toggle({ x: 10, y: canv.height - 10 - 16 }, 16, true, "-", "+")
		};
	}
	Render() {
		this.Replay.FPS = 1000 / (new Date() - this.Replay.startTime);
		this.Replay.startTime = new Date();
		d.clear("black");
		for (let i = 0; i < this.recordedData.length; i++) {
			this.recordedData[i].DrawFunc(this.recordedData[i].data[Math.round(this.Replay.replayFrame)], this.camera);
		}
		if (this.Replay.isReplay)
			this.Replay.replayFrame += this.Replay.replaySpeed
		if (Math.round(this.Replay.replayFrame) >= this.recordedData[0].data.length) this.Replay.replayFrame = this.Replay.startReplayFrame;

		this.UIRender();
	}
	UIRender() {
		this.Replay.frameSlider.max = this.recordedData[0].data.length;
		this.Replay.frameSlider.setStickPosition(Math.round(this.Replay.replayFrame));
		if (this.Replay.frameSlider.wasClicked) {
			this.camera.isControlLocked = true;
		} else
			this.camera.isControlLocked = false;

		d.txt(Math.round(this.Replay.FPS), 10, 26, "16px Arial", "White");
		this.Replay.frameSlider.draw();
		this.Replay.frameSlider.control();
		this.Replay.replayToggle.Draw();
		this.Replay.isReplay = this.Replay.replayToggle.state;
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
	constructor(StartPosition, Width, Height, ScaleX = 10, ScaleY = 10) {
		this.startPosition = StartPosition;
		this.width = Width;
		this.height = Height;

		// this.dimensionsCount = 2;
		this.data = []; // [[data: new GraphData(), name: "...", color: "red"], ...]
		this.equations = [];

		this.scaleX = ScaleX;
		this.scaleY = ScaleY;

		this.offsetX = 0;
		this.offsetY = 0;

		this.axisLinesSize = 8;
		this.needDrawNumbers = false;

		this.drawBackground = false;
		this.backgroundOpacity = 0.8;

		this.lockOnLast = false;
		this.lockTarget = 0;

		document.addEventListener("mousewheel", e => {
			this.OnScroll(e);
		});
		document.addEventListener("mousemove", e => {
			this.OnMouseDrag(e);
		});
	}
	Draw() {
		if (this.lockOnLast && typeof (this.data[this.lockTarget].data[0]) != "undefined") {
			this.offsetX = (-this.data[this.lockTarget].data[this.data[this.lockTarget].data.length - 1].xpos / this.scaleX + 1) * this.width;
		}
		if (this.lockOnLast && typeof (this.data[this.lockTarget].data[0]) != "undefined") {
			// this.offsetY = (-this.data[this.lockTarget].data[this.data[this.lockTarget].data.length - 1].value / this.scaleY + 0.5) * this.height;
		}
		if (this.drawBackground)
			d.rect(this.startPosition.x, this.startPosition.y, this.width, -this.height, "rgba(0,0,0," + this.backgroundOpacity + ")");

		d.rect(this.startPosition.x, this.startPosition.y, this.width, -this.height, "black", "rgba(255,255,255,0.1)", 2, false);

		if (this.offsetY >= 0 && this.offsetY <= this.height)
			d.ray(this.startPosition.x, this.startPosition.y - this.offsetY, { x: 1, y: 0 }, this.width, "white", true, 0.95, 0.015);

		if (this.offsetX >= 0 && this.offsetX <= this.width)
			d.ray(this.startPosition.x + this.offsetX, this.startPosition.y, { x: 0, y: -1 }, this.height, "white", true, 0.95, 0.015);

		let visualScaleX = this.scaleX;
		if (visualScaleX > this.width / 20)
			visualScaleX = this.width / 20;
		let visualScaleY = this.scaleY;
		if (visualScaleY > this.height / 20)
			visualScaleY = this.height / 20;

		if (-this.offsetY <= 0 && -this.offsetY >= -this.height)
			d.txt(this.scaleX + " / " + (this.scaleX / visualScaleX), this.startPosition.x + this.width + 5, this.startPosition.y - this.offsetY, "", "white");

		if (this.offsetX >= 0 && this.offsetX <= this.width)
			d.txt(this.scaleY + " / " + (this.scaleY / visualScaleY), this.startPosition.x + this.offsetX, this.startPosition.y - this.height - 5, "", "white");

		for (let i = 0, c = 0; i < this.width; i += Math.abs(this.width / visualScaleX), c++) {
			// if (this.offsetY > 0-this.axisLinesSize/2 && this.offsetY < this.height+this.axisLinesSize/2) {
			let x = this.startPosition.x + i + (this.offsetX % (this.width / visualScaleX));
			let y = this.startPosition.y - this.offsetY;
			d.line(x, y + this.axisLinesSize / 2, x, y - this.axisLinesSize / 2, "white");

			let fontSize = 10 * 5 / Math.pow(this.scaleX, 1 / 2);
			if (fontSize > 0) {
				let v = i / this.width * visualScaleX + math.floorWithNegate(-this.offsetX * visualScaleX / this.width);//(this.scaleX*this.scaleX/visualScaleX)
				d.txt(v.toFixed(1), x - 8, y + 16, 11 + "px Arial", "rgba(255,255,255,0.4)");
			}
			// }
			d.line(this.startPosition.x + i + (this.offsetX % (this.width / visualScaleX)), this.startPosition.y, this.startPosition.x + i + (this.offsetX % (this.width / visualScaleX)), this.startPosition.y - this.height, "rgba(255,255,255,0.07)");
		}
		for (let i = 0, c = 0; i < this.height; i += Math.abs(this.height / visualScaleY), c++) {
			if (this.offsetX > 0 - this.axisLinesSize / 2 && this.offsetX < this.width + this.axisLinesSize / 2) {
				let x = this.startPosition.x + this.offsetX;
				let y = this.startPosition.y - i - (this.offsetY % (this.height / visualScaleY));
				d.line(x - this.axisLinesSize / 2, y, x + this.axisLinesSize / 2, y, "white");

				let fontSize = 10 * 5 / Math.pow(this.scaleY, 1 / 2);
				if (fontSize > 0) {
					let v = i / this.height * visualScaleY + math.floorWithNegate(-this.offsetY * visualScaleY / this.height);
					d.txt(v.toFixed(1), x - 8, y + 16, 11 + "px Arial", "rgba(255,255,255,0.4)");
				}
			}
			d.line(this.startPosition.x, this.startPosition.y - i - (this.offsetY % (this.height / visualScaleY)), this.startPosition.x + this.width, this.startPosition.y - i - (this.offsetY % (this.height / visualScaleY)), "rgba(255,255,255,0.07)");
		}

		for (let i = 0; i < this.data.length; i++) {
			ctx.strokeStyle = this.data[i].color; //this.data[i].color
			ctx.beginPath();
			for (let j = 0; j < this.data[i].data.length; j++) {
				let x = (this.data[i].data[j].xpos) * this.width / this.scaleX + this.offsetX;
				let y = (this.data[i].data[j].value) * this.height / this.scaleY + this.offsetY;
				if (x >= 0 && y >= 0 && x <= this.width && y <= this.height) {
					// if (0.1/this.scaleY > 2)
					// 	d.circle(this.startPosition.x+x,this.startPosition.y-y,0.1/this.scaleY,this.data[i][j].color);
					if (j > 0) {
						let x2 = (this.data[i].data[j - 1].xpos) * this.width / this.scaleX + this.offsetX;
						let y2 = (this.data[i].data[j - 1].value) * this.height / this.scaleY + this.offsetY;
						if (x2 >= 0 && x2 >= 0 && x2 <= this.width && y2 <= this.height) {
							// d.line(this.startPosition.x + x, this.startPosition.y - y, this.startPosition.x + x2, this.startPosition.y - y2, this.data[i][j].color);
							ctx.lineTo(this.startPosition.x + x2, this.startPosition.y - y2);
						}
						let dd = this.IsHoverOnDataLine(this.startPosition.x + x, this.startPosition.y - y, this.startPosition.x + x2, this.startPosition.y - y2);
						let lineLength = math.magnitude({ x: x2 - x, y: y2 - y });
						if (Math.abs(dd.byNormal) < 3 && (dd.byLine > 0 && dd.byLine < lineLength)) {
							let PosInGraph = this.GlobalToLocal(x, y);
							let pos = { x: this.startPosition.x + (x + x2) / 2, y: this.startPosition.y - (y + y2) / 2 };
							d.txt(this.data[i].name, pos.x + 13, pos.y - 16, "", "white");
							d.txt(this.data[i].data[j].xpos.toFixed(2), pos.x + 13, pos.y, "", "white");
							d.txt(this.data[i].data[j].value.toFixed(2), pos.x + 13, pos.y + 16, "", "white");
						}
					}
				}
			}
			ctx.stroke();
		}
		for (let i = 0; i < this.equations.length; i++) {
			let dataToShow = {
				isExist: false,
				x: 0,
				y: 0
			};
			for (let gx = 0; gx < this.width; gx++) {
				let x = this.GlobalToLocal(gx, 0).x;
				let y = this.equations[i].value(x);
				let gy = y * this.height / this.scaleY + this.offsetY;
				// d.rect(this.startPosition.x + gx, this.startPosition.y - gy, 1.2, 1.2, "red");
				let gy2 = (this.equations[i].value(this.GlobalToLocal(gx - 1, 0).x)) * this.height / this.scaleY + this.offsetY;
				d.line(this.startPosition.x + gx, this.startPosition.y - gy, this.startPosition.x + gx - 1, this.startPosition.y - gy2, "red", 1);

				// let g = ((x) => { return Math.sqrt(Math.pow(x-input.mouse.x,2)+Math.pow(y-input.mouse.y,2));});

				let onGraphMousePos = this.GlobalToLocal(input.mouse.x - this.startPosition.x, input.mouse.y - this.startPosition.y);
				if (Math.abs(onGraphMousePos.y - this.equations[i].value(onGraphMousePos.x)) < 0.1) {
					// d.txt(this.data[i][j].label,input.mouse.x,input.mouse.y,"","white");
					dataToShow.x = (onGraphMousePos.x).toFixed(2)
					dataToShow.y = this.equations[i].value(onGraphMousePos.x).toFixed(3);
					dataToShow.isExist = true;
				}
			}
			if (dataToShow.isExist) {
				d.txt("X: " + dataToShow.x, input.mouse.x + 16, input.mouse.y + 16, "", "white");
				d.txt("Y: " + dataToShow.y, input.mouse.x + 16, input.mouse.y + 32, "", "white");
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
	GlobalToLocal(x, y) {
		return { x: (x - this.offsetX) / (this.width / this.scaleX), y: -(y + this.offsetY) / (this.height / this.scaleY) };
	}
	GetYByLocalX(x, eqi = 0) {
		return this.equations[eqi].value(x);
	}
	IsHoverOnDataLine(x1, y1, x2, y2) {
		let delta1 = { x: x2 - x1, y: y2 - y1 };
		let normal = math.normalize({ x: -delta1.y, y: delta1.x });
		let delta2 = { x: input.mouse.x - x1, y: input.mouse.y - y1 };
		let dot1 = math.dot(normal, delta2);
		let dot2 = math.dot(math.normalize(delta1), delta2);
		// d.ray(x1,y1,math.normalize(delta1),dot2,"red");
		// d.ray(x1,y1,normal,dot1);
		return { byNormal: dot1, byLine: dot2 };
	}
	SortDataByXAxis() {

	}
	GetNewScale(x) {
		return 1;
	}
	OnScroll(e) {
		if (input.mouse.x < this.startPosition.x || input.mouse.x > this.startPosition.x + this.width) return;
		if (input.mouse.y > this.startPosition.y || input.mouse.y < this.startPosition.y - this.height) return;

		let h1 = this.IsHoverXAxis(input.mouse.position.y);
		let h2 = this.IsHoverYAxis(input.mouse.position.x);
		if (h1) {
			this.scaleX += e.deltaY / 100 * this.GetNewScale(this.scaleX);
		}
		if (h2) {
			this.scaleY += e.deltaY / 100 * this.GetNewScale(this.scaleY);
		}
		if (!h1 && !h2) {
			let startOffsetX = this.offsetX;
			// this.offsetX -= (input.mouse.x-this.startPosition.x);
			// this.scaleX -= (this.offsetX-startOffsetX);
			this.scaleX += e.deltaY / 100 * this.GetNewScale(this.scaleX);
			this.scaleY += e.deltaY / 100 * this.GetNewScale(this.scaleY);


			// this.offsetY += (input.mouse.position.y-this.startPosition.y)*(e.deltaY/100);
		}
		// if (this.scaleX < 0.1)
		// 	this.scaleX = 0.1;
		// if (this.scaleY < 0.1)
		// 	this.scaleY = 0.1;
	}
	OnMouseDrag(e) {
		if (input.mouse.x < this.startPosition.x || input.mouse.x > this.startPosition.x + this.width) return;
		if (input.mouse.y > this.startPosition.y || input.mouse.y < this.startPosition.y - this.height) return;

		if (e.buttons == 4) {
			this.offsetX += e.movementX;
			this.offsetY += -e.movementY;
		}
	}
	IsHoverGraph() {
		if (input.mouse.x < this.startPosition.x || input.mouse.x > this.startPosition.x + this.width) return false;
		if (input.mouse.y > this.startPosition.y || input.mouse.y < this.startPosition.y - this.height) return false;
		return true;
	}
	IsHoverXAxis(mousePosY) {
		if (Math.abs((this.startPosition.y - this.offsetY) - mousePosY) < 4) {
			return true;
		}
		return false;
	}
	IsHoverYAxis(mousePosX) {
		if (Math.abs((this.startPosition.x + this.offsetX) - mousePosX) < 4) {
			return true;
		}
		return false;
	}
}
class NewGraph {
	constructor(DrawPosition, Width, Height, ScaleX, ScaleY) {
		this.position = DrawPosition;
		this.size = [Width, Height];
		this.gridSize = 4;
		this.scale = [ScaleX, ScaleY];

		this.data = []; // [{color:"red", name:"Animals count", data: []}, ...], data: [{x: 0, y: 1}]
		this.equations = []; // [{color:"Red",name:"sin wave", func: (x)=>{}}];
		this.vectorField = undefined; // (x,y) => {return [x,y]; };
		this.colorField = undefined; // (x,y) => {return [r,g,b]; };


		this.centere = [this.position[0] + this.size[0] / 2, this.position[1] + this.size[1] / 2];
		this.viewOffset = [0,0];

		document.addEventListener("mousewheel", e => {
			this.OnScroll(e);
		});
		
		document.addEventListener("mousemove", e => {
			this.OnMouseDrag(e);
		});
	}
	TransformPointToGraph(x,y) {
		return [
			(this.centere[0]+x*(this.size[0]/canv.width/this.scale[0])+this.viewOffset[0]),
			(this.centere[1]+y*(this.size[1]/canv.height/this.scale[1])+this.viewOffset[1])
		];
	}
	GlobalToGraphCoordinates(x,y) {
		return [
			((x-this.position[0])/this.size[0]-0.5)*2*this.scale[0],
			((y-this.position[1])/this.size[1]-0.5)*2*this.scale[1]];
	}
	LocalToGlobal(x,y) {
		return [
			this.centere[0]+x*this.size[0]/2/this.scale[0],
			this.centere[1]-y*this.size[1]/2/this.scale[1]
		];
	}
	DrawBackground() {
		d.rect(this.position[0], this.position[1], this.size[0], this.size[1], "black");
		d.rect(this.position[0], this.position[1], this.size[0], this.size[1], "black", "rgba(255,255,255,0.4)", 1, false);

		for (let x = -1; x <= 1; x += 1/this.gridSize) {
			let xl = this.centere[0]+x*this.size[0]/2+this.viewOffset[0]%(1/this.gridSize*this.size[0]/2);
			d.line(xl, this.position[1], xl, this.position[1]+this.size[1], "rgba(255,255,255,0.15)");
		}
		for (let y = -1; y <= 1; y += 1/this.gridSize) {
			let yl = this.centere[1]+y*this.size[1]/2+this.viewOffset[1]%(1/this.gridSize*this.size[1]/2);
			d.line(this.position[0], yl, this.position[0]+this.size[0], yl, "rgba(255,255,255,0.15)");
		}
	}
	DrawAxisLines() {
		d.ray(this.position[0], this.centere[1]+this.viewOffset[1], { x: 1, y: 0 }, this.size[0], "rgba(255,255,255,0.4)", true, 0.95, 0.015);
		d.ray(this.centere[0]+this.viewOffset[0], this.position[1] + this.size[1], { x: 0, y: -1 }, this.size[1], "rgba(255,255,255,0.4)", true, 0.95, 0.015);

		d.txt(this.scale[0],this.position[0]+this.size[0],this.centere[1]+6,"16px Arial","white");
		d.txt(this.scale[1],this.centere[0]-6,this.position[1]-3,"16px Arial","white");

		for (let x = -1; x <= 1; x += 1/this.gridSize) {
			let xl = this.centere[0]+x*this.size[0]/2+this.viewOffset[0]%(1/this.gridSize*this.size[0]/2);
			d.line(xl, this.centere[1] - 3+this.viewOffset[1], xl, this.centere[1] + 3+this.viewOffset[1], "rgba(255,255,255,0.7)");

			let V = (this.GlobalToGraphCoordinates(xl-this.viewOffset[0],0)[0]).toFixed(2);
			let Vwidth = ctx.measureText(V).width;
			d.txt(V,xl-Vwidth/2,this.centere[1]+14+this.viewOffset[1],"9px Arial","rgba(255,255,255,0.5)");
		}
		for (let y = -1; y <= 1; y += 1/this.gridSize) {
			let yl = this.centere[1]+y*this.size[1]/2+this.viewOffset[1]%(1/this.gridSize*this.size[1]/2);
			d.line(this.centere[0]-3+this.viewOffset[0], yl, this.centere[0]+3+this.viewOffset[0], yl, "rgba(255,255,255,0.7)");

			let V = (this.GlobalToGraphCoordinates(0,yl-this.viewOffset[1])[1]).toFixed(2);
			let Vwidth = ctx.measureText(V).width;
			d.txt(-V,this.centere[0]+5+this.viewOffset[0],yl+3,"9px Arial","rgba(255,255,255,0.5)");
		}
	}
	DrawDataAboutPoint(data,x,y) {
		d.txt("X: "+data.x,x,y,"12px Arial","white");
		d.txt("Y: "+data.y,x,y+12,"12px Arial","white");
	}
	DrawData() {
		let minDst = Infinity;
		let dataOfMin= {};
		let posOfMin = [0,0];
		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].data.length == 0) continue;
			ctx.strokeStyle = this.data[i].color;
			ctx.beginPath();
			for (let j = 1; j < this.data[i].data.length; j++) {
				let p1 = this.LocalToGlobal(this.data[i].data[j-1].x,this.data[i].data[j-1].y);
				let p2 = this.LocalToGlobal(this.data[i].data[j].x,this.data[i].data[j].y);

				p1[0] += this.viewOffset[0];
				p1[1] += this.viewOffset[1];
				p2[0] += this.viewOffset[0];
				p2[1] += this.viewOffset[1];

				if ((Math.abs(p1[0]-this.centere[0]) > this.size[0]/2 && Math.abs(p2[0]-this.centere[0]) > this.size[0]/2) ||
				(Math.abs(p1[1]-this.centere[1]) > this.size[1]/2 && Math.abs(p2[1]-this.centere[1]) > this.size[1]/2)) continue;

				
				let dst = math.distanceToLine([input.mouse.x,input.mouse.y], p1, p2);
				if (dst < 3 && minDst > dst) {
					minDst = dst;
					dataOfMin =	this.data[i].data[j];
					// posOfMin[0]= (p1[0]+p2[0])/2;
					// posOfMin[1]= (p1[1]+p2[1])/2;
					posOfMin[0]= input.mouse.x+12;
					posOfMin[1]= input.mouse.y;
				}

				ctx.moveTo(p1[0],p1[1]);
				ctx.lineTo(p2[0],p2[1]);
			}
			ctx.stroke();
			if (minDst < Infinity) {
				this.DrawDataAboutPoint(dataOfMin, posOfMin[0],posOfMin[1]);
			}
		}
		
	}
	DrawColorField() {
		// if (this.scale[0] > 60 || this.scale[1] > 60) return;
		// let blockSize= [
		// 	this.size[0]/this.scale[0],
		// 	this.size[1]/this.scale[1]
		// ];
		// for (let y = -1; y <= 1; y+= 1/this.scale[1]) {
		// 	for (let x = -1; x <= 1; x+= 1/this.scale[0]) {
		// 		let v = this.colorField(x-1/this.scale[0]*0.5-this.viewOffset[0]/this.size[0]*2,-y+this.viewOffset[1]/this.size[1]*2);
		// 		if (v[0] < 0) v[0] = 0;
		// 		if (v[1] < 0) v[1] = 0;
		// 		if (v[2] < 0) v[2] = 0;
		// 		let drawPos = [
		// 			this.centere[0] + this.size[0]*x/2 + this.viewOffset[0]%(this.size[0]/this.scale[0]/2),
		// 			this.centere[1] + this.size[1]*y/2 + this.viewOffset[1]%(this.size[1]/this.scale[1]/2),
		// 		];
		// 		d.rect(drawPos[0]-blockSize[0]/2,drawPos[1]-blockSize[1]/2,blockSize[0],blockSize[1],inRgb(v[0]*255,v[1]*255,v[2]*255,255),"white");
		// 	}
		// }
		for (let y = -1; y <= 1; y+=1/20) {
			for (let x = -1; x <= 1; x+=1/20) {
				let p = [x*this.scale[0]-this.viewOffset[0]/(this.size[0]/this.scale[0]/2),y*this.scale[1]-this.viewOffset[1]/(this.size[0]/this.scale[0]/2)];
				let v = this.colorField(p[0],p[1]);

				let drawPos = [this.centere[0]+x*(this.size[0]/2),this.centere[1]+y*(this.size[1]/2)];
				d.rect(drawPos[0],drawPos[1],this.size[0]/2/20,this.size[1]/2/20,inRgb(v[0]*255,v[1]*255,v[2]*255));
			}
		}
	}
	DrawVectorField() {
		if (this.scale[0] > 60 || this.scale[1] > 60) return;
		let blockSize= [
			this.size[0]/this.scale[0],
			this.size[1]/this.scale[1]
		];
		for (let y = -1; y <= 1; y+= 1/this.scale[1]) {
			for (let x = -1; x <= 1; x+= 1/this.scale[0]) {
				let v = this.vectorField(x-this.viewOffset[0]/this.size[0]*2,-y+this.viewOffset[1]/this.size[1]*2);
				let drawPos = [
					this.centere[0] + this.size[0]*x/2 + this.viewOffset[0]%(this.size[0]/this.scale[0]/2),
					this.centere[1] + this.size[1]*y/2 + this.viewOffset[1]%(this.size[1]/this.scale[1]/2),
				];
				d.ray(drawPos[0],drawPos[1],{x:v[0],y:v[1]},math.magnitude(v),"red");
			}
		}
	}
	Draw() {
		this.DrawBackground();
		if (typeof(this.colorField) == "undefined" && typeof(this.vectorField) == "undefined") {
			this.DrawAxisLines();
			this.DrawData();
		} else if (typeof(this.colorField) != "undefined" && typeof(this.vectorField) == "undefined") {
			this.DrawColorField();
			this.DrawAxisLines();
		} else if (typeof(this.colorField) == "undefined" && typeof(this.vectorField) != "undefined") {
			this.DrawVectorField();
			this.DrawAxisLines();
		} else {
			console.error("Graph has vector field and color field in same time");
		}
	}
	OnScroll(e) {
		if (input.mouse.x < this.position[0] || input.mouse.x > this.position[0] + this.size[0]) return;
		if (input.mouse.y > this.position[1]+this.size[1] || input.mouse.y < this.position[1]) return;

		if (e.deltaY > 0) {
			this.scale[0] *= 2;
			this.scale[1] *= 2;
		} else if (e.deltaY < 0) {
			this.scale[0] *= 0.5;
			this.scale[1] *= 0.5;
		}
	}
	OnMouseDrag(e) {
		if (input.mouse.x < this.position[0] || input.mouse.x > this.position[0] + this.size[0]) return;
		if (input.mouse.y > this.position[1]+this.size[1] || input.mouse.y < this.position[1]) return;

		if (e.buttons == 4) {
			this.viewOffset[0] += e.movementX*0.5;
			this.viewOffset[1] += e.movementY*0.5;
		}
	}
}
class Graph3d {
	constructor(cam) {
		this.position = [0, 0, 0];

		this.scale = [1, 1, 1];

		this.planeEquations = [];
		/* 
			{
				Name: name: "",
				Function: func: (x,y) => {},
				Color: clr: rgb(255,0,0)
			}
		*/

		this.gridPlane = [];
		/*
			{
				Name: name: "",
				Color: clr: rgb(255,0,0),
				Dots: grid: [[x1,x2,...],[x1,x2,...],...]
			}
		*/

		this.equationDrawQuality = 0.05;
		this.camera = cam;

		document.addEventListener("mousewheel", (e) => {
			let v = -e.deltaY / 100;
			this.scale[0] *= Math.pow(1.2, v);
			this.scale[1] *= Math.pow(1.2, v);
			this.scale[2] *= Math.pow(1.2, v);
		});
	}
	DrawAxes() {
		let xp1 = this.camera.ProjectToCanvas({ x: -1, y: 0, z: 0 });
		let xp2 = this.camera.ProjectToCanvas({ x: 1, y: 0, z: 0 });

		let yp1 = this.camera.ProjectToCanvas({ x: 0, y: -1, z: 0 });
		let yp2 = this.camera.ProjectToCanvas({ x: 0, y: 1, z: 0 });

		let zp1 = this.camera.ProjectToCanvas({ x: 0, y: 0, z: -1 });
		let zp2 = this.camera.ProjectToCanvas({ x: 0, y: 0, z: 1 });

		d.line(xp1.x, xp1.y, xp2.x, xp2.y, "red");
		d.line(yp1.x, yp1.y, yp2.x, yp2.y, "green");
		d.line(zp1.x, zp1.y, zp2.x, zp2.y, "blue");

		d.txt("X " + this.scale[0].toFixed(2), xp2.x, xp2.y, (30 / this.camera.DistToCamera({ x: 1, y: 0, z: 0 })) + "px Arial", "red");
		d.txt("Y " + this.scale[1].toFixed(2), yp2.x, yp2.y, (30 / this.camera.DistToCamera({ x: 0, y: 1, z: 0 })) + "px Arial", "green");
		d.txt("Z " + this.scale[2].toFixed(2), zp2.x, zp2.y, (38 / this.camera.DistToCamera({ x: 0, y: 0, z: 1 })) + "px Arial", "blue");
	}
	DrawPlaneEquation() {
		for (let i = 0; i < this.planeEquations.length; i++) {
			ctx.strokeStyle = this.planeEquations[i].clr;
			ctx.beginPath();
			for (let y = -this.scale[1]; y < this.scale[1]; y += this.equationDrawQuality * this.scale[1]) {
				let vp0 = this.camera.ProjectToCanvas({ x: -1, y: this.planeEquations[i].func(-this.scale[0], y) / this.scale[1], z: y / this.scale[2] });
				ctx.moveTo(vp0.x, vp0.y);
				for (let x = -this.scale[0]; x < this.scale[0]; x += this.equationDrawQuality * this.scale[0]) {
					let z = this.planeEquations[i].func(x, y);

					let vp = this.camera.ProjectToCanvas({ x: x / this.scale[0], y: z / this.scale[1], z: y / this.scale[2] });
					ctx.lineTo(vp.x, vp.y);
				}
			}
			for (let y = -this.scale[1]; y < this.scale[1]; y += this.equationDrawQuality * this.scale[1]) {
				let vp0 = this.camera.ProjectToCanvas({ x: y / this.scale[2], y: this.planeEquations[i].func(y, -this.scale[0]) / this.scale[1], z: -1 });
				ctx.moveTo(vp0.x, vp0.y);
				for (let x = -this.scale[0]; x < this.scale[0]; x += this.equationDrawQuality * this.scale[0]) {
					let z = this.planeEquations[i].func(y, x);

					let vp = this.camera.ProjectToCanvas({ x: y / this.scale[0], y: z / this.scale[1], z: x / this.scale[2] });
					ctx.lineTo(vp.x, vp.y);
				}
			}
			ctx.stroke();
		}

	}
	DrawPlaneGrid() {
		for (let i = 0; i < this.gridPlane.length; i++) {
			ctx.strokeStyle = this.gridPlane[i].clr;
			ctx.beginPath();
			for (let j = 0; j < this.gridPlane[i].grid.length; j++) {
				let vp0 = this.camera.ProjectToCanvas({ x: (j / this.gridPlane[i].grid.length - 0.5) * 2, y: (this.gridPlane[i].grid[j][0]), z: -1 });
				ctx.moveTo(vp0.x, vp0.y);
				for (let k = 0; k < this.gridPlane[i].grid[j].length; k++) {

					let vp = this.camera.ProjectToCanvas({ x: (j / this.gridPlane[i].grid.length - 0.5) * 2, y: this.gridPlane[i].grid[j][k], z: (k / this.gridPlane[i].grid[j].length - 0.5) * 2 });
					ctx.lineTo(vp.x, vp.y);
				}
			}
			for (let j = 0; j < this.gridPlane[i].grid.length; j++) {
				let vp0 = this.camera.ProjectToCanvas({ x: -1, y: (this.gridPlane[i].grid[0][j]), z: (j / this.gridPlane[i].grid.length - 0.5) * 2 });
				ctx.moveTo(vp0.x, vp0.y);
				for (let k = 0; k < this.gridPlane[i].grid[j].length; k++) {

					let vp = this.camera.ProjectToCanvas({ x: (k / this.gridPlane[i].grid[j].length - 0.5) * 2, y: this.gridPlane[i].grid[k][j], z: (j / this.gridPlane[i].grid.length - 0.5) * 2 });
					ctx.lineTo(vp.x, vp.y);
				}
			}
			ctx.stroke();
		}

	}
}

class Camera {
	constructor(StartOffset = { x: 0, y: 0 }, StartZoom = 1) {
		this.offset = StartOffset;
		this.zoom = StartZoom;

		this.isMoveDependsOnZoom = true;
		this.isControlLocked = false;

		document.addEventListener("mousemove", (e) => { this.OnMouseMove(e) });
		document.addEventListener("mousewheel", (e) => { this.OnMouseScroll(e) });

	}
	ViewToCanvas(p) {
		if (typeof p == "object") {
			return {
				x: ((p.x - canv.width / 2 + this.offset.x) * this.zoom + this.offset.x) + canv.width / 2,
				y: ((p.y - canv.height / 2 + this.offset.y) * this.zoom + this.offset.y) + canv.height / 2
			};
		}
		if (typeof p == "number") {
			return p * this.zoom;
		}
	}
	CanvasToView(p) {
		if (typeof p == "object") {
			return {
				x: ((p.x - canv.width / 2 - this.offset.x) / this.zoom - this.offset.x) + canv.width / 2,
				y: ((p.y - canv.height / 2 - this.offset.y) / this.zoom - this.offset.y) + canv.height / 2
			};
		}
		if (typeof p == "number") {
			return p / this.zoom;
		}
	}
	OnMouseMove(e) {
		if (e.buttons == 1 && !this.isControlLocked) {
			this.offset.x += -e.movementX * (this.isMoveDependsOnZoom ? this.zoom : 1);
			this.offset.y += -e.movementY * (this.isMoveDependsOnZoom ? this.zoom : 1);
		}
	}
	OnMouseScroll(e) {
		if (this.isControlLocked) return;
		this.zoom += e.deltaY / 100 * this.zoom * 0.1;
		if (this.zoom < 0.0001) this.zoom = 0.0001;
	}
}
function MatrixMult3x3(v, m) {
	return {
		x: v.x * m[0][0] + v.y * m[1][0] + v.z * m[2][0],
		y: v.x * m[0][1] + v.y * m[1][1] + v.z * m[2][1],
		z: v.x * m[0][2] + v.y * m[1][2] + v.z * m[2][2]
	};
}
class Camera3d {
	constructor(StartPosition = { x: 0, y: 0, z: 0 }, StartFov = 0.8) {
		this.position = StartPosition;
		this.rotation = { x: 0, y: 0, z: 0 };
		this.fov = StartFov;

		this.forward = { x: 0, y: 0, z: 1 };
		this.right = { x: 1, y: 0, z: 0 };
		this.up = { x: 0, y: 1, z: 0 };

		document.addEventListener("mousemove", (e) => {
			this.Control(e);
		});
		// document.addEventListener();
	}
	Control(e) {
		if (input.mouse.click == 3) {
			this.rotation.x += e.movementX * 0.003;
			this.rotation.y += -e.movementY * 0.003;

			this.Rotate(this.rotation.x, this.rotation.y, this.rotation.z);
		}
	}
	KeyboardControl(speed = 1) {
		if (input.keyboard.char == 'w') {
			this.position.x += this.forward.x * speed;
			this.position.y += this.forward.y * speed;
			this.position.z += this.forward.z * speed;
		}
		if (input.keyboard.char == 'a') {
			this.position.x += -this.right.x * speed;
			this.position.y += -this.right.y * speed;
			this.position.z += -this.right.z * speed;
		}
		if (input.keyboard.char == 's') {
			this.position.x += -this.forward.x * speed;
			this.position.y += -this.forward.y * speed;
			this.position.z += -this.forward.z * speed;
		}
		if (input.keyboard.char == 'd') {
			this.position.x += this.right.x * speed;
			this.position.y += this.right.y * speed;
			this.position.z += this.right.z * speed;
		}
		if (input.keyboard.char == 'r') {
			this.position.x += this.up.x * speed;
			this.position.y += this.up.y * speed;
			this.position.z += this.up.z * speed;
		}
		if (input.keyboard.char == 'f') {
			this.position.x += -this.up.x * speed;
			this.position.y += -this.up.y * speed;
			this.position.z += -this.up.z * speed;
		}
	}
	Rotate(x, y, z) {
		this.rotation.x = x;
		this.rotation.y = y;
		this.rotation.z = z;

		// this -> forward = Vector3ff(cosf(rotation.y) * sinf(rotation.x), sinf(rotation.y), cosf(rotation.x) * cosf(rotation.y));
		// this -> right = Vector3ff(sinf(rotation.x + PI / 2.0f), 0.0f, cosf(rotation.x + PI / 2.0f));
		// this -> up = Vector3ff(cosf(rotation.y + PI / 2.0f) * sinf(rotation.x), sinf(rotation.y + PI / 2.0f), cosf(rotation.x) * cosf(rotation.y + PI / 2.0f));

		this.forward = {
			x: Math.cos(this.rotation.y) * Math.sin(this.rotation.x),
			y: Math.sin(this.rotation.y),
			z: Math.cos(this.rotation.x) * Math.cos(this.rotation.y)
		};
		this.right = {
			x: Math.sin(this.rotation.x + Math.PI / 2),
			y: 0,
			z: Math.cos(this.rotation.x + Math.PI / 2)
		};
		this.up = {
			x: Math.cos(this.rotation.y + Math.PI / 2) * Math.sin(this.rotation.x),
			y: Math.sin(this.rotation.y + Math.PI / 2),
			z: Math.cos(this.rotation.x) * Math.cos(this.rotation.y + Math.PI / 2)
		};
		return this.forward;

		let forward = {
			x: 0,
			y: 0,
			z: 1
		};
		this.forward = MatrixMult3x3(forward, [
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		]);
		this.forward = MatrixMult3x3(this.forward, [
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		]);
		this.forward = MatrixMult3x3(this.forward, [
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		]);

		let right = {
			x: 1,
			y: 0,
			z: 0
		};
		this.right = MatrixMult3x3(right, [
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		]);
		this.right = MatrixMult3x3(this.right, [
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		]);
		this.right = MatrixMult3x3(this.right, [
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		]);

		let up = {
			x: 0,
			y: 1,
			z: 0
		};
		this.up = MatrixMult3x3(up, [
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		]);
		this.up = MatrixMult3x3(this.up, [
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		]);
		this.up = MatrixMult3x3(this.up, [
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		]);

		return this.forward;
	}
	ProjectToCanvas(p) {
		let size = Math.min(canv.width, canv.height);

		let delta = {
			x: p.x - this.position.x,
			y: p.y - this.position.y,
			z: p.z - this.position.z
		};
		let nDelta = math.normalize(delta);
		if (math.dot(nDelta, this.forward) < 0) return { x: -1, y: -1 };
		let v = {
			x: (nDelta.x / math.dot(nDelta, this.forward) - this.forward.x) * size * this.fov,
			y: (nDelta.y / math.dot(nDelta, this.forward) - this.forward.y) * size * this.fov,
			z: (nDelta.z / math.dot(nDelta, this.forward) - this.forward.z) * size * this.fov
		};

		return {
			x: math.dot(v, this.right) + canv.width / 2,
			y: -math.dot(v, this.up) + canv.height / 2
		};
	}
	isOnScreen(p) {
		if (p.x < 0 || p.y < 0) return false;
		if (p.x > canv.width || p.y > canv.height) return false;
		return true;
	}
	OrtogonalProjectToCanvas(p) {
		let delta = {
			x: p.x - this.position.x,
			y: p.y - this.position.y,
			z: p.z - this.position.z
		};
		return {
			x: math.dot(delta, this.right) * this.fov + canv.width / 2,
			y: -math.dot(delta, this.up) * this.fov + canv.height / 2
		};
	}
	ViewportPosToRay(p) {
		let size = Math.min(canv.width, canv.height);
		let deltas = {
			x: (p.x - canv.width / 2) / size,
			y: -(p.y - canv.height / 2) / size
		};
		let direction = {
			x: this.forward.x + this.right.x * deltas.x + this.up.x * deltas.y,
			y: this.forward.y + this.right.y * deltas.x + this.up.y * deltas.y,
			z: this.forward.z + this.right.z * deltas.x + this.up.z * deltas.y
		};
		return direction;
	}
	DistToCamera(p) {
		return math.magnitude({
			x: p.x - this.position.x,
			y: p.y - this.position.y,
			z: p.z - this.position.z
		});
	}
	AxisLines() {
		let vp1 = this.ProjectToCanvas({ x: -1, y: 0, z: 0 });
		let vp2 = this.ProjectToCanvas({ x: 1, y: 0, z: 0 });
		let vp3 = this.ProjectToCanvas({ x: 0, y: -1, z: 0 });
		let vp4 = this.ProjectToCanvas({ x: 0, y: 1, z: 0 });
		let vp5 = this.ProjectToCanvas({ x: 0, y: 0, z: -1 });
		let vp6 = this.ProjectToCanvas({ x: 0, y: 0, z: 1 });

		d.line(vp1.x, vp1.y, vp2.x, vp2.y, "red");
		d.line(vp3.x, vp3.y, vp4.x, vp4.y, "green");
		d.line(vp5.x, vp5.y, vp6.x, vp6.y, "blue");
	}
}
class Camera4d {
	constructor(StartPosition = { x: 0, y: 0, z: 0, w: 0 }, StartFov = 1) {
		this.position = StartPosition;
		this.rotation = { x: 0, y: 0, z: 0, w: 0 };
		this.fov = StartFov;

		this.forward = { x: 0, y: 0, z: 1, w: 0 };
		this.right = { x: 1, y: 0, z: 0, w: 0 };
		this.up = { x: 0, y: 1, z: 0, w: 0 };
	}
	Rotate(x, y, z, w) {
		this.rotation.x = x;
		this.rotation.y = y;
		this.rotation.z = z;
		let forward = {
			x: 0,
			y: 0,
			z: 1
		};
		this.forward = MatrixMult3x3(forward, [
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		]);
		this.forward = MatrixMult3x3(this.forward, [
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		]);
		this.forward = MatrixMult3x3(this.forward, [
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		]);

		let right = {
			x: 1,
			y: 0,
			z: 0
		};
		this.right = MatrixMult3x3(right, [
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		]);
		this.right = MatrixMult3x3(this.right, [
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		]);
		this.right = MatrixMult3x3(this.right, [
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		]);

		let up = {
			x: 0,
			y: 1,
			z: 0
		};
		this.up = MatrixMult3x3(up, [
			[1, 0, 0],
			[0, Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)],
		]);
		this.up = MatrixMult3x3(this.up, [
			[Math.cos(y), 0, Math.sin(y)],
			[0, 1, 0],
			[-Math.sin(y), 0, Math.cos(y)],
		]);
		this.up = MatrixMult3x3(this.up, [
			[Math.cos(z), -Math.sin(z), 0],
			[Math.sin(z), Math.cos(z), 0],
			[0, 0, 1],
		]);

		return this.forward;
	}
	ProjectToCanvas(p) {
		let size = Math.min(canv.width, canv.height);

		let delta = {
			x: p.x - this.position.x,
			y: p.y - this.position.y,
			z: p.z - this.position.z,
			w: p.w - this.position.w
		};
		let deltaLen = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z + delta.w * delta.w);
		let nDelta = {
			x: delta.x / deltaLen,
			y: delta.y / deltaLen,
			z: delta.z / deltaLen,
			w: delta.w / deltaLen
		};
		let t = (this.forward.x ** 2 + this.forward.y ** 2 + this.forward.z ** 2 + this.forward.w ** 2) / (nDelta.x * this.forward.x + nDelta.y * this.forward.y + nDelta.z * this.forward.z + nDelta.w * this.forward.w);
		let v = {
			x: (nDelta.x * t - this.forward.x) * size * this.fov,
			y: (nDelta.y * t - this.forward.y) * size * this.fov,
			z: (nDelta.z * t - this.forward.z) * size * this.fov,
			w: (nDelta.w * t - this.forward.w) * size * this.fov
		};
		return {
			x: (v.x * this.right.x + v.y * this.right.y + v.z * this.right.z + v.w * this.right.w) + canv.width / 2,
			y: -(v.x * this.up.x + v.y * this.up.y + v.z * this.up.z + v.w * this.up.w) + canv.height / 2
		};
		return {
			x: math.dot(v, this.right) + canv.width / 2,
			y: -math.dot(v, this.up) + canv.height / 2
		};
	}
	ViewportPosToRay(p) {
		let size = Math.min(canv.width, canv.height);
		let deltas = {
			x: (p.x - canv.width / 2) / size,
			y: -(p.y - canv.height / 2) / size
		};
		let direction = {
			x: this.forward.x + this.right.x * deltas.x + this.up.x * deltas.y,
			y: this.forward.y + this.right.y * deltas.x + this.up.y * deltas.y,
			z: this.forward.z + this.right.z * deltas.x + this.up.z * deltas.y
		};
		return direction;
	}
	DistToCamera(p) {
		return math.magnitude({
			x: p.x - this.position.x,
			y: p.y - this.position.y,
			z: p.z - this.position.z
		});
	}
}

function Vec(x, y, z = undefined) {
	if (typeof (z) == "undefined") return { x: x, y: y, z: z };
	return { x: x, y: y };
}

class Matrix3 {
	constructor(sX, sY, sZ) {
		this.M = [];
		for (let z = 0; z < sZ; z++) {
			this.M[z] = [];
			for (let y = 0; y < sY; y++) {
				this.M[z][y] = [];
				for (let x = 0; x < sX; x++) {
					this.M[z][y][x] = 0;
				}
			}
		}
	}
	createBy(M2) {
		this.M = [];
		for (let z = 0; z < M2.length; z++) {
			this.M[z] = [];
			for (let y = 0; y < M2[z].length; y++) {
				this.M[z][y] = [];
				for (let x = 0; x < M2[z][y].length; x++) {
					this.M[z][y][x] = M2[z][y][x];
				}
			}
		}
	}
	equal(M2) {
		for (let z = 0; z < this.M.length; z++) {
			for (let y = 0; y < this.M[z].length; y++) {
				for (let x = 0; x < this.M[z][y].length; x++) {
					this.M[z][y][x] = M2[z][y][x];
				}
			}
		}
	}
}

var d3 = new (class d3 {
	constructor() {

	}
	circle(x, y, z, r, clr) {
		let vp = camera.ProjectToCanvas({ x: x, y: y, z: z });
		d.circle(vp.x, vp.y, r, clr, clr);
	}
})();