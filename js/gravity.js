function threeD_vector() {
    this.direction = new THREE.Vector3(0, -1, 0);
};

threeD_vector.prototype.rotate = function (angle, axis) {
    var matrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
    this.direction.applyMatrix4(matrix);

    $("#i").text(this.direction.x);
    $("#j").text(this.direction.y);
    $("#k").text(this.direction.z);

};