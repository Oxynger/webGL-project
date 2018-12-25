"use strict";

function main() {
  // Get A WebGL context
  var canvas = document.getElementById("mainWindow");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  gl = WebGLDebugUtils.makeDebugContext(
    gl,
    undefined,
    validateNoneOfTheArgsAreUndefined
  );

  if (!gl) {
    Console.error("Failed to get webgl context");
    return;
  }

  let positionFInfo = new MakePositionInfo([-50, 100, 0], [0, 0, 0], [1, 1, 1]);

  let spotLightInfo = {
    shininess: 3000,
    limit: degreesToRadians(180),
    specularColor: [1, 1, 1],
    lightColor: [1, 1, 1],
    lightPosition: [30, 10, 300],
    lightDirection: [],
    up: [0, 1, 0],
    target: [0, -50, 20]
  };

  const figures = {};
  const lights = {};

  let mainShader = new MakeShader(gl, "3d-vertex-shader", "3d-fragment-shader");

  lights["SpotLight"] = new MakeSpotlight(mainShader, spotLightInfo);

  let cameraInfo = new MakeCameraInfo([0, 100, 300], [0, 0, 0], 60);
  let fog = new MakeFog(mainShader);

  window.cube = {};
  fetch("/figure/cubeFigure.json")
    .then(response => {
      return response.json();
    })
    .then(figure => {
      cube = figure;
      cube.Primitive = new Float32Array(cube.Primitive);
      cube.normals = new Float32Array(cube.normals);
      cube.texcoord = new Float32Array(cube.texcoord);
      reversePrimitive(cube);

      figures["cube"] = new MakeObject(gl, mainShader, cube, positionFInfo);
      window.scene = new MakeScene(gl, figures, lights, fog, cameraInfo);
      requestAnimationFrame(drawScene);
    })
    .catch(console.log);

  // Draw the scene.
  function drawScene(now) {
    scene.draw(now);

    // Call drawScene again next frame
    requestAnimationFrame(drawScene);
  }
}

function MakeShader(gl, vertexShaderId, fragmentShaderId) {
  this.vertexSource = vertexShaderId;
  this.fragmentSource = fragmentShaderId;
  this.programHandle = webglUtils.createProgramFromScripts(gl, [
    vertexShaderId,
    fragmentShaderId
  ]);

  this.Locations = {};

  this.setAttributeLocation = attributeName => {
    this.Locations[attributeName] = gl.getAttribLocation(
      this.programHandle,
      attributeName
    );
  };

  this.setUniformLocation = unifromName => {
    this.Locations[unifromName] = gl.getUniformLocation(
      this.programHandle,
      unifromName
    );
  };

  this.Use = () => {
    gl.useProgram(this.programHandle);
  };

  this.bindInt = (intName, value) => {
    gl.uniform1i(this.Locations[intName], value);
  };

  this.bindMatrix4 = (matrixName, matrix, transpose) => {
    if (transpose == null) transpose = false;

    gl.uniformMatrix4fv(this.Locations[matrixName], transpose, matrix);
  };

  this.bindFloat = (floatName, value) => {
    gl.uniform1f(this.Locations[floatName], value);
  };

  this.bindVerctor4 = (vectorName, vector) => {
    gl.uniform4fv(this.Locations[vectorName], vector);
  };

  this.bindVerctor3 = (vectorName, vector) => {
    gl.uniform3fv(this.Locations[vectorName], vector);
  };

  this.supplyVertices = (attributeName, buffer, vertexPointerInfo) => {
    vertexPointerInfo = setupDefaultPropertyIfNotExist(vertexPointerInfo);

    // Turn on the position attribute
    gl.enableVertexAttribArray(this.Locations[attributeName]);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    vertexPointerInfo.setupAttribute(this.Locations[attributeName]);
  };

  let setupDefaultPropertyIfNotExist = pointerInfo => {
    if (pointerInfo == null) pointerInfo = {};

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    if (!pointerInfo.hasOwnProperty("size")) pointerInfo.size = 3; // 3 components per iteration
    if (!pointerInfo.hasOwnProperty("type")) pointerInfo.type = gl.FLOAT; // the data is 32bit floats
    if (!pointerInfo.hasOwnProperty("normalize")) pointerInfo.normalize = false; // don't normalize the data
    if (!pointerInfo.hasOwnProperty("stride")) pointerInfo.stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    if (!pointerInfo.hasOwnProperty("offset")) pointerInfo.offset = 0; // start at the beginning of the buffer

    pointerInfo.setupAttribute = function(attribute) {
      gl.vertexAttribPointer(
        attribute,
        this.size,
        this.type,
        this.normalize,
        this.stride,
        this.offset
      );
    };

    return pointerInfo;
  };
}

function MakeCameraInfo(cameraPosition, target, degreesFieldOfView) {
  this.Position = cameraPosition;
  this.Target = target;
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
  };
}

function MakeScene(gl, figures, lights, fog, cameraInfo) {
  this.figures = figures;
  this.light = lights;
  this.cameraInfo = cameraInfo;
  let viewProjectionMatrix = null;

  let before = 0;

  this.figures["cube"].shader.setUniformLocation("u_viewWorldPosition");

  this.draw = function(now) {
    // time in second
    now *= 0.001;

    let deleyTime = now - before;

    before = now;

    // Every frame increase the rotation a little.
    this.figures["cube"].rotate(deleyTime);
    //cameraInfo.Position[2] += Math.sin(now);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let blending = document.getElementById("blending").checked;
    if (blending) {
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      figures["cube"].setAlpha(
        parseFloat(document.getElementById("alpha").value)
      );
    } else {
      gl.disable(gl.BLEND);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      figures["cube"].setAlpha(1);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor.apply(this, fog.color);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(
      this.cameraInfo.RadiansfieldOfView,
      aspect,
      1,
      2000
    );

    viewProjectionMatrix = m4.multiply(
      projectionMatrix,
      cameraInfo.getMatrix()
    );

    for (const key in lights) {
      if (lights.hasOwnProperty(key)) {
        lights[key].draw();
      }
    }

    for (const key in figures) {
      if (figures.hasOwnProperty(key)) {
        figures[key].viewPosition = cameraInfo;
        figures[key].matrix = viewProjectionMatrix;
        figures[key].draw();
      }
    }
    fog.draw();
  };
}

function MakePositionInfo(translation, degreesRotation, scale) {
  this.translation = translation;
  this.scale = scale;
  this.rotation = [];

  degreesRotation.forEach((currentDegrees, index) => {
    this.rotation[index] = degreesToRadians(currentDegrees);
  });

  this.getMatrix = function() {
    let matrix = m4.identity;
    matrix = m4.translate(
      matrix,
      this.translation[0],
      this.translation[1],
      this.translation[2]
    );
    matrix = m4.xRotate(matrix, this.rotation[0]);
    matrix = m4.yRotate(matrix, this.rotation[1]);
    matrix = m4.zRotate(matrix, this.rotation[2]);
    matrix = m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);

    return matrix;
  };
}

function MakeSpotlight(shader, spotLightInfo) {
  Object.assign(this, spotLightInfo);

  shader.setUniformLocation("u_shininess");
  shader.setUniformLocation("u_lightColor");
  shader.setUniformLocation("u_specularColor");
  shader.setUniformLocation("u_lightDirection");
  shader.setUniformLocation("u_lightWorldPosition");
  shader.setUniformLocation("u_limit");

  this.draw = () => {
    let lmat = m4.lookAt(this.lightPosition, this.target, this.up);
    this.lightDirection = [-lmat[8], -lmat[9], -lmat[10]];

    this.bindLight();
  };

  this.bindLight = () => {
    shader.Use();
    // Set the specular
    shader.bindFloat("u_shininess", this.shininess);
    shader.bindVerctor3("u_specularColor", this.specularColor);

    // Set the light.
    shader.bindVerctor3("u_lightWorldPosition", this.lightPosition);
    shader.bindVerctor3("u_lightColor", this.lightColor);

    // Set Spotlight
    shader.bindVerctor3("u_lightDirection", this.lightDirection);
    shader.bindFloat("u_limit", Math.cos(this.limit));
  };
}

function MakeFog(shader) {
  this.maxDistance = 1000;
  this.minDistance = 1000;
  this.color = [128, 128, 0, 1];

  shader.setUniformLocation("u_fogColor");
  shader.setUniformLocation("u_fogMaxDist");
  shader.setUniformLocation("u_fogMinDist");

  this.draw = () => {
    shader.Use();
    shader.bindVerctor4("u_fogColor", this.color);
    shader.bindFloat("u_fogMaxDist", this.maxDistance);
    shader.bindFloat("u_fogMinDist", this.minDistance);
  };
}

function MakeObject(gl, shader, GeometryFigure, position) {
  this.shader = shader;
  this.matrix = m4.identity;
  this.worldRotation = 0;
  this.viewPosition = {};
  this.position = position;
  this.alpha = 0.9;

  // look up atrribute locations
  shader.setAttributeLocation("a_position");
  shader.setAttributeLocation("a_normal");
  shader.setAttributeLocation("a_texcoord");

  // look up uniform locations
  shader.setUniformLocation("u_texture");
  shader.setUniformLocation("u_worldViewProjection");
  shader.setUniformLocation("u_worldInverseTranspose");
  shader.setUniformLocation("u_worldView");
  shader.setUniformLocation("u_alpha");

  // Create a buffer and put three 2d clip space points in it
  this.positionBuffer = gl.createBuffer();
  setObject = setObject.bind(this);
  setObject();

  this.normalBuffer = gl.createBuffer();
  setNormal = setNormal.bind(this);
  setNormal();

  this.texcoordBuffer = gl.createBuffer();
  setTexcoords = setTexcoords.bind(this);
  setTexcoords();

  textureLoad();

  this.rotationSpeed = -0.5;
  this.count = GeometryFigure.Primitive.length / 3;

  this.rotate = delay => {
    this.worldRotation += delay * this.rotationSpeed;
  };

  this.setAlpha = newAlpha => {
    this.alpha = newAlpha;
  };

  this.draw = () => {
    // Tell it to use our programForF (pair of shaders)
    shader.Use();

    shader.supplyVertices("a_position", this.positionBuffer);

    shader.supplyVertices("a_normal", this.normalBuffer);

    shader.supplyVertices("a_texcoord", this.texcoordBuffer, { size: 2 });

    this.matrix = m4.multiply(this.matrix, position.getMatrix());

    // Draw a F at the origin
    let worldMatrix = m4.yRotation(this.worldRotation);

    // Multiply the matrices.
    let worldViewProjectionMatrix = m4.multiply(this.matrix, worldMatrix);
    let worldInverseMatrix = m4.inverse(worldMatrix);
    let worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

    // Set the matrixs.
    shader.bindMatrix4("u_worldInverseTranspose", worldInverseTransposeMatrix);
    shader.bindMatrix4("u_worldViewProjection", worldViewProjectionMatrix);

    // Bind texture
    shader.bindInt("u_texture", 0);
    shader.bindFloat("u_alpha", this.alpha);

    // Bind shader figures cube with camera position
    shader.bindVerctor3("u_viewWorldPosition", this.viewPosition.Position);
    shader.bindMatrix4("u_worldView", this.viewPosition.getMatrix());

    // Draw the geometry.
    let primitiveType = gl.TRIANGLES;
    let arrayOffset = 0;
    gl.drawArrays(primitiveType, arrayOffset, this.count);
  };

  function textureLoad() {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );

    // Asynchronously load an image
    let image = new Image();
    image.crossOrigin = "";

    image.src =
      "https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg";
    image.addEventListener("load", function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      // Нет, это не степень двойки. Отключаем мипмапы и устанавливаем режим CLAMP_TO_EDGE
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    });
  }

  function setNormal() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, GeometryFigure.normals, gl.STATIC_DRAW);
  }

  function setObject() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, GeometryFigure.Primitive, gl.STATIC_DRAW);
  }

  function setTexcoords() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, GeometryFigure.texcoord, gl.STATIC_DRAW);
  }
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function logGLCall(functionName, args) {
  console.log(
    "gl." +
      functionName +
      "(" +
      WebGLDebugUtils.glFunctionArgsToString(functionName, args) +
      ")"
  );
}

function validateNoneOfTheArgsAreUndefined(functionName, args) {
  for (var ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error(
        "undefined passed to gl." +
          functionName +
          "(" +
          WebGLDebugUtils.glFunctionArgsToString(functionName, args) +
          ")"
      );
    }
  }
}

function throwOnGLError(err, funcName) {
  throw WebGLDebugUtils.glEnumToString(err) +
    " was caused by call to: " +
    funcName;
}

function reversePrimitive(GeometryFigure) {
  let reversalMatrix = m4.xRotation(Math.PI);

  for (var ii = 0; ii < GeometryFigure.Primitive.length; ii += 3) {
    var vector = m4.transformPoint(reversalMatrix, [
      GeometryFigure.Primitive[ii + 0],
      GeometryFigure.Primitive[ii + 1],
      GeometryFigure.Primitive[ii + 2],
      1
    ]);
    GeometryFigure.Primitive[ii + 0] = vector[0];
    GeometryFigure.Primitive[ii + 1] = vector[1];
    GeometryFigure.Primitive[ii + 2] = vector[2];
  }
}

main();
