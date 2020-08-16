import React from 'react';
import SceneComponent from 'babylonjs-hook';
import './App.css';
import * as BABYLON from'@babylonjs/core';
import { Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, Mesh, SceneLoader, StandardMaterial,Texture,Color3 } from '@babylonjs/core';
import "@babylonjs/loaders/glTF"

let box: Mesh | undefined;

const onSceneReady = (scene: Scene) => {
  console.log('scene ready:', scene);

  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  var materialWood = new StandardMaterial("wood", scene);
    materialWood.diffuseTexture = new Texture("textures/crate.png", scene);
    materialWood.emissiveColor = new Color3(0.5, 0.5, 0.5);

  var dummyBox = Mesh.CreateSphere("Sphere0", 16, 3, scene);
    dummyBox.checkCollisions = true


    // physics
    // scene.collisionsEnabled = true;
    // scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
    SceneLoader.ImportMesh(
      "",
      "https://models.babylonjs.com/",
      "shark.glb",
        scene,
        function (sharkMesh) {
            var shark = sharkMesh[0]
            console.log("shark is",shark)
            // selecting the mesh we will animate later on scene.registerBeforeRender()
            
            // shark.position= new BABYLON.Vector3(150, -20, 150);
            
            // shark.parent = dummyBox

            // dummyBox.parent = camera
            // shark.parent = dummyBox
            dummyBox.parent = camera
            shark.parent = dummyBox
            console.log("shark parent is", shark.parent)
            dummyBox.position = new Vector3(0, -5, 20);
            dummyBox.material = materialWood
            dummyBox.checkCollisions = true;


            }
       );


  const canvas: HTMLCanvasElement = scene.getEngine()!.getRenderingCanvas()!;

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", {size: 2}, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  var ground = BABYLON.Mesh.CreateBox("Ground", 5, scene);
    ground.scaling = new BABYLON.Vector3(500, 1, 500);
    ground.position.y = -5.0;
    // ground.checkCollisions = true;
    console.log("ground id is", ground.uniqueId)

    var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
    border0.scaling = new BABYLON.Vector3(1, 300, 300);
    border0.position.y = -5.0;
    border0.position.x = -250.0;
    border0.checkCollisions = true;
    border0.setEnabled(false)

    var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
    border1.scaling = new BABYLON.Vector3(1, 300, 300);
    border1.position.y = -5.0;
    border1.position.x = 250.0;
    border1.checkCollisions = true;
    border1.setEnabled(false)

    var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
    border2.scaling = new BABYLON.Vector3(300, 300, 1);
    border2.position.y = -5.0;
    border2.position.z = 250.0;
    border2.checkCollisions = true;
    border2.setEnabled(false)

    var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
    border3.scaling = new BABYLON.Vector3(300, 300, 1);
    border3.position.y = -5.0;
    border3.position.z = -250.0;
    border3.checkCollisions = true;
    border3.setEnabled(false)



    var groundTexture = new BABYLON.Texture("//www.babylonjs.com/assets/sand.jpg", scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;
    ground.material = groundMaterial;

    // border0.material = groundMaterial;
    // border1.material = groundMaterial;
    // border2.material = groundMaterial;
    // border3.material = groundMaterial;
    ground.receiveShadows = true;

    // Material
    var materialAmiga = new BABYLON.StandardMaterial("amiga", scene);
    materialAmiga.diffuseTexture = new BABYLON.Texture("/amiga.jpg", scene);
    materialAmiga.emissiveColor = new BABYLON.Color3(0.23, 0.29, 0.55);
    // materialAmiga.diffuseTexture.uScale = 5;
    // materialAmiga.diffuseTexture.vScale = 5;

    var materialAmiga2 = new BABYLON.StandardMaterial("amiga", scene);
    materialAmiga2.diffuseTexture = new BABYLON.Texture("/amiga.jpg", scene);
    materialAmiga2.emissiveColor = new BABYLON.Color3(0.25, 0.53, 0.6);

    var materialWood = new BABYLON.StandardMaterial("wood", scene);
    materialWood.diffuseTexture = new BABYLON.Texture("/crate.png", scene);
    materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    

    var y = 0;
    let spheres = []
    for (var index = 0; index < 100; index++) {
        var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 10, scene);
        sphere.material = materialAmiga;

        // if(index > 50)sphere.material = materialWood
        if (index > 1)sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);
        // sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);

        // shadowGenerator.addShadowCaster(sphere);

        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
        spheres.push(sphere)
        sphere.checkCollisions = true;
        y += 2;
    }
}

const onRender = (scene: Scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
  }
}

export default () => (
    <div>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id='my-canvas' />
    </div>
)
