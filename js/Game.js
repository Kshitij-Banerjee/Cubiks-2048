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

GAME.prototype.add_random_cube = function () {

    // No more to add..
    if (this.filled_cubes == this.cube_count) {
        release();
        return;
    }

    var rand = this.create_random_number(this.cube_count);

    while (this.cube_array[rand] != 0) {
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
};

function next_map(map) {
    var underscore_idx = map.sourceFile.indexOf("_");
    var dot_idx = map.sourceFile.lastIndexOf(".");
    var index = map.sourceFile.substring(++underscore_idx, dot_idx);
    index = parseInt(index);
    return index + index;
};

GAME.prototype.shift_cubes = function () {

    for (var i = 0 ; i < this.cube_count; i++) {

        if (i > 8 && (this.cube_array[i] != 0)) {
            var j = i - 9;
            while ((j >= 0) && (this.cube_array[j] == 0))
                j -= 9;

            // Either j is empty, out of bound, or did not move at all
            if (j >= 0 && this.cube_array[j] &&
                (this.cube_array[i].material.map ==
                 this.cube_array[j].material.map)) {
                cube_group.remove(this.cube_array[j]);
                this.cube_array[j] = 0;
                this.filled_cubes--;

                var next_texture = textures[next_map(this.cube_array[i].material.map)];
                this.cube_array[i].material.map = next_texture;
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
                                "scl": [1, 1, 1]
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
            cube_anim.interpolationType = THREE.AnimationHandler.LINEAR;
            cube_anim.play(false, 0);

            this.cube_array[j] = this.cube_array[i];
            this.cube_array[i] = 0;
        }
    }
};
