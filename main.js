import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

let mixer;

const clock = new THREE.Clock();
const container = document.getElementById("container");

const stats = new Stats();
container.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x86a3d8);
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.set(0, 0, 10);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0.5, 0);
// controls.update();
// controls.enablePan = false;
// controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("jsm/libs/draco/");

let model;
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  "assets/bonsai.glb",
  function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0.5, 0);
    model.scale.set(0.005, 0.005, 0.005);
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);

    animate();
  },
  undefined,
  function (e) {
    console.error(e);
  }
);
// loader.load(
//   "assets/water_waves.glb",
//   function (gltf) {
//     const model = gltf.scene;
//     model.position.set(5, 5, 0);
//     model.scale.set(0.1, 0.1, 0.1);
//     scene.add(model);

//     mixer = new THREE.AnimationMixer(model);
//     mixer.clipAction(gltf.animations[0]).play();

//     animate();
//   },
//   undefined,
//   function (e) {
//     console.error(e);
//   }
// );

window.onresize = function (model = model) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  mixer.update(delta);

  // controls.update();

  stats.update();

  model.rotation.y += 0.001;

  renderer.render(scene, camera);
}
