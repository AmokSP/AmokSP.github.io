var MAX_PARTICLES = 280;
var COLOURS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];


Particle.pool = [];

function Particle(x, y, radius,color,sideNum=0) {
    this.init(x, y, radius,color,sideNum);
}

Particle.prototype = {

    init: function (x, y, radius,color,sideNum=0) {

        this.alive = true;

        this.radius = radius || 10;
        this.wander = 0.15;
        this.theta = random(Math.PI*2);
        this.drag = random(0.90,0.95);
        this.color = color;
        this.sideNum = sideNum;

        this.x = x || 0.0;
        this.y = y || 0.0;

        this.vx = 0.0;
        this.vy = 0.0;
    },

    move: function () {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.drag;
        this.vy *= this.drag;

        //this.theta += random(-0.5, 0.5) * this.wander;
        //this.vx += Math.sin(this.theta) * 0.1;
        //this.vy += Math.cos(this.theta) * 0.1;

        this.radius *= this.drag;
        this.alive = this.radius > 0.5;
    },

    draw: function (ctx) {
        var ang = 0;
        ctx.beginPath();
        if (this.sideNum <=2) {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        } else {
            rad = Math.PI*2/this.sideNum;
            ctx.moveTo(this.x+Math.cos(this.theta)*this.radius,this.y+Math.sin(this.theta)*this.radius);
            for (var i=1;i<this.sideNum;i++) {
                ctx.lineTo(this.x+Math.cos(rad*i + this.theta)*this.radius,this.y+Math.sin(rad*i+this.theta)*this.radius);
            }
            ctx.lineTo(this.x+Math.cos(this.theta)*this.radius,this.y+Math.sin(this.theta)*this.radius);
        }
        ctx.fillStyle = this.color;
        ctx.fill();
    },
    dipose:function() {
        if (Particle.pool.indexOf(this)!=-1) {
            
        }
    }
};
Particle.spawnParticles = function (x, y, num,color,sideNum = 0) {


    var p, theta, force;
    for (var i = 0; i < num; i++) {
        p = new Particle();
        p.init(x, y, random(20, 40),color,sideNum);

        p.wander = 0;
        //p.color = random(COLOURS);

        //theta = random(Math.PI*2);
        theta = random(Math.PI*2);
        force = random(2, 8);

        p.vx = Math.sin(theta) * force;
        p.vy = Math.cos(theta) * force;

        Particle.pool.push(p);
    }
}