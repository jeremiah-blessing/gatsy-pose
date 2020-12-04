import * as THREE from 'three'
import './OrbitControls'
import './OBJLoader'

export const setup = () => {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

	camera.position.z = 2000;

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight / 1.2);
	document.getElementById('avatar-viewer').appendChild(renderer.domElement)

	var controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.campingFactor = 0.25
	controls.enableZoom = true

	var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0)
	keyLight.position.set(-100, 0, 100)

	var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 1.0)
	fillLight.position.set(100, 0, 100)

	var backLight = new THREE.DirectionalLight(0xffffff, 1.0)
	backLight.position.set(-100, 0, -100).normalize()


	scene.add(keyLight)
	scene.add(fillLight)
	scene.add(backLight)

	var objLoader = new THREE.OBJLoader()
	objLoader.load('https://esatta-audio.s3.amazonaws.com/avatar-PYJLXL.obj', function (object) {
		object.position.y -= 1000
		scene.add(object)
	})

	var animate = function () {
		requestAnimationFrame(animate);
		controls.update()
		renderer.render(scene, camera);
	};

	animate()
}
