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

    window.addEventListener( 'mousemove', onDocumentMouseMove, false );

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const scene = new THREE.Scene();

    const roomEnviroment = new THREE.RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnviroment, 0.04).texture;

    let camera;
    const loader = new THREE.GLTFLoader();
    const url = 'assets/glb/smartphone.glb';

    let model = null;
    loader.load(
        url,
        function (gltf) {
            model = gltf.scene;
            scene.add(model);
            camera = gltf.cameras[0];
            render();
        },
        undefined, function (e) {
            console.log(e);
        }
    );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    const mouse = new THREE.Vector2();
    const windowHalf = new THREE.Vector2(
        windowW / 2,
        windowH / 2
    );

    function onDocumentMouseMove( event ) {
        mouse.x = (event.clientX - windowHalf.x) / windowHalf.x;
        mouse.y = (event.clientY - windowHalf.y) / windowHalf.y;
        scene.traverse(function(obj) {
            if (obj.isMesh) {
                obj.rotation.y = mouse.x / 2;
                obj.rotation.x = mouse.y / 2;
            }
        });
    }

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
