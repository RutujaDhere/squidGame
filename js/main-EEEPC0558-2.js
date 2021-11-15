const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xb7c3f3, 1);
const light = new THREE.AmbientLight( 0xffffff ); 
scene.add( light );

//Global Variables
const start_postion = 5;
const end_position = -start_postion;
const text = document.querySelector(".text");
const TIME_LIMIT = 10;
let gameStat = "loading";

function delay(ms) {
    return new Promise(resolve=> setTimeout(resolve, ms));
}


function createCube(size, positionX, rotY = 0, color=0xfbc851) {
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x=positionX;
    cube.rotation.y = rotY;
    scene.add( cube );
    return cube;
}

camera.position.z = 5;


const loader = new THREE.GLTFLoader();

class Doll{
    constructor() {
        loader.load("../model/scene.gltf", (gltf) =>     {
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4,0.4,0.4);
            gltf.scene.position.set(0,-1,0);
            this.doll= gltf.scene;
        })
    }
    lookBackward() {
        gsap.to(this.doll.rotation,{y: -3.15, duration: 0.45})
    }
    lookforward() {
        gsap.to(this.doll.rotation,{y: 0, duration: 0.45})
    }

    async start () {
        this.lookBackward()
        await delay(1000)
        this.lookforward()
        await delay(1000)
        this.start()
    }
}

class Player {
    constructor() {
        const geometry = new THREE.SphereGeometry( .3, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z =1;
        sphere.position.x = start_postion;
        scene.add( sphere );
        this.player = sphere;
        this.playerInfo = {
            positionX : start_postion,
            velocity : 0
        }
    }

    run() {
        this.playerInfo.velocity = 0.03
    }

    stop() {
        gsap.to(this.playerInfo ,{velocity: 0, duration: .1})
    }

    check() {
        
    }

    update() {
        this.check();
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x =   this.playerInfo.positionX;
    }

   
}

function createTrack() {
    createCube({w: start_postion *2 + 0.2, h:1.5,d:1}, 0, 0, 0xe5a716).position.z = -1;
    createCube({w: .2, h:1.5,d:1}, start_postion, -.35);
    createCube({w: .2, h:1.5,d:1}, end_position, .35);
  
}
createTrack();

const player = new Player();
let doll = new Doll();


function startGame() {
    gameStat = "started";
    let progressBar = createCube({w: 5, h:.1,d:1}, 0,0, 0x3CCE25);
    progressBar.position.y = 3.35
    gsap.to(progressBar.scale,{x: 0, duration: TIME_LIMIT, ease: "none"})
    doll.start()
}


async function init() {
    await delay(500)
    text.innerText = "Starting in 3";
    await delay(500)
    text.innerText = "Starting in 2";
    await delay(500)
    text.innerText = "Starting in 1";
    await delay(500)
    text.innerText = "Go";
    startGame();
}

init();

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    player.update();
}
animate();

window.addEventListener('keydown', (e) => {
    if(gameStat != "started") return
    if(e.key == "ArrowUp") {
        player.run();
    }
})

window.addEventListener('keyup', (e) => {
    if(e.key == "ArrowUp") {
        player.stop();  
    }
})

window.addEventListener( 'resize', onWindowResize, false )
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
}