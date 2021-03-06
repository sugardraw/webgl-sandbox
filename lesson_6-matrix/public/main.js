const canvas = document.querySelector('canvas');


canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
// canvas.style.width = 500 + "px";
// canvas.style.height = 500 + "px";

const gl = canvas.getContext('webgl');

// gl.enable(gl.SAMPLE_COVERAGE);
// gl.sampleCoverage(0.8, false);


if (!gl) {
    throw new Error('web gl not supported');
}





// -vertexData =[...];
// -create Buffer
//bind buffer
// -load vertexData into that Buffer
// -create vertex shader    
// -create fragment shader
// -create programm
// -attach shaders to program
// link program
// -enable vertex attributes
// -draw

const vertexData = [
    0, 1, 0,
    1, -1, 0,
    -1, -1, 0,
    -1, 1, 0
];

const colorData = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    1, 1, 1,
]

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

const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix')
}

const matrix = glMatrix.mat4.create();
//translate scale and rotate will occours reverse
glMatrix.mat4.translate(matrix, matrix, [0.3, -0.6, 0.1]);
glMatrix.mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);
function animate(){
    glMatrix.mat4.rotateZ(matrix, matrix, (Math.PI/2)/70);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    // draw arrays
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(animate)
}
animate();





