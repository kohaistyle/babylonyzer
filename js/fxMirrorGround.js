var fxMirrorGround = {
    
    // Private Fx
    scene: 0,
    camera:0,
    lensEffect:0,
    TWO_PI : Math.PI * 2,

    // Private Meshes
    newInstance: 0,
    meshIcoSphere: 0,
    meshGround: 0,
    uvOffset: 0,
    light0: 0,
    
    // Private Layers
    gui: 0,
    logo: 0,
    babyLogo: 0,
    ring2:0,
      
    init: function(engine, canvas, assets) {
    
    var scene = assets["scape"];
    fxMirrorGround.scene = scene;
    fxMirrorGround.scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    
    //var camera2 = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
    var camera = this.scene.activeCamera;
    //camera2.attachControl(canvas, false);
    
    fxMirrorGround.camera = camera;
    fxMirrorGround.camera.fov = 70;
                       
    // Add a light
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(0.9, 0.9, 0.9);
    
    var meshMain = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 5}, scene);
    fxMirrorGround.meshIcoSphere = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 200, radiusY: 20, subdivisions: 6}, scene);

    this.meshGround = this.scene.meshes[0];
    this.meshGround.convertToFlatShadedMesh();
     
    var materialPink = new BABYLON.StandardMaterial("matPink", fxMirrorGround.scene);                                                                   
    materialPink.diffuseColor = new BABYLON.Color3(1.0, 0.0, 1.0);
    materialPink.emissiveColor = new BABYLON.Color3(1.0, 0.0, 1.0);
    var materialBlue = new BABYLON.StandardMaterial("matBlue", fxMirrorGround.scene);                                                                   
    materialBlue.diffuseColor = new BABYLON.Color3(0.0, 1.0, 1.0);
    materialBlue.emissiveColor = new BABYLON.Color3(0.0, 1.0, 1.0);
    var materialYellow = new BABYLON.StandardMaterial("matYellow", fxMirrorGround.scene);                                                                   
    materialYellow.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    materialYellow.emissiveColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    
    var materialScale = new BABYLON.StandardMaterial("matScale", fxMirrorGround.scene);                                                                   
    materialScale.emissiveColor = BABYLON.Color3.White();
    materialScale.diffuseTexture = assets["scapetex"];
    //materialScale.diffuseTexture.hasAlpha = true;
    //materialScale.diffuseTexture.vScale = 50.0;
    //materialScale.backFaceCulling = false;
    this.meshIcoSphere.material = materialScale;
    
    var materialIcoSphere = new BABYLON.StandardMaterial("matWire", fxMirrorGround.scene);
    materialIcoSphere.wireframe = true;
    materialIcoSphere.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    this.meshIcoSphere.material = materialIcoSphere;
    this.meshIcoSphere.position = new BABYLON.Vector3( 0, 0, 0);

    
    this.newInstance = new Array();
    
    var radius=8.0;
    var numPoints = 30;
    var TWO_PI = Math.PI * 2;
    
    var mirrorMaterial = new BABYLON.StandardMaterial("mirror", fxMirrorGround.scene);
    mirrorMaterial.diffuseColor = new BABYLON.Color3.Black();
    mirrorMaterial.diffuseTexture = assets["squaretex"];
    mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
    mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -10.0);
    
    var angle=TWO_PI/numPoints;
    for(var index=0;index<numPoints;index++)
    {    
    		var x = getRandomInt(-70, 70);
        var z = getRandomInt(-70, 70);
        var y = getRandomInt(6, 10);
        
        var sc = getRandomInt(0.2, 2);
        
        this.newInstance[index] = meshMain.clone("i" + index);
      	this.newInstance[index].position = new BABYLON.Vector3(x, y, z);
      	this.newInstance[index].scaling = new BABYLON.Vector3(sc, sc, sc);
        
        if(index<10 )
          this.newInstance[index].material = materialPink;

        if(index<20 && index>10)
          this.newInstance[index].material = materialBlue;

        if(index<30 && index>20)
          this.newInstance[index].material = materialYellow;
          
    }     
 
    mirrorMaterial.reflectionTexture.renderList = this.newInstance;
    mirrorMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    
        
    this.scene.meshes[0].material = mirrorMaterial;
                
    // POSTPROCESS
    var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
        edge_blur: 0.2,
        chromatic_aberration: 1.0,
        distortion: 1.0,
        dof_focus_distance: 10.0,
        dof_aperture: 0.2,
        grain_amount: 0.2,
        dof_pentagon: true,
        dof_gain: 0.2,
        dof_threshold: 1.0,
        dof_darken: 0.25
    }, scene, 1.0, camera);
   
    this.lensEffect = lensEffect;
/*
    // CREATE LAYERS
    this.gui = new bGUI.GUISystem(this.scene, engine.getRenderWidth(), engine.getRenderHeight());
    var textGroup = new bGUI.GUIGroup("text", this.gui);

    this.logo = new bGUI.GUIPanel("ring1", assets["ring4"], null, this.gui);
    this.logo.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
    this.logo.fadein(2000);
    
    this.ring2 = new bGUI.GUIPanel("ring2", assets["ring2"], null, this.gui);
    this.ring2.relativePosition(new BABYLON.Vector3(0.3, 0.5, 0));
    this.ring2.mesh.scaling = new BABYLON.Vector3(1024,1024,0);
    this.ring2.mesh.material.alpha = 0.3; 

    
    this.babyLogo = new bGUI.GUIPanel("babylonyzer", assets["babylonyzer"], null, this.gui);    
    this.babyLogo.relativePosition(new BABYLON.Vector3(0.5,0.5,0));
    this.babyLogo.fadein(4000); 
      
		this.gui.updateCamera();
*/    
    return fxMirrorGround.scene;
    },
    
    
    render: function()
    {
      fxMirrorGround.scene.render(engine);
    },
    
    renderBefore: function(workingArray)
    {

      var coef = 0.002;
      
      if(workingArray[0] > 210 )
        coef = 0.009;
                
      time = Date.now() * coef;  
        
      fxMirrorGround.camera.position.x += 0.1;
      fxMirrorGround.camera.rotation.x += 0.1;
      //var pos = this.babyLogo.position();
      //pos.addInPlace(new BABYLON.Vector3(0,0,0))
      //this.babyLogo.position(pos);

      //this.logo.mesh.rotation = new BABYLON.Vector3(0,0,0.0002*Date.now());
      //this.ring2.mesh.rotation = new BABYLON.Vector3(0,0,-0.0002*Date.now());
      //var zoom = 512 + workingArray[0]*0.4;
      //this.logo.mesh.scaling = new BABYLON.Vector3(zoom,zoom,0);
   
      fxMirrorGround.lensEffect.setChromaticAberration( workingArray[200] *0.1 );
      fxMirrorGround.lensEffect.setEdgeBlur( workingArray[200] *0.1 );
      //fxMirrorGround.lensEffect.setAperture( workingArray[0] *10);
      fxMirrorGround.lensEffect.setFocusDistance( 10*workingArray[0]);
                  
    	var step =0;
	    for (var i = 0; i < 30 ; i++) {
            
            var sc = Math.pow(workingArray[i] *0.02, 1); 
            fxMirrorGround.newInstance[i].scaling =  new BABYLON.Vector3(sc, sc, sc);
  	        //fxMirrorGround.newInstance[63+i].scaling.z =  Math.pow(workingArray[i] / 30, 2);
            //step +=2;
	    } 
      
    }

    	

};// JavaScript Document
