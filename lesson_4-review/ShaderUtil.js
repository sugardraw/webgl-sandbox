


class ShaderUtil {

    static domShaderSrc(elemID) {
        var elm = document.getElementById(elemID)
        if (!elm || elm.text == "") {
            console.log(elemID + " shader not found or not text.");
            return null;
        }
        return elm.text;
    }

    static createShader(gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        // get Error data if shader failes compiling

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader: " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    static createProgram(gl, vShader, fShader, doValidate) {
        var prog = gl.createProgram();
        gl.attachShader(prog, vShader)
        gl.attachShader(prog, fShader)
        gl.linkProgram(prog);

        // check if successfull
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error(
                "Error creating shader program. ", gl.getProgramInfoLog(prog)
            );
            gl.deleteProgram(prog);
            return null;
        }

        // for additional debugging

        if (doValidate) {
            gl.validateProgram(prog);

            if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.log("error validating program ", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }

        //can delete the shader since the program has been made

        gl.detachShader(prog, vShader);
        gl.detachShader(prog, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return prog;
    }


    static domShaderProgram(gl, vectID, fragID, doValidate) {

        var vShaderTxt = ShaderUtil.domShaderSrc(vectID); if (!vShaderTxt) { return null };
        var fShaderTxt = ShaderUtil.domShaderSrc(fragID); if (!fShaderTxt) { return null };
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER); if (!vShader) { return null };
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER); if (!fShader) { return null };
        return ShaderUtil.createProgram(gl, vShader, fShader, true);
    }
}