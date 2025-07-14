// spatial-canvas-threejs.js
// Three.js scene: grid, animated primitives, fog, lighting, and orbit controls

(function () {
  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xcce0ff, 5, 25); // 🌫️ Blue fog
  const camera = new THREE.PerspectiveCamera(60, 800 / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(800, 400);
  renderer.setClearColor(0xcce0ff); // match fog color
  document.getElementById('threejs-container-2').appendChild(renderer.domElement);

  // Grid
  const grid = new THREE.GridHelper(20, 40, 0x999999, 0xcccccc);
  scene.add(grid);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.3);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // 🟥 Rotating Box
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x3264a8, metalness: 0.3, roughness: 0.5 })
  );
  box.position.set(-5, 1, 0);
  scene.add(box);

  // 🟠 Bouncing Sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.2, roughness: 0.4 })
  );
  sphere.position.set(0, 1.2, 0);
  scene.add(sphere);

  // 🟢 Cylinder
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 2, 32),
    new THREE.MeshStandardMaterial({ color: 0x4caf50, metalness: 0.1, roughness: 0.6 })
  );
  cylinder.position.set(5, 1, 0);
  scene.add(cylinder);

  // 💗 Cone
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    new THREE.MeshStandardMaterial({ color: 0xe91e63, metalness: 0.1, roughness: 0.3 })
  );
  cone.position.set(2.5, 1, -4);
  scene.add(cone);

  // 💜 Torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.3, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x9c27b0, metalness: 0.5, roughness: 0.2 })
  );
  torus.position.set(-2.5, 1, -4);
  scene.add(torus);

  // 🔷 Icosahedron
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 0),
    new THREE.MeshStandardMaterial({ color: 0x00bcd4, flatShading: true })
  );
  ico.position.set(0, 1.5, -6);
  scene.add(ico);

  // Camera
  camera.position.set(8, 5, 10);
  camera.lookAt(0, 1, 0);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.target.set(0, 1, 0);
  controls.minDistance = 5;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2; // Prevent camera from flipping below

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Animations
    box.rotation.y += 0.01;
    box.rotation.x += 0.005;

    torus.rotation.y += 0.03;

    sphere.position.y = 1.2 + Math.sin(Date.now() * 0.002) * 0.3;

    ico.rotation.y += 0.01;
    ico.rotation.x += 0.005;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})()