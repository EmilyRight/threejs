import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/*debug*/

const gui = new dat.GUI();

/**
 * Base
 */

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('loadingManager: loading started');
};
loadingManager.onLoaded = () => {
    console.log('loadingManager: loading finished');
};
loadingManager.onProgress = () => {
    console.log('loadingManager: loading progressing');
};
loadingManager.onError = () => {
    console.log('loadingManager: loading error');
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load(
    '/textures/door/color.jpg',
    () => {
        console.log('textureLoader: loading finished');
    },
    () => {
        console.log('textureLoader: loading progressing');
    },
    () => {
        console.log('textureLoader: loading error');
    }
);
colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.MirroredRepeatWrapping;
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/3.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
// const material = new THREE.MeshBasicMaterial({ color: 0xff5500, map: colorTexture });

// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;
// Canvas
const canvas = document.querySelector('canvas.webgl');

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
// material.shininess = 100;
// material.metalnessTexture = matcapTexture;

// const material = new THREE.MeshStandardMaterial(); // MeshStandardMaterial лучше реагирует на свет
// material.metalness = 0.7;
// material.roughness = 0.3;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.metalnessMap = metalnessTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.transparent = true;
// material.alphaMap = alphaTexture;


const material = new THREE.MeshStandardMaterial(); // MeshStandardMaterial лучше реагирует на свет
material.metalness = 0.7;
material.roughness = 0.2;

gui.add(material, 'metalness').min(0).max(1).step(0.01);
gui.add(material, 'roughness').min(0).max(1).step(0.01);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01);
gui.add(material, 'displacementScale').min(0).max(1).step(0.01);

// material. = matcapTexture;

// Scene
const scene = new THREE.Scene();
//Material

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), material);

sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 100), material);

torus.position.x = 1.5;
scene.add(sphere, plane, torus);

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2); // Белый свет вместо красного
pointLight.position.set(1, 2, 3);
scene.add(pointLight);

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

    //Update objects

    sphere.rotation.y = 0.15 * elapsedTime;
    plane.rotation.y = 0.15 * elapsedTime;
    torus.rotation.y = 0.15 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
