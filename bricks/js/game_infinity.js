
var maxVerticalBrick = 6;
var brickRadius = ((rigWidth - 40) / (maxVerticalBrick)) / 2;
var shapes = [2, 3, 4, 5];


var verticalPositions = [];
var touchable = false;
var wallThickness = 200;
var level = 0;
var totalBallNum = 0;
var userscore = 0;

var ballsToFire = [];
var firedBalls = [];


function initGameRig() {
    var top = Bodies.rectangle(rigWidth * 0.5, 0 - wallThickness * 0.5, rigWidth + wallThickness * 2, wallThickness, { isStatic: true });
    var left = Bodies.rectangle(0 - wallThickness * 0.5, rigHeight * 0.5, wallThickness, rigHeight+ wallThickness * 2, { isStatic: true });
    var right = Bodies.rectangle(640 + wallThickness * 0.5, rigHeight * 0.5, wallThickness, rigHeight+ wallThickness * 2, { isStatic: true });
    var bottom = Bodies.rectangle(rigWidth * 0.5, rigHeight + wallThickness * 0.5, rigWidth + wallThickness * 2, wallThickness, { isStatic: true });

    bottom.label = "bottom";

    top.friction = left.friction = right.friction = bottom.friction = 0;
    top.slop = left.slop = right.slop = bottom.slop = 0;
    top.frictionStatic = left.frictionStatic = right.frictionStatic = 0;
    left.restitution = right.restitution = 1;

    top.restitution = 1;
    bottom.restitution = 0;

    top.render.visible = left.render.visible = right.render.visible = bottom.render.visible = false;

    top.collisionFilter.category = left.collisionFilter.category = right.collisionFilter.category = bottom.collisionFilter.category = CAT_WALL;
    top.collisionFilter.mask = left.collisionFilter.mask = right.collisionFilter.mask = bottom.collisionFilter.mask = CAT_BALL;


    //bottom.render.visible = false;

    World.addBody(world, top);
    World.addBody(world, left);
    World.addBody(world, right);
    World.addBody(world, bottom);
}


initGameRig();





$(function () {
    generateBricks();
    setTimeout(() => {
        moveDownBricks();
        generateBricks();
    }, 1000);
    setTimeout(() => {
        startListening();
        addBall(320, rigHeight - Ball.RADIUS * 0.5);
    }, 2000);




    document.body.addEventListener("touchstart", function (e) {
        e.preventDefault();
        var location = getLocation(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

        if (!touchable) {
            return;
        }
        indicator.visible = true;
        indicator.ox = firedBalls[0].body.position.x;
        indicator.oy = firedBalls[0].body.position.y;
        indicator.tx = location.x;
        indicator.ty = location.y;

    });
    document.querySelector('body').addEventListener("touchmove", function (e) {
        e.preventDefault();

        var location = getLocation(e.touches[0].clientX, e.touches[0].clientY);

        if (!touchable) {
            return;
        }

        if(firedBalls.length!=0) {
            indicator.visible = true;
            indicator.ox = firedBalls[0].body.position.x;
            indicator.oy = firedBalls[0].body.position.y;
            indicator.tx = location.x;
            indicator.ty = location.y;
        }

    });
    document.body.addEventListener("touchend", function (e) {
        console.log(touchable);
        if (!touchable) {
            return;
        }


        indicator.visible = false;
        touchable = false;

        var ballOx = Ball.pool[0].body.position.x;
        var ballOy = Ball.pool[0].body.position.y;

        var location = getLocation(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        var rad = Math.atan2(location.y - ballOy, location.x - ballOx)
        var vx = Math.cos(rad);
        var vy = Math.sin(rad);


        if (firedBalls.length == totalBallNum) {
            while (firedBalls.length != 0) {
                ballsToFire.push(firedBalls.shift());
            }
            console.log("start firing " + ballsToFire.length + " balls");
            fireBall(ballOx, ballOy, vx, vy);
        }

    });
})
function addBall(x, y,velocity={x:0,y:0}) {
    totalBallNum++;
    var b = new Ball(x, y);
    Body.setVelocity(b.body,velocity);

}
function moveDownBricks() {
    
    var progress = 0;
    var lowest = [];
    for (var i = 0; i < Brick.pool.length; i++) {
        TweenLite.to(Brick.pool[i], 1, { positionY: Brick.pool[i].positionY + brickRadius * 2,ease:Linear.easeIn});
        if (Brick.pool[i].positionY + brickRadius * 2 >= progress) {
            progress = Brick.pool[i].positionY + brickRadius * 2;
            lowest.push(Brick.pool[i]);
        }
    }
    setTimeout(() => {
        touchable = true;
        if (progress >= brickRadius * 16 - 5) {
            
            while (lowest.length != 0) {
                lowest.shift().dispose();
            }
        } else if (progress >= brickRadius * 14 - 5) {
            while (lowest.length != 0) {
                lowest.shift().shake()
            }
        }
    }, 1000);
    
}
function generateBricks() {
    level++;
    var totalScore = Math.ceil(Math.random() * (totalBallNum ) + level/2);

    var tPosX = brickRadius;
    var brickNum = (Math.round(Math.random() * Math.min(totalScore, 6)));
    if (brickNum == 0) {
        brickNum = 1;
    }
    console.log("generating " + brickNum + " bricks; totalScore: " + totalScore);
    var offset;
    var scoreHolders = [];
    var hasSpecial = false;
    for (var i = 0; i < brickNum; i++) {
        offset = (i + 1 - 1) * (rigWidth) / brickNum;
        tPosX = offset + brickRadius + Math.random() * ((rigWidth - brickRadius * 2) / brickNum - brickRadius * 2);

        
        var brick;
        if (Common.random() < 0.3 && scoreHolders.length!=0 && !hasSpecial) {
            brick = new Brick(tPosX, -100, 0, 30);
            brick.type = Common.choose(Brick.TYPES);
            hasSpecial = true;
        } else {
            brick = new Brick(tPosX, -100, Common.choose(shapes), 40);
            scoreHolders.push(brick);
        }
        
        TweenLite.to(brick, 1, { positionY: brickRadius * 2,ease:Linear.easeIn });
    }
    for (var i =0;i<scoreHolders.length;i++) {
        if (i==scoreHolders.length-1) {
            scoreHolders[i].life = totalScore;            
        } else {
            scoreHolders[i].life = Math.round(Math.random()*(totalScore-scoreHolders.length+i));
        }
        if (scoreHolders[i].life==0) {
            scoreHolders[i].life = 1;
        }
        totalScore -= scoreHolders[i].life;
    }
    delete scoreHolders;
}

function fireBall(fromx, fromy, vx, vy) {
    if (ballsToFire.length != 0) {
        var t = ballsToFire.shift();
        t.sleep = false;
        Body.setVelocity(t.body, Vector.mult({ x: vx, y: vy }, Ball.speed));

        setTimeout(() => {
            fireBall(fromx, fromy, vx, vy);
        }, 150);
    } else {
        console.log("all fired");
    }

}
function ballHitBottom(ball) {
    if (firedBalls.indexOf(ball) == -1) {
        ball.sleep = true;
        firedBalls.push(ball);
    }
    if (firedBalls.length == totalBallNum) {
        moveDownBricks();
        generateBricks();

        setTimeout(()=>{
            console.log("refire");
            while (firedBalls.length != 0) {
                ballsToFire.push(firedBalls.shift());
            }
            console.log("start firing " + ballsToFire.length + " balls");
            var dir = -Math.random()*Math.PI;
            console.log(dir);
            fireBall(ballsToFire[0].body.position.x,ballsToFire[0].body.position.y,Math.cos(dir),Math.sin(dir));
        },1500)
    }
}
function startListening() {
    Events.on(engine, "collisionStart", function (e) {
        for (var i = 0; i < e.pairs.length; i++) {
            var ball;
            var brick;
            var hitBottom = false;
            switch (e.pairs[i].bodyA.label) {
                case "ball":
                    ball = e.pairs[i].bodyA.skin;
                    break;
                case "brick":
                    brick = e.pairs[i].bodyA.skin;
    
                    break;
                case "bottom":
                    hitBottom = true;
                    break;
            }
            switch (e.pairs[i].bodyB.label) {
                case "ball":
                    ball = e.pairs[i].bodyB.skin;
                    break;
                case "brick":
                    brick = e.pairs[i].bodyB.skin;
                    break;
    
                case "bottom":
                    hitBottom = true;
    
                    break;
    
            }
            if (brick && ball) {
                if(Brick.pool.indexOf(brick) == -1) {
                    continue;
                }
                brick.collisionStart(ball.size);
                userscore += ball.size;
                if (brick.life <= 0) {
                    userscore += brick.life;
                    switch (brick.type) {
                        case Brick.DOUBLE_SIZE:
                            console.log("double size");
                            if (ball.size == 2) {
                                addBall(brick.body.position.x, brick.body.position.y,Vector.mult({x:Math.cos(Math.random()),y:Math.sin(Math.random())},Ball.speed/2));
                            } else {
                                ball.size = 2;
                            }
                            break;
                        case Brick.SPEED_BOOST:
                            console.log("adding speed");
                            Body.setVelocity(ball.body, Vector.mult(Vector.normalise(ball.body.velocity), Ball.speed));
    
                            break;
                        case Brick.EXTRA_BALL:
                            console.log("adding new ball");
                            addBall(brick.body.position.x, brick.body.position.y,Vector.mult({x:Math.cos(Math.random()),y:Math.sin(Math.random())},Ball.speed/2));
                            break;
                    }
                    brick.dispose();
                }
                if (ball.body.speed < Ball.boostThreshold) {
                    ball.needsBoost = true;
                }
            }
            if (hitBottom) {
                if (ball && !ball.sleep) {
                    ballHitBottom(ball);
                }
            }
        }
    });
    Events.on(engine, "beforeUpdate", function () {
        var dx;
        for (var i = 0; i < firedBalls.length; i++) {
            dx = (firedBalls[0].body.position.x - firedBalls[i].body.position.x) / 4 + firedBalls[i].body.position.x;
            Body.setAngularVelocity(firedBalls[i].body, 0);
    
            Body.rotate(firedBalls[i].body, -firedBalls[i].body.angle);
            Body.setVelocity(firedBalls[i].body, { x: 0, y: 0 });
            Body.setPosition(firedBalls[i].body, { x: dx, y: rigHeight - Ball.RADIUS*(1+firedBalls[i].size/4)  });
        }
    });
    Events.on(engine, "afterUpdate", function () {
        for (var i = 0; i < Ball.pool.length; i++) {
            if (Ball.pool[i].sleep) {
                continue;
            }
            Body.setVelocity(Ball.pool[i].body, Vector.mult(Vector.normalise(Ball.pool[i].body.velocity), Ball.speed));

            continue;
            if (Ball.pool[i].needsBoost) {
                Ball.pool[i].needsBoost = false;
                Body.setVelocity(Ball.pool[i].body, Vector.mult(Vector.normalise(Ball.pool[i].body.velocity), Ball.speed / 2));
            } else {

            }
        }
    });
    
    Events.on(engine, "collisionActive", function (e) {
        for (var i = 0; i < e.pairs.length; i++) {
            var ball;
            var brick;
            var hitBottom = false;
            switch (e.pairs[i].bodyA.label) {
                case "ball":
                    ball = e.pairs[i].bodyA.skin;
                    break;
                case "brick":
                    brick = e.pairs[i].bodyA.skin;
    
                    break;
                case "bottom":
                    hitBottom = true;
                    break;
            }
            switch (e.pairs[i].bodyB.label) {
                case "ball":
                    ball = e.pairs[i].bodyB.skin;
                    break;
                case "brick":
                    brick = e.pairs[i].bodyB.skin;
                    break;
    
                case "bottom":
                    hitBottom = true;
    
                    break;
    
            }
    
        }
    });
    Events.on(engine, "collisionEnd", function (e) {
        for (var i = 0; i < e.pairs.length; i++) {
            var ball;
            var brick;
            switch (e.pairs[i].bodyA.label) {
                case "ball":
                    ball = e.pairs[i].bodyA.skin;
                    break;
                case "brick":
                    brick = e.pairs[i].bodyA.skin;
    
                    break;
            }
            switch (e.pairs[0].bodyB.label) {
                case "ball":
                    ball = e.pairs[i].bodyB.skin;
                    break;
                case "brick":
                    brick = e.pairs[i].bodyB.skin;
                    break;
            }
            if (ball) {
            }
        }
    });

}


