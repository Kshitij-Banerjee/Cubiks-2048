function threeD_vector() {
    this.direction = new THREE.Vector3(0, -1, 0);
};

function normalize( x )
{
	if( x > 0 )
	{
		if( x < 0.001 )
			x = 0;	
		else if( x > 0.99 )
			x = 1;
	}
	else{
		if( x > -0.001 )
			x = 0;
		else if( x < -0.99 )
			x = -1;
	}
	
	return x;
};

threeD_vector.prototype.rotate = function (angle, axis) {    
	
	var dir = new THREE.Vector3( 0, -1, 0 );
	
	var quat = new THREE.Quaternion();
	quat.copy( cube_group.quaternion );
	quat.inverse();
	
	dir.applyQuaternion( quat );

	dir.x = normalize( dir.x );
	dir.y = normalize( dir.y );
	dir.z = normalize( dir.z );
	
	this.direction = dir;
	
   // $("#i").text(this.direction.x);
   // $("#j").text(this.direction.y);
   // $("#k").text(this.direction.z);

};

threeD_vector.prototype.right = function () {
    var dir = new THREE.Vector3(1, 0, 0);

    var quat = new THREE.Quaternion();
    quat.copy(cube_group.quaternion);
    quat.inverse();

    dir.applyQuaternion(quat);

    dir.x = normalize(dir.x);
    dir.y = normalize(dir.y);
    dir.z = normalize(dir.z);

    return dir;
}
