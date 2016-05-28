var fxIntro = {

    line: 0,

    engine: 0,
    scene: 0,
    camera:0,
      
    init: function(engine, canvas) {
    
    var scene = new BABYLON.Scene(engine);
    fxIntro.engine = engine;
    fxIntro.scene = scene;
    
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    camera.attachControl(canvas, false);
    
    fxIntro.camera = camera;
                   
    // Add a light
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    light.groundColor = new BABYLON.Color3(0.6, 0, 0.4);
    
    var meshMain = BABYLON.Mesh.CreateBox("band", 0.2, scene);
    
    fxIntro.newInstance = new Array();
    
    var radius=8.0;
    var numPoints = 128;
    var TWO_PI = Math.PI * 2;
    
    
    var angle=TWO_PI/numPoints;
    for(var index=0;index<numPoints;index++)
    {
    
    		var x = radius * Math.sin(angle * index);
        var z = radius*1.2 * Math.cos(angle * index);
          fxIntro.newInstance[index] = meshMain.createInstance("i" + index);
      		fxIntro.newInstance[index].position = new BABYLON.Vector3(x, 0, z);	
          fxIntro.newInstance[index].lookAt(new BABYLON.Vector3(0, 0, 0));
      	  
    } 
    
    // POSTPROCESS
    var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
        edge_blur: 0.0,
        chromatic_aberration: 1.0,
        distortion: 0.0,
        dof_focus_distance: 40.0,
        dof_aperture: 3.0,
        grain_amount: 3.0,
        dof_pentagon: true,
        dof_gain: 1.0,
        dof_threshold: 1.0,
        dof_darken: 0.25
    }, scene, 1.0, camera);
    
    return fxIntro.scene;
    },
    
    render: function()
    {
    
      fxIntro.scene.render(engine);
    },
    
    renderBefore: function(analyser)
    {
    /*
        var workingArray = analyser.getByteFrequencyData();    
      	var step =0;
  	    for (var i = 0; i < 128 ; i++) {
              fxIntro.newInstance[i].scaling.z =  Math.pow(workingArray[step] / 30, 2.5);
    	        fxIntro.newInstance[127-i].scaling.z =  Math.pow(workingArray[step] / 30, 3);
              step +=2;
  	    } */
    }

    	

};// JavaScript Document
