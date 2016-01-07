var Entity = (function () {
    function Entity() {
    }
    Entity.prototype.getGrix = function () {
        return this.grix;
    };
    Entity.prototype.getX = function () {
        return this.x;
    };
    Entity.prototype.getY = function () {
        return this.y;
    };
    Entity.prototype.update = function () {
    };
    Entity.prototype.render = function () {
        this.grix.moveTo(this.x, this.y);
        this.grix.render();
    };
    return Entity;
})();
var Camera = (function () {
    function Camera(x, y) {
        this.x = 0;
        this.y = 0;
        if (typeof x == 'number')
            this.setView(x, y);
        else if (x)
            this.bindTo(x);
    }
    Camera.prototype.setView = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Camera.prototype.getX = function () {
        return this.x;
    };
    Camera.prototype.getY = function () {
        return this.y;
    };
    Camera.prototype.setX = function (x) {
        this.x = x;
    };
    Camera.prototype.setY = function (y) {
        this.y = y;
    };
    Camera.prototype.getViewMatrix = function () {
        return Matrix4.translate(-this.x, -this.y);
    };
    Camera.prototype.applyViewMatrixTo = function (shader) {
        shader.getMatHandler().setViewMatrix(this.getViewMatrix());
    };
    Camera.prototype.update = function () {
        this.x = this.entity.getX();
        this.y = this.entity.getY();
        if (this.entity != null)
            this.applyViewMatrixTo(this.entity.getGrix().getShader());
    };
    Camera.prototype.bindTo = function (entity) {
        this.entity = entity;
    };
    return Camera;
})();
//# sourceMappingURL=world.js.map