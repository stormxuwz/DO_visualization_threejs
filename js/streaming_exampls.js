var scene, camera, renderer;
var geometry, material, mesh;
var animation, queue, pruneTime;
var lastTime;

init();

// Generate keys at a fixed interval.
produceKeys(2.0, 1.0 / 30.0);

// Consume keyframes and animate the scene.
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    mesh = new THREE.Mesh(geometry, material);
    animation = initAnimation(mesh);
    scene.add(mesh);
    
    queue = [ [] ];
    lastTime = Date.now();
    pruneTime = 0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function initAnimation(mesh) {
    var data = {
        hierarchy: [{
            keys: [{
                time: 0,
                index: 0,
                pos: [0, 0, 0],
                rot: new THREE.Quaternion(0, 1, 0, 1),
                scl: [1, 1, 1]
            }, {
                time: 1,
                index: 1,
                pos: [0, 0, 0],
                rot: new THREE.Quaternion(0, 1, 0, 1),
                scl: [1, 1, 1]
            }]
        }],
    };
    
    var animation = new THREE.Animation(mesh, data);
    animation.loop = false;
    animation.startTime = 0;
    
    return animation;
}

function animate() {
    requestAnimationFrame(animate);

    // Calculate the time delta for this frame.
    var now = Date.now();
    var deltaTime = (now - lastTime) / 1000.0;
    lastTime = now;
    
    // Get new keyframes.
    consumeKeys(animation);

    // Prune old keyframes every so often.
    pruneTime += deltaTime;
    if (pruneTime > 2.0) {
        pruneKeys(animation);
        pruneTime = 0;
    }
    
    // Determine if we should stop playback and buffer.
    bufferPlayback(animation);

    // Update the scene and render.
    THREE.AnimationHandler.update(deltaTime);
    renderer.render(scene, camera);
}

function bufferPlayback(animation) {
    var keys = animation.data.hierarchy[0].keys,
        bufferTime = keys[keys.length - 1].time - animation.currentTime;
    
    if (animation.isPlaying) {
        if (bufferTime <= 0.0) {
            console.log("Buffering...");
            animation.startTime = animation.currentTime;
            animation.stop();
        }
    } else if (bufferTime >= 0.5) {
        console.log("Resuming...");
        animation.play(animation.startTime);
    }
}

function consumeKeys(animation) {
    var hierarchy = animation.data.hierarchy;
    
    for (var iObject = 0; iObject < hierarchy.length; ++iObject) {
        var object = hierarchy[iObject];
        if (!object) {
            continue;
        }
        
        var keys = object.keys,
            nextIdx = keys[keys.length - 1].index;
        
        for (var iKey = 0; iKey < queue[iObject].length; ++iKey) {
            queue[iObject][iKey].index = ++nextIdx;
            keys.push(queue[iObject][iKey]);
        }
        
        queue[iObject] = [];
    }
}

function produceKeys(time, rate) {
    var angle = (time * Math.PI) % (2.0 * Math.PI),
        quaternion = new THREE.Quaternion(),
        axis = new THREE.Vector3(0, 1, 0);
    
    quaternion.setFromAxisAngle(axis, angle);
    
    queue[0].push({
        time: time,
        pos: [0, 0, 0],
        rot: quaternion,
        scl: [1, 1, 1]
    });
    
    setTimeout(function() {
        produceKeys(time + rate, rate);
    }, Math.floor(1000 * rate));
}

function pruneKeys(animation) {
    var hierarchy = animation.data.hierarchy;
    
    for (var iObject = 0; iObject < hierarchy.length; ++iObject) {
        var object = hierarchy[iObject];
        if (!object) {
            continue;
        }
        
        var keys = object.keys;
        
        while (keys.length > 2 && keys[1].time <= animation.currentTime) {
            keys.shift();
        }
        
        for (var iKey = 0; iKey < keys.length; ++iKey) {
            keys[iKey].index = iKey;
        }
    }
    
    animation.reset();
}


