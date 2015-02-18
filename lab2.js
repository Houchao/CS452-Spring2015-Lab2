// Houchao Gan 0326471 

var gl;

var dx = 0.0;
var dy = 0.0;

var deltax = 0.1;
var deltay = 0.1;

var dxLoc;
var dyLoc;

var speed = 100;
//var direction = true;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = circleVertex(0, 0, 0.3, 64)
    //console.log(vertices[1]);

    // Load the data into the GPU    
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);
   
    
    dxLoc = gl.getUniformLocation(program, "dx");
    dyLoc = gl.getUniformLocation(program, "dy");
    
    // Initialize event handlers
    
//    document.getElementById("slider").onchange = function(event) {
//        speed = 100 - event.target.value;
//    };
    
    document.getElementById("Direction").onclick = function () { //autro run
    	
        deltax = 0.035
        deltay = 0.011
        bounce();
    	Autorender();
    };
    
    document.getElementById("Stop").onclick = function () {// stop run
    	
        deltax = 0
        deltay = 0

    };
    
//    document.getElementById("Controls").onclick = function( event) {
//		switch(event.target.index) {
//          case 0:
//            var min = -0.1;
//            var max = 0.1;
//              
//            deltax = Math.floor(Math.random() * (max - min + 1)) + min;
//            deltay = Math.floor(Math.random() * (max - min + 1)) + min;
//              
//          	Autorender();
//            break;
//
//         case 1:
//            speed /= 2.0;
//            break;
//
//         case 2:
//            speed *= 2.0;
//            break;
//       }
//    };

   
    window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'W':
        	dy = dy + 0.1;
        	//console.log(vPosition.y); 
            break;

          case 'S':
        	dy = dy - 0.1;
            break;

          case 'A':
        	dx = dx - 0.1;
            break;
            
          case 'D':
        	dx = dx + 0.1;
            break;
            
          case '1':
        	dx = 0;
        	dy = 0;
        }
    };


    //console.log(vertices[1])
    
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    

    //theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(dxLoc, dx);
    gl.uniform1f(dyLoc, dy);
    
    dx = xbound(dx);
    dy = ybound(dy);
    //console.log(dx);
    //console.log(dy)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);

    setTimeout(
        function () {requestAnimFrame( render );},
        speed
    );
}

function Autorender()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    //theta += (direction ? 0.1 : -0.1);
    
    gl.uniform1f(dxLoc, dx);
    gl.uniform1f(dyLoc, dy);
    //console.log(dy)
    bounce();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 64);
 
    requestAnimFrame( Autorender );

}

//ball vertex
function circleVertex(cx, cy, r, n)
{
	var temp = [];
    
    
    for(var i = 0; i < n; i++)
    {
        var theta = 2.0 * 3.1415926 * i / n;//get the current angle

        var x = cx + r * Math.cos(theta);//calculate the x component
        var y = cy + r * Math.sin(theta);//calculate the y component

        //glVertex2f(x + 1, y + 1);//output vertex
        temp.push(x);
        temp.push(y);
    }
    
    return new Float32Array(temp);

}
//x bound
function xbound(dx)
{
    if(dx  > 0.7)
    {
    	return dx = 0.7;
    }
    if(dx < -0.7)
    {
    	return dx = -0.7;
    }
    return dx;
}
// y bound
function ybound(dy)
{
    if(dy  > 0.7)
    {
    	return dy = 0.7;
    }
    if(dy < -0.7)
    {
    	return dy = -0.7;
    }
    return dy;
}
// ball bounce
function bounce()
{

    if(dy  > 0.7 || dy < -0.7)
    {
    	deltay = -deltay;
    }
    
    if(dx  > 0.7 || dx < -0.7)
    {
    	deltax = -deltax;
    }
    dy = dy + deltay;
    dx = dx + deltax;
}
