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
    return (this.rotate_x || this.rotate_y || this.rotate_z || CUBE2048.showing_view );
};

rot_animation.prototype.get_offset = function () {
    return this.angle / this.animation_duration;
};

var rotation_animation = new rot_animation(Math.PI / 2);

// Utility Functions.

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix); // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}