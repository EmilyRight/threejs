import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
// import typefaceFont from '../static/fonts/Special Gothic Expanded One_Regular.json';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/3.png');
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
/**
 * Object
 */
const loader = new FontLoader();
const font = loader.load(
    // resource URL
    './fonts/Special_Gothic_Expanded_One_Regular.json',

    // onLoad callback
    function (font) {
        // do something with the font
        const geometry = new TextGeometry('Hello three.js!', {
            font: font,
            size: 0.4,
            height: 0.4,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
        });

        geometry.computeBoundingBox();
        console.log('====================================');
        console.log(geometry.boundingBox);
        console.log('====================================');
        // geometry.translate(
        //     -(geometry.boundingBox.max.x - 0.02) / 2, //      bevelSize: 0.02,
        //     -(geometry.boundingBox.max.y - 0.02) / 2, //      bevelSize: 0.02,
        //     -(geometry.boundingBox.max.x - 0.03) / 2 //    bevelThickness: 0.03,
        // );

        geometry.center();

        const text = new THREE.Mesh(geometry, material);
        scene.add(text);
    },

    // onProgress callback
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },

    // onError callback
    function (err) {
        console.log('An error happened');
    }
);
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    donut.scale.set(scale, scale, scale);
    scene.add(donut);
}

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
camera.position.set(1, 2, 3);
scene.add(camera);

// gui.add(camera).min(-2).max(10).step(0.05);
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

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
