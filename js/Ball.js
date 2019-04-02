
function Ball(x, y) {
    this.body = Bodies.circle(x, y, Ball.RADIUS);
    this.body.friction = 1;
    this.body.frictionAir = 0;
    this.body.frictionStatic = 0;
    this.body.restitution = 0;
    this.body.label = "ball";

    this.body.collisionFilter.category = CAT_BALL;
    this.body.collisionFilter.mask = CAT_WALL | CAT_BRICK;
    this.body.render.fillStyle = "#fff";
    this.body.render.strokeStyle = "#fff";

    this.body.skin = this;
    this.sleep = false;
    this._size = 1;
    World.addBody(world, this.body);
    this.needsBoost = false;
    Ball.pool.push(this);
}
Ball.RADIUS= 12;
Ball.pool = [];
Ball.speed = 20;

Ball.boostThreshold=5;

Ball.prototype = {
    set size(t) {
        if (this._size!=t) {
            switch (t) {
                case 1:
                    Body.scale(this.body,1/1.5,1/1.5);
                break;
                case 2:
                    Body.scale(this.body,1.5,1.5);
                break;
            }
            this._size = t;
        }
    },
    get size() {
        return this._size;
    },

    setSize: function () {

    },
    dispose: function () {
        World.remove(world, this.body);
        Ball.pool.splice(Brick.pool.indexOf(this), 1);

    },
    collisionStart: function () {

    },
    collisionEnd: function () {
    }

}