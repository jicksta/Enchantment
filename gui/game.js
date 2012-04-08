var E = {};


function PhysicsEngine(options) {
  var self = this;

  self.worker = new Worker("physics.js");
  self.worker.addEventListener("message", function() {
    self._messageReceived.apply(self, arguments);
  });
  self._send("init", {ammo:"/vendor/ammo.36200f52b3383deba7f3a4d7f57ac5870d0e1895.js"});
  self.state = null;
  self.ontick = options.ontick;
}

PhysicsEngine.prototype._send = function(action, payload) {
  this.worker.postMessage({action:action, payload:payload});
};

PhysicsEngine.prototype._messageReceived = function(e) {
  if (e.data.action == "debug") {
    console.debug("(WORKER)", e.data.payload);
  } else if (e.data.action === "tick") {
    this.state = e.data.payload;
    if (typeof this.ontick === "function") this.ontick();
  }
};

PhysicsEngine.prototype.buildTriangleMesh = function(triangles) {
  this._send("buildTriangleMesh", {triangles:triangles});
};

PhysicsEngine.prototype.update = function(state) {
  this.state = null;
  this._send("update", state);
};


(function(ns) {

  var VIEW_WIDTH = document.body.clientWidth,
      VIEW_HEIGHT = document.body.clientHeight;

  var domElement = document.getElementById("container");

  var clock = new THREE.Clock;
  var scene = createScene();

  var stats = createStats();
  var camera = createCamera();
  var physics = setupPhysics(function() {
    requestAnimationFrame(render);
  });

  setupLighting();
  setupControls();

  var renderer = createRenderer();

  loadCollada("models/bigmap.dae", 4, function() {
    physics.update(viewState());
  });

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  function render() {
    moveCamera();
    sendMovementData();
    renderer.render(scene, camera);
    physics.update(viewState());
    updateOtherPlayers();
    stats.update();
  }

  function createScene() {
    var scene = new THREE.Scene;
    scene.fog = new THREE.FogExp2(0xaaaaaa, 0.00055);
    return scene;
  }

  function moveCamera() {
    var position = physics.state.agent;
    camera.position.set(position.x, position.y, position.z);
  }

  function createCamera() {
    var camera = new THREE.PerspectiveCamera(camera, VIEW_WIDTH / VIEW_HEIGHT, 0.1, 20000);
    camera.position.set(0, 1, 0);
    scene.add(camera);
    return camera;
  }

  function setupPhysics(fn) {
    return new PhysicsEngine({ontick:fn});
  }

  function setupLighting() {
    var ambientLight = new THREE.PointLight(0xFFFFFF, 1, 25000);
    ambientLight.position.y = 5;
    scene.add(ambientLight);
  }

  function createRenderer() {
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(VIEW_WIDTH, VIEW_HEIGHT);
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

      recursivelyPhysicalizeMeshes(collada.scene);
      function recursivelyPhysicalizeMeshes(obj) {
        if ("geometry" in obj) {
          // We use this array to create the triangles with actual vectors instead of indices
          var physicalMeshVertices = [];
          obj.geometry.vertices.forEach(function(meshVertex) {
            // Have to find the absolute position of each vertex irrespective of their parents' transformations.
            var worldVertex = obj.matrixWorld.multiplyVector3(meshVertex.position.clone());
            var physicalVertex = [worldVertex.x * scale, worldVertex.y * scale, worldVertex.z * scale];
            physicalMeshVertices.push(physicalVertex);
          });

          var triangles = [];
          obj.geometry.faces.forEach(function(face) {
            if (face instanceof THREE.Face3) {
              triangles.push({
                a:physicalMeshVertices[face.a],
                b:physicalMeshVertices[face.b],
                c:physicalMeshVertices[face.c]
              });
            } else if (face instanceof THREE.Face4) {
              // Must convert a four-vertex face into two three-vertex faces.
              triangles.push({
                a:physicalMeshVertices[face.a],
                b:physicalMeshVertices[face.b],
                c:physicalMeshVertices[face.d]
              });
              triangles.push({
                a:physicalMeshVertices[face.b],
                b:physicalMeshVertices[face.c],
                c:physicalMeshVertices[face.d]
              });
            }
          });
          physics.buildTriangleMesh(triangles);
        }
        obj.children.forEach(recursivelyPhysicalizeMeshes);
      }

      callback();
    });
  }

  var ACTIVE_KEYS = {};

  function setupControls() {
    document.addEventListener('keydown', function(e) {
      ACTIVE_KEYS[e.which] = true;
    }, false);
    document.addEventListener('keyup', function(e) {
      delete ACTIVE_KEYS[e.which]
    }, false);
  }


  var playerMeshes = {};

  ns.otherPlayerJoined = function(playerID) {
    var mesh = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({color:0xFFFF00})
    );
    scene.add(mesh);
    playerMeshes[playerID] = mesh;
  };

  ns.otherPlayerLeft = function(playerID) {
    scene.remove(playerMeshes[playerID]);
    delete playerMeshes[playerID];
  };

  function sendMovementData() {
    var playerState = physics.state.agent;

    var rotation = new THREE.Matrix4().extractRotation(camera.matrixWorld);
    var rotationY = new THREE.Vector3().getRotationFromMatrix(rotation).y;

    ns.sendUpdate({
      id:ns.remotePlayerID,
      x:playerState.x,
      y:playerState.y,
      z:playerState.z,
      rotation:rotationY
    });
  }

  function updateOtherPlayers() {
    for (var playerID in ns.otherPlayers) {
      if (ns.otherPlayers.hasOwnProperty(playerID)) {
        var otherPlayerData = ns.otherPlayers[playerID];
        var mesh = playerMeshes[playerID];
        mesh.position = new THREE.Vector3(otherPlayerData.x, otherPlayerData.y, otherPlayerData.z);
        mesh.rotation.y = otherPlayerData.rotation;
      }
    }
  }

  function viewState() {
    var state = {
      timeDelta:clock.getDelta(),
      rotation:camera.rotation.y
    };

    var left, forward, right, backward;
    if (37 in ACTIVE_KEYS) left = true;
    if (38 in ACTIVE_KEYS) forward = true;
    if (39 in ACTIVE_KEYS) right = true;
    if (40 in ACTIVE_KEYS) backward = true;

    if (right) {
      camera.rotation.y -= 0.07;
    } else if (left) {
      camera.rotation.y += 0.07;
    } else if (forward || backward) {
      // var movementSpeeds = forward ? -12 : 10;
      var movementSpeeds = forward ? -62 : 10;
      var cameraRotation = new THREE.Matrix4().extractRotation(camera.matrixWorld);
      var velocityVector = new THREE.Vector3(0, 0, movementSpeeds);
      cameraRotation.multiplyVector3(velocityVector);

      state.vector = {x:velocityVector.x, y:velocityVector.y, z:velocityVector.z};
    }

    return state;
  }

  function createStats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    return stats;
  }


})(E);
