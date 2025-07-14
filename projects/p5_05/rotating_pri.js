// rotating-primitives.js
// Three.js scene: rotating pastel primitives with fog, dramatic lighting, and orbit controls

(function () {
  // Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 800 / 400, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(800, 400);
  renderer.setClearColor(0xe6f3ff);
  document.getElementById('threejs-container-3').appendChild(renderer.domElement);

  // Fog
  scene.fog = new THREE.Fog(0xe6f3ff, 5, 25);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Pastel color palette
  const colors = [0xff99cc, 0xcc99ff, 0x99ffcc]; // Pink, lilac, mint

  // Cube
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshPhongMaterial({ color: colors[0], shininess: 80 })
  );
  cube.position.set(-5, 1, 0);
  scene.add(cube);

  // Torus (Donut)
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.4, 16, 100),
    new THREE.MeshPhongMaterial({ color: colors[1], shininess: 100 })
  );
  torus.position.set(0, 2, 3);
  scene.add(torus);

  // Icosahedron
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, 0),
    new THREE.MeshPhongMaterial({ color: colors[2], flatShading: true })
  );
  ico.position.set(6, 3, -2);
  scene.add(ico);

  // Camera
  camera.position.set(-10, 8, 10);
  camera.lookAt(0, 2, 0);

  // Orbit Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 6;
  controls.maxDistance = 50;
  controls.target.set(0, 2, 0);

  // Animate
  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.y += 0.01;
    cube.rotation.x += 0.005;

    torus.rotation.y += 0.02;
    torus.rotation.z += 0.01;

    ico.rotation.y += 0.03;
    ico.rotation.x += 0.015;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
})();
