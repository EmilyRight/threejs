import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const sizes = {
    width: 800,
    height: 600,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
const clock = new THREE.Clock();
/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// // mesh.position.x = 0.7 //вправо
// // mesh.position.y =-0.7 //вниз
// // mesh.position.z = -1 // от камеры вдаль
// mesh.position.set(0.7, -0.6, 1);

// scene.add(mesh);

// //scle
// mesh.scale.set(1.5, 1, 1);
// mesh.rotation.reorder('YXZ');
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;
// // const a = new THREE.Euler( 0, 1, 1.57, 'XYZ' );
// // const b = new THREE.Vector3( 1, 0, 1 );
// // b.applyEuler(a)
// /**
//  * Sizes
//  */
// const sizes = {
//     width: 800,
//     height: 600,
// };

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -0.5;
animateCube(0.3, cube1);
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = 0;
cube2.position.y = 0.7;
animateCube( 0.2, cube2);
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 0.5;
animateCube(0.1, cube3);
group.add(cube3);

// /**
//  * Sizes
//  */

/**
 * Camera
 */

camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */

renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop(animate);
renderer.render(scene, camera);

function animateGroup() {
    const elapsedTime = clock.getElapsedTime();
    group.position.y = Math.sin(elapsedTime);
    group.position.x = Math.cos(elapsedTime);
    camera.lookAt(group.position);
    renderer.render(scene, camera);
    window.requestAnimationFrame(animateGroup);
}

animateGroup();

function animateCube(y, cube) {
    cube.position.y += y;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animateCube);
}

// gsap.to(group.position, {
//     duration: 1,
//     delay: 1.2,
//     x: 2,
// });