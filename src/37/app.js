import * as THREE from "../../libs/three/three.module.js";
import { VRButton } from "../../libs/VRButton.js";
import { OrbitControls } from "../../libs/three/jsm/OrbitControls.js";

let camera, scene, renderer, sphere, clock;

init();
animate();

function init() {
  const container = document.getElementById("container");

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  scene.add(camera);

  // Create the panoramic sphere geometery
  const panoSphereGeo = new THREE.SphereGeometry(6, 256, 256);

  // Create the panoramic sphere material
  const panoSphereMat = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    displacementScale: -4.0
  });

  // Create the panoramic sphere mesh
  sphere = new THREE.Mesh(panoSphereGeo, panoSphereMat);

  // Load and assign the texture and depth map
  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);

  loader.load("./textures/kandao3.jpg", function(texture) {
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    sphere.material.map = texture;
  });

  loader.load("./textures/kandao3_depthmap.jpg", function(depth) {
    depth.minFilter = THREE.NearestFilter;
    depth.generateMipmaps = false;
    sphere.material.displacementMap = depth;
  });

  // On load complete add the panoramic sphere to the scene
  manager.onLoad = function() {
    scene.add(sphere);
  };

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}
