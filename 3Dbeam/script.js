let scene, camera, renderer, beam, deflectionLine;

function init() {
    // Create the scene
    scene = new THREE.Scene();
    
    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10; // Adjusted to ensure we see the beam

    // Set up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas').appendChild(renderer.domElement);
    
    // Add lighting
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Initialize beam
    const beamGeometry = new THREE.BoxGeometry(5, 0.2, 0.2);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    beam = new THREE.Mesh(beamGeometry, beamMaterial);
    scene.add(beam);

    // Initialize deflection line
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([]);
    deflectionLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(deflectionLine);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function calculateDeflection() {
    const length = parseFloat(document.getElementById('length').value);
    const load = parseFloat(document.getElementById('load').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const youngsModulus = parseFloat(document.getElementById('youngsModulus').value);

    if (isNaN(length) || isNaN(load) || isNaN(distance) || isNaN(youngsModulus) || length <= 0 || load <= 0 || distance < 0 || youngsModulus <= 0) {
        alert("Please enter valid positive numbers.");
        return;
    }

    // Calculate deflection
    const momentOfInertia = (1 / 12) * (length ** 4); // Simplified
    const deflection = (load * Math.pow(distance, 2) * (3 * length - distance)) / (6 * youngsModulus * momentOfInertia);
    
    document.getElementById('deflection').textContent = deflection.toFixed(4);

    // Update the 3D visualization
    updateBeam(length, deflection);
}

function updateBeam(length, deflection) {
    const scale = 10; // Scale factor for visualization

    // Update beam geometry
    beam.geometry.dispose(); // Dispose of the old geometry to prevent memory leaks
    beam.geometry = new THREE.BoxGeometry(length * scale, 0.2, 0.2);
    beam.position.set(0, 0, 0);

    // Create deflection line
    const points = [];
    const step = length / 20;
    for (let x = 0; x <= length; x += step) {
        const y = deflection * Math.sin((Math.PI * x) / length); // Simple sine function for deflection
        points.push(new THREE.Vector3(x - length / 2, y * scale, 0));
    }
    deflectionLine.geometry.dispose(); // Dispose of the old geometry to prevent memory leaks
    deflectionLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
    deflectionLine.geometry.attributes.position.needsUpdate = true;
}

window.onload = init;
