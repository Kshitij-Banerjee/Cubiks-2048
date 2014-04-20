function create_outer_cube(cube_dim) {
    var cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);
    var cube_mat = new THREE.MeshBasicMaterial({ color: 0x589768, opacity: 0.1, transparent: true });
    return new THREE.Mesh(cube_geo, cube_mat);

};

function create_inner_cube(cube_dim) {
    var offset = 10;

    cube_dim -= offset;
    cube_geo = new THREE.CubeGeometry(cube_dim, cube_dim, cube_dim);

    var texture = null;

    if (Math.random() < 0.9)
        texture = textures[2];
    else
        texture = textures[4];

    cube_mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.8 });
    return new THREE.Mesh(cube_geo, cube_mat);
};

function bind_keyboard_keys() {

    KeyboardJS.on('down', function () { // Rotate about x clockwise.

        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1;
            rotation_animation.rotate_x = true;

            CUBE2048.gravity.rotate(-Math.PI / 2, X_axis);
            CUBE2048.shift_cubes();
        }
    });

    KeyboardJS.on('up', function () { // Rotate about x anti-clockwise


        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_x = true;

            CUBE2048.gravity.rotate(Math.PI / 2, X_axis);
            CUBE2048.shift_cubes();
        }
    });

    KeyboardJS.on('left', function () { // Rotate about z anticlockwise


        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = +1
            rotation_animation.rotate_z = true;

            CUBE2048.gravity.rotate(Math.PI / 2, Z_axis);
            CUBE2048.shift_cubes();
        }
    });

    KeyboardJS.on('right', function () {  // Rotate about z clockwise

        if (!rotation_animation.is_animating()) {
            CUBE2048.add_random_cube();
            rotation_animation.animation_residue = rotation_animation.animation_duration;
            rotation_animation.rotation_direction = -1;
            rotation_animation.rotate_z = true;

            CUBE2048.gravity.rotate( -Math.PI/2, Z_axis);
            CUBE2048.shift_cubes();
        }

    });
};
