function create_outer_cube(cube_dim) {
    cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);
    cube_mat = new THREE.MeshBasicMaterial({ color: 0x589768, opacity: 0.1, transparent: true });
    return new THREE.Mesh(cube_geo, cube_mat);
}

function create_inner_cube(cube_dim) {
    var offset = 10;

    cube_dim -= offset;
    cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);
    cube_mat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });
    return new THREE.Mesh(cube_geo, cube_mat);
}

function rot_animation( angle_in ) {
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
        if (!rotation_animation.is_animating() )
        {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1;
            rotation_animation.rotate_x = true;
        }
    }

    function onuparrow() { // Rotate about x anti-clockwise
        if (!rotation_animation.is_animating() )
        {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_x = true;
        }
    }

    function onleftarrow() { // Rotate about z anticlockwise
        if (!rotation_animation.is_animating() ) {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1
            rotation_animation.rotate_z = true;
        }
    }

    function onrightarrow() {  // Rotate about z clockwise
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
