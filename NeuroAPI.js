class NeuroWeb0 {
    inputs = [];
    hidden = [];
    outputs = [];

    nodes = []; // first nodes dimension is outputs, second - inputs

    expectedValues = [];
    constructor(inputs, hidden, outputs, expectedValues = []) { 
        this.inputs = inputs;
        this.hidden = hidden;
        this.outputs = outputs;
        this.expectedValues = expectedValues;
    
        if (this.hidden.length > 0) {
            for (let hidColumn = 0; hidColumn < this.hidden.length; hidColumn++) {
                this.nodes.push([]);
                for (let hidRow = 0; hidRow < this.hidden[hidColumn].length; hidRow++) {
                    this.nodes[hidColumn].push([]);
                    if (hidColumn == 0) {
                        for (let inpI = 0; inpI < this.inputs.length; inpI++) {
                            this.nodes[hidColumn][hidRow].push(Math.random());
                        }
                    } else {
                        for (let hidI = 0; hidI < this.hidden[hidColumn-1].length; hidI++) {
                            this.nodes[hidColumn][hidRow].push(Math.random());
                        }
                    }
                }
            }
            this.nodes.push([]);
            for (let outI = 0; outI < this.outputs.length; outI++) {
                this.nodes[this.nodes.length-1].push([]);
                for (let hidRow = 0; hidRow < this.hidden[this.hidden.length-1].length; hidRow++) {
                    this.nodes[this.nodes.length-1][outI].push(Math.random());
                }
            }
        } else {
            this.nodes.push([]);
            for (let i = 0; i < this.outputs.length; i++) {
                this.nodes[0].push([]);
                for (let j = 0; j < this.inputs.length; j++) {
                    this.nodes[0][i].push(Math.random());
                }
            }
        }
        
        window.addEventListener("mousewheel", {handleEvent:this.debug_onScrollInCircle, parentClass:this});
    }
    sigma(x) {
        return 1/(1+Math.pow(Math.E,-x));
    }
    tangent(x) {
        return (Math.pow(Math.E,2*x)-1)/(Math.pow(Math.E,2*x)+1);
    }
    getOutputs() {
        this.calculateOutputs();
        return this.outputs;
    }
    calculateOutputs() {
        /*for (let outs = 0; outs < this.outputs.length; outs++) {
            this.outputs[outs] = 0;
            for (let nod = 0; nod < this.nodes[outs].length; nod++) {
                this.outputs[outs] += this.nodes[outs][nod]*this.inputs[nod];
            }
            // this.outputs[outs] = this.sigma(this.outputs[outs]);
        }*/
        for (let hidCol = 0; hidCol < this.hidden.length; hidCol++) {
            for (let hidRow = 0; hidRow < this.hidden[hidCol].length; hidRow++) {
                this.hidden[hidCol][hidRow] = 0;
                for (let nod = 0; nod < this.nodes[hidCol][hidRow].length; nod++) {
                    if (hidCol == 0) {
                        this.hidden[hidCol][hidRow] += this.nodes[hidCol][hidRow][nod]*this.inputs[nod];
                    } else {
                        this.hidden[hidCol][hidRow] += this.nodes[hidCol][hidRow][nod]*this.hidden[hidCol-1][hidRow];
                    }
                }
            }
        }
        for (let outs = 0; outs < this.outputs.length; outs++) {
            this.outputs[outs] = 0;
            if (this.hidden.length > 0) {
                for (let hidI = 0; hidI < this.hidden[this.hidden.length-1].length; hidI++) {
                    this.outputs[outs] += this.nodes[this.nodes.length-1][outs][hidI]*this.hidden[this.hidden.length-1][hidI];
                }
            } else {
                for (let inpI = 0; inpI < this.inputs.length; inpI++) {
                    this.outputs[outs] += this.nodes[0][outs][inpI]*this.inputs[inpI];
                }
            }
        }
        for (let outs = 0; outs < this.outputs.length; outs++) {
            this.outputs[outs] = this.sigma(this.outputs[outs]);
        }
    }
    trainWeb(itersCount, deltaError = 0.1) {
        for (let i = 0; i < itersCount; i++) {
            this.calculateOutputs();
            for (let outs = 0; outs < this.outputs.length; outs++) {
                let error = this.expectedValues[outs]-this.outputs[outs];

                for (let nod = 0; nod < this.nodes[this.nodes.length-1].length; nod++) {
                    // this.nodes[this.nodes.length-1][outs][nod] = this.expectedValues[outs]/;
                }
                for (let colN = this.nodes.length-1-1; colN >= 0; colN--) {
                    for (let rowN = 0; rowN < this.nodes[colN].length; rowN++) {
                        for (let nod = 0; nod < this.nodes[colN][rowN].length; nod++) {
                            this.nodes[colN][rowN][nod] -= deltaError * (error/this.nodes[colN][rowN][nod]);
                        }
                    }
                }
            }
        }
        // this.calculateOutputs();
    }
    trainWeb2(itersCount, deltaError = 0.1) {
        for (let i = 0; i < itersCount; i++) {
            this.calculateOutputs();
            if (this.hidden.length > 0) {

            } else {
                for (let w = 0; w < this.nodes[0].length; w++) {

                }
            }
        }
    }
    debug_radius = 40;
    debug_drawPos = {x:0,y:0};
    debug_circlesXOffset = 150;
    debug_circlesYOffset = 10;

    debug_drawNodes = true;
    debug_setDrawPos(x,y) {
        this.debug_drawPos.x = x;
        this.debug_drawPos.y = y;
    }
    debug_getInputPos(i) {
        return [this.debug_drawPos.x,this.debug_drawPos.y+i*(this.debug_radius*2+this.debug_circlesYOffset)];
    }
    debug_getHiddenPos(i,j) {
        return [
            this.debug_drawPos.x+(this.debug_radius*2+(this.debug_circlesXOffset/((this.hidden.length < 1) ? 1 : this.hidden.length)))*(i+1),
            this.debug_drawPos.y+j*(this.debug_radius*2+this.debug_circlesYOffset)];
    }
    debug_getOuputPos(i) {
        return [
            this.debug_drawPos.x+(this.debug_radius*2+(this.debug_circlesXOffset/((this.hidden.length < 1) ? 1 : this.hidden.length)))*(this.hidden.length+1),
            this.debug_drawPos.y+i*(this.debug_radius*2+this.debug_circlesYOffset)];
    }
    debug_draw() {
        for (let i = 0; i < this.inputs.length; i++) {
            let p = this.debug_getInputPos(i);
            d.circle(p[0],p[1],this.debug_radius,"white","White",1,false);
            d.txt(this.inputs[i].toFixed(3),p[0]-10,p[1],"14px Arial","white");
        }
        for (let i = 0; i < this.hidden.length; i++) {
            for (let j = 0; j < this.hidden[i].length; j++) {
                let p = this.debug_getHiddenPos(i,j);
                d.circle(p[0],p[1],this.debug_radius,"white","White",1,false);
                d.txt(this.hidden[i][j].toFixed(3),p[0]-10,p[1],"14px Arial","white");
            }
        }
        for (let i = 0; i < this.outputs.length; i++) {
            let p = this.debug_getOuputPos(i);
            d.circle(p[0],p[1],this.debug_radius,"white","White",1,false);
            d.txt(this.outputs[i].toFixed(3),p[0]+10,p[1],"14px Arial","white");
        }

        if (this.debug_drawNodes) {
            let t = 0.2;
            for (let column = 0; column < this.nodes.length; column++) {
                for (let row = 0; row < this.nodes[column].length; row++) {
                    for (let nod = 0; nod < this.nodes[column][row].length; nod++) {
                        if (column == 0) {
                            let iP = this.debug_getInputPos(nod);
                            let hP = this.debug_getHiddenPos(column,row);
                            d.line(iP[0],iP[1], hP[0],hP[1],"white");
                            d.txt(this.nodes[column][row][nod].toFixed(2),iP[0]+(hP[0]-iP[0])*t, iP[1]+(hP[1]-iP[1])*t, "14px Arial", "rgb(255,255,255)");
                        } else {
                            let h0P = this.debug_getHiddenPos(column-1,nod);
                            let hP = this.debug_getHiddenPos(column,row);
                            d.line(h0P[0],h0P[1], hP[0],hP[1],"white");
                            d.txt(this.nodes[column][row][nod].toFixed(2),h0P[0]+(hP[0]-h0P[0])*t, h0P[1]+(hP[1]-h0P[1])*t, "14px Arial", "rgb(255,255,255)");
                        }
                    }
                }
            }
        }
    }
    debug_isMouseInInputCircle(x,y) {
        for (let i = 0; i < this.inputs.length; i++) {
            let p = this.debug_getInputPos(i);
            let deltaP = [p[0]-x, p[1]-y];
            if (deltaP[0]*deltaP[0]+deltaP[1]*deltaP[1] < this.debug_radius*this.debug_radius) {
                return [true,i];
            }
        }
        return [false,0];
    }
    debug_onScrollInCircle(e) {
        let mouseCheck = this.parentClass.debug_isMouseInInputCircle(e.offsetX,e.offsetY);
        if (mouseCheck[0]) {
            let inps = this.parentClass.inputs;
            inps[mouseCheck[1]] += 0.001*-e.deltaY;
            if (inps[mouseCheck[1]] < -1) inps[mouseCheck[1]] = -1;
            if (inps[mouseCheck[1]] > 1) inps[mouseCheck[1]] = 1;
            inps[mouseCheck[1]] = Number(inps[mouseCheck[1]].toFixed(6));
            this.parentClass.calculateOutputs();
        }
    }
}


class DebugText {
    constructor(Value,Position) {

    }
}
class Input {
    constructor(targetNode, Weight = undefined) {
        this.node = targetNode;
        if (Weight != undefined)
            this.weight = Weight;
        else
            this.weight = -1+Math.random()*2;
    }
}
class Node {
    constructor(Value, Inputs = []) {
        this.value = Value;
        this.inputs = Inputs;

        this.posInArray = [];

        this.error = 0;
    }
    getNodeValue() {
        this.value = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            this.value += this.inputs[i].node.value*this.inputs[i].weight;
        }
        return this.value;
    }
}
class NeuroWeb {
    constructor(Nodes = [], ExpectedOutputs = []) { // 1. Nodes = Array of Node class 2. Nodes is 2 dimensional array
        this.nodes = Nodes;
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes[i].length; j++) {
                this.nodes[i][j].posInArray = [i,j];
            }
        }
        this.expectedOutputs = ExpectedOutputs;
        this.outputLayerIndex = this.nodes.length-1;

        this.connections = [];

        this.recaulculateNodes();
    }
    getConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.connections[i] = [];
            for (let j = 0; j < this.nodes[i].length; j++) {
                this.connections[i].push(this.nodes[i][j].inputs);
            }
        }
        return this.connections;
    }
    recaulculateNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes[i].length; j++) {
                
                if (this.nodes[i][j].inputs.length > 0)
                    this.nodes[i][j].value = 0;
                for (let k = 0; k < this.nodes[i][j].inputs.length; k++) {
                    const inp = this.nodes[i][j].inputs[k];
                    this.nodes[i][j].value += inp.node.value*inp.weight;
                }
            }
        }
    }
    getOutputs() {
        let outputs = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes[i].length; j++) {
                
                if (this.nodes[i][j].inputs.length > 0)
                    this.nodes[i][j].value = 0;
                for (let k = 0; k < this.nodes[i][j].inputs.length; k++) {
                    const inp = this.nodes[i][j].inputs[k];
                    this.nodes[i][j].value += inp.node.value*inp.weight;
                }
            }
        }
        return this.nodes[this.outputLayerIndex];
    }
    setInput(i,v) {
        this.nodes[0][i].value = v;
        this.recaulculateNodes();
    }
    trainWeb(iterationsCount, deltaError = 0.1) {
        // for (let i = this.outputLayerIndex; i >= 0; i--) {
        //     this.recaulculateNodes();
        //     for (let j = 0; j < this.nodes[i].length; j++) {
        //         const nod = this.nodes[i][j];
        //         // let error = 
        //     }
        // }

        this.getConnections();
        for (let iter = 0; iter < iterationsCount; iter++) {
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = 0; j < this.nodes[i].length; j++) {
                    const nod = this.nodes[i][j];
                    if (nod.inputs.length > 0)
                        nod.value = 0;
                    for (let k = 0; k < nod.inputs.length; k++) {
                        nod.value += nod.inputs[k].node.value*nod.inputs[k].weight;
                    }
                }
            }
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                for (let j = 0; j < this.nodes[i].length; j++) { 
                    let e = 0;
                    if (i == this.nodes.length - 1) e = this.expectedOutputs[j] - this.nodes[i][j].value;
                    else {
                        e = 0;
                        for (let k = 0; k < this.nodes[i + 1].length; k++)
                            e += this.nodes[i][j].value * this.nodes[i + 1][k].error;
                    }
                    this.nodes[i][j].error = e;
                    for (let k = 0; k < this.nodes[i][j].inputs.length; k++) { 
                        this.nodes[i][j].inputs[k].weight += e * deltaError;
                        // this.nodes[i][j].inputs[k].weight = sigma(this.nodes[i][j].inputs[k].weight);
                    }

                }
            }
        }
    }
    getOutputErrors() {
        let errors = [];
        for (let i = 0; i < this.nodes[this.nodes.length - 1].length; i++) {
            errors.push(this.expectedOutputs[i]-this.nodes[this.nodes.length-1][i]);
        }
        return errors;
    }
    trainWeb2(iterationsCount, deltaError = 0.1) {
        this.getConnections();
        for (let iteration = 0; iteration < iterationsCount; iteration++) { 
            for (let i = this.nodes.length - 1; i >= 0; i--) { 
                for (let j = 0; j < this.nodes[i].length; j++) {
                    for (let k = 0; k < this.nodes[i][j].inputs.length; k++) {
                        this.getOutputs();
                        let errors1 = this.getOutputErrors();
                        
                        this.nodes[i][j].inputs[k].weight += 1;
                        this.getOutputs();
                        let errors2 = this.getOutputErrors();

                        this.nodes[i][j].inputs[k].weight += -2;
                        this.getOutputs();
                        let errors3 = this.getOutputErrors();
                    
                        let gradeForUp = 0;
                        let gradeForDown = 0;

                        for (let e1 = 0; e1 < errors1.length; e1++) { 
                            gradeForUp += (errors2[e1] - errors1[e1]);
                            gradeForDown += (errors3[e1] - errors1[e1]);
                        }

                        if (gradeForUp < 0 && gradeForDown < 0) continue;
                        if (gradeForUp > 0 && gradeForDown > 0) {
                            this.nodes[i][j].inputs[k].weight += deltaError;
                            continue;
                        }
                        if (gradeForUp > 0) {
                            this.nodes[i][j].inputs[k].weight += deltaError;
                            continue;
                        }
                        if (gradeForDown > 0) {
                            this.nodes[i][j].inputs[k].weight += -deltaError;
                            continue;
                        }
                    }
                }
            }
        }
    }
    GetPositionByIndexes(i,j,r = 5) {
        return [i * (r+20)*2, j * (r+20)*2];
    }
    DebugDraw(StartPosition = {x:0,y:0}) {
        let r = 20;
        for (let i = 0; i < this.nodes.length; i++) {
            let pastImpact = [];
            // let offset = {x:0,y:0};
            let yOffset = this.nodes[i].length*r/2;
            yOffset = 0;
            for (let j = 0; j < this.nodes[i].length; j++) {
                const nod = this.nodes[i][j];
                let cp2 = this.GetPositionByIndexes(i,j, r);
                for (let k = 0; k < this.nodes[i][j].inputs.length; k++) {
                    const inp = this.nodes[i][j].inputs[k];
                    let cp1 = this.GetPositionByIndexes(inp.node.posInArray[0],inp.node.posInArray[1], r);

                    let isHovered = false;
                    let dstData = math.dstToLine(StartPosition.x+cp2[0],StartPosition.y+cp2[1],StartPosition.x+cp1[0],StartPosition.y+cp1[1], input.mouse.x,input.mouse.y);
                    if (Math.abs(dstData.byNormal) < 5 && dstData.byLineNormalized < 1 && dstData.byLineNormalized > 0) {
                        d.txt(inp.weight.toFixed(2),input.mouse.x,input.mouse.y,"","white");
                        isHovered = true;
                    }
                    d.line(StartPosition.x+cp2[0],StartPosition.y+cp2[1]-yOffset,StartPosition.x+cp1[0],StartPosition.y+cp1[1],"rgba(255,255,255,"+(isHovered ? 1 : 0.4)+")");
                }

                d.circle(StartPosition.x+cp2[0],StartPosition.y+cp2[1]-yOffset,r,"white","white",1,false);
                d.txt(nod.value.toFixed(2),StartPosition.x+cp2[0],StartPosition.y+cp2[1]-yOffset,"12px Arial","white");
            }
        }
    }
    GetDebugSize(i = 0) { 
        let poses = this.GetPositionByIndexes(this.nodes.length - 1, this.nodes[i].length - 1, 20);
        return {
            x: poses[0] + 20,
            y: poses[1] + 20
        };
    }
}

function sigma(x) {
    return 1/(1+Math.pow(Math.E,-x));
}
function tangent(x) {
    return (Math.pow(Math.E,2*x)-1)/(Math.pow(Math.E,2*x)+1);
}
