console.log(window.devicePixelRatio);
var CAT_WALL = Math.pow(2, 0);
var CAT_BALL = Math.pow(2, 1);
var CAT_BRICK = Math.pow(2, 2);

var rigWidth = 640;
var rigHeight = 900;

var indicator = {
    visible: false,
    ox: 0,
    oy: 0,
    tx: 0,
    ty: 0,
    delta: 30,
    steps: 10,
    focus: 0,
}

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Vector = Matter.Vector;

var engine = Engine.create({
    positionIterations: 10,
    velocityIterations: 10,
    enabled : true,
    }),
    world = engine.world,
    runner = Runner.create({
        fps: 30,
        isFixed: true,
    });

var render = Render.create({
    engine: engine,
    canvas: document.getElementById("gameContainer"),
    options: {
        wireframes: false,
        showAngleIndicator: false,
        retina: "auto",
        background: "#333",
        width: rigWidth,
        height: rigHeight,
        showAxis: false,
        showDebug: false,
    }
});

var canvas = document.getElementById("gameContainer");
var ctx = document.getElementById("gameContainer").getContext("2d");


Render.run(render);


world.gravity = { x: 0, y: 0.001 };

Events.on(render, "afterRender", function () {
    drawBricks();
    drawParticles();
    drawIndicator();

});
function drawBricks() {
    var i, brick
    for (i = 0; i < Brick.pool.length; i++) {
        brick = Brick.pool[i];
        brick.draw(ctx);
    }
}


function drawParticles() {
    if (Particle.pool.length == 0) {
        return;
    }
    var i, particle;
    for (i = Particle.pool.length - 1; i >= 0; i--) {

        particle = Particle.pool[i];

        particle.move();
        if (particle.alive) {

            ctx.globalCompositeOperation = 'lighter';

            Particle.pool[i].draw(ctx);
        } else {
            Particle.pool.splice(Particle.pool.indexOf(particle), 1);
            i--
            continue;
        }
    }

}
function drawIndicator() {
    if (indicator.visible) {
        var rad = Math.atan2(indicator.ty - indicator.oy, indicator.tx - indicator.ox);
        var startX = indicator.ox + Math.cos(rad) * 30;
        var startY = indicator.oy + Math.sin(rad) * 30
        var endX = indicator.ox + Math.cos(rad) * indicator.delta * (indicator.steps + 2);
        var endY = indicator.oy + Math.sin(rad) * indicator.delta * (indicator.steps + 2);

        for (var i = 0; i < indicator.steps; i++) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            if (i == indicator.focus) {
                ctx.fillStyle = "#fff";
                ctx.shadowColor = "#fff";
                ctx.shadowBlur = 7;
                ctx.arc(startX + Math.cos(rad) * i * indicator.delta, startY + Math.sin(rad) * i * indicator.delta, 7, 0, Math.PI * 2);
            } else {
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.shadowBlur = 5;
                ctx.arc(startX + Math.cos(rad) * i * indicator.delta, startY + Math.sin(rad) * i * indicator.delta, 5, 0, Math.PI * 2);
                ctx.shadowColor = "rgba(255,255,255,0.5)";
            }
            ctx.fill();

        }
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + Math.cos(rad - Math.PI + Math.PI / 12) * 40, endY + Math.sin(rad - Math.PI + Math.PI / 12) * 40);
        ctx.lineTo(endX + Math.cos(rad - Math.PI - Math.PI / 12) * 40, endY + Math.sin(rad - Math.PI - Math.PI / 12) * 40);
        ctx.lineTo(endX, endY);

        indicator.focus += 0.5;
        if (indicator.focus >= indicator.steps) {
            indicator.focus = 0;
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#fff";
        } else {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.shadowColor = "rgba(255,255,255,0.5)";
        }
        ctx.shadowBlur = 10;
        //ctx.fill();
        ctx.shadowBlur = 0;

    }
}





function getLocation(x, y) {
    var bbox = canvas.getBoundingClientRect();
    var scale = (canvas.height / bbox.height)
    return {
        x: (x) * scale,
        y: (y - $("#gameContainer").offset().top) * scale

        /*  
         * 此处不用下面两行是为了防止使用CSS和JS改变了canvas的高宽之后是表面积拉大而实际  
         * 显示像素不变而造成的坐标获取不准的情况  
        x: (x - bbox.left),  
        y: (y - bbox.top)  
        */
    };
}



function random(min, max) {

    if (isArray(min))

        return min[~~(Math.random() * min.length)];

    if (!isNumber(max))

        max = min || 1, min = 0;

    return min + Math.random() * (max - min);
}
function isArray(object) {

    return Object.prototype.toString.call(object) == '[object Array]';
}

function isFunction(object) {

    return typeof object == 'function';
}

function isNumber(object) {

    return typeof object == 'number';
}

function isString(object) {

    return typeof object == 'string';
}
