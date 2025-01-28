function renderTileModel(containerId, stlFile) {
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0xffffff, 1); // Set background to white
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const loader = new THREE.STLLoader();
    loader.load(stlFile, function (geometry) {
        geometry.center(); // Center the geometry
        const material = new THREE.MeshStandardMaterial({ color: 0x004080 }); // Make initial color duller
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        if (containerId === 'model3') {
            mesh.position.x -= 10; // Move Squishy Waffle slightly more to the left
            camera.position.set(0, 0, 150); // Zoom out for Squishy Waffle
        } else if (containerId === 'model5') {
            camera.position.set(0, 0, 80); // Zoom in for Grabbing Claw
        } else if (containerId === 'model6' || containerId === 'model7') {
            mesh.rotation.x = Math.PI / 2; // Rotate Catapult and Skibidi Toilet 90 degrees along the x-axis
            mesh.scale.z *= -1; // Reflect Catapult and Skibidi Toilet vertically
            if (containerId === 'model7') {
                mesh.scale.x *= -1; // Reflect Skibidi Toilet along the x-axis
            }
            camera.position.set(0, 0, 120); // Adjust camera position for Catapult and Skibidi Toilet
        } else {
            camera.position.set(0, 0, 100); // Default camera position
        }

        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(1, 1, 1).normalize();
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(-1, 1, 1).normalize();
        scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xffffff, 0.5); // Dimmer light
        light3.position.set(0, -1, 1).normalize();
        scene.add(light3);

        let colorChange = 0;
        const animate = function () {
            requestAnimationFrame(animate);
            if (containerId === 'model6' || containerId === 'model7') {
                mesh.rotation.z -= 0.01; // Reverse rotation for Catapult and Skibidi Toilet along the z-axis
            } else {
                mesh.rotation.y += 0.01; // Horizontal rotation for other models
            }
            colorChange += 0.2; // Slow down speed of color change
            const color = new THREE.Color(`hsl(${(colorChange % 360)}, 50%, 40%)`); // Make color duller
            material.color = color; // Change model color
            renderer.render(scene, camera);
        };
        animate();
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function renderSubpageModel(containerId, stlFile, modelId) {
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0xffffff, 1); // Set background to white
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = true; // Enable user interaction on subpage
    controls.enableZoom = true; // Enable user interaction on subpage

    const loader = new THREE.STLLoader();
    loader.load(stlFile, function (geometry) {
        geometry.center(); // Center the geometry
        const material = new THREE.MeshStandardMaterial({ color: 0x004080 }); // Make initial color duller
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        if (modelId === 'model3-sub') {
            mesh.position.x -= 10; // Move Squishy Waffle slightly more to the left
            camera.position.set(0, 0, 150); // Zoom out for Squishy Waffle
            controls.target.set(-10, 0, 0); // Center controls target
        } else if (modelId === 'model5-sub') {
            camera.position.set(0, 0, 80); // Zoom in for Grabbing Claw
            controls.target.set(0, 0, 0); // Center controls target
        } else if (modelId === 'model6-sub' || modelId === 'model7-sub') {
            mesh.rotation.x = Math.PI / 2; // Rotate Catapult and Skibidi Toilet 90 degrees along the x-axis
            mesh.scale.z *= -1; // Reflect Catapult and Skibidi Toilet vertically
            if (modelId === 'model7-sub') {
                mesh.scale.y *= -1; // Reflect Skibidi Toilet along the x-axis
            }
            camera.position.set(0, 0, 120); // Adjust camera position for Catapult and Skibidi Toilet
            controls.target.set(0, 0, 0); // Center controls target
        } else {
            camera.position.set(0, 0, 100); // Default camera position
            controls.target.set(0, 0, 0); // Center controls target
        }
        controls.update(); // Update controls after setting camera position and target

        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(1, 1, 1).normalize();
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(-1, 1, 1).normalize();
        scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xffffff, 0.5); // Dimmer light
        light3.position.set(0, -1, 1).normalize();
        scene.add(light3);

        const render = function () {
            requestAnimationFrame(render);
            light1.position.copy(camera.position);
            light1.lookAt(controls.target);
            renderer.render(scene, camera);
        };
        render();
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

renderTileModel('model1', 'flexirex.stl');
renderTileModel('model3', 'squishywaffle.stl'); // Add new model
renderTileModel('model4', 'infinitycube.stl'); // Add Infinity Cube model
renderTileModel('model5', 'grabbingclaw.stl'); // Add Grabbing Claw model
renderTileModel('model6', 'catapult.stl'); // Add Catapult model
renderTileModel('model7', 'skibiditoilet.stl'); // Add Skibidi Toilet model
// Add more renderTileModel calls as needed

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const modelId = tile.querySelector('.model-container').id;
        window.location.href = `subpage.html?model=${modelId}`;
    });
});
