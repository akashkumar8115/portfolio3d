import React, { useEffect, useRef } from 'react';
import '../css/Try.css'; // Import your styles

const WebGLAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let gl, program;
    let locationOfResolution, locationOfMouse, locationOfMass, locationOfTime, locationOfclickedTime;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let currentTime = 0, curblackholeMass = 0;
    const blackholeMass = 5500;
    let startTime = new Date().getTime();
    let targetMouse = { ...mouse };

    const loadShaders = () => {
      const vertexShaderElement = document.getElementById('2d-vertex-shader');
      const fragmentShaderElement = document.getElementById('2d-fragment-shader');

      if (!vertexShaderElement || !fragmentShaderElement) {
        console.error("Shader elements not found.");
        return;
      }

      const vertexShaderSource = vertexShaderElement.text;
      const fragmentShaderSource = fragmentShaderElement.text;

      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex shader failed to compile:", gl.getShaderInfoLog(vertexShader));
        return;
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment shader failed to compile:", gl.getShaderInfoLog(fragmentShader));
        return;
      }

      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      // Check if the program linked successfully
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program failed to link:", gl.getProgramInfoLog(program));
        return;
      }

      gl.useProgram(program); // Activate the program here

      // Assign uniform locations after the program is active
      locationOfResolution = gl.getUniformLocation(program, "u_resolution");
      locationOfMouse = gl.getUniformLocation(program, "u_mouse");
      locationOfMass = gl.getUniformLocation(program, "u_mass");
      locationOfTime = gl.getUniformLocation(program, "u_time");
      locationOfclickedTime = gl.getUniformLocation(program, "u_clickedTime");

      // Set initial uniforms
      gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
    };


    const initWebGL = () => {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error("WebGL not supported");
        return;
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      loadShaders();

      window.addEventListener('mousemove', (e) => {
        targetMouse.x = e.pageX;
        targetMouse.y = e.pageY;
      });
    };

    const render = () => {
      gl.useProgram(program); // Ensure the correct program is active

      const now = new Date().getTime();
      currentTime = (now - startTime) / 1000;

      // Update uniforms
      gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas
      gl.uniform1f(locationOfMass, curblackholeMass * 0.00001);
      gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
      gl.uniform1f(locationOfTime, currentTime);

      // Draw the scene
      gl.drawArrays(gl.TRIANGLES, 0, 6); // Draw a rectangle covering the entire canvas

      requestAnimationFrame(render);
    };

    initWebGL();
    render(); // Start the render loop

    return () => {
      window.removeEventListener('mousemove', () => { });
    };
  }, []);


  // start
  var bgUrl = 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  var blackholeMass = 500;
  var curblackholeMass = 0;

  var canvas, gl; // canvas and webgl context

  var shaderScript;
  var shaderSource;
  var vertexShader; // Vertex shader. Not much happens in that shader, it just creates the vertex's to be drawn on
  var fragmentShader; // this shader is where the magic happens. Fragment = pixel. Vertex = kind of like "faces" on a 3d model.
  var buffer;

  /* Variables holding the location of uniform variables in the WebGL. We use this to send info to the WebGL script. */
  var locationOfTime;
  var locationOfResolution;
  var locationOfMouse;
  var locationOfMass;
  var locationOfclickedTime;

  var originY = window.innerHeight,
    originX = window.innerWidth;

  var mouse, targetMouse;

  var startTime = new Date().getTime(); // Get start time for animating
  var currentTime = 0;

  var clicked = false,
    clickedTime = 0;

  $(document).mousedown(function () {
    clicked = true;
  });
  $(document).mouseup(function () {
    clicked = false;
  });

  function init(image) {
    // standard canvas setup here, except get webgl context
    canvas = document.getElementById('glscreen');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    canvas.width = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;
    canvas.height = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;

    mouse = { x: originX / 2, y: -(originY / 2) + canvas.height, moved: false };
    targetMouse = { x: mouse.x, y: mouse.y }; // Initialize targetMouse
    $(document).mousemove(function (e) {
      targetMouse.x = e.pageX; // Update target mouse position
      targetMouse.y = -e.pageY + canvas.height;
      mouse.moved = true;
    });

    // give WebGL it's viewport
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // kind of back-end stuff
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0]),
      gl.STATIC_DRAW
    ); // ^^ That up there sets up the vertex's used to draw onto. I think at least, I haven't payed much attention to vertex's yet, for all I know I'm wrong.

    shaderScript = document.getElementById("2d-vertex-shader");
    shaderSource = shaderScript.text;
    vertexShader = gl.createShader(gl.VERTEX_SHADER); //create the vertex shader from script
    gl.shaderSource(vertexShader, shaderSource);
    gl.compileShader(vertexShader);

    shaderScript = document.getElementById("2d-fragment-shader");
    shaderSource = shaderScript.text;
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //create the fragment from script
    gl.shaderSource(fragmentShader, shaderSource);
    gl.compileShader(fragmentShader);

    program = gl.createProgram(); // create the WebGL program.  This variable will be used to inject our javascript variables into the program.
    gl.attachShader(program, vertexShader); // add the shaders to the program
    gl.attachShader(program, fragmentShader); // ^^
    gl.linkProgram(program);    // Tell our WebGL application to use the program
    gl.useProgram(program); // ^^ yep, but now literally use it.

    locationOfResolution = gl.getUniformLocation(program, "u_resolution");
    locationOfMouse = gl.getUniformLocation(program, "u_mouse");
    locationOfMass = gl.getUniformLocation(program, "u_mass");
    locationOfTime = gl.getUniformLocation(program, "u_time");
    locationOfclickedTime = gl.getUniformLocation(program, "u_clickedTime");

    gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
    gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
    gl.uniform1f(locationOfMass, curblackholeMass * 0.00001);
    gl.uniform1f(locationOfTime, currentTime);
    gl.uniform1f(locationOfclickedTime, clickedTime);

    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0]),
      gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    render();
  }

  function render() {
    var now = new Date().getTime();
    currentTime = (now - startTime) / 1000; // update the current time for animations

    if (curblackholeMass < blackholeMass - 50) {
      curblackholeMass += (blackholeMass - curblackholeMass) * 0.03;
    }

    if (clicked) {
      clickedTime += 0.03;
    } else if (clickedTime > 0 && clicked == false) {
      clickedTime += -(clickedTime * 0.015);
    }

    if (mouse.moved == false) {
      mouse.y = (-(originY / 2) + Math.sin(currentTime * 0.7) * ((originY * 0.25))) + canvas.height;
      mouse.x = (originX / 2) + Math.sin(currentTime * 0.6) * -(originX * 0.35);
    } else {
      // Apply easing to the mouse movement
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;
    }

    gl.uniform1f(locationOfMass, curblackholeMass * 0.00001);
    gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
    gl.uniform1f(locationOfTime, currentTime); // update the time uniform in our shader
    gl.uniform1f(locationOfclickedTime, clickedTime);

    window.requestAnimationFrame(render, canvas); // request the next frame

    positionLocation = gl.getAttribLocation(program, "a_position"); // do stuff for those vertex's
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  window.addEventListener('load', function (event) {
    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = bgUrl;
    image.onload = function () {
      init(image);
    }
  });

  window.addEventListener('resize', function (event) {
    // just re-doing some stuff in the init here, to enable resizing.
    canvas.width = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;
    canvas.height = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    locationOfResolution = gl.getUniformLocation(program, "u_resolution");
  });


  // end

  return (
    <div className='webgl-container'>
      <canvas ref={canvasRef} id="glscreen"></canvas>

      {/* Add shader script elements */}
      <script id="2d-vertex-shader" type="x-shader/x-vertex">
        {`
          attribute vec2 a_position;
          uniform vec2 u_resolution;

          void main() {
            vec2 clipSpace = a_position / u_resolution * 2.0 - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
          }
        `}
      </script>
      <script id="2d-fragment-shader" type="x-shader/x-fragment">
        {`
          precision mediump float;
          uniform vec2 u_mouse;
          uniform float u_time;
          uniform float u_mass;

          void main() {
            // Create a simple color animation based on time and mouse position
            float r = 0.5 + 0.5 * sin(u_time + u_mouse.x * 0.01);
            float g = 0.5 + 0.5 * sin(u_time + u_mouse.y * 0.01);
            float b = 0.5 + 0.5 * sin(u_time);

            gl_FragColor = vec4(r, g, b, 1.0);
          }
        `}
      </script>
    </div>
  );
};

export default WebGLAnimation;
