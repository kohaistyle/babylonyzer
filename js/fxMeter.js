var fxMeter = {
    
    // Private Fx
    scene: 0,
    camera:0,
    lensEffect:0,
    TWO_PI : Math.PI * 2,

    // Private Meshes
    newInstance: 0,
    meshIcoSphere: 0,
    meshScale: 0,
    uvOffset: 0,
    
    // Private Layers
    gui: 0,
    logo: 0,
    babyLogo: 0,
    babyaudio: 0,
    ring2:0,
      
    init: function(engine, canvas, assets) {
    
    var scene = new BABYLON.Scene(engine);
    fxMeter.scene = scene;
    
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    
    fxMeter.camera = camera;
                   
    // Add a light
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    light.groundColor = new BABYLON.Color3(0.6, 0, 0.4);
    
    var meshMain = BABYLON.Mesh.CreateBox("band", 0.2, scene);
    fxMeter.meshIcoSphere = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 20, radiusY: 20, subdivisions: 6}, scene);

    this.meshScale = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
    this.meshScale.updatable = true;
    this.meshScale.scaling = new BABYLON.Vector3( 0.5, 50, 0)
    var materialScale = new BABYLON.StandardMaterial("matScale", fxMeter.scene);
    materialScale.emissiveColor = BABYLON.Color3.White();
    materialScale.diffuseTexture = assets["scale1"];
    materialScale.diffuseTexture.hasAlpha = true;
    materialScale.diffuseTexture.vScale = 50.0;
    materialScale.backFaceCulling = false;
    this.meshScale.material = materialScale;
    
    var meshScale2 = this.meshScale.createInstance("meshScale2");
    meshScale2.rotation = new BABYLON.Vector3(1.5708,0,1.5708);
    
    
    var materialIcoSphere = new BABYLON.StandardMaterial("matWire", fxMeter.scene);
    materialIcoSphere.wireframe = true;
    materialIcoSphere.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    this.meshIcoSphere.material = materialIcoSphere;
    this.meshIcoSphere.position = new BABYLON.Vector3( 0, 0, 0);

        var l = materialScale.isReady();
        l = materialIcoSphere.isReady();

    
    fxMeter.newInstance = new Array();
    
    var radius=8.0;
    var numPoints = 128;
    var TWO_PI = Math.PI * 2;
    
    
    var angle=TWO_PI/numPoints;
    for(var index=0;index<numPoints;index++)
    {
    
    		var x = radius * Math.sin(angle * index);
        var z = radius*1.2 * Math.cos(angle * index);
          fxMeter.newInstance[index] = meshMain.createInstance("i" + index);
      		fxMeter.newInstance[index].position = new BABYLON.Vector3(x, 0, z);	
          fxMeter.newInstance[index].lookAt(new BABYLON.Vector3(0, 0, 0));
      	  
    } 
 
    
    meshMain.position = new BABYLON.Vector3(x, -1000, z);
    
    // POSTPROCESS
    var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
        edge_blur: 0.0,
        chromatic_aberration: 1.0,
        distortion: 0.0,
        dof_focus_distance: 10.0,
        dof_aperture: 1.0,
        grain_amount: 3.0,
        dof_pentagon: true,
        dof_gain: 1.0,
        dof_threshold: 1.0,
        dof_darken: 0.25
    }, scene, 1.0, camera);
    
    fxMeter.lensEffect = lensEffect;

    // CREATE LAYERS
    this.gui = new bGUI.GUISystem(this.scene, engine.getRenderWidth(), engine.getRenderHeight());
    //var textGroup = new bGUI.GUIGroup("text", this.gui);
    // Title
    //var title = new bGUI.GUIText("helpText", 512, 128, {font:"40px Segoe UI", text:"Babylonyzer", color:"#cecb7a"}, gui);
    //title.guiposition(new BABYLON.Vector3(190, 50, 0));
    //textGroup.add(title);

    this.logo = new bGUI.GUIPanel("ring1", assets["ring4"], null, this.gui);
    this.logo.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
    this.logo.fadein(2000);
    
    this.ring2 = new bGUI.GUIPanel("ring2", assets["ring2"], null, this.gui);
    this.ring2.relativePosition(new BABYLON.Vector3(0.3, 0.5, 0));
    this.ring2.mesh.scaling = new BABYLON.Vector3(1024,1024,0);
    this.ring2.mesh.material.alpha = 0.3; 
    
    this.babyLogo = new bGUI.GUIPanel("babylonyzer", assets["babylonyzer"], null, this.gui);    
    this.babyLogo.relativePosition(new BABYLON.Vector3(0.5,0.5,0));
    this.babyLogo.fadein(5000);
    
    this.babyaudio = new bGUI.GUIPanel("babyaudio", assets["babyaudio"], null, this.gui);    
    this.babyaudio.relativePosition(new BABYLON.Vector3(0.5,0.57,0));
    this.babyaudio.fadein(8000); 
      
		this.gui.updateCamera();
    
    return fxMeter.scene;
    },
    
    
    render: function()
    {
    
      fxMeter.scene.render(engine);
    },
    
    renderBefore: function(workingArray)
    {

      var coef = 0.002;
      
      if(workingArray[0] > 210 )
        coef = 0.009;
                
      time = Date.now() * coef;  
        
      fxMeter.camera.alpha =  Math.cos(this.TWO_PI*time / 25);
      fxMeter.camera.beta =  5*Math.sin(time/25);
      fxMeter.camera.radius = 15 + (5 * Math.sin(time / 10));        
        
      var pos = this.babyLogo.position();
      pos.addInPlace(new BABYLON.Vector3(0,0,0))
      this.babyLogo.position(pos);
      //console.log(this.logo.mesh.rotation );
      this.logo.mesh.rotation = new BABYLON.Vector3(0,0,0.0002*Date.now());
      this.ring2.mesh.rotation = new BABYLON.Vector3(0,0,-0.0002*Date.now());
      var zoom = 512 + workingArray[0]*0.6;
      this.logo.mesh.scaling = new BABYLON.Vector3(zoom,zoom,0);
   
      this.meshScale.material.diffuseTexture.vOffset = this.uvOffset;
      this.uvOffset += 0.005;
   
      fxMeter.lensEffect.setChromaticAberration( workingArray[200] / 10 );
      fxMeter.lensEffect.setEdgeBlur( workingArray[200] *0.5 );
      //fxMeter.lensEffect.setAperture( workingArray[0] *10);
      fxMeter.lensEffect.setFocusDistance( 10*workingArray[0]);
                  
    	var step =0;
	    for (var i = 0; i < 64 ; i++) {
            fxMeter.newInstance[i].scaling.z =  Math.pow(workingArray[step] / 30, 2);
  	        fxMeter.newInstance[63+i].scaling.z =  Math.pow(workingArray[step] / 30, 2);
            step +=2;
	    } 
      
    }

    	

};// JavaScript Document
