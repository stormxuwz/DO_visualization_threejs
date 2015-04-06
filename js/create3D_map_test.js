function create3DMap(data){
		// console.log("create3DMap");
		var height=data.length;
		var width=data[0].length;

		var scene = new THREE.Scene();
		
		var renderer = new THREE.WebGLRenderer();

		renderer.setClearColor("white", 0.9);
        renderer.setSize(window.innerWidth, window.innerHeight);

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000 );
        camera.position.x = 0;
        camera.position.y = 50;
        camera.position.z = 50;
		camera.lookAt(new THREE.Vector3(0,0,0));

		// var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		// camera.position.x = 0;
  //       camera.position.y = 100;
  //       camera.position.z = 0;

		document.body.appendChild(renderer.domElement);
	
		var geom = new THREE.Geometry();
		
		console.log([width,height]);

		
		controls = new THREE.TrackballControls(camera);
		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 0.2;
		controls.panSpeed = 0.8;

		controls.noZoom = false;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
		
		// Create vertices
		for(var y=0;y<height;y++){
			for(var x=0;x<width;x++){		
				var vertex=new THREE.Vector3(x-width/2.0, -1, (y-height/2.0));
				geom.vertices.push(vertex);
			}
		}

		// Create faces
		for(var y=0;y<height-1;y++){
			for(var x=0;x<width-1;x++){
				
				var a=x+y*width;
				var b=(x+1)+y*width;
				var c=x+(y+1)*width;
				var d=x+1+(y+1)*width;

				
				var color_a=new THREE.Color(data[y][x]);
				var color_b=new THREE.Color(data[y][x+1]);
				var color_c=new THREE.Color(data[y+1][x]);
				var color_d=new THREE.Color(data[y+1][x+1]);

				var face1=new THREE.Face3(a,b,d);
				var face2=new THREE.Face3(d,c,a);

				face1.vertexColors=[color_a,color_b,color_d];
				face2.vertexColors=[color_d,color_c,color_a];

				geom.faces.push(face1);
				geom.faces.push(face2);
			}
		}

		geom.computeVertexNormals(true);
  		geom.computeFaceNormals();
  		geom.computeBoundingBox();
  		
		
		var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors});
		// var vertexColorMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
		vertexColorMaterial.side=THREE.DoubleSide;
		var mesh = new THREE.Mesh( geom, vertexColorMaterial );
		scene.add(mesh)

		// Toy DO data
		var DO_geom = new THREE.Geometry();
		
		var v1=new THREE.Vector3(-10,10,-10);
		var v2=new THREE.Vector3(10,8,-10);
		var v3=new THREE.Vector3(-10,6,10);
		var v4=new THREE.Vector3(10,7,10);

		
		DO_geom.vertices.push(v1);
		DO_geom.vertices.push(v2);
		DO_geom.vertices.push(v3);
		DO_geom.vertices.push(v4);

		var face1=new THREE.Face3(0,1,3);
		var face2=new THREE.Face3(3,2,0);

		face1.vertexColors=[new THREE.Color(0xFFFF00),new THREE.Color(0xFF0000),new THREE.Color(0x66FF00)];
		face2.vertexColors=[new THREE.Color(0x66FF00),new THREE.Color(0x0000FF),new THREE.Color(0xFFFF00)];


		// face1.color=new THREE.Color(0x00ff00);
		// face2.color=new THREE.Color(0xFF0000);
		
		DO_geom.faces.push(face1);
		DO_geom.faces.push(face2);

		var DO_vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors});
		var DO_mesh = new THREE.Mesh( DO_geom, vertexColorMaterial );
		scene.add(DO_mesh)



		axes = buildAxes( 100 );
		scene.add( axes );

		height_change=[0,5,10,5,10,5,5];
		// velocity=[]

		var i=0;
		var j=0;
		

		function render() {
			renderer.render( scene, camera );
			controls.update();
			i++ // i is the current time
			j=Math.floor(i/60);
			j=j>5?5:j

			// while(j<5){
				
				// console.log(currentY);
				// console.log((height_change[j+1]-height_change[j])/60);
				for(var index=0;index<geom.vertices.length;index++){
					var currentY=geom.vertices[index].y
					geom.vertices[index].setY(currentY+3*Math.random()*(height_change[j+1]-height_change[j])/60);
				}
				
				// console.log([i,j]);
				// DO_geom.faces[0].vertexColors[0].setHSL(, 0.5, 0.5 );
				// DO_mesh.geometry.colorsNeedUpdate = true;
				mesh.geometry.verticesNeedUpdate = true;
				// requestAnimationFrame( render );
			// }


			// DO_geom.vertices[0]=new THREE.Vector3(-10,randomNum*20,-10);
			// DO_geom.faces[0].vertexColors[0].setHSL( randomNum, 0.5, 0.5 );
			
			
			// mesh.geometry.computeVertexNormals();
			
			// setTimeout( function() {
        	requestAnimationFrame( render );

    		// }, 1000 / 1);
		}

		render();

}

function buildAxes( length ) {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

		return axes;

	}
function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat; 

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

		var axis = new THREE.Line( geom, mat, THREE.LinePieces );

		return axis;

	}