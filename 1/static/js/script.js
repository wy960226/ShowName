console.clear();
let camera, scene, renderer, uniforms;
const $ = document.querySelector.bind(document);

const canvas = $("#canvas");
const vert = $('script[type=vert]').textContent.trim();
const frag = $('script[type=frag]').textContent.trim();
const gui = new dat.GUI();
const tl = gsap.timeline();
const clock = new SpeedClock();
const onUpdateSpeed = () => {
  clock.speedFactor = params.speed;
  uniforms.swirlIntensity.value = params.swirlIntensity;
  gui.updateDisplay();
};

const params = { 
  speed: 0,
  swirlIntensity: 10,
  start: () => {
    tl.clear();
    tl.set(params, {speed: 0});
    tl.to(params, {
      speed:5,
      swirlIntensity: 20,
      duration: 4, 
      onUpdate: onUpdateSpeed
    });
  },
  stop: () => {
    tl.clear();
    tl.to(params, {
      speed:0, 
      swirlIntensity: 10,
      duration: 1, 
      onUpdate: onUpdateSpeed
    });
  }
}




init();
animate();

function init() {
  clock.start(0);
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
    swirlIntensity: { value: 10 }
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({canvas});
  renderer.setPixelRatio(window.devicePixelRatio);
  onResize();
  window.addEventListener('resize', onResize, false);
  
  gui.add(params, 'speed').min(-10).max(10).step(.1).onChange(() => {
    clock.speedFactor = params.speed;
  })
  gui.add(params, 'swirlIntensity').min(0).max(100).step(.1).onChange(() => {
    uniforms.swirlIntensity.value = params.swirlIntensity;
  });
  
  gui.add(params, 'start')
  gui.add(params, 'stop')
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.resolution.value.x = renderer.domElement.width;
  uniforms.resolution.value.y = renderer.domElement.height;
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  uniforms.time.value = clock.elapsedTime;
  renderer.render(scene, camera);
}