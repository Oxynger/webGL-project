"use strict";

/* eslint-disable */
// prettier-ignore

var primitive = {
	FsFigure: {
		Primitive: new Float32Array([
			// left column front
			0, 0, 0,
			0, 150, 0,
			30, 0, 0,
			0, 150, 0,
			30, 150, 0,
			30, 0, 0,

			// top rung front
			30, 0, 0,
			30, 30, 0,
			100, 0, 0,
			30, 30, 0,
			100, 30, 0,
			100, 0, 0,

			// middle rung front
			30, 60, 0,
			30, 90, 0,
			67, 60, 0,
			30, 90, 0,
			67, 90, 0,
			67, 60, 0,

			// left column back
			0, 0, 30,
			30, 0, 30,
			0, 150, 30,
			0, 150, 30,
			30, 0, 30,
			30, 150, 30,

			// top rung back
			30, 0, 30,
			100, 0, 30,
			30, 30, 30,
			30, 30, 30,
			100, 0, 30,
			100, 30, 30,

			// middle rung back
			30, 60, 30,
			67, 60, 30,
			30, 90, 30,
			30, 90, 30,
			67, 60, 30,
			67, 90, 30,

			// top
			0, 0, 0,
			100, 0, 0,
			100, 0, 30,
			0, 0, 0,
			100, 0, 30,
			0, 0, 30,

			// top rung right
			100, 0, 0,
			100, 30, 0,
			100, 30, 30,
			100, 0, 0,
			100, 30, 30,
			100, 0, 30,

			// under top rung
			30, 30, 0,
			30, 30, 30,
			100, 30, 30,
			30, 30, 0,
			100, 30, 30,
			100, 30, 0,

			// between top rung and middle
			30, 30, 0,
			30, 60, 30,
			30, 30, 30,
			30, 30, 0,
			30, 60, 0,
			30, 60, 30,

			// top of middle rung
			30, 60, 0,
			67, 60, 30,
			30, 60, 30,
			30, 60, 0,
			67, 60, 0,
			67, 60, 30,

			// right of middle rung
			67, 60, 0,
			67, 90, 30,
			67, 60, 30,
			67, 60, 0,
			67, 90, 0,
			67, 90, 30,

			// bottom of middle rung.
			30, 90, 0,
			30, 90, 30,
			67, 90, 30,
			30, 90, 0,
			67, 90, 30,
			67, 90, 0,

			// right of bottom
			30, 90, 0,
			30, 150, 30,
			30, 90, 30,
			30, 90, 0,
			30, 150, 0,
			30, 150, 30,

			// bottom
			0, 150, 0,
			0, 150, 30,
			30, 150, 30,
			0, 150, 0,
			30, 150, 30,
			30, 150, 0,

			// left side
			0, 0, 0,
			0, 0, 30,
			0, 150, 30,
			0, 0, 0,
			0, 150, 30,
			0, 150, 0,
		]),
		normals: new Float32Array([
			// left column front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			// top rung front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			// middle rung front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			// left column back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			// top rung back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			// middle rung back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			// top
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			// top rung right
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			// under top rung
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			// between top rung and middle
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			// top of middle rung
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			// right of middle rung
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			// bottom of middle rung.
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			// right of bottom
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			// bottom
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			// left side
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
      -1, 0, 0]),
        texcoord: new Float32Array([
        // left column front
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
  
        // top rung front
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
  
        // middle rung front
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
  
        // left column back
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1,
  
        // top rung back
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1,
  
        // middle rung back
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1,
  
        // top
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,
  
        // top rung right
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,
  
        // under top rung
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,
  
        // between top rung and middle
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,
  
        // top of middle rung
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,
  
        // right of middle rung
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,
  
        // bottom of middle rung.
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,
  
        // right of bottom
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,
  
        // bottom
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,
  
        // left side
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0
      ])
  },
  cube: {
		Primitive: new Float32Array([
			//front
			0, 0, 0,
			0, 150, 0,
			150, 0, 0,
			0, 150, 0,
			150, 150, 0,
			150, 0, 0,

			//right
			150, 0, 0,
			150, 150, 0,
			150, 150, 150,
			150, 0, 0,
			150, 150, 150,
			150, 0, 150,

			//back
			150, 0, 150,
			0, 150, 150,
			0, 0, 150,
			150, 0, 150,
			150, 150, 150,
			0, 150, 150,

			//left
			0, 150, 150,
			0, 150, 0,
			0, 0, 0,
			0, 0, 150,
			0, 150, 150,
			0, 0, 0,

			//top
			0, 0, 0,
			150, 0, 0,
			150, 0, 150,
			0, 0, 0,
			150, 0, 150,
			0, 0, 150,

			//bottom
			150,150,150,
			150,150,0,
			0,150,0,
			0,150,150,
			150,150,150,
			0,150,0,
		]),
		normals: new Float32Array([
			//front
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			//right
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			//back
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			//left
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,

			//top
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			//bottom
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
		]),
    texcoord: new Float32Array([
      //front
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      //right
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      //back
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      //left
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      //top
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,

      //bottom
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 1,
      1, 0,
      

    ])
  },

	polygon: {
		Primitive: new Float32Array([
			100, 100, 100,
			0, 100, 100,
			0, 150, 100,
		]),
		normals: new Float32Array([
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		])
	}
}
/* eslint-enable */
