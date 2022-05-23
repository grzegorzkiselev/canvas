// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
    antialias: true
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404040, 4);
  // ambientLight.castShadow = true;
  // ambientLight.shadow.camera.far = 15
  // ambientLight.shadow.mapSize.set(1024, 1024)
  // ambientLight.shadow.normalBias = 0.05
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(2048, 2048)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0, 3, 0)
  scene.add(directionalLight)

  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

  // Setup a material
    colorCount = 10;
    const palette = random.shuffle(random.pick(palettes))
    .slice(0, colorCount);

  // Setup a mesh with geometry + material

  const meshes = new THREE.Group();

  const sceneX = 1;
  const sceneZ = 1;

  for (let i = 0; i < 10; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
        roughness: 0,
      })
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.position.set(
      Math.random() * sceneX,
      Math.random(),
      Math.random() * sceneZ
    );
    mesh.scale.multiplyScalar(0.2);
    mesh.scale.y = mesh.scale.y * Math.random();
    meshes.add(mesh)
  };

  scene.add(meshes);

  scene.translateX(sceneX / -2);
  scene.translateZ(sceneZ / -2);
  console.log(scene);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;
      
      renderer.physicallyCorrectLights = true
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ReinhardToneMapping
      renderer.toneMappingExposure = 3
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      // Ortho zoom
      const zoom = 1.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      // camera.position.set(0, 0, 1);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },

    // Update & render your scene here
    render({ time }) {

      camera.position.x = Math.cos(time * 0.5);
      camera.position.z = Math.sin(time * 0.5);

      for (let x = 0; x < meshes.children.length; x++) {
        currentMesh = meshes.children[x];
        currentMesh.scale.x = (Math.cos((time * 0.1) * (x + 1)) * 0.2) + 0.1;
        currentMesh.scale.y = (Math.sin((time * 0.1) * (x + 1)) * 0.5) + 1;
        currentMesh.scale.z = (Math.sin((time * 0.1) * (x + 1)) * 0.7) + 0.1;
      }

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);