const canvas = document.querySelector('canvas');



canvas.style.width = window.innerWidth / 2 + "px";
canvas.style.height = window.innerHeight / 2 + "px";

const gl = canvas.getContext('webgl');


if (!gl) {
    throw new Error('web gl not supported');
}

const matrix = mat4.create();



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

void main(){
    vColor = color;
    gl_Position = vec4(position, 1);
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
// draw arrays
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

