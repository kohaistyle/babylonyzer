var fxFloorWave = {
    
    // Private Fx
    scene:0,
    camera : 0,
    lensEffect: 0,

    // Private Meshes 
    newInstance: 0,

    // Private Layers
    gui: 0,
    layerScale: 0,
    layerScale2: 0,
    layerRing1: 0,
    layerRing2: 0,
    layerCred: 0,  
      
    init: function(engine, canvas, assets) {
    
    var scene = new BABYLON.Scene(engine);
    fxFloorWave.scene = scene;
    scene.shadowsEnabled = true;
    
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12,  new BABYLON.Vector3(128, 5, 128), scene);
    camera.setPosition(new BABYLON.Vector3(280,-25,115));
    camera.attachControl(canvas, false);
    
    fxFloorWave.camera = camera;
    fxFloorWave.camera.fov = 70;
    
                   
    // Add a light
    var light = new BABYLON.PointLight("Dir", new BABYLON.Vector3(128, 50, 128), scene);
    light.diffuse = new BABYLON.Color3(0.8, 0.19, 0.5);
    
    var meshGround = BABYLON.Mesh.CreateGround("ground1", 2000, 2000, 50, scene);
    var meshMain = BABYLON.Mesh.CreateCylinder("cylinder", 3, 18, 18, 6, 1, scene, false);

    var materialGround = new BABYLON.StandardMaterial("matWire", fxFloorWave.scene);
    materialGround.wireframe = true;
    materialGround.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
 
    var materialCyl = new BABYLON.StandardMaterial("matCyl", fxFloorWave.scene);
    materialCyl.diffuseColor = new BABYLON.Color3(0.5, 0.2, 0.7);
    materialCyl.emissiveColor = new BABYLON.Color3(0.40, 0.20, 0.37);
    materialCyl.reflectionTexture = new BABYLON.Texture("assets/spheremap.jpg", scene);
    materialCyl.reflectionTexture.level = 0.3;
    materialCyl.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    
    meshMain.material = materialCyl;
    
    meshGround.material = materialGround;
    meshGround.position = new BABYLON.Vector3(128,-5,128);
    fxFloorWave.newInstance = new Array();
    
  
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

    
    var radius=8.0;
    var TWO_PI = Math.PI * 2;
    
    
      var index=0, m=0;
      var xg = 16, zg = 16;
      
      for (var x = 0; x<xg; x++)
        for (var z = 0; z<zg; z++)
          {
          fxFloorWave.newInstance[index] = meshMain.createInstance("i" + index);

          if(x%2)
      		  fxFloorWave.newInstance[index].position = new BABYLON.Vector3(x*xg, 0, z*zg);
          else	
      		  fxFloorWave.newInstance[index].position = new BABYLON.Vector3(x*xg, 0, (z*zg)+8);
            
          shadowGenerator.getShadowMap().renderList.push(fxFloorWave.newInstance[index]);
          fxFloorWave.newInstance[index].receiveShadow = true;         
          index++;
          
          }
          
    // CREATE LAYERS
    this.gui = new bGUI.GUISystem(this.scene, engine.getRenderWidth(), engine.getRenderHeight());
    
    // Layers
    this.layerScale = new bGUI.GUIPanel("scale2", assets["scale2"], null, this.gui);
    this.layerScale.relativePosition(new BABYLON.Vector3(0.3, 0.7, 0));
    this.layerScale.mesh.scaling = new BABYLON.Vector3(1024,100,0);
    //this.layerScale.mesh.material.alpha = 0.5;
    this.layerScale.mesh.material.diffuseTexture.uScale = 7;
    
    this.layerScale2 = new bGUI.GUIPanel("scale2", assets["scale2"], null, this.gui);
    this.layerScale2.relativePosition(new BABYLON.Vector3(0.7, 0.3, 0));
    this.layerScale2.mesh.scaling = new BABYLON.Vector3(1024,100,0);
    //this.layerScale.mesh.material.alpha = 0.5;
    this.layerScale2.mesh.material.diffuseTexture.uScale = 7;
    
    this.layerRing2 = new bGUI.GUIPanel("ring5", assets["ring5"], null, this.gui);
    this.layerRing2.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
    this.layerRing2.mesh.scaling = new BABYLON.Vector3(1024,1024,0);    
    this.layerRing2.fadein(4000);
    this.layerRing2.mesh.material.alpha = 0.5;
    this.layerRing1 = new bGUI.GUIPanel("ring6", assets["ring6"], null, this.gui);
    this.layerRing1.relativePosition(new BABYLON.Vector3(0.8, 0.5, 0));
    this.layerRing1.fadein(2000);

    this.layerCred = [];
    this.layerCred[1] = new bGUI.GUIPanel("kohai", assets["cred1"], null, this.gui);
    this.layerCred[1].relativePosition(new BABYLON.Vector3(0.2, 0.5, 0));
    this.layerCred[1].fadein(3000);
    this.layerCred[2] = new bGUI.GUIPanel("stv", assets["cred2"], null, this.gui);
    this.layerCred[2].relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
    this.layerCred[2].fadein(6000);
    this.layerCred[3] = new bGUI.GUIPanel("delta", assets["cred3"], null, this.gui);
    this.layerCred[3].relativePosition(new BABYLON.Vector3(0.8, 0.5, 0));
    this.layerCred[3].fadein(8000);        


    
        
    // POSTPROCESS
    var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
        edge_blur: 2.0,
        chromatic_aberration: 1.0,
        distortion: 2.0,
        dof_focus_distance: 40.0,
        dof_aperture: 6.0,
        grain_amount: 3.0,
        dof_pentagon: true,
        dof_gain: 1.0,
        dof_threshold: 1.0,
        dof_darken: 0.25
    }, scene, 1.0, fxFloorWave.camera);
    
    
    fxFloorWave.lensEffect = lensEffect;

    this.gui.updateCamera();    
    
    return fxFloorWave.scene;
    },
    
    render: function()
    {
    
      fxFloorWave.scene.render(engine);
    },
    
    renderBefore: function(workingArray)
    {
                               
      time = Date.now() * 0.002;
        
      fxFloorWave.camera.alpha =  0.5+Math.cos(time / 8);
      fxFloorWave.camera.beta = -0.5+( Math.sin(time/4));
      fxFloorWave.camera.radius = 150 + (30 * Math.sin(time / 10));
    
      fxFloorWave.lensEffect.setChromaticAberration( workingArray[200] / 10 );
      fxFloorWave.lensEffect.setEdgeBlur( workingArray[200] *0.5 );
      //fxMeter.lensEffect.setAperture( workingArray[0] *10);
      fxFloorWave.lensEffect.setFocusDistance( 10*workingArray[0]);
          
      this.layerRing1.mesh.rotation = new BABYLON.Vector3(0,0,0.0002*Date.now());
      this.layerRing2.mesh.rotation = new BABYLON.Vector3(0,0,-0.0001*Date.now());
      this.layerScale.mesh.material.diffuseTexture.uOffset -= 0.01;
      //this.layerScale2.mesh.material.diffuseTexture.uOffset += 0.01;
      
      	var step =0;
  	    for (var i = 0; i < 256 ; i++) {
              fxFloorWave.newInstance[i].scaling.y =  0.5+Math.pow(workingArray[i] / 30, 2.5);
    	        fxFloorWave.newInstance[255-i].scaling.y =  0.5+Math.pow(workingArray[i] / 30, 2.5);
              //step +=2;
  	    } 
    }

    	

};// JavaScript Document
