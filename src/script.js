import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AdditiveAnimationBlendMode } from 'three'
import { Texture , TextureLoader , AdditiveBlending , PointsMaterial} from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


const gui=new dat.GUI()

//texture
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const texture = textureLoader.load('./sun1.jpg')
const texture1 = textureLoader.load('./e2.jpg')
const matcaptexture = textureLoader.load('/textures/matcaps/6.png')

/* const space = textureLoader.load('./galaxy.png')
scene.background = space;
 */

//font
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json',

    (font) =>
    {
        const textGeometry = new TextGeometry(
            'S T A R T U P S H I V E',
            {
                font : font,
                size : 0.25,
                height : 0,
                curveSegments : 4,
                bevelEnabled : true ,
                bevelThickness : 0.009,
                bevelSize : 0.002 , 
                bevelOffset : 0,
                bevelSegments : 6
            }
        )
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial({matcap : matcaptexture})
        const text = new THREE.Mesh(textGeometry , textMaterial)
        text.position.set(3.5, 2.5 , -0.5)
        scene.add(text)
    }
)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//lighting
const light = new THREE.DirectionalLight(0xffffff , 4 );
light.position.set(-4.5 , 2.4 , 0);
scene.add( light );

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(80, 64, 64);

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("./galaxy.png"),
  side: THREE.BackSide,
  //transparent: true,
});
// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
//starMesh.layers.set(1);
scene.add(starMesh);
/**
 * Object
 */
//sun
const geometry = new THREE.SphereGeometry(1.7, 32 , 32)
const material = new THREE.MeshBasicMaterial({ map : texture })
material.color=new THREE.Color("yellow")
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)
sun.position.x=-4.5
sun.position.y=2.4

/* const envtexture = cubeTextureLoader.load(
    [
        '/ptextures/px.png',
        '/ptextures/nx.png',
        '/ptextures/py.png',
        '/ptextures/ny.png',
        '/ptextures/pz.png',
        '/ptextures/nz.png'
    ]
) */
//earth
const geometry1 = new THREE.SphereGeometry(6 , 32 , 32 )
const material1 = new THREE.MeshStandardMaterial({map : texture1})
const earth = new THREE.Mesh(geometry1, material1)
material1.color=new THREE.Color("white")
//material1.envMap = envtexture
scene.add(earth)
earth.position.x=4.13
earth.position.y=-6.89

//gui functions

//sun
const g1 = gui.addFolder('Sun position')
g1.add(sun.position , 'x',-5,5,0.01).name('x-axis')
g1.add(sun.position , 'y',-5,5,0.01).name('y-axis')
g1.add(sun.position , 'z',-5,5,0.01).name('z-axis')
g1.add(sun, 'visible')
g1.add(material,'wireframe')

//earth
const g2 = gui.addFolder('Earth position')
g2.add(earth.position , 'x',-5,5,0.01).name('x-axis')
g2.add(earth.position , 'y',-10,5,0.01).name('y-axis')
g2.add(earth.position , 'z',-5,5,0.01).name('z-axis')
g2.add(earth, 'visible')
g2.add(material1,'wireframe')

gui.hide()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//double click event
window.addEventListener('dblclick' , () => {
    
    if(!document.fullscreenElement)
    {
       canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

 // Controls
/* const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true  */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    sun.rotation.y+=0.00002
    earth.rotation.x+=0.0003
    earth.rotation.y+=0.0003
    starMesh.rotation.y += 0.000125;
    // Update controls
    //controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick() 

