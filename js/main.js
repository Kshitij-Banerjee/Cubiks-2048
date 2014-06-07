var renderer, scene, camera, cube_group;
var cube_size = 3;
var CUBE2048;
var X_axis = new THREE.Vector3(1, 0, 0);
var Y_axis = new THREE.Vector3(0, 1, 0);
var Z_axis = new THREE.Vector3(0, 0, 1);

var textures;

var clock = new THREE.Clock();
var container = $("#game_container");
var dist;
var height_zoom = container.height() / 5;
var width_zoom = container.width() / 5;
init();

animate();

function init() {

    $(".demo-start").click(function () {
        $(".demo-2").width('69vw');
        $(".demo-2").height('38.8vw');

        $(".demo-start").height('0%');
    });

    $(".demo-2").click(function () {
        $(".demo-2").width('0%');
        $(".demo-2").height('0%');

        $(".demo-start").width('0%');
        $(".demo-start").height('0%');

        $("#game_container").show();
        release();
    });

    textures = {
        2: THREE.ImageUtils.loadTexture('./Textures/Texture_2.gif'),
        4: THREE.ImageUtils.loadTexture('./Textures/Texture_4.gif'),
        8: THREE.ImageUtils.loadTexture('./Textures/Texture_8.gif'),
        16: THREE.ImageUtils.loadTexture('./Textures/Texture_16.gif'),
        32: THREE.ImageUtils.loadTexture('./Textures/Texture_32.gif'),
        64: THREE.ImageUtils.loadTexture('./Textures/Texture_64.gif'),
        128: THREE.ImageUtils.loadTexture('./Textures/Texture_128.gif'),
        256: THREE.ImageUtils.loadTexture('./Textures/Texture_256.gif'),
        512: THREE.ImageUtils.loadTexture('./Textures/Texture_512.gif'),
        1024: THREE.ImageUtils.loadTexture('./Textures/Texture_1024.gif'),
        2048: THREE.ImageUtils.loadTexture('./Textures/Texture_2048.gif')
    };

    scene = new THREE.Scene();
    // The plane platform.

    var plane = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var plane_mat = new THREE.MeshBasicMaterial({ color: 0x708090, transparent: true, opacity: 0.4 });
    var plane_mesh = new THREE.Mesh(plane, plane_mat);
    scene.add(plane_mesh);
    plane_mesh.position.set(50, -1000 / cube_size, 0);
    plane_mesh.rotation.x -= 1.5;

    // Cameras

    var aspect = container.width() / container.height();
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 10000);

    var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
    dist = 1000 / (2 * Math.tan(vFOV / 2)) ; // visible height
    
    camera.position.set(50, dist/5, dist/6);
    camera.lookAt(new THREE.Vector3(50, 50, 0));
    scene.add(camera);

    // Lights

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(300, 300, 300);
    scene.add(spotLight);
    scene.add(new THREE.AmbientLight(0xffffff));

    // Geometries
    cube_group = new THREE.Object3D();
    cube_group.position.set(50, 50, 0);

    //==================================================
    // Insert debug code from debug.js here...
    //==================================================

    // Refresh the game.

    CUBE2048 = new GAME(3);

    scene.add(cube_group);

    // Renderer
    try{
        renderer = new THREE.WebGLRenderer({ antialias: true });    
        renderer.setSize( container.width(), container.height());
        renderer.setClearColor(0xe9eaed);

        // Add the canvas to the dom.

        $("#game_container").append(renderer.domElement);
        $("#game_container").hide();    // Add the canvas to the dom.

    }
    catch( ex ){
        alert(" Your Browser does not support this games technology.. Get chrome/mozilla!");
        $(".container").text(" Your browser is unsupported/not updated. Please get the latest version of chrome/mozilla to play.");
		$(".container").append(" <br><br> For Safari: <br><br> Open the Safari menu and select Preferences.<br> <br> Then, click the Advanced tab in the Preferences window.<br>  <br> Then, at the bottom of the window, check the Show Develop menu in menu bar checkbox.<br> <br> Then, open the Develop menu in the menu bar and select Enable WebGL.<br> <br> Have fun!<br> " );
        return;
    }

    // Make the outer frame..

    var outer_frame = create_frame(50);
    cube_group.add(outer_frame);
        
    // And fade it away...

    new TWEEN.Tween(outer_frame.material)
        .to({ opacity: 0.0 }, 5000)
        .onComplete(function () {
            cube_group.remove(outer_frame);
        })
        .start();


    // Add the mouse events

    $("#game_container").mousedown(function () {
        CUBE2048.view_sides();
    });

    $("#game_container").mouseup(function () {
        CUBE2048.reset_positions();
    });
    
    // Keyboard events..

    bind_keyboard_keys();

    // Buttons..

    $(".restart-button").click(function () {
        release();
    });
};

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    if (rotation_animation.is_animating()) {
        if (rotation_animation.rotate_x) {
            if (rotation_animation.animation_residue > 0)
                rotateAroundWorldAxis(cube_group, X_axis, rotation_animation.rotation_direction * rotation_animation.get_offset());

            if (--rotation_animation.animation_residue == -10) {
                rotation_animation.rotate_x = false;
            }

            if (rotation_animation.animation_residue == 0) {
                CUBE2048.gravity.rotate((-rotation_animation.rotation_direction) * Math.PI / 2, X_axis);
                if( CUBE2048.shift_cubes() )
                {
                    CUBE2048.add_random_cube(2);
                }
                else if (CUBE2048.filled_cubes == CUBE2048.cube_count)
                {
                        renderer.render(scene, camera);
                        release('Game Over!!');
                        return;
                }
            }
        }
        
        else if (rotation_animation.rotate_y) {
            if (rotation_animation.animation_residue > 0)
                rotateAroundWorldAxis(cube_group, Y_axis, rotation_animation.rotation_direction * rotation_animation.get_offset());

            if (--rotation_animation.animation_residue == -10) {
                rotation_animation.rotate_y = false;
            }

                if (rotation_animation.animation_residue == 0) {
                    CUBE2048.gravity.rotate((-rotation_animation.rotation_direction) * Math.PI / 2, Y_axis);
                    if( CUBE2048.shift_cubes() )
                    {
                        CUBE2048.add_random_cube(2);
                    }
                    else if (CUBE2048.filled_cubes == CUBE2048.cube_count) {
                        renderer.render(scene, camera);
                        release('Game Over!!');
                        return;
                    }
                }
            }
        
        else if (rotation_animation.rotate_z) {
            if(rotation_animation.animation_residue > 0 )
                rotateAroundWorldAxis(cube_group, Z_axis, rotation_animation.rotation_direction * rotation_animation.get_offset());

            if (--rotation_animation.animation_residue == -10) {
                rotation_animation.rotate_z = false;
            }
                if (rotation_animation.animation_residue == 0) {
                    CUBE2048.gravity.rotate((-rotation_animation.rotation_direction) * Math.PI / 2, Z_axis);
                    if( CUBE2048.shift_cubes() )
                    {
                        CUBE2048.add_random_cube(2);                        
                    }
                    else if (CUBE2048.filled_cubes == CUBE2048.cube_count) {
                        renderer.render(scene, camera);
                        release('Game Over!!');
                        return;
                    }
                }
            }        
    }

    renderer.render(scene, camera);
};


function release(msg) {

    $("canvas").css({ opacity: 0.5 });

    if (msg != undefined)
        alert(msg);

    $("#game_container").empty();

    var len = cube_group.children.length;
    for (var i = 0 ; i < len ; i++) {
        cube_group.remove(cube_group.children[0]);
    }

    len = scene.children.length;
    for (var i = 0 ; i < len; i++) {
        scene.remove(scene.children[0]);
    }

    renderer.render(scene, camera);

    delete CUBE2048;
    delete cube_group;
    delete scene;
    delete camera;
    delete renderer;

    KeyboardJS.clear('down');
    KeyboardJS.clear('up');
    KeyboardJS.clear('left');
    KeyboardJS.clear('right');
    KeyboardJS.clear('space');
    KeyboardJS.clear('enter');


    // Restart..

    init();
    $("#game_container").show();
};
