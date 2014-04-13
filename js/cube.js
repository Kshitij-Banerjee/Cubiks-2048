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
    cube_mat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });
    return new THREE.Mesh(cube_geo, cube_mat);
}

function create_random_cube()
{
    var x = Math.floor(Math.random()* 10) % 3;
    var y = Math.floor(Math.random() * 10) % 3;
    var z = Math.floor(Math.random() * 10) % 3;

    x--;
    y--;
    z--;

    x *= (100 / cube_size);
    y *= (100 / cube_size);
    z *= (100 / cube_size);

    var cube = create_inner_cube(33);

    cube.position.set(x, y, z);
    cube_group.add( cube );
}

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
    //return 0.18;
};

    var rotation_animation = new rot_animation( Math.PI / 2);

function bind_keyboard_keys() {

    function ondownarrow() { // Rotate about x clockwise.
        create_random_cube();
        if (!rotation_animation.is_animating() )
        {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1;
            rotation_animation.rotate_x = true;
        }
    }

    function onuparrow() { // Rotate about x anti-clockwise
        create_random_cube();
        if (!rotation_animation.is_animating() )
        {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_x = true;
        }
    }

    function onleftarrow() { // Rotate about z anticlockwise
        create_random_cube();
        if (!rotation_animation.is_animating() ) {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1
            rotation_animation.rotate_z = true;
        }
    }

    function onrightarrow() {  // Rotate about z clockwise
        create_random_cube();
        if (!rotation_animation.is_animating() ) {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_z = true;
        }
    }

    KeyboardJS.on('down arrow', ondownarrow);
    KeyboardJS.on('up arrow', onuparrow );
    KeyboardJS.on('left arrow', onleftarrow);
    KeyboardJS.on('right arrow', onrightarrow);
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
