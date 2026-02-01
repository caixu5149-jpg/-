import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// --- Configuration ---
const PARTICLE_COUNT = 700;
const TREE_HEIGHT = 40;
const TREE_RADIUS = 15;
const EMOJIS = ['📦', '🧦', '🔔', '👔', '🌳', '🎅', '❄️', '⭐'];
const COLORS = [0xff0000, 0x00ff00, 0xffd700, 0xffffff, 0x0000ff];

// Animation Easings Registry
const EASINGS = [
    TWEEN.Easing.Linear.None,
    TWEEN.Easing.Quadratic.Out,
    TWEEN.Easing.Cubic.Out,
    TWEEN.Easing.Quartic.Out,
    TWEEN.Easing.Quintic.Out,
    TWEEN.Easing.Sinusoidal.Out,
    TWEEN.Easing.Exponential.Out,
    TWEEN.Easing.Circular.Out,
    TWEEN.Easing.Elastic.Out,
    TWEEN.Easing.Back.Out,
    TWEEN.Easing.Bounce.Out
];

// --- Globals ---
let scene, camera, renderer, composer, controls;
let particlesGroup = new THREE.Group();
let particlesData = []; // { mesh, treePos: Vector3, scatterPos: Vector3, type: 'mesh'|'sprite' }
let photoTextures = [];
let treeTopperLight;

// Interaction State
let handState = 'OPEN'; // 'OPEN', 'FIST', 'PINCH'
let handPositionScreen = new THREE.Vector2(); // 0-1 normalized
let isPinching = false;
let pinchTarget = null; // The object currently being pinched

// Raycaster for interactions
const raycaster = new THREE.Raycaster();

// UI Elements
const videoElement = document.getElementById('input_video');
const statusText = document.getElementById('status-text');
const fileInput = document.getElementById('photo-upload');

init();
initMediaPipe();
animate();

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.02);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 50);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    document.getElementById('container').appendChild(renderer.domElement);

    // Environment Map (Reflections)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Tree Topper Light (The Bulb)
    // Align with the actual top of the particle tree (approx y=25)
    const topY = 25;
    treeTopperLight = new THREE.PointLight(0xffaa00, 5, 50);
    treeTopperLight.position.set(0, topY, 0);
    scene.add(treeTopperLight);

    // Physical topper mesh
    const topperGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const topperMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 2,
        roughness: 0,
        metalness: 1
    });
    const topperMesh = new THREE.Mesh(topperGeo, topperMat);
    topperMesh.position.set(0, topY, 0);
    scene.add(topperMesh);

    // 5. Post Processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.1;
    bloomPass.strength = 0.4;
    bloomPass.radius = 0.1;

    const outputPass = new OutputPass();

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    // 6. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 7. Particles
    createParticles();
    scene.add(particlesGroup);

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize);

    // UI: Photo Upload
    fileInput.addEventListener('change', handleImageUpload);

    // UI: Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}

function createParticles() {
    const geometrySphere = new THREE.SphereGeometry(0.6, 16, 16);
    const geometryBox = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const geometryCone = new THREE.ConeGeometry(0.5, 1, 16);
    const geometryTetra = new THREE.TetrahedronGeometry(0.6);

    // Pre-generate textures for emojis to improve performance
    // Fixed: variable name Emojis -> EMOJIS
    const emojiTextures = EMOJIS.map(emoji => createTextureFromEmoji(emoji));

    // Pool materials to reduce draw calls and memory usage
    const meshMaterials = COLORS.map(color => new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.1,
        metalness: 0.8, // High metalness for reflection
        transparent: true,
        opacity: 0.9
    }));

    const spriteMaterials = emojiTextures.map(tex => new THREE.SpriteMaterial({ map: tex }));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const type = Math.random();
        let mesh;
        let isSprite = false;

        // --- Create Mesh/Sprite ---
        if (type < 0.4) {
            // Primitives (Sphere, Box, Triangle/Cone, Cube)
            let geo;
            const r = Math.random();
            if (r < 0.25) geo = geometrySphere;
            else if (r < 0.5) geo = geometryBox;
            else if (r < 0.75) geo = geometryCone;
            else geo = geometryTetra;

            // Reuse shared material
            const colorIndex = Math.floor(Math.random() * COLORS.length);
            const mat = meshMaterials[colorIndex];
            mesh = new THREE.Mesh(geo, mat);
        } else {
            // Emoji Sprites
            // Reuse shared material
            const emojiIndex = Math.floor(Math.random() * emojiTextures.length);
            const mat = spriteMaterials[emojiIndex];
            mesh = new THREE.Sprite(mat);
            mesh.scale.set(1.5, 1.5, 1.5);
            isSprite = true;
        }

        // --- Positions ---

        // 1. Tree Position (Spiral Cone)
        // Normalized height (0 at bottom, 1 at top)
        const h = Math.random();
        const y = h * TREE_HEIGHT - (TREE_HEIGHT / 2) + 5; // Center vertically somewhat
        const radiusAtHeight = (1 - h) * TREE_RADIUS; // Wider at bottom
        const angle = h * 25 + (Math.random() * Math.PI * 2); // Spiral

        const tx = Math.cos(angle) * radiusAtHeight;
        const tz = Math.sin(angle) * radiusAtHeight;

        const treePos = new THREE.Vector3(tx, y, tz);

        // 2. Scatter Position (Random Cloud)
        const sx = (Math.random() - 0.5) * 60;
        const sy = (Math.random() - 0.5) * 60;
        const sz = (Math.random() - 0.5) * 60;
        const scatterPos = new THREE.Vector3(sx, sy, sz);

        // Initial State
        mesh.position.copy(scatterPos);

        // Add random rotation for meshes
        if (!isSprite) {
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
        }

        mesh.userData = {
            id: i,
            originalScale: mesh.scale.clone(),
            isPhoto: false,
            easing: TWEEN.Easing.Elastic.Out // Default
        };

        particlesGroup.add(mesh);
        particlesData.push({
            mesh: mesh,
            treePos: treePos,
            scatterPos: scatterPos,
            currentVelocity: new THREE.Vector3()
        });
    }
}

function createTextureFromEmoji(emoji) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = '90px serif'; // Large font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

// --- Interaction Logic ---

function updateParticles() {
    // const time = Date.now() * 0.001;
    const dt = 0.05; // Lerp factor

    // Determine target based on state
    const isTreeState = (handState === 'FIST');

    // Group Rotation
    if (handState === 'OPEN' || handState === 'PINCH') {
        // Rotate slowly
        particlesGroup.rotation.y += 0.002;
    } else if (isTreeState) {
        // Rotate faster or settle? Let's rotate gently
        particlesGroup.rotation.y += 0.005;
    }

    // Update each particle
    particlesData.forEach(p => {
        const target = isTreeState ? p.treePos : p.scatterPos;

        // Smoothly interpolate position
        // "Silky smooth" -> Standard lerp or damped spring. Lerp is safest for performance.
        p.mesh.position.lerp(target, dt);

        // Twinkle effect (rotation)
        if (!p.mesh.isSprite) {
            p.mesh.rotation.x += 0.01;
            p.mesh.rotation.y += 0.01;
        }
    });
}

function handlePinchInteraction() {
    if (handState !== 'PINCH' || !isPinching) return;

    // Raycast to find photo/particle
    // Map hand coordinates (0-1) to Normalised Device Coordinates (-1 to 1)
    const ndc = new THREE.Vector2(
        (handPositionScreen.x * 2) - 1,
        -(handPositionScreen.y * 2) + 1
    );

    raycaster.setFromCamera(ndc, camera);
    const intersects = raycaster.intersectObjects(particlesGroup.children);

    if (intersects.length > 0) {
        const target = intersects[0].object;

        // If it's the first time pinching this object
        if (pinchTarget !== target) {
            pinchTarget = target;

            // Check if it's a photo or just a regular particle
            // We animate regardless for "feedback"

            // Get unique easing function if it's a photo, else default
            const easingFunc = target.userData.easing || TWEEN.Easing.Elastic.Out;

            // Animation: Zoom particle towards camera or just enlarge
            new TWEEN.Tween(target.scale)
                .to({ x: target.userData.originalScale.x * 3, y: target.userData.originalScale.y * 3, z: target.userData.originalScale.z * 3 }, 500)
                .easing(easingFunc) // Use unique easing
                .start();

            // If it is a photo, add glow effect (Visual Only, dealt with in Bloom/Material)
            if (target.userData.isPhoto) {
                target.material.emissive = new THREE.Color(0x555555);
                target.material.emissiveIntensity = 1;
            }
        }
    }
}

function resetPinchTargets() {
    if (pinchTarget) {
        // Reset scale
        new TWEEN.Tween(pinchTarget.scale)
            .to({ x: pinchTarget.userData.originalScale.x, y: pinchTarget.userData.originalScale.y, z: pinchTarget.userData.originalScale.z }, 500)
            .easing(TWEEN.Easing.Back.Out)
            .start();

        if (pinchTarget.userData.isPhoto) {
            pinchTarget.material.emissive = new THREE.Color(0x000000);
            pinchTarget.material.emissiveIntensity = 0;
        }

        pinchTarget = null;
    }
}

// --- MediaPipe Hand Tracking ---

function initMediaPipe() {
    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onHandResults);

    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
    });

    cameraUtils.start()
        .then(() => statusText.innerText = "Camera Active - Show Hand")
        .catch(e => statusText.innerText = "Camera Error: " + e.message);
}

function onHandResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // 1. Detect Gesture
        // Thumb Tip: 4, Index Tip: 8, Middle Tip: 12, Ring Tip: 16, Pinky Tip: 20
        // Wrist: 0

        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        const wrist = landmarks[0];

        // Calculate distance between Thumb and Index (Pinch)
        const pinchDist = distance(thumbTip, indexTip);

        // Calculate average distance of fingertips from wrist (Fist vs Open)
        const avgFingerDist = (
            distance(indexTip, wrist) +
            distance(middleTip, wrist) +
            distance(ringTip, wrist) +
            distance(pinkyTip, wrist)
        ) / 4;

        // Detect State
        // Thresholds need tuning. Coordinates are 0-1.
        if (pinchDist < 0.05) {
            handState = 'PINCH';
            isPinching = true;
        } else if (avgFingerDist < 0.3) { // Curled fingers are close to wrist
            handState = 'FIST';
            isPinching = false;
            resetPinchTargets();
        } else {
            handState = 'OPEN';
            isPinching = false;
            resetPinchTargets();
        }

        // 2. Update Hand Position for Interaction
        // Use Index Finger Tip or center of palm (0 or 9)
        // MediaPipe X is mirrored? Usually 0 is left, 1 is right.
        // We want screen coordinates.
        // Invert X because webcam is mirrored usually.
        handPositionScreen.set(1 - landmarks[9].x, landmarks[9].y);

        // Update Status for debugging
        // statusText.innerText = `State: ${handState}`;

    } else {
        // No hands
    }
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
}

// --- Photo Upload Logic ---
function handleImageUpload(e) {
    const files = e.target.files;
    if (!files.length) return;

    // Load each file
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            const tex = new THREE.TextureLoader().load(img.src);
            tex.colorSpace = THREE.SRGBColorSpace;

            // Find a random primitive mesh (not a sprite) to replace
            // Or create a new one? Requirement says "photos appear in particles"
            // Let's replace some existing ones.
            const candidates = particlesData.filter(p => !p.mesh.isSprite && !p.mesh.userData.isPhoto);

            if (candidates.length > 0) {
                const targetP = candidates[Math.floor(Math.random() * candidates.length)];

                // Replace geometry with a plane or box with the photo
                // Actually, let's just map it to the box/sphere
                // For Sphere, it might look warped. Plane is best for photos.

                // Create new Mesh
                const newGeo = new THREE.PlaneGeometry(2, 2); // Bigger?
                const newMat = new THREE.MeshStandardMaterial({
                    map: tex,
                    side: THREE.DoubleSide,
                    roughness: 0.2,
                    metalness: 0.1
                });

                const oldMesh = targetP.mesh;
                const newMesh = new THREE.Mesh(newGeo, newMat);

                newMesh.position.copy(oldMesh.position);
                newMesh.userData = oldMesh.userData;
                newMesh.userData.isPhoto = true;
                newMesh.userData.originalScale = new THREE.Vector3(1, 1, 1);

                // Assign Unique Easing Function
                newMesh.userData.easing = EASINGS[Math.floor(Math.random() * EASINGS.length)];

                // Swap in scene/group
                particlesGroup.remove(oldMesh);
                particlesGroup.add(newMesh);
                targetP.mesh = newMesh;

                // Apply "Appearance" effect (Requirement: smooth appearance)
                newMesh.scale.set(0,0,0);
                new TWEEN.Tween(newMesh.scale)
                    .to({x:1, y:1, z:1}, 1000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
            }
        };
        reader.readAsDataURL(file);
    });
}

// --- Main Loop ---

function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();
    controls.update();

    updateParticles();

    if (handState === 'PINCH') {
        handlePinchInteraction();
    }

    // Replace renderer.render with composer.render for Bloom
    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
