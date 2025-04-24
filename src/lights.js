import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// const pointLightLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
// scene.add(
//     pointLightLightHelper,
//     directionalLightHelper,
//     hemisphereLightHelper,
//     rectAreaLightHelper,
//     spotLightHelper
// );
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 10, 2);
pointLight.position.set(1, 0.5, 0);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0x00ffcc, 0.5);
directionalLight.position.set(1, -0.5, 1);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(hemisphereLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.add(rectAreaLightHelper);
scene.add(rectAreaLight);
rectAreaLight.lookAt(new THREE.Vector3());

const spotLight = new THREE.SpotLight(0xffffff, 10);

spotLight.position.set(0, 2, 3);
spotLight.target.position.set(0, 0, 0);
spotLight.distance = 10;
spotLight.angle = Math.PI * 0.1;
spotLight.penumbra = 0.25;
spotLight.decay = 1;

// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 10;
// spotLight.shadow.focus = 1;
scene.add(spotLight);
scene.add(spotLight.target);

window.requestAnimationFrame(() => {
    spotLightHelper.update();
});
const parameters = {
    color: 0x00ffcc,
};

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01);
gui.add(directionalLight.position, 'x').min(0).max(1).step(0.01);
gui.add(pointLight.position, 'y').min(0).max(1).step(0.01);
gui.add(spotLight.position, 'x').min(0).max(1).step(0.01);
gui.add(spotLight, 'distance').min(0).max(10).step(0.01);
gui.addColor(parameters, 'color').onChange(() => {
    directionalLight.color.set(parameters.color);
});
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
material.metalness = 0.3;
gui.add(material, 'metalness').min(0).max(1).step(0.01);
// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
