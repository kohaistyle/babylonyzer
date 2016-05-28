var fxWobble = {

    camera: 0,
    torus: 0,
    sphere: 0,
    fsphere: 0,
    lensEffect: 0,

    px: 0,
    py: 0,
    pz: 0,

    t:0, v:0, fv:0,
    
    gui: 0,
    layer1: 0,
    layer2: 0,
    layer3: 0,
    layer4: 0,
      
    init: function(engine, canvas, assets) {
        
        var scene = new BABYLON.Scene(engine);
        engine.backFaceCulling = true;

        this.scene = scene;


        var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 100, BABYLON.Vector3.Zero(), scene);
        camera.setTarget(BABYLON.Vector3.Zero());        
        this.camera = camera;
        
        
        var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0,0,10), scene);
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 500.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/nebula/nebula", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        

        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 18, 25, scene);
        var fsphere = BABYLON.Mesh.CreateSphere("sphere1", 18, 25, scene);
        fsphere.isVisible = false;
      
        var materialSphere = new BABYLON.PBRMaterial("Material", scene);
        materialSphere.specularColor = new BABYLON.Color3(1, 1, 1);
        materialSphere.reflectionTexture = new BABYLON.CubeTexture("assets/nebula/nebula", scene);
        materialSphere.reflectionColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        materialSphere.bumpTexture = new BABYLON.Texture("assets/grained_uv.png", scene);
        materialSphere.bumpTexture.uScale = 4;
        materialSphere.bumpTexture.vScale = 4;
        materialSphere.glossiness = 1.2;
        materialSphere.backFaceCulling = false;

        var materialTorus = new BABYLON.PBRMaterial("Material2", scene);
        materialTorus.diffuseColor = new BABYLON.Color3(1, 1, 1);
        materialTorus.specularColor = new BABYLON.Color3(1, 1, 1);
        materialTorus.glossiness = 0.98;
        materialTorus.cameraExposure = 0.66;
        materialTorus.cameraContrast = 1.66;
        materialTorus.directIntensity = 1.2;
        materialTorus.environmentIntensity = 1.2;        

        var torus = BABYLON.Mesh.CreateTorus("torus", 140, 20, 18, scene, false);
        var probe = new BABYLON.ReflectionProbe("torusProbe", 512, scene);
        probe.renderList.push(sphere);
        probe.renderList.push(skybox);        

        var probe2 = new BABYLON.ReflectionProbe("torusProbe", 512, scene);
        probe2.renderList.push(torus);
        probe2.renderList.push(skybox);        

        materialTorus.reflectionTexture = probe.cubeTexture;
        sphere.material = materialSphere;
        materialSphere.reflectionTexture = probe2.cubeTexture;
        torus.material = materialTorus;

        //var l = skyboxMaterial.isReady();
        //l = materialSphere.isReady();
        //l = materialTorus.isReady();



        light.position = camera.position;

        this.v = sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.fv = fsphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
            edge_blur: 2.0,
            chromatic_aberration: 1.0,
            distortion: 2.0,
            dof_focus_distance: 20.0,
            dof_aperture: 6.0,
            grain_amount: 0.5,
            dof_pentagon: true,
            dof_gain: 1.0,
            dof_threshold: 1.0,
            dof_darken: 0.25
        }, scene, 1.0, this.camera);
    

        this.sphere = sphere;
        this.fsphere = fsphere;
        this.torus = torus;
        
        this.lensEffect = lensEffect;

        this.gui = new bGUI.GUISystem(this.scene, engine.getRenderWidth(), engine.getRenderHeight());


        this.layer3 = new bGUI.GUIPanel("ring2", assets["ring2"], null, this.gui);
        this.layer3.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.layer3.mesh.material.alpha = 0.5;
        this.layer4 = new bGUI.GUIPanel("ring1", assets["ring1"], null, this.gui);
        this.layer4.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.layer4.mesh.material.alpha = 0.05;
        
        this.layer1 = new bGUI.GUIPanel("music", assets["music"], null, this.gui);
        this.layer1.relativePosition(new BABYLON.Vector3(0.3, 0.5, 0));
        //this.layer1.mesh.scaling = new BABYLON.Vector3(512,512,0);    
        this.layer1.fadein(4000);
        this.layer2 = new bGUI.GUIPanel("powered", assets["powered"], null, this.gui);
        this.layer2.relativePosition(new BABYLON.Vector3(0.7, 0.5, 0));
        //this.layer1.mesh.scaling = new BABYLON.Vector3(512,512,0);    
        this.layer2.fadein(6000);
        
		    this.gui.updateCamera();    
        return this.scene;
    },
    
    render: function()
    {
        this.scene.render(engine);
    },
    
    renderBefore: function(workingArray)
    {
        for (var i = 0; i < this.sphere.getTotalVertices(); i++) 
        {
            var fx = this.fv[i * 3 + 0]; var fy = this.fv[i * 3 + 1]; var fz = this.fv[i * 3 + 2];
            var wave = 1.0 + (workingArray[200] / 200) * ((1 - Math.cos(fx + this.t * 0.2)) + (1 - Math.cos(fy + this.t * 0.4)) + (1 - Math.cos(fz + this.t * 0.6))); 
            this.v[i * 3 + 0] = fx * wave;
            this.v[i * 3 + 1] = fy * wave;
            this.v[i * 3 + 2] = fz * wave;
        }

        this.sphere.setVerticesData(BABYLON.VertexBuffer.PositionKind, this.v);

        this.px = 50.0 * Math.cos(this.t/30);
        this.py = 50.0 * Math.sin(this.t/10);
        this.pz = 50.0 * Math.cos(this.t/20);
            
        this.camera.alpha = 4.0 * (Math.PI / 20 + Math.cos(this.t / 30));                           
        this.camera.beta = 2.0 * (Math.PI / 20 + Math.sin(this.t / 50));
        this.camera.radius = 160 + (-45 + 45 * Math.sin(this.t / 10));

        this.torus.rotation.x += 0.01;
        this.torus.rotation.y += 0.003;
        this.torus.rotation.z += 0.006;

        this.lensEffect.setChromaticAberration(workingArray[0] / 40);
        this.lensEffect.setEdgeBlur(0.5-(workingArray[200] * 0.1));        
        this.lensEffect.setFocusDistance(150*workingArray[0]);

        this.layer4.mesh.rotation = new BABYLON.Vector3(0,0,0.0001*Date.now());
        this.layer3.mesh.rotation = new BABYLON.Vector3(0,0,-0.0002*Date.now());
        var zoom = 512 + workingArray[0]*0.6;
        this.layer3.mesh.scaling = new BABYLON.Vector3(zoom,zoom,0);
      
        this.t += 0.1;    
    }
};
