const canvas = document.querySelector('canvas');


// canvas.style.width = window.innerWidth + "px";
// canvas.style.height = window.innerHeight + "px";
// canvas.style.width = 500 + "px";
// canvas.style.height = 500 + "px";

const gl = canvas.getContext('webgl');

// gl.enable(gl.SAMPLE_COVERAGE);
// gl.sampleCoverage(0.8, false);


if (!gl) {
    throw new Error('web gl not supported');
}


const vertexData = [
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,

    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,


    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,


];

function randomColor() {
    return [Math.random(), Math.random(), Math.random()]
}

// let colorData = [
//     ...randomColor(),
//     ...randomColor(),
//     ...randomColor(),
// ]

let colorData = [];

for (let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
        colorData.push(...faceColor);
    }
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);


const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main(){
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix')
}

const modelMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create(); // matrix to simulate a camera
const projectionMatrix = glMatrix.mat4.create();

glMatrix.mat4.perspective(projectionMatrix,
    75 * Math.PI / 180,//vertical field-of-view (angle in rad)
    canvas.width / canvas.height, //aspect W/H
    1e-4, // near cull distance (0.00001)
    1e4 // far cull distance

)

const mvMatrix = glMatrix.mat4.create();
const mvpMatrix = glMatrix.mat4.create();



//translate scale and rotate will occours reverse
// glMatrix.mat4.translate(matrix, matrix, [0.0, 0.2, -1.9]);
glMatrix.mat4.translate(modelMatrix, modelMatrix, [0, 0, -2])
glMatrix.mat4.translate(viewMatrix, viewMatrix, [-1, 0, -1]);
glMatrix.mat4.invert(viewMatrix, viewMatrix);
glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, (Math.PI / 180) * 45);
glMatrix.mat4.rotateY(modelMatrix, modelMatrix, (Math.PI / 180) * 0.45);
let scaleFactor = 1;
let angle = 30;
glMatrix.mat4.scale(modelMatrix, modelMatrix, [scaleFactor, scaleFactor, scaleFactor]);
function animate() {
    requestAnimationFrame(animate)
    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, (Math.PI / 2) / 100);

    // projectionmatrix * modelmatrix

    glMatrix.mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    glMatrix.mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    // draw arrays
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}
animate();





