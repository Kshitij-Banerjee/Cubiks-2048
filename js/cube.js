function create_inner_cube(cube_dim) {
    var offset = 0;

    cube_dim -= offset;
    cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);

    var texture = null;

    texture = textures[2];

    cube_mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.5 });
    return new THREE.Mesh(cube_geo, cube_mat);
};

function create_frame(frame_dim) {
    var frame = new THREE.BoxHelper();
    frame.material.color.setRGB(0, 0, 0);
    frame.material.transparent = true;
    frame.scale.set(frame_dim, frame_dim, frame_dim);
    return frame;
};

function bind_keyboard_keys() {

    KeyboardJS.on('down', function () { // Rotate about x clockwise.

        if (!rotation_animation.is_animating()) {            
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1;
            rotation_animation.rotate_x = true;
        }
    });

    KeyboardJS.on('up', function () { // Rotate about x anti-clockwise

        if (!rotation_animation.is_animating()) {
            
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_x = true;
        }
    });

    KeyboardJS.on('left', function () { // Rotate about z anticlockwise


        if (!rotation_animation.is_animating()) {            
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1
            rotation_animation.rotate_z = true;
        }
    });

    KeyboardJS.on('right', function () {  // Rotate about z clockwise

        if (!rotation_animation.is_animating()) {
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_z = true;
        }

    });

    KeyboardJS.on('enter', function () {
       if(  CUBE2048.shift_cubes() )
            CUBE2048.add_random_cube(2);
    });

    KeyboardJS.on("space",
    function () {
        CUBE2048.view_sides()
    },
    function () {
        CUBE2048.reset_positions()
    });
};
