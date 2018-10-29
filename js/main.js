"use strict";

function main() {
    // Get A WebGL context
    var canvas = document.getElementById("mainWindow");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var gl = canvas.getContext("webgl");
    gl = WebGLDebugUtils.makeDebugContext(gl, undefined, validateNoneOfTheArgsAreUndefined);

    if (!gl) {
        Console.error("Failed to get webgl context");
        return;
    }

    let positionFInfo = new MakePositionInfo(
        [-50, 75, -15],
        [0, 0, 0],
        [1, 1, 1],
    );

    let polygonPositionInfo = new MakePositionInfo(
        [150, 75, -15],
        [0, 0, 0],
        [1, 1, 1],
    );

    let cameraInfo = new MakeCameraInfo(
        [0, 150, 300],
        [0, 0, 0],
        60,
    );

    const figures = {};

    figures["letter"] = new MakeObject(
        "3d-vertex-shader", "3d-fragment-shader", gl, primitive.FsFigure, positionFInfo
    );

    // figures["polygon"] = new MakeObject(
    //     "3d-vertex-shader", "3d-fragment-shader", gl, primitive.polygon, polygonPositionInfo
    // );

    window.scene = new MakeScene(gl, figures, cameraInfo);

    // Draw the scene.
    function drawScene(now) {

        scene.draw(now);

        // Call drawScene again next frame
        requestAnimationFrame(drawScene);
    }

    requestAnimationFrame(drawScene);

}

function MakeCameraInfo(cameraPosition, target, degreesFieldOfView) {
    this.cameraPosition = cameraPosition;
    this.target = target;
    this.RadiansfieldOfView = degreesToRadians(degreesFieldOfView);

    let up = [0, 1, 0];
    let cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    let viewMatrix = m4.inverse(cameraMatrix);

    this.getMatrix = () => {
        cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        viewMatrix = m4.inverse(cameraMatrix);

        return viewMatrix;
    }
}

function MakeScene(gl, figures, cameraInfo) {
    this.figures = figures;
    this.cameraInfo = cameraInfo;
    let viewProjectionMatrix = null;

    let before = 0;

    this.draw = function (now) {
        // time in second
        now *= 0.001;

        let deleyTime = now - before;

        before = now;

        // Every frame increase the rotation a little.
        this.figures["letter"].rotate(deleyTime);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var projectionMatrix =
            m4.perspective(this.cameraInfo.RadiansfieldOfView, aspect, 1, 2000);

        viewProjectionMatrix = m4.multiply(projectionMatrix, cameraInfo.getMatrix());

        for (const key in figures) {
            if (figures.hasOwnProperty(key)) {
                figures[key].matrix = viewProjectionMatrix;
                figures[key].draw();
            }
        }
    }
}

function MakePositionInfo(translation, degreesRotation, scale) {
    this.translation = translation;
    this.scale = scale;
    this.rotation = [];

    degreesRotation.forEach((currentDegrees, index) => {
        this.rotation[index] = degreesToRadians(currentDegrees);
    });

    this.getMatrix = function () {
        let matrix = m4.identity;
        matrix = m4.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
        matrix = m4.xRotate(matrix, this.rotation[0]);
        matrix = m4.yRotate(matrix, this.rotation[1]);
        matrix = m4.zRotate(matrix, this.rotation[2]);
        matrix = m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);

        return matrix;
    }
}

function MakeObject(vertexShaderId, fragmentShaderId, gl, GeometryFigure, position) {
    this.program = webglUtils.createProgramFromScripts(gl, [vertexShaderId, fragmentShaderId]);
    this.matrix = m4.identity;
    this.worldRotation = 0;

    let color = [Math.random(), Math.random(), Math.random(), 1]; // rgba

    // look up atrribute locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.normalLocation = gl.getAttribLocation(this.program, "a_normal");

    // look up uniform locations
    this.worldViewProjectionLocation =
        gl.getUniformLocation(this.program, "u_worldViewProjection");
    this.worldInverseTransposeLocation =
        gl.getUniformLocation(this.program, "u_worldInverseTranspose");
    this.worldLocation =
        gl.getUniformLocation(this.program, "u_world");

    this.lightWorldPositionLocation =
        gl.getUniformLocation(this.program, "u_lightWorldPosition");

    this.colorLocation = gl.getUniformLocation(this.program, "u_color");

    // Create a buffer and put three 2d clip space points in it
    this.positionBuffer = gl.createBuffer();
    this.position = position;

    setObject = setObject.bind(this);
    setObject();

    this.normalBuffer = gl.createBuffer();
    setNormal = setNormal.bind(this);
    setNormal();

    this.rotationSpeed = -0.5;
    this.count = GeometryFigure.Primitive.length / 3;

    this.rotate = (delay) => {
        this.worldRotation += delay * this.rotationSpeed;
    }

    this.draw = () => {
        // Tell it to use our programForF (pair of shaders)
        gl.useProgram(this.program);

        // Turn on the position attribute
        gl.enableVertexAttribArray(this.positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;                 // 3 components per iteration
        var type = gl.FLOAT;          // the data is 32bit floats
        var normalize = false;        // don't normalize the data
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;         // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.positionLocation, size, type, normalize, stride, offset)

        // Turn on the normal attribute
        gl.enableVertexAttribArray(this.normalLocation);

        // Bind the normal buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floating point values
        var normalize = false; // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.normalLocation, size, type, normalize, stride, offset)

        this.matrix = m4.multiply(this.matrix, position.getMatrix())

        // Draw a F at the origin
        let worldMatrix = m4.yRotation(this.worldRotation);

        // Multiply the matrices.
        let worldViewProjectionMatrix = m4.multiply(this.matrix, worldMatrix);
        let worldInverseMatrix = m4.inverse(worldMatrix);
        let worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);


        // Set the matrixs.
        gl.uniformMatrix4fv(
            this.worldLocation, false, worldMatrix);
        gl.uniformMatrix4fv(this.worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
        gl.uniformMatrix4fv(
            this.worldViewProjectionLocation, false,
            worldViewProjectionMatrix
        );

        // Set the color to use
        gl.uniform4fv(this.colorLocation, color);

        // set the light direction.
        gl.uniform3fv(this.lightWorldPositionLocation, [20, 30, 50]);

        // Draw the geometry.
        let primitiveType = gl.TRIANGLES;
        let arrayOffset = 0;
        gl.drawArrays(primitiveType, arrayOffset, this.count);
    }

    function setNormal() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, GeometryFigure.normals, gl.STATIC_DRAW);

    }

    function setObject() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        let reversalMatrix = m4.xRotation(Math.PI)

        for (var ii = 0; ii < GeometryFigure.Primitive.length; ii += 3) {
            var vector = m4.transformPoint(reversalMatrix, [GeometryFigure.Primitive[ii + 0], GeometryFigure.Primitive[ii + 1], GeometryFigure.Primitive[ii + 2], 1]);
            GeometryFigure.Primitive[ii + 0] = vector[0];
            GeometryFigure.Primitive[ii + 1] = vector[1];
            GeometryFigure.Primitive[ii + 2] = vector[2];
        }

        gl.bufferData(gl.ARRAY_BUFFER, GeometryFigure.Primitive, gl.STATIC_DRAW);
    }
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

function logGLCall(functionName, args) {
    console.log("gl." + functionName + "(" +
        WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}

function validateNoneOfTheArgsAreUndefined(functionName, args) {
    for (var ii = 0; ii < args.length; ++ii) {
        if (args[ii] === undefined) {
            console.error("undefined passed to gl." + functionName + "(" +
                WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
        }
    }
}

function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
}

main();