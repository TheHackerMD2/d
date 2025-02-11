// Setup basic scene
let scene, camera, renderer, raycaster, mouse, player;
let blockSize = 1;
let blocks = [];
let isPlacingBlock = false;

// Initialize scene
function init() {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create the ground
    let groundGeometry = new THREE.PlaneGeometry(100, 100);
    let groundMaterial = new THREE.MeshBasicMaterial({ color: 0x7cfc00, side: THREE.DoubleSide });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / -2;
    scene.add(ground);

    // Create some blocks (simple cubes for this demo)
    for (let x = -5; x < 5; x++) {
        for (let z = -5; z < 5; z++) {
            let blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
            let blockMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            let block = new THREE.Mesh(blockGeometry, blockMaterial);
            block.position.set(x * blockSize, blockSize / 2, z * blockSize);
            scene.add(block);
            blocks.push(block);
        }
    }

    // Player camera control
    player = new THREE.Object3D();
    camera.position.set(0, 3, 10);
    camera.lookAt(player.position);
    scene.add(camera);

    // Event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);

    animate();
}

// Update mouse position for raycasting
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Raycast and detect clicked block
function onMouseClick(event) {
    raycaster.update();
    let intersects = raycaster.intersectObjects(blocks);
    if (intersects.length > 0) {
        if (event.button === 0) {
            // Left-click for attacking: remove block
            scene.remove(intersects[0].object);
            blocks = blocks.filter(block => block !== intersects[0].object);
        } else if (event.button === 2) {
            // Right-click for placing block
            let newBlock = intersects[0].object.clone();
            newBlock.position.set(intersects[0].object.position.x, intersects[0].object.position.y + blockSize, intersects[0].object.position.z);
            scene.add(newBlock);
            blocks.push(newBlock);
        }
    }
}

// Adjust camera on resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Raycast update each frame
function updateRaycaster() {
    raycaster.update(camera.position, mouse);
}

// Game loop for rendering
function animate() {
    requestAnimationFrame(animate);
    updateRaycaster();
    renderer.render(scene, camera);
}

init();
