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
    this.premerges = [];
    this.five_one_two_anims = {};
	
	this.add_random_cube( 2 );
	this.shift_cubes();

	this.showing_view = false;
};

GAME.prototype.create_random_number = function (limit) {
    return Math.floor(Math.random() * 100) % limit;
};

GAME.prototype.index_to_ijk = function ( rand )
{
    coord = new createcoord();
    coord.z = Math.floor(rand / (this.game_size * this.game_size)); //  z level
    rand = rand % (this.game_size * this.game_size); // remaining in level

    coord.y = Math.floor(rand / this.game_size);
    coord.x = rand % this.game_size;
    return coord;
};

GAME.prototype.get_coord = function (rand, coord) {
    var coord = this.index_to_ijk(rand);
    coord.x = Math.floor(coord.x - Math.floor(this.game_size / 2));
    coord.y = Math.floor(coord.y - Math.floor(this.game_size / 2));
    coord.z = Math.floor(coord.z - Math.floor(this.game_size / 2));

    coord.x *= (100 / this.game_size);
    coord.y *= (100/ this.game_size);
    coord.z *= (100 / this.game_size);

    return coord;
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
    {
        while (this.premerges.length)
            this.premerges.pop();

        return;
    }
        
    if( this.filled_cubes == this.cube_count )
        return;

    var rand = this.create_random_number(this.cube_count);

    while (this.cube_array[rand] != 0 ) {
        rand++;
        if (rand == this.cube_count)
            rand = 0;
    }

    this.coord = this.get_coord( rand );
    
    var cube = create_inner_cube(33);
    cube.position.set(this.coord.x, this.coord.y, this.coord.z);
    cube.scale = { x: 0.0, y: 0.0, z: 0.0 };
    var scaling = 1.0;
    new TWEEN.Tween(cube.scale).to({ x: scaling, y: scaling, z: scaling }, 300).delay(400).start();
    new TWEEN.Tween(cube.material).to({ opacity:1.0},300).delay(400).start();
    cube_group.add(cube);
    this.cube_array[rand] = cube;

    this.filled_cubes++;
    var ijk = this.index_to_ijk(rand);
    this.sift_cube( ijk.x, ijk.y, ijk.z, this.gravity.direction );
    this.add_random_cube(--count);
};

function get_map_id( map )
{
    var underscore_idx = map.sourceFile.indexOf("_");
    var dot_idx = map.sourceFile.lastIndexOf(".");
    var index = map.sourceFile.substring(++underscore_idx, dot_idx);
    return parseInt(index);
}

function next_map(map) {
    var index = get_map_id( map );
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

GAME.prototype.get_512_and_above_count = function () {
    var count = 0;

    for (var i = 0; i < this.cube_count; i++) {
        if( this.cube_array[i] != 0 )
            if (get_map_id(this.cube_array[i].material.map) >= 512)
                count++;
    }

    return count;
};

GAME.prototype.do_texture_events = function (index, index2, i2, j2, k2) {
    var next_texture = this.cube_array[index].material.map;
    
    // Win!
    if (next_texture == textures[2048]) {
        TWEEN.removeAll();
        this.view_sides( true );            
        return true;
    }
    // Almost there!
    else if (next_texture == textures[512]) {

        var go = new TWEEN.Tween(this.cube_array[index].scale)
                        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
                        .easing(TWEEN.Easing.Sinusoidal.In)
                        .start();

        var back = new TWEEN.Tween(this.cube_array[index].scale)
                        .to({ x: 1.0, y: 1.0, z: 1.0 }, 500)
                        .easing(TWEEN.Easing.Sinusoidal.In);

        go.chain(back);
        back.chain(go);

        // Record these for future..

        this.five_one_two_anims[ this.cube_array[index].uuid ] = go;
    }

    return false;
};

GAME.prototype.merge_cubes = function(last_index)
{
    // Remove from 512 array as well

    if (this.five_one_two_anims[this.cube_array[last_index].uuid ] != undefined) {
        this.five_one_two_anims[this.cube_array[last_index].uuid].stop();
    }

    // Cube to be removed expands a little.
    this.removal_queue.push(this.cube_array[last_index]);
    this.cube_array[last_index].transparent = false;
    this.cube_array[last_index] = 0;
    this.filled_cubes--;


    var length = 200;
    var tween = new TWEEN.Tween(this.removal_queue[0].scale).
                    to({ x: 1.3, y: 1.3, z: 1.3 }, length).
                    easing(TWEEN.Easing.Sinusoidal.In)
                    .start();

    var tween2 = new TWEEN.Tween(this.removal_queue[0].scale).
                    to({ x: 1.0, y: 1.0, z: 1.0 }, length/2).
                    easing(TWEEN.Easing.Sinusoidal.In)
                    .onComplete(function () {                       

                        // Remove from removal queue of settles..

                        var removal = CUBE2048.removal_queue.shift();
                        cube_group.remove(removal);
                        delete removal;                        
                    });

    tween.chain(tween2);
};

GAME.prototype.is_premerged = function ( cube ) {

    for (var i = 0; i < this.premerges.length ; i++) {
        if (this.premerges[i] == cube)
            return true;
    }

    return false;
};


var counter = 0;
GAME.prototype.sift_cube = function ( i, j, k, direction ) {

    var start_index = this.coord_to_index(i, j, k)

    this.coord = this.get_coord( start_index );

    // No cube at this location.
    if (this.cube_array[start_index] == 0)
        return false;

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
        // If this was from a previous merge.skip..

        if (    !this.is_premerged(this.cube_array[last_index])
            && (this.cube_array[start_index] != 0)
            && (this.cube_array[last_index] != 0)
            && (this.cube_array[start_index].material.map == this.cube_array[last_index].material.map))
        {
            this.merge_cubes( last_index );
            var next_text = next_map( this.cube_array[start_index].material.map );
            //console.log("Merging " + start_index + " with " + last_index + " New texture : " + next_text);

            this.cube_array[start_index].material.map = textures[next_text];

            // Dont merge on this again.
            this.premerges.push(this.cube_array[start_index]);

            if ( this.do_texture_events(start_index, last_index, i2, j2, k2) )
                return true;
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

    start_index = this.coord_to_index( i, j, k );
    last_index = this.coord_to_index( i2, j2, k2 );
        

    if (start_index == last_index)
        return false;

    var start_coord = new createcoord();
    var last_coord = new createcoord();

    var start_coord = this.get_coord( start_index );
    var last_coord = this.get_coord( last_index );

    //console.log("Final coord : \t" + last_coord.x + "\t " + last_coord.y+ "\t " + last_coord.z);

    this.settled = false;
    new TWEEN.Tween(this.cube_array[start_index].position)
        .to({ x: last_coord.x, y: last_coord.y, z: last_coord.z }, 600)
        .easing(TWEEN.Easing.Bounce.Out)
        .onComplete( function (){ CUBE2048.settled = true;} )
        .start();

    this.cube_array[last_index] = this.cube_array[start_index];
    this.cube_array[start_index] = 0;

    return true;
};

GAME.prototype.shift_cubes = function () {
    var shifted = false;
    if (this.gravity.direction.x != 0) {
        var start = this.gravity.direction.x > 0 ? this.game_size-1 : 0;
        var end = this.gravity.direction.x > 0 ? -1 : this.game_size;

        start -= this.gravity.direction.x;

        for (var i = start; i != end ; i -= this.gravity.direction.x) {
            for (var j = 0 ; j < this.game_size; j++) {
                for (var k = 0; k < this.game_size; k++) {
                    shifted |= this.sift_cube(i, j, k, this.gravity.direction);                   
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
                    shifted |= this.sift_cube(i, j, k, this.gravity.direction);
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
                    shifted |= this.sift_cube(i, j, k, this.gravity.direction);
                }
            }
        }
    }
    
    return shifted;
};

GAME.prototype.translate = function (i, j, k, direction) {
    var start_index = this.coord_to_index(i, j, k);
    var coord =  this.get_coord(start_index, coord);
    if (this.cube_array[start_index] != 0) {
        new TWEEN.Tween(this.cube_array[start_index].position)
        .to({
            x: coord.x + (121 * direction.x),
            y: coord.y + (121 * direction.y),
            z: coord.z + (121 * direction.z)
        }, 100)
        .start();
    }
};

GAME.prototype.view_sides = function ( is_win ) {

    if (TWEEN.getAll().length > this.get_512_and_above_count())
        return;

    if (this.showing_view)
        return;

    var right = this.gravity.right();
    var left = new THREE.Vector3(0, 0, 0);
    left.copy( right );
    left.negate();

    var dirs = [];
    dirs.push( left );
    dirs.push( new THREE.Vector3(0, 0, 0) );
    dirs.push( right );

    if (this.gravity.direction.x != 0) {
        var start = this.gravity.direction.x > 0 ? this.game_size - 1 : 0;
        var end = this.gravity.direction.x > 0 ? -1 : this.game_size;

        for (var i = start; i != end ; i -= this.gravity.direction.x) {
            for (var j = 0 ; j < this.game_size; j++) {
                for (var k = 0; k < this.game_size; k++) {
                    this.translate(i, j, k,  dirs[i]);
                }
            }
        }
    }

    else if (this.gravity.direction.y != 0) {
        var start = this.gravity.direction.y > 0 ? this.game_size - 1 : 0;
        var end = this.gravity.direction.y > 0 ? -1 : this.game_size;
        for (var j = start; j != end ; j -= this.gravity.direction.y) {
            for (var i = 0 ; i < this.game_size; i++) {
                for (var k = 0; k < this.game_size; k++) {
                    this.translate(i, j, k, dirs[j]);
                }
            }
        }

    }

    else if (this.gravity.direction.z != 0) {
        var start = this.gravity.direction.z > 0 ? this.game_size - 1 : 0;
        var end = this.gravity.direction.z > 0 ? -1 : this.game_size;
        for (var k = start; k != end ; k -= this.gravity.direction.z) {
            for (var i = 0 ; i < this.game_size; i++) {
                for (var j = 0; j < this.game_size; j++) {
                    this.translate(i, j, k, dirs[k]);
                }
            }
        }
    }

    if (is_win) {
        new TWEEN.Tween(camera.position)
        .to({
            x: camera.position.x,
            y: camera.position.y + 100,
            z: camera.position.z
        }, 150)
        .onUpdate(function () {
            camera.lookAt(new THREE.Vector3(50, 50, 0));
        })
        .delay( 2000 )
        .onComplete(function () {
            renderer.render(scene, camera);
            alert(" Did you just win? !!");
            release('Yes you did! You won! Yay!! :) ');
        })
        .start();
    }
    else {
        new TWEEN.Tween(camera.position)
        .to({
            x: camera.position.x,
            y: camera.position.y + 100,
            z: camera.position.z
        }, 150)
        .onUpdate(function () {
            camera.lookAt(new THREE.Vector3(50, 50, 0));
        })       
        .start();
    }
    

    this.showing_view = true;
};

GAME.prototype.reset_positions = function()
{

    if (!this.showing_view)
        return;

    for( var i = 0 ; i < this.cube_count ; i ++ )
    {
        if (this.cube_array[i] != 0) {
            var coord = this.get_coord( i );
            new TWEEN.Tween(this.cube_array[i].position)
            .to({ x: coord.x, y: coord.y, z: coord.z }, 100)
            .start();
        }
    }

    new TWEEN.Tween(camera.position)
       .to({
           x: 50,
           y: dist/5,
           z: dist/6
       },100)
       .onUpdate(function () {
           camera.lookAt(new THREE.Vector3(50, 50, 0));
       })
       .start();

    this.showing_view = false;

}
    
