/**
 * three-hero.js
 * Three.js animated 3D background for the hero section.
 * Creates a field of floating, rotating geometric shapes
 * that react to mouse movement.
 */

(function () {
  // Only run if Three.js is loaded and the canvas exists
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ---- Scene setup ---- */
  const scene    = new THREE.Scene();
  const W        = canvas.offsetWidth  || window.innerWidth;
  const H        = canvas.offsetHeight || window.innerHeight;
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ---- Lighting ---- */
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const pointLight1 = new THREE.PointLight(0x2563eb, 2, 80);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x38bdf8, 1.5, 80);
  pointLight2.position.set(-15, -10, 5);
  scene.add(pointLight2);

  /* ---- Particle field (small dots) ---- */
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.15,
    transparent: true,
    opacity: 0.6,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ---- Floating geometric shapes ---- */
  const shapes = [];
  const geometries = [
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.TorusGeometry(0.8, 0.3, 8, 16),
  ];

  const materials = [
    new THREE.MeshPhongMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.5 }),
    new THREE.MeshPhongMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 }),
    new THREE.MeshPhongMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.45 }),
    new THREE.MeshPhongMaterial({ color: 0x0ea5e9, wireframe: false, transparent: true, opacity: 0.15,
      side: THREE.DoubleSide }),
  ];

  // Spawn 18 random shapes
  for (let i = 0; i < 18; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geo, mat);

    // Random position spread across the scene
    mesh.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20 - 5
    );

    const s = 0.5 + Math.random() * 2;
    mesh.scale.setScalar(s);

    // Store random rotation speeds
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008,
      rotY: (Math.random() - 0.5) * 0.012,
      rotZ: (Math.random() - 0.5) * 0.006,
      floatSpeed: 0.3 + Math.random() * 0.7,
      floatAmp:   0.5 + Math.random() * 1.5,
      originY:    mesh.position.y,
    };

    scene.add(mesh);
    shapes.push(mesh);
  }

  /* ---- Mouse parallax ---- */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---- Animation loop ---- */
  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);
    clock += 0.01;

    // Rotate all shapes
    shapes.forEach(mesh => {
      mesh.rotation.x += mesh.userData.rotX;
      mesh.rotation.y += mesh.userData.rotY;
      mesh.rotation.z += mesh.userData.rotZ;
      // Gentle float up/down
      mesh.position.y = mesh.userData.originY +
        Math.sin(clock * mesh.userData.floatSpeed) * mesh.userData.floatAmp;
    });

    // Slowly rotate particle field
    particles.rotation.y = clock * 0.03;
    particles.rotation.x = clock * 0.01;

    // Camera parallax follows mouse
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  /* ---- Resize handler ---- */
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
