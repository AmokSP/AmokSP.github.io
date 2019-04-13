function Brick(x, y, sideNum, radius) {
    switch (sideNum) {
        case 0:
        case 1:
        case 2:
            this.body = Bodies.circle(x, y, radius);
            break;
        case 3:
        case 4:
        case 5:
            this.body = Bodies.polygon(x, y, sideNum, radius * (1 + 1 / sideNum));
            break;
    }

    this.body.isStatic = true;
    this.body.friction = 0;
    this.body.frictionAir = 0;
    this.body.frictionStatic = 0;
    this.body.restitution = 1;
    this.body.slop = 0;
    this.body.label = "brick";
    this.body.skin = this;

    this.sideNum = sideNum;
    this._life = 30;
    this._type = Brick.NORMAL;
    this.body.render.strokeStyle = "rgba(0,0,0,0)";
    this.setColorBylife();

    this.body.collisionFilter.category = CAT_BRICK;
    this.body.collisionFilter.mask = CAT_BALL;
    this.frame = 0;

    Body.rotate(this.body, Math.random());
    World.addBody(world, this.body);
    Brick.pool.push(this);
}
Brick.EXTRA_BALL = "extraBall";
Brick.SPEED_BOOST = "speedBoost";
Brick.DOUBLE_SIZE = "doubleSize";
Brick.NORMAL = "normal";

Brick.TYPES = [Brick.EXTRA_BALL, Brick.EXTRA_BALL, Brick.EXTRA_BALL, Brick.EXTRA_BALL, Brick.DOUBLE_SIZE, Brick.DOUBLE_SIZE, Brick.DOUBLE_SIZE];


Brick.pool = [];
Brick.TEXT_COLOR = "#000";
Brick.FONT = "25px Arial";
Brick.prototype = {
    set life(t) {
        this._life = t;
        this.setColorBylife();

    },
    get life() {
        return this._life;
    },
    set positionX(t) {
        Body.setPosition(this.body, { x: t, y: this.body.position.y });
    },
    get positionX() {
        return this.body.position.x;
    },
    set positionY(t) {
        Body.setPosition(this.body, { x: this.body.position.x, y: t });
    },
    get positionY() {
        return this.body.position.y;
    },
    set type(t) {
        this._type = t;
        this.body.isSensor = true;
        this.life = 1;
        this.body.render.visible = false;
        switch (t) {
            case "EXTRA_BALL":
                break;
            case "DOUBLE_SIZE":
                break;
            case "SPEED_BOOST":
                break;
        }
    },
    get type() {
        return this._type
    },

    shake: function () {
        var tmpX = this.body.position.x;
        var tmpY = this.body.position.y;
        var count = 20;
        var rad = 0;
        var loop = setInterval(() => {
            rad = Math.random() * Math.PI * 2;
            count--;
            Body.setPosition(this.body, { x: tmpX + Math.cos(rad) * count, y: tmpY + Math.sin(rad) * count });
            if (count == 0) {
                clearInterval(loop);
            }
        }, 17);
    },
    draw: function (ctx) {
        var breath = Math.sin(this.frame * 10 * Math.PI / 180) * 2;
        switch (this._type) {
            case Brick.EXTRA_BALL:
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#0f0";
                ctx.arc(this.body.position.x, this.body.position.y, 21 + breath, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.fillStyle = "#fff";
                ctx.arc(this.body.position.x, this.body.position.y, 10, 0, Math.PI * 2);
                ctx.fill();
                break;
            case Brick.SPEED_BOOST:
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#0ff";
                ctx.arc(this.body.position.x, this.body.position.y, 21 + breath, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#fff";
                ctx.moveTo(this.body.position.x - 8, this.positionY - 8);
                ctx.lineTo(this.body.position.x, this.positionY);
                ctx.lineTo(this.body.position.x - 8, this.positionY + 8);
                ctx.moveTo(this.body.position.x, this.positionY - 8);
                ctx.lineTo(this.body.position.x + 8, this.positionY);
                ctx.lineTo(this.body.position.x, this.positionY + 8);
                ctx.stroke();
                break;
            case Brick.DOUBLE_SIZE:
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#f0f";
                ctx.arc(this.body.position.x, this.body.position.y, 21 + breath, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.lineWidth = 6;
                ctx.strokeStyle = "#fff";
                ctx.moveTo(this.body.position.x, this.positionY - 10);
                ctx.lineTo(this.body.position.x, this.positionY + 10);
                ctx.moveTo(this.body.position.x - 10, this.positionY);
                ctx.lineTo(this.body.position.x + 10, this.positionY);
                ctx.stroke();
                break;
            case Brick.NORMAL:
                ctx.fillStyle = Brick.TEXT_COLOR;
                ctx.font = Brick.FONT;
                ctx.fillText(this._life, this.body.position.x - ctx.measureText(this._life.toString()).width * 0.5, this.body.position.y + 8);
                break;
        }
        this.frame++;
    },
    dispose: function () {
        var color;
        switch (this.type) {
            case Brick.NORMAL:
                color = getColorByNum(this._life);
                break;
            case Brick.SPEED_BOOST:
                color = "#3cc";
                break;
            case Brick.DOUBLE_SIZE:
                color = "#c3c";
                break;
            case Brick.EXTRA_BALL:
                color = "#3c3";
                break;
        }
        Particle.spawnParticles(this.body.position.x, this.body.position.y, 15, color, this.sideNum);
        World.remove(world, this.body);
        Brick.pool.splice(Brick.pool.indexOf(this), 1);
    },
    collisionStart: function (damage = 1) {
        this._life -= damage;
        this.setColorBylife();
    },
    collisionEnd: function () {
    },
    setColorBylife: function () {
        this.body.render.fillStyle = getColorByNum(this._life);
    },
}

function getColorByNum(t) {
    return "HSL(" + Math.min(360, 30 + t * 6) + ",100%,50%)";
}