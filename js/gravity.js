function threeD_vector() {
    this.direction = new THREE.Vector3(0, 0, -1);
};

threeD_vector.prototype.rotate = function (angle, axis) {
    var matrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
    this.direction.applyMatrix4(matrix);
};