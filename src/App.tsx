import React from 'react';
import SceneComponent from 'babylonjs-hook';
import './App.css';
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
    SceneLoader.ImportMesh(
      "",
      "https://models.babylonjs.com/",
      "shark.glb",
        scene,
        function (sharkMesh) {
            var shark = sharkMesh
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
  MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
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
