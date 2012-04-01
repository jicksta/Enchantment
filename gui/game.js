var RQ = {};

(function(ns) {

  var WIDTH = document.body.clientWidth,
      HEIGHT = document.body.clientHeight;

  var domElement = document.getElementById("container");

  var clock = new THREE.Clock;
  var scene = new THREE.Scene;

  var camera = createCamera();
  var physics = setupPhysics();
  var player = setupPlayer();

  setupLighting();

  var renderer = createRenderer();

  loadCollada("models/building.dae", 0.002, delayRenderFn(500));

  function render() {
    requestAnimationFrame(render);
    var timeDelta = clock.getDelta();
    physics.integrate(timeDelta);
    updateCameraFromPhysics();
    updatePhysicalMeshes();
    updateOtherPlayers();
    renderer.render(scene, camera);
  }

  // This is useful for passing the returned function as a callback that will start the render loop at a certain number
  // of milliseconds in the future. This might be useful or even necessary if you depend on physics immediately.
  // Browsers tend to be briefly laggy immediately after page load while it JITs all the JavaScript. Collision
  // detection may fail during this laggy period if the lag lasts longer than the time it takes the object to fall/move
  // through another.
  function delayRenderFn(ms) {
    return function() {
      setTimeout(render, ms);
    }
  }

  function createCamera() {
    var camera = new THREE.PerspectiveCamera(camera, WIDTH / HEIGHT, 1, 20000);
    camera.position.set(-4, 1, 0);
    scene.add(camera);
    return camera;
  }

  function setupPhysics() {
    physics = jiglib.PhysicsSystem.getInstance();
    physics.rigidBodies = [];
    physics.setCollisionSystem(true);
    physics.setSolverType("FAST");
    physics.setGravity(new Vector3D(0, -9.8, 0, 0));
    return physics;
  }

  function setupLighting() {
    var light = new THREE.PointLight(0x0020BB, 10, 50);
    light.position.set(5, 5, 5);
    scene.add(light);
  }

  function createRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    domElement.appendChild(renderer.domElement);
    return renderer;
  }

  function loadCollada(file, scale, callback) {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(file, function(collada) {
      collada.scene.scale.set(scale, scale, scale);
      collada.scene.updateMatrix();
      scene.add(collada.scene);

      recursivelyImportMeshes(collada.scene);
      function recursivelyImportMeshes(obj) {
        if ("geometry" in obj) {
          var skin = {vertices: [], indices: []};

          obj.geometry.vertices.forEach(function(meshVertex) {
            // Have to find the absolute position of each vertex irrespective of their parents' transformations.
            var worldVertex = obj.matrixWorld.multiplyVector3(meshVertex.position.clone());
            var physicalVert = new Vector3D(worldVertex.x, worldVertex.y, worldVertex.z, 0).scaleBy(scale);
            skin.vertices.push(physicalVert);
          });
          obj.geometry.faces.forEach(function(face) {
            if (face instanceof THREE.Face3) {
              skin.indices.push({i0: face.a, i1: face.b, i2: face.c});
            } else if (face instanceof THREE.Face4) {
              // Must convert a four-vertex face into two three-vertex faces.
              skin.indices.push({i0: face.a, i1: face.b, i2: face.d});
              skin.indices.push({i0: face.b, i1: face.c, i2: face.d});
            }
          });

          var position = new Vector3D(obj.position.x, obj.position.y, obj.position.z, 0);
          var rotation = new jiglib.Matrix3D;
          obj.rigidBody = new jiglib.JTriangleMesh(skin, position, rotation, 200, 5);
          obj.rigidBody.set_friction(1);
          physics.addBody(obj.rigidBody);
          physics.rigidBodies.push({body: obj.rigidBody, mesh: obj});
        }
        obj.children.forEach(recursivelyImportMeshes);
      }

      callback();
    });
  }

  function updatePhysicalMeshes() {
    physics.rigidBodies.forEach(function(obj) {
      var currentState = obj.body.get_currentState();
      var currentPosition = currentState.position;
      var currentOrientation = currentState.orientation.get_rawData();

      var transformation = new THREE.Matrix4;
      transformation.setTranslation(currentPosition.x, currentPosition.y, currentPosition.z);
      var rotation = THREE.Matrix4.prototype.set.apply(new THREE.Matrix4, currentOrientation);
      transformation.multiplySelf(rotation);

      obj.mesh.matrix = transformation;
      obj.mesh.matrixWorldNeedsUpdate = true;
    });
  }

  var PRESSED_KEYS = {};

  function setupPlayer() {
    var player = new jiglib.JBox(null, 1, 1, 1.5);
    player.moveTo(new Vector3D(0, 15, 0, 0));
    player.set_friction(3);
    player.set_mass(100);
    physics.addBody(player);

    document.addEventListener('keydown', function(e) {
      PRESSED_KEYS[e.which] = true;
    }, false);
    document.addEventListener('keyup', function(e) {
      delete PRESSED_KEYS[e.which]
    }, false);

    return player;
  }

  function updateCameraFromPhysics() {
    camera.position.set(player.get_x(), player.get_y(), player.get_z());

    if (39 in PRESSED_KEYS) { // right
      camera.rotation.y -= 0.07;
    } else if(37 in PRESSED_KEYS) { // left
      camera.rotation.y += 0.07;
    } else if((38 in PRESSED_KEYS) || (40 in PRESSED_KEYS)) { // forward & back
      var isMovingForward = 38 in PRESSED_KEYS;
      var movementSpeeds = isMovingForward ? -4 : 3;

      var cameraRotation = new THREE.Matrix4().extractRotation(camera.matrixWorld);
      var velocityVector = new THREE.Vector3(0, 0, movementSpeeds);
      cameraRotation.multiplyVector3(velocityVector);

      var currentVelocityY = player.get_currentState().linVelocity.y;
      player.setLineVelocity(new Vector3D(velocityVector.x, currentVelocityY, velocityVector.z, 0));
    } else {
      return;
    }
    sendMovementData();
  }

  var playerMeshes = {};

  ns.otherPlayerJoined = function(playerID) {
    var mesh = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({color: 0xFFFF00})
    );
    scene.add(mesh);
    playerMeshes[playerID] = mesh;
  };

  ns.otherPlayerLeft = function(playerID) {
    scene.remove(playerMeshes[playerID]);
    delete playerMeshes[playerID];
  };

  function sendMovementData() {
    var playerState = player.get_currentState();

    var rotation = new THREE.Matrix4().extractRotation(camera.matrixWorld);
    var rotationY = new THREE.Vector3().getRotationFromMatrix(rotation).y;

    ns.sendUpdate({
      id: ns.remotePlayerID,
      x: playerState.position.x,
      y: playerState.position.y,
      z: playerState.position.z,
      rotation: rotationY
    });
  }

  function updateOtherPlayers() {
    for(var playerID in ns.otherPlayers) {
      if(ns.otherPlayers.hasOwnProperty(playerID)) {
        var otherPlayerData = ns.otherPlayers[playerID];
        var mesh = playerMeshes[playerID];
        mesh.position = new THREE.Vector3(otherPlayerData.x, otherPlayerData.y, otherPlayerData.z);
        mesh.rotation.y = otherPlayerData.rotation;
      }
    }
  }

})(RQ);
