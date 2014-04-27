function createcoord() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

function GAME(size) {
    this.game_size = size;
    this.cube_count = size * size * size;
    this.filled_cubes = 0;
    this.cube_array = {};

    // Initialize the array .

    for (var i = 0 ; i < this.cube_count; i++) {
        this.cube_array[i] = 0;
    }

    this.gravity = new threeD_vector();
    this.coord = new createcoord();

    this.removal_queue = [];
	
	this.add_random_cube( 2 );
	this.shift_cubes();
};

GAME.prototype.create_random_number = function (limit) {
    return Math.floor(Math.random() * 100) % limit;
};

GAME.prototype.fill_coord = function (rand, coord) {
    coord.z = Math.floor(rand / (this.game_size * this.game_size)); //  z level
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

GAME.prototype.coord_to_index = function( i, j, k ){
    var numb  = 0;
    numb += this.game_size * this.game_size * k;
    numb += j * this.game_size;
    numb += i;

    return numb;
};

GAME.prototype.add_random_cube = function ( count ) {

    if (count == 0)
        return;

    // No more to add..
    if (this.filled_cubes == this.cube_count) {
        renderer.render(scene, camera);
        release( 'Game Over!!' );
        return;
    }

    var rand = this.create_random_number(this.cube_count);

    while (this.cube_array[rand] != 0 ) {
        rand++;
        if (rand == this.cube_count)
            rand = 0;
    }

    this.fill_coord(rand, this.coord);

    var cube = create_inner_cube(33);
    cube.position.set(this.coord.x, this.coord.y, this.coord.z);

    cube_group.add(cube);
    this.cube_array[rand] = cube;

    this.filled_cubes++;

    this.add_random_cube(--count);
};

function next_map(map) {
    var underscore_idx = map.sourceFile.indexOf("_");
    var dot_idx = map.sourceFile.lastIndexOf(".");
    var index = map.sourceFile.substring(++underscore_idx, dot_idx);
    index = parseInt(index);
    return index + index;
};

GAME.prototype.is_in_bound = function( i2, j2 , k2 ){
    if( i2 < 0 || i2 >= this.game_size)
        return false;

    if( j2 < 0 || j2 >= this.game_size)
        return false;

    if( k2 < 0 || k2 >= this.game_size)
        return false;

    return true;
};


GAME.prototype.do_texture_events = function (index, index2, i2, j2, k2) {
    var next_texture = this.cube_array[index].material.map;

    if (next_texture == textures[2048]) {
        renderer.render(scene, camera);
        alert(" Did you just win? !!");
        release('Yes you did! You won! Yay!! :) ');
        return true;
    }
    else if (next_texture == textures[512]) {
        var go = new TWEEN.Tween(this.cube_array[index].scale)
                        .to({ x: 1.1, y: 1.1, z: 1.1 }, 500)
                        .easing(TWEEN.Easing.Sinusoidal.In)
                        .start();

        var back = new TWEEN.Tween(this.cube_array[index].scale)
                        .to({ x: 1.0, y: 1.0, z: 1.0 }, 500)
                        .easing(TWEEN.Easing.Sinusoidal.In);

        go.chain(back);
        back.chain(go);
    }

    return false;
};

GAME.prototype.merge_cubes = function(last_index)
{
    this.removal_queue.push(this.cube_array[last_index]);
    this.cube_array[last_index].transparent = false;
    this.cube_array[last_index].opacity = 1;
    this.cube_array[last_index] = 0;
    this.filled_cubes--;   

    var length = 100;
    var tween = new TWEEN.Tween(CUBE2048.removal_queue[0].scale).
                    to({ x: 1.2, y: 1.2, z: 1.2 }, length/2).
                    easing(TWEEN.Easing.Sinusoidal.In)
                    .start();

    var tween2 = new TWEEN.Tween(CUBE2048.removal_queue[0].scale).
                    to({ x: 1.0, y: 1.0, z: 1.0 }, length).
                    easing(TWEEN.Easing.Sinusoidal.In)
                    .onComplete(function () {
                        var removal = CUBE2048.removal_queue.shift();
                        cube_group.remove(removal);
                        delete removal;
                    });

    tween.chain(tween2);

};

var counter = 0;
GAME.prototype.sift_cube = function ( i, j, k, direction ) {

    var start_index = this.coord_to_index(i, j, k)

    this.fill_coord( start_index, this.coord);

    if (this.cube_array[start_index] == 0)
        return;

    var i2 = i + direction.x;
    var j2 = j + direction.y;
    var k2 = k + direction.z;
    var last_index = this.coord_to_index(i2, j2, k2);

    while( this.is_in_bound( i2, j2, k2) && (this.cube_array[last_index] == 0) )
    {
        i2 += direction.x;
        j2 += direction.y;
        k2 += direction.z;

        last_index = this.coord_to_index(i2, j2, k2);
    }    

    // Either we are out of bound or we are filled..

    if( this.is_in_bound( i2, j2, k2) )
    {
        // We found an existing cube. Is it the same texture?

        if (this.cube_array[start_index].material.map == this.cube_array[last_index].material.map ) 
        {
            this.merge_cubes(last_index);
            var next_text = next_map(this.cube_array[start_index].material.map);
            console.log("Merging " + start_index + " with " + last_index + " New texture : " + next_text);

            this.cube_array[start_index].material.map = textures[next_text];
            
            if (this.do_texture_events(start_index, last_index, i2, j2, k2))
                return;
        }
        else{
            // Move to the next free block.
            i2 -= direction.x;
            j2 -= direction.y;
            k2 -= direction.z;
        }
    }
    else{
        // Move to the next free block.
        i2 -= direction.x;
        j2 -= direction.y;
        k2 -= direction.z;
    }

    start_index = this.coord_to_index( i, j, k);
    last_index = this.coord_to_index( i2, j2, k2);

    if (start_index == last_index)
        return;

    var start_coord = new createcoord();
    var last_coord = new createcoord();

    this.fill_coord(start_index, start_coord);
    this.fill_coord(last_index, last_coord);

    this.cube_array[start_index].animation = {
                "name": ("Cube_down" + (++counter)),
                "length": 0.2,
                "hierarchy": [
                    {
                        "parent": -1,
                        "keys": [
                            {
                                "time": 0,
                                "pos": [start_coord.x, start_coord.y, start_coord.z],
                                "rot": [0, 0, 0],
                                "scl": [1, 1, 1]
                            },
                            {
                                "time": 0.2,
                                "pos": [last_coord.x, last_coord.y, last_coord.z]
                            }
                        ]
                    }
                ]
            };

            THREE.AnimationHandler.add(this.cube_array[start_index].animation);

            var cube_anim = new THREE.Animation(this.cube_array[start_index], this.cube_array[start_index].animation.name);
            cube_anim.loop = false;
            cube_anim.interpolationType = THREE.AnimationHandler.LINEAR;
            cube_anim.play();

            this.cube_array[last_index] = this.cube_array[start_index];
            this.cube_array[start_index] = 0;
};

GAME.prototype.shift_cubes = function () {
    var order = {};
    if (this.gravity.direction.x != 0) {
        var start = this.gravity.direction.x > 0 ? this.game_size-1 : 0;
        var end = this.gravity.direction.x > 0 ? -1 : this.game_size;

        start -= this.gravity.direction.x;

        for (var i = start; i != end ; i -= this.gravity.direction.x) {
            for (var j = 0 ; j < this.game_size; j++) {
                for (var k = 0; k < this.game_size; k++) {
                   this.sift_cube(i, j, k, this.gravity.direction );
                }
            }
        }
    }

    else if (this.gravity.direction.y != 0)
    {
        var start = this.gravity.direction.y > 0 ? this.game_size-1 : 0;
        var end = this.gravity.direction.y > 0 ? -1 : this.game_size;
        start -= this.gravity.direction.y;

        for (var j = start; j != end ; j -= this.gravity.direction.y) {
            for (var i = 0 ; i < this.game_size; i++) {
                for (var k = 0; k < this.game_size; k++) {
                    this.sift_cube(i, j, k, this.gravity.direction );
                }
            }
        }

    }

    else if (this.gravity.direction.z != 0) {
        var start = this.gravity.direction.z > 0 ? this.game_size-1 : 0;
        var end = this.gravity.direction.z > 0 ? -1 : this.game_size;
        start -= this.gravity.direction.z;
        for (var k = start; k != end ; k -= this.gravity.direction.z) {
            for (var i = 0 ; i < this.game_size; i++) {
                for (var j = 0; j < this.game_size; j++) {
                    this.sift_cube(i, j, k, this.gravity.direction );
                }
            }
        }
    }  
};
