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

/**
 * 
 * for coloring vertices
 */


// function randomColor() {
//     return [Math.random(), Math.random(), Math.random()]
// }
// let colorData = [];

// for (let face = 0; face < 6; face++) {
//     let faceColor = randomColor();
//     for (let vertex = 0; vertex < 6; vertex++) {
//         colorData.push(...faceColor);
//     }
// }
// const colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

//construct an array by repeating pattern n times

function repeat(n, pattern) { return [...Array(n)].reduce(sum => sum.concat(pattern), []) }

const uvData = repeat(6, [

    0, 0,
    0, 1,
    1, 0,

    1, 0,
    0, 1,
    1, 1,
])


const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);

//resource loading

function loadTexture(url) {
    const texture = gl.createTexture();
    const image = new Image();
    image.onload = (e) => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    };
    image.src = url;
    return texture;
}


//another test

function initTextures(url) {
    const cubeTexture = gl.createTexture();
    const cubeImage = new Image();
    cubeImage.onload = function () { handleTextureLoaded(cubeImage, cubeTexture); }
    cubeImage.src =url;
}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,     gl.UNSIGNED_BYTE,image);


}

const stone = initTextures('./textures/pattern1.png');
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, stone);

/**
 * shader programs
 */

let uniformLocations;


const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    precision mediump float;
    
    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUV;
    
    uniform mat4 matrix;
    
    void main(){
        vUV = uv;
        gl_Position = matrix * vec4(position, 1);
    }
    `);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    precision mediump float;
    
    varying vec2 vUV;
    uniform sampler2D textureID;
    
    void main(){
        gl_FragColor = texture2D(textureID, vUV);
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

const uvLocation = gl.getAttribLocation(program, `uv`);
gl.enableVertexAttribArray(uvLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);



gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix'),
    textureID: gl.getUniformLocation(program, 'textureID'),
}

gl.uniform1i(uniformLocations.textureID, 0);



const modelMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create(); // matrix to simulate a camera
const projectionMatrix = glMatrix.mat4.create();

glMatrix.mat4.perspective(projectionMatrix,
    75 * Math.PI / 180,//vertical field-of-view (angle in rad)
    gl.canvas.width / gl.canvas.height, //aspect W/H
    1e-4, // near cull distance (0.00001)
    1e4 // far cull distance

)

const mvMatrix = glMatrix.mat4.create();
const mvpMatrix = glMatrix.mat4.create();



//translate scale and rotate will occours reverse
// glMatrix.mat4.translate(matrix, matrix, [0.0, 0.2, -1.9]);
// glMatrix.mat4.translate(modelMatrix, modelMatrix, [0, 0, -2])
glMatrix.mat4.translate(viewMatrix, viewMatrix, [0, 0, 2]);
glMatrix.mat4.invert(viewMatrix, viewMatrix);
glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, (Math.PI / 180) * 45);
glMatrix.mat4.rotateY(modelMatrix, modelMatrix, (Math.PI / 180) * 0.45);


let scaleFactor = 1;
let angle = 30;
window.addEventListener("resize", resize);


glMatrix.mat4.scale(modelMatrix, modelMatrix, [scaleFactor, scaleFactor, scaleFactor]);



function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        console.log(canvas.width)
        glMatrix.mat4.scale(modelMatrix, modelMatrix, [scaleFactor, scaleFactor, scaleFactor]);
    }
}

function animate(dt) {
    resize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, (Math.PI / 2) / 50);
    // projectionmatrix * modelmatrix
    glMatrix.mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    glMatrix.mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    // draw arrays
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    // requestAnimationFrame(animate)
}



RLoop = new RenderLoop(animate).start();

// animate()









