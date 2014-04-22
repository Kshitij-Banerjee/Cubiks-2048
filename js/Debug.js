// DEBUG information....
		cube_debug = new THREE.Object3D();
		volumeGeometry = new THREE.CubeGeometry(100/5,33/5,100/5, 3, 1, 3);
		 volumeMaterial = new THREE.MeshBasicMaterial({
			   color : 0x0099ff,
			   wireframe : true,
			   transparent : true, 
			   opacity : 0.4
			 });
		 volumeMesh = new THREE.Mesh(volumeGeometry, volumeMaterial);
		 volumeMesh.position.set( -50, 0 , 0 );
		 cube_debug.add(volumeMesh);
		
		 volumeGeometry = new THREE.CubeGeometry(100/5,33/5,100/5, 3, 1, 3);
		 volumeMaterial = new THREE.MeshBasicMaterial({
			   color : 0x002245,
			   wireframe : true,
			   transparent : true, 
			   opacity : 0.4
			 });
		 volumeMesh = new THREE.Mesh(volumeGeometry, volumeMaterial);
		 volumeMesh.position.set( -50, -33, 0 );
		 cube_debug.add(volumeMesh);
		
		 volumeGeometry = new THREE.CubeGeometry(100/5,33/5,100/5, 3, 1, 3);
		 volumeMaterial = new THREE.MeshBasicMaterial({
			   color : 0x00ff25,
			   wireframe : true,
			   transparent : true, 
			   opacity : 0.4
			 });
		 volumeMesh = new THREE.Mesh(volumeGeometry, volumeMaterial);		 
		 volumeMesh.position.set( -50, -66, 0 );
		 cube_debug.add(volumeMesh);
		
		 var arrowHelper = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 0 ), 
												  new THREE.Vector3( 0, 1, 0 ), 33, 0xffff00 );
		 arrowHelper.setDirection(  new THREE.Vector3( 0, -1, 0 ) );
		 arrowHelper.position.set( -50, 0 , 0 );
		 cube_debug.add( arrowHelper );
		 
		 var axis_debug = new THREE.AxisHelper(5) ;
		 axis_debug.position.set( -5, 0, 0 );
		 cube_debug.add( axis_debug );
		 cube_group.add( cube_debug );		 
