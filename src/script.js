import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

//Fog

const fog = new THREE.Fog('#262837', 1, 15);
// Scene
const scene = new THREE.Scene();
scene.fog = fog;
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const wallsColorTexture = textureLoader.load('./textures/bricks/color.jpg');
const wallsAmbientOcclusionTexture = textureLoader.load('./textures/bricks/ambientOcclusion.jpg');
const wallsNormalTexture = textureLoader.load('./textures/bricks/normal.jpg');
const wallsRoughnessTexture = textureLoader.load('./textures/bricks/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');

const grassColorTexture = textureLoader.load('./textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('./textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('./textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('./textures/grass/roughness.jpg');

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

//walls

// const walls = new THREE.Mesh(
//     new THREE.BoxGeometry(4, 2.5, 4),
//     new THREE.MeshStandardMaterial({
//         map: wallsColorTexture,
//         aoMap: wallsAmbientOcclusionTexture,
//         normalMap: wallsNormalTexture,
//         roughness: wallsRoughnessTexture,
//     })
// );
// walls.geometry.setAttribute(
//     'uv2',
//     new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
// );
// walls.castShadow = true;
// walls.position.y = 2.5 / 2;
const wallWidth = 4;
const wallHeight = 2.5;
const windowWidth = 0.8;
const windowHeight = 0.8;
const doorWidth = 1;
const doorHeight = 2.0;
const frameThickness = 0.05; // Толщина оконной рамы

// Положение двери (центр стены)
const doorLeft = -doorWidth / 2;
const doorRight = doorWidth / 2;
const doorBottom = -wallHeight / 2;

// Положение окна (слева от двери)
const windowCenterX = doorLeft - windowWidth / 2 - 0.3;
const windowCenterY = 0;
const windowLeft = windowCenterX - windowWidth / 2;
const windowRight = windowCenterX + windowWidth / 2;
const windowBottom = windowCenterY - windowHeight / 2;
const windowTop = windowCenterY + windowHeight / 2;

// Положение окна (справа от двери)
const windowRCenterX = -(doorLeft - windowWidth / 2 - 0.3);
const windowRCenterY = 0;
const windowRLeft = -(windowCenterX - windowWidth / 2);
const windowRRight = -(windowCenterX + windowWidth / 2);
const windowRBottom = -(windowCenterY - windowHeight / 2);
const windowRTop = -(windowCenterY + windowHeight / 2);

// 1. СОЗДАНИЕ СТЕНЫ С ПРОЕМОМ ДЛЯ ОКНА И ДВЕРИ
const wallShape = new THREE.Shape();

wallShape.moveTo(-wallWidth / 2, -wallHeight / 2);
wallShape.lineTo(wallWidth / 2, -wallHeight / 2);
wallShape.lineTo(wallWidth / 2, wallHeight / 2);
wallShape.lineTo(-wallWidth / 2, wallHeight / 2);
wallShape.lineTo(-wallWidth / 2, -wallHeight / 2);

// Проем для окна
const windowPathL = new THREE.Path();
windowPathL.moveTo(windowLeft, windowBottom);
windowPathL.lineTo(windowRight, windowBottom);
windowPathL.lineTo(windowRight, windowTop);
windowPathL.lineTo(windowLeft, windowTop);
windowPathL.lineTo(windowLeft, windowBottom);

const windowPathR = new THREE.Path();
windowPathR.moveTo(-windowLeft, -windowBottom);
windowPathR.lineTo(-windowRight, -windowBottom);
windowPathR.lineTo(-windowRight, -windowTop);
windowPathR.lineTo(-windowLeft, -windowTop);
windowPathR.lineTo(-windowLeft, -windowBottom);

wallShape.holes.push(windowPathL, windowPathR);

const frontWallGeometry = new THREE.ShapeGeometry(wallShape);
const commonWallGeometry = new THREE.PlaneGeometry(4, 2.5);
wallsColorTexture.repeat.set(0.5, 0.5);
// Настраиваем текстуру для повторения
wallsColorTexture.wrapS = THREE.RepeatWrapping;
wallsColorTexture.wrapT = THREE.RepeatWrapping;
// То же самое для других текстур
wallsAmbientOcclusionTexture.wrapS = wallsAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
wallsNormalTexture.wrapS = wallsNormalTexture.wrapT = THREE.RepeatWrapping;
wallsRoughnessTexture.wrapS = wallsRoughnessTexture.wrapT = THREE.RepeatWrapping;

const wallMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
    map: wallsColorTexture,
    aoMap: wallsAmbientOcclusionTexture,
    normalMap: wallsNormalTexture,
    roughness: wallsRoughnessTexture,
});

const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
const leftWall = new THREE.Mesh(commonWallGeometry, wallMaterial);
const rightWall = new THREE.Mesh(commonWallGeometry, wallMaterial);
const backWall = new THREE.Mesh(commonWallGeometry, wallMaterial);

frontWall.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(frontWall.geometry.attributes.uv.array, 2)
);
frontWall.castShadow = true;
frontWall.position.y = 2.5 / 2;
frontWall.position.z = 2;

leftWall.castShadow = true;
leftWall.position.y = 2.5 / 2;
leftWall.position.z = 0;
leftWall.position.x = 2;
leftWall.rotation.y = Math.PI / 2;

rightWall.castShadow = true;
rightWall.position.y = 2.5 / 2;
rightWall.position.z = 0;
rightWall.position.x = -2;
rightWall.rotation.y = Math.PI / 2;

backWall.castShadow = true;
backWall.position.y = 2.5 / 2;
backWall.position.z = -2;

house.add(frontWall, leftWall, rightWall, backWall);

// 2. СОЗДАНИЕ ОКОННОЙ РАМЫ
const windowFrameGroupL = new THREE.Group();
const windowFrameGroupR = new THREE.Group();
windowFrameGroupL.position.y = 2.5 / 2;
windowFrameGroupL.position.z = 2;
windowFrameGroupR.position.y = 2.5 / 2;
windowFrameGroupR.position.z = 2;

// Материал для рамы - белый
const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3, // Немного глянцевая поверхность
    metalness: 0.1,
});

// Внешняя рама
const outerFrameLShape = new THREE.Shape();
outerFrameLShape.moveTo(windowLeft - frameThickness, windowBottom - frameThickness);
outerFrameLShape.lineTo(windowRight + frameThickness, windowBottom - frameThickness);
outerFrameLShape.lineTo(windowRight + frameThickness, windowTop + frameThickness);
outerFrameLShape.lineTo(windowLeft - frameThickness, windowTop + frameThickness);
outerFrameLShape.lineTo(windowLeft - frameThickness, windowBottom - frameThickness);

// Отверстие во внешней раме
const innerWindowPathL = new THREE.Path();
innerWindowPathL.moveTo(windowLeft, windowBottom);
innerWindowPathL.lineTo(windowRight, windowBottom);
innerWindowPathL.lineTo(windowRight, windowTop);
innerWindowPathL.lineTo(windowLeft, windowTop);
innerWindowPathL.lineTo(windowLeft, windowBottom);

outerFrameLShape.holes.push(innerWindowPathL);

const outerFrameLGeometry = new THREE.ShapeGeometry(outerFrameLShape);
const outerFrameL = new THREE.Mesh(outerFrameLGeometry, frameMaterial);
outerFrameL.position.z = 0.01; // Слегка выдвигаем вперед
windowFrameGroupL.add(outerFrameL);
// windowFrameGroupR.add(outerFrameL);

// Центральная перемычка (между створками)
const middleBarWidth = frameThickness;
const middleBarX = windowCenterX;

const middleBarGeometry = new THREE.BoxGeometry(middleBarWidth, windowHeight, frameThickness);
const middleBar = new THREE.Mesh(middleBarGeometry, frameMaterial);
middleBar.position.set(middleBarX, windowCenterY, 0.02);
windowFrameGroupL.add(middleBar);
const windowPaneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    roughness: 0.05, // Гладкость
    thickness: 0.01, // Толщина стекла
    envMapIntensity: 1, // Интенсивность отражения
});

// Левая створка
const leftPaneWidth = (windowWidth - middleBarWidth) / 2;
const leftPaneGeometry = new THREE.PlaneGeometry(
    leftPaneWidth - frameThickness / 2,
    windowHeight - frameThickness * 2
);
const leftPane = new THREE.Mesh(leftPaneGeometry, windowPaneMaterial);
leftPane.position.set(windowLeft + leftPaneWidth / 2, windowCenterY, 0.025);
windowFrameGroupL.add(leftPane);

// Правая створка
const rightPaneGeometry = new THREE.PlaneGeometry(
    leftPaneWidth - frameThickness / 2,
    windowHeight - frameThickness * 2
);
const rightPane = new THREE.Mesh(rightPaneGeometry, windowPaneMaterial);
rightPane.position.set(windowRight - leftPaneWidth / 2, windowCenterY, 0.025);
windowFrameGroupL.add(rightPane);

//правое окно
const outerFrameRShape = new THREE.Shape();
outerFrameRShape.moveTo(-(windowLeft - frameThickness), -(windowBottom - frameThickness));
outerFrameRShape.lineTo(-(windowRight + frameThickness), -(windowBottom - frameThickness));
outerFrameRShape.lineTo(-(windowRight + frameThickness), -(windowTop + frameThickness));
outerFrameRShape.lineTo(-(windowLeft - frameThickness), -(windowTop + frameThickness));
outerFrameRShape.lineTo(-(windowLeft - frameThickness), -(windowBottom - frameThickness));

// Отверстие во внешней раме
const innerWindowPathR = new THREE.Path();
innerWindowPathR.moveTo(-windowLeft, -windowBottom);
innerWindowPathR.lineTo(-windowRight, -windowBottom);
innerWindowPathR.lineTo(-windowRight, -windowTop);
innerWindowPathR.lineTo(-windowLeft, -windowTop);
innerWindowPathR.lineTo(-windowLeft, -windowBottom);

outerFrameRShape.holes.push(innerWindowPathR);

const outerFrameRGeometry = new THREE.ShapeGeometry(outerFrameRShape);
const outerFrameR = new THREE.Mesh(outerFrameRGeometry, frameMaterial);
outerFrameR.position.z = 0.01; // Слегка выдвигаем вперед
windowFrameGroupR.add(outerFrameR);
// windowFrameGroupR.add(outerFrameL);

// Центральная перемычка (между створками)
const middleBarWidthR = frameThickness;
const middleBarXR = -windowCenterX;

const middleBarGeometryR = new THREE.BoxGeometry(middleBarWidthR, windowHeight, frameThickness);
const middleBarR = new THREE.Mesh(middleBarGeometryR, frameMaterial);
middleBarR.position.set(middleBarXR, windowCenterY, 0.02);
windowFrameGroupR.add(middleBarR);
const windowPaneMaterialR = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    roughness: 0.05, // Гладкость
    thickness: 0.01, // Толщина стекла
    envMapIntensity: 1, // Интенсивность отражения
});

// Левая створка
const leftPaneWidthR = (windowWidth - middleBarWidth) / 2;
const leftPaneGeometryR = new THREE.PlaneGeometry(
    leftPaneWidth - frameThickness / 2,
    windowHeight - frameThickness * 2
);
const leftPaneR = new THREE.Mesh(leftPaneGeometryR, windowPaneMaterialR);
leftPaneR.position.set(windowLeft + leftPaneWidthR / 2, windowCenterY, 0.025);
windowFrameGroupR.add(leftPaneR);

// Правая створка
const rightPaneGeometryR = new THREE.PlaneGeometry(
    leftPaneWidth - frameThickness / 2,
    windowHeight - frameThickness * 2
);
const rightPaneR = new THREE.Mesh(rightPaneGeometryR, windowPaneMaterial);
rightPaneR.position.set(windowRight - leftPaneWidth / 2, windowCenterY, 0.025);
windowFrameGroupR.add(rightPaneR);

// Добавляем все элементы окна на сцену

house.add(windowFrameGroupL, windowFrameGroupR);

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
);

roof.position.y = 3;
roof.rotation.y = Math.PI / 4;

//Door

const material = new THREE.MeshStandardMaterial();

material.transparent = true;
material.map = matcapTexture;
material.alphaMap = alphaTexture;
material.normalMap = normalTexture;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 1;
material.metalnessMap = metalnessTexture;
material.displacementMap = heightTexture;
material.displacementScale = 0.15;
material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;

const door = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 100, 100), material);
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1.5 / 2 + 0.2;
door.position.z = 2.01;

//Bushes
// const bushGroup1 = new THREE.Group();
// bushGroup1.position.set(0.8, 0.2, 3);
// const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });
// // const bushBranch1 = new THREE.SphereGeometry(0.2, 5, 5);
// for (let i = 0; i < 20; i++) {
//     const bushBranch = new THREE.SphereGeometry(0.2, 5, 5);

//     const branch1 = new THREE.Mesh(bushBranch, bushMaterial);
//     branch1.position.x = Math.random();
//     branch1.position.y = Math.random();
//     branch1.position.z = Math.random();
//     bushGroup1.add(branch1);
// }

const bushGroup1 = new THREE.Group();
const bushGroup2 = new THREE.Group();
const bushGroup3 = new THREE.Group();
const bushGroup4 = new THREE.Group();

bushGroup1.position.set(1.5, 0.3, 2.5);
bushGroup2.position.set(-1.5, 0.3, 2.5);
bushGroup3.position.set(-1, 0.3, 2.5);
bushGroup4.position.set(1, 0.3, 2.5);
bushGroup1.castShadow = true;
bushGroup2.castShadow = true;
bushGroup3.castShadow = true;
bushGroup4.castShadow = true;

gui.add(bushGroup2.position, 'z').min(-2).max(2).step(0.01);

const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

// Параметры куста
const sphereCount = 30; // Количество сфер
const baseRadius = 0.2; // Базовый радиус сфер
const bushRadius = 0.5; // Радиус всего куста
const sizeVariation = 0.1; // Вариация размера сфер

// Функция для создания куста
function createBush(group) {
    // Создаем сферу в центре куста (базовая сфера)
    const centerSphere = new THREE.Mesh(
        new THREE.SphereGeometry(baseRadius * 1.2, 8, 8),
        bushMaterial
    );

    group.add(centerSphere);

    // Размещаем остальные сферы вокруг
    for (let i = 0; i < sphereCount; i++) {
        // Случайный размер сферы с небольшой вариацией
        const sphereSize = baseRadius * (1 + (Math.random() * 2 - 1) * sizeVariation);
        const bushBranch = new THREE.SphereGeometry(sphereSize, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 == 0 ? 0x3b822f : 0x306327,
        });

        const branch = new THREE.Mesh(bushBranch, material);
        // Генерируем позицию на сфере с учетом плотности
        const phi = Math.random() * Math.PI * 2; // Горизонтальный угол
        const theta = Math.random() * Math.PI; // Вертикальный угол
        const radius = bushRadius * (0.5 + Math.random() * 0.5); // Расстояние от центра

        // Преобразование сферических координат в декартовы
        branch.position.x = radius * Math.sin(theta) * Math.cos(phi);
        branch.position.y = radius * Math.sin(theta) * Math.sin(phi);
        branch.position.z = radius * Math.cos(theta);
        branch.castShadow = true;
        // Масштабируем для создания более натурального вида
        const scale = 0.7 + Math.random() * 0.6;
        branch.scale.set(scale, scale, scale);

        group.add(branch);
    }

    // Добавляем ещё сферы для заполнения промежутков
    for (let i = 0; i < sphereCount / 2; i++) {
        const sphereSize = baseRadius * 0.8;
        const bushBranch = new THREE.SphereGeometry(sphereSize, 8, 8);
        const branch = new THREE.Mesh(bushBranch, bushMaterial);

        // Генерируем позицию ближе к центру
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const radius = bushRadius * (0.3 + Math.random() * 0.3);

        branch.position.x = radius * Math.sin(theta) * Math.cos(phi);
        branch.position.y = radius * Math.sin(theta) * Math.sin(phi);
        branch.position.z = radius * Math.cos(theta);

        group.add(branch);
    }
}

// Создаем кусты
createBush(bushGroup1);
createBush(bushGroup2);
createBush(bushGroup3);
createBush(bushGroup4);
// Temporary sphere

// // const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
// bush1.scale.set(0.5, 0.5, 0.5);
// bush1.position.set(0.8, 0.2, 2.2);

//graves

const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 4 + Math.random() * 5;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
}

house.add(roof, door, bushGroup1, bushGroup2, bushGroup3, bushGroup4, graves);
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughness: grassRoughnessTexture,
    })
);
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.2);
moonLight.position.set(4, 5, -2);
gui.add(moonLight.position, 'x').min(0).max(7).step(0.01);

scene.add(moonLight);

const doorLammGeometry = new THREE.SphereGeometry(0.1, 8, 8);

doorLammGeometry.thetaStart = 4.66;
doorLammGeometry.thetaLength = 3.3;
const doorLamp = new THREE.Mesh(
    doorLammGeometry,
    new THREE.MeshStandardMaterial({ color: '#ffffff' })
);
doorLamp.position.set(0, 2.257, 2.257);
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 1.8, 2.257);

house.add(doorLamp, doorLight);

const innerLight = new THREE.PointLight('#45b558', 10, 7);
innerLight.position.set(0, 0.54, 0);
gui.add(innerLight.position, 'x').min(0).max(7).step(0.01);
gui.add(innerLight.position, 'z').min(0).max(7).step(0.01);
gui.add(innerLight.position, 'y').min(0).max(7).step(0.01);
house.add(innerLight);
//windows
const windowFrontLeft = new THREE.Group();

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);

scene.add(ghost1, ghost2, ghost3);
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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor('#262837');
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost2.castShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle) * 3;

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle) * 4 + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 2.5));
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
const flickerParams = {
    minIntensity: 0.5, // Минимальная интенсивность света
    maxIntensity: 1.5, // Максимальная интенсивность света
    speed: 0.05, // Скорость изменения (меньше = медленнее)
    probability: 0.7, // Вероятность мигания в каждом кадре (0-1)
};

function animate() {
    requestAnimationFrame(animate);

    // Более резкое мигание
    if (Math.random() < 0.1) {
        // 10% шанс мигания в каждом кадре
        // Резкое изменение интенсивности
        doorLight.intensity = Math.random() * 1.5; // Случайное значение от 0.2 до 1.7
    }

    renderer.render(scene, camera);
}

animate();
