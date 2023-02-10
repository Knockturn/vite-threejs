import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

let mixer;
let mixer2;

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
scene.background = new THREE.Color(0x21252c);
scene.environment = pmremGenerator.fromScene(
  new RoomEnvironment(),
  0.04
).texture;

const camera = new THREE.PerspectiveCamera(
  4,
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

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);
// create a global audio source
const sound = new THREE.Audio(listener);
// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("sounds/ambient.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("jsm/libs/draco/");

let bonsai;
let model;
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  "assets/birds.glb",
  function (gltf) {
    model = gltf.scene;
    model.position.set(0, -2, 0);
    model.rotation.set(0, 4, 0);
    model.scale.set(0.7, 0.7, 0.7);
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();

    animate();
  },
  undefined,
  function (e) {
    console.error(e);
  }
);
loader.load(
  "assets/bonsai.glb",
  function (gltf) {
    bonsai = gltf.scene;
    bonsai.position.set(0, 0, 0);
    bonsai.scale.set(0.005, 0.005, 0.005);
    scene.add(bonsai);

    mixer2 = new THREE.AnimationMixer(bonsai);

    animate();
  },
  undefined,
  function (e) {
    console.error(e);
  }
);
window.onresize = function (bonsai = bonsai) {
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

  bonsai.rotation.y += 0.001;
  model.position.y = Math.sin(clock.getElapsedTime()) * 0.2 + 1.5;
  model.position.x = Math.sin(clock.getElapsedTime()) * 0.2 + 0;
  model.position.z = Math.sin(clock.getElapsedTime()) * 0.2 + 0;
  // model.rotation.y = Math.sin(clock.getElapsedTime()) * 0.5 + 4;
  model.rotation.y += 0.001;

  if (camera.position.z > 0) {
    camera.position.z += 0.01;
  }
  if (camera.position.z >= 80) {
    camera.position.z -= 0.01;
  }

  renderer.render(scene, camera);
}
