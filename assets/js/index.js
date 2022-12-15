window.addEventListener('DOMContentLoaded', init);

function init() {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas')
    });

    const container = document.getElementById('canvasBox');
    let windowW = window.innerWidth;
    let windowH = window.innerHeight;
    let parentW = container.clientWidth;
    let parentH = container.clientHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(parentW, parentH);
    renderer.setClearColor(0x000000, 0);
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const scene = new THREE.Scene();

    const roomEnviroment = new THREE.RoomEnvironment();
    scene.background = null;
    scene.environment = pmremGenerator.fromScene(roomEnviroment, 0.04).texture;

    let camera;
    const loader = new THREE.GLTFLoader();
    loader.load("/assets/glb/smartphone.glb", (gltf) => {
        const model = gltf.scene;
        model.traverse((obj) => {
            if (obj.isMesh) {
                obj.receiveShadow = true;
                obj.castShadow = true;
            }
        });
        scene.add(model);
        camera = gltf.cameras[0];
        render();
    });

    const mouse = new THREE.Vector2();
    const windowHalf = new THREE.Vector2(
        windowW / 2,
        windowH / 2
    );

    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX - windowHalf.x) / windowHalf.x;
        mouse.y = (event.clientY - windowHalf.y) / windowHalf.y;
        scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.rotation.y = mouse.x / 2;
                obj.rotation.x = mouse.y / 2;
            }
        });
    });

    const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
}
