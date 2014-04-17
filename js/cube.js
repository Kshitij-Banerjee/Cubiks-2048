function create_outer_cube(cube_dim) {
    var cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);
    var cube_mat = new THREE.MeshBasicMaterial({ color: 0x589768, opacity: 0.1, transparent: true });
    var cube_mesh = new THREE.Mesh(cube_geo, cube_mat);
    //cube_mesh.position.set(cube_dim/2, cube_dim/2, cube_dim/2);
}

function create_inner_cube(cube_dim) {
    var offset = 10;    

    cube_dim -= offset;
    cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);

    var texture = null;

    if (Math.random() < 0.9 )
        texture = texture_2;
    else
        texture = texture_4;

    cube_mat = new THREE.MeshBasicMaterial({ map: texture, transparent : true, opacity :0.8 });
    return new THREE.Mesh(cube_geo, cube_mat);
}

function GAME( size ) {
		this.game_size = size;
		this.cube_count = size * size* size;
		this.filled_cubes = 0;
		this.cube_array = {};
		this.coord = {x:0,y:0,z:0};
        // Initialize the array .

		for( var i = 0 ; i < this.cube_count; i ++ )	
		{			
		    this.cube_array[i] = 0;
		}
};	


GAME.prototype.create_random_number = function (limit) {
    return Math.floor(Math.random() * 100) % limit;
};

GAME.prototype.fill_coord= function (rand, coord) {
    coord.z = Math.floor( rand / (this.game_size*this.game_size) ); //  z level
    rand = rand % (this.game_size * this.game_size); // remaining in level

    coord.y = Math.floor(rand / this.game_size);
    coord.x = rand % this.game_size;

    coord.x = Math.floor(coord.x - Math.floor(this.game_size / 2));
    coord.y = Math.floor(coord.y - Math.floor(this.game_size / 2));
    coord.z = Math.floor(coord.z - Math.floor(this.game_size / 2));

    coord.x *= (100 / this.game_size);
    coord.y *= (100 / this.game_size);
    coord.z *= (100 / this.game_size);
};



GAME.prototype.add_random_cube = function () {

    // No more to add..
    if (this.filled_cubes == this.cube_count) {
        release();    
        return;
    }

    var rand = this.create_random_number( this.cube_count);

    while (this.cube_array[rand] != 0) {
        rand++;
        if (rand == this.cube_count)
            rand = 0;
    }
    
    this.fill_coord( rand, this.coord );

    var cube = create_inner_cube(33);
    cube.position.set(this.coord.x, this.coord.y, this.coord.z);

    cube_group.add(cube);
    this.cube_array[rand] = cube;

    this.filled_cubes++;
};

function rot_animation(angle_in) {
    this.animation_duration = 10; // 2 seconds apprx
    this.angle = angle_in;
    this.animation_residue = 0;
    this.rotate_x = false;
    this.rotate_y = false;
    this.rotate_z = false;
    this.rotation_direction = +1;
                            
}

rot_animation.prototype.is_animating = function () {
      return (this.rotate_x || this.rotate_y || this.rotate_z);
};

rot_animation.prototype.get_offset = function ()
{ 
    return this.angle / this.animation_duration; 
};

function createcoord() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

GAME.prototype.shift_cubes = function () {

    for (var i = 0 ; i < this.cube_count; i++) {

        if ( i > 8 && ( this.cube_array[i] != 0)) {
            var j = i -9;
            while ((j >= 0) && (this.cube_array[j] == 0))
                j -= 9;

            // Either j is empty, out of bound, or did not move at all
            if (j >= 0 && this.cube_array[j] && 
                (this.cube_array[i].material.map.sourceFile ==
                 this.cube_array[j].material.map.sourceFile ))
            {
                cube_group.remove(this.cube_array[j]);
                this.cube_array[j] = 0;
                this.filled_cubes--;
                j -= 9; 
            }
            

            j += 9;
            if (j == i)
                continue;

            if (j < 0)
                continue;

            var start_coord = new createcoord();
            var last_coord = new createcoord();

            this.fill_coord(i, start_coord);
            this.fill_coord(j, last_coord);

            this.cube_array[i].animation = {
                "name": ("Cube_down" + i),
                "length": 0.5,
                "hierarchy": [
                    {
                        "parent": -1,
                        "keys": [
                            {
                                "time": 0,
                                "pos": [start_coord.x, start_coord.y, start_coord.z],
                                "rot": [0, 0, 0],
                                "scl": [1,1,1]
                            },
                            {
                                "time": 0.5,
                                "pos": [last_coord.x, last_coord.y, last_coord.z]
                            }
                        ]
                    }
                ]
            };

            THREE.AnimationHandler.add(this.cube_array[i].animation);

            var cube_anim = new THREE.Animation(this.cube_array[i], this.cube_array[i].animation.name);
            cube_anim.loop = false;
            cube_anim.interpolationType = THREE.AnimationHandler.CATMULLROM;
            cube_anim.play( false, 0 );

            this.cube_array[j] = this.cube_array[i];
            this.cube_array[i] = 0;
        }
    }
};

var rotation_animation = new rot_animation( Math.PI / 2);

function bind_keyboard_keys() {

    KeyboardJS.on('down', function () { // Rotate about x clockwise.

        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1;
            rotation_animation.rotate_x = true;

            CUBE2048.shift_cubes();
        }
    });



    KeyboardJS.on('up', function () { // Rotate about x anti-clockwise


        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_x = true;

            CUBE2048.shift_cubes();
        }
    });

    KeyboardJS.on('left', function () { // Rotate about z anticlockwise


        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1
            rotation_animation.rotate_z = true;

            CUBE2048.shift_cubes();
        }
    });

    KeyboardJS.on('right',
    function () {  // Rotate about z clockwise

        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_z = true;

            CUBE2048.shift_cubes();
        }
    });
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix); // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}
