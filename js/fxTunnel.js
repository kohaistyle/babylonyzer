var fxTunnel = {

    line: 0,

    engine: 0,
    scene: 0,
    camera:0,
    lensEffect:0,
    
    ico_vertices:0,
    fake_ico_vertices:0,

    particleSystem:0,
    torus:0, torus2:0, torus3:0, ico:0, fake_ico:0,
    mat:0, mat2:0, mat3:0, mat_ico:0, fake_mat:0,

    myAnalyser:0,

    // Private Layers
    gui: 0,
    seatbelt: 0,
    embark: 0,
    shake: 0,
    oblique1: 0,
    interface1: 0,
    interface2: 0,
    ring:0,
    layercycle:0,
    zoom: 0,
      
    init: function(engine, canvas, assets) {
    
        var scene = new BABYLON.Scene(engine);
        this.scene = scene;
        
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1.0;

        // Material for the middle torus (pink)
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.backFaceCulling = false;
        mat.frontFaceCulling = false;
        mat.diffuseTexture = new BABYLON.Texture("assets/tunnel_big.png", scene);
        mat.diffuseTexture.hasAlpha = true;
        mat.diffuseTexture.uScale = 16;
        mat.diffuseTexture.vScale = 16;
        mat.reflectionTexture = new BABYLON.Texture("assets/spheremap.jpg", scene);
        mat.reflectionTexture.level = 0.3;
        mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

        // Material for the little torus (white)
        var mat2 = new BABYLON.StandardMaterial("mat", scene);
        mat2.backFaceCulling = false;
        mat2.frontFaceCulling = false;
        mat2.diffuseTexture = new BABYLON.Texture("assets/tunnel_medium.png", scene);
        mat2.diffuseTexture.hasAlpha = true;
        mat2.diffuseTexture.uScale = 32;
        mat2.diffuseTexture.vScale = 32;

        // Material for the big torus (wireframe)
        var mat3 = new BABYLON.StandardMaterial("mat", scene);
        mat3.backFaceCulling = false;
        mat3.frontFaceCulling = false;
        mat3.diffuseTexture = new BABYLON.Texture("assets/tunnel_medium.png", scene);
        mat3.diffuseTexture.hasAlpha = true;
        mat3.diffuseTexture.uScale = 12;
        mat3.diffuseTexture.vScale = 12;
        mat3.wireframe = true;
        mat3.lineSize = 3.0;

        // Medium torus
        var torus = BABYLON.Mesh.CreateTorus("torus", 100, 4, 25, scene, false);
        torus.material = mat;

        // Little torus
        var torus2 = BABYLON.Mesh.CreateTorus("torus", 100, 2, 25, scene, false);
        torus2.material = mat2;

        // Big torus
        var torus3 = BABYLON.Mesh.CreateTorus("torus", 100, 10, 25, scene, false);
        torus3.material = mat3;

        // Material for the background sphere with lighting disabled
        var mat_ico = new BABYLON.StandardMaterial("mat", scene);
        mat_ico.wireframe = true;
        mat_ico.disableLighting = true;
        // The background sphere
        var ico = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 20, radiusY: 20, subdivisions: 5}, scene);
        ico.material = mat_ico;

        // A copy of the background sphere but invisble, just to keep a copy of original vertexes positions
        var fake_ico = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 20, radiusY: 20, subdivisions: 5}, scene);
        var fake_mat = new BABYLON.StandardMaterial("fake_mat", scene);
        fake_ico.isVisible = false;
            
        light.position = camera.position;

        this.lensEffect = new BABYLON.LensRenderingPipeline('lens', {
            edge_blur: 1.0,
            chromatic_aberration: 1.0,
            distortion: 1.0,
            dof_focus_distance: 50.0,
            dof_aperture: 1.0,
            grain_amount: 1.0,
            dof_pentagon: true,
            dof_gain: 1.0,
            dof_threshold: 1.0,
            dof_darken: 0.0
        }, scene, 1.0, camera);

        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", scene);

        // Where the particles come from
        particleSystem.emitter = torus;
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.8, 0.0, 0.8, 0.1);
        particleSystem.color2 = new BABYLON.Color4(0.1, 0.0, 0.1, 0.1);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        // Size of each particle
        particleSystem.minSize = 1.0;
        particleSystem.maxSize = 2.0;

        // Life time of each particle
        particleSystem.minLifeTime = 1;
        particleSystem.maxLifeTime = 3.0;

        // Emission rate
        particleSystem.emitRate = 500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 1.5;
        particleSystem.updateSpeed = 0.1;

        // start position on the big torus
        var vertices = torus3.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var vertexIndex = 0;
        particleSystem.startPositionFunction = function(worldMatrix, positionToUpdate) {
            var posX = vertices[vertexIndex * 3];
            var posY = vertices[vertexIndex * 3 + 1];
            var posZ = vertices[vertexIndex * 3 + 2];
        
            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(posX, posY, posZ, worldMatrix, positionToUpdate);
            
            vertexIndex++;
            
            if (vertexIndex >= torus3.getTotalVertices()) {
                vertexIndex = 0;
            }                        
        }

        // Start the particle system
        //particleSystem.start();

        var myAnalyser = new BABYLON.Analyser(scene);
        BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
        myAnalyser.FFT_SIZE = 256;
        myAnalyser.SMOOTHING = 0.9;
            
        var t = 0;
        // Get datas vertex of each spheres
        var ico_vertices = ico.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var fake_ico_vertices = fake_ico.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        // No need to declare rotation on each frame
        var rotX = rotY = rotZ = 0;


        this.gui = new bGUI.GUISystem(this.scene, engine.getRenderWidth(), engine.getRenderHeight());  
        
        this.ring = new bGUI.GUIPanel("ring3", assets["ring3"], null, this.gui);
        this.ring.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.ring.mesh.scaling = new BABYLON.Vector3(1024,1024,0);
        
        this.seatbelt = new bGUI.GUIPanel("seatbelt", assets["fasten"], null, this.gui);
        this.seatbelt.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.seatbelt.fadein(5000);
        
        this.shake = new bGUI.GUIPanel("shake", assets["shake"], null, this.gui);
        this.shake.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.shake.fadein(5000);
        
        this.embark = new bGUI.GUIPanel("embark", assets["embark"], null, this.gui);
        this.embark.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.embark.fadein(5000);
        
        this.interface1 = new bGUI.GUIPanel("interface1", assets["interface1"], null, this.gui);
        this.interface1.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.interface1.mesh.scaling = new BABYLON.Vector3(1024,1024,0);
        
        this.interface2 = new bGUI.GUIPanel("interface2", assets["interface2"], null, this.gui);
        this.interface2.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        this.interface2.mesh.scaling = new BABYLON.Vector3(1024,1024,0);

        this.oblique1 = new bGUI.GUIPanel("oblique1", assets["oblique1"], null, this.gui);
        this.oblique1.relativePosition(new BABYLON.Vector3(0.5, 0.5, 0));
        //this.ring2.mesh.scaling = new BABYLON.Vector3(1024,1024,0);
        this.oblique1.mesh.material.alpha = 0.3; 

        this.layercycle = 1;
        this.zoom = 512;
        
        scene.registerBeforeRender(function () {            

            // Calculate rotation
            var rotX = 30 * Math.cos(t / 80.0) + 25 * Math.sin(t / 50.0);
            var rotY = 30 * Math.sin(t / 45.0) + 25 * Math.cos(t / 50.0);
            var rotZ = 30 * Math.cos(t / 25.0) + 25 * Math.sin(t / 50.0);

            // Shift by -50 on X axis of each pivot's toruses (torus radius / 2)
            // And rotate them on Z axis
            var p = BABYLON.Matrix.Translation(-50,0,0);
            torus.setPivotMatrix(p);
            torus.rotation.z = rotZ;

            var q = BABYLON.Matrix.Translation(-50,0,0);
            torus2.setPivotMatrix(q);
            torus2.rotation.z = rotZ;

            var r = BABYLON.Matrix.Translation(-50,0,0);
            torus3.setPivotMatrix(r);
            torus3.rotation.z = rotZ;

            // Set sphere rotation
            ico.rotation.x = rotX;
            ico.rotation.y = rotY;
            ico.rotation.z = rotZ;
            
            // Shift uv's offset of each toruses textures at different speed
            mat.diffuseTexture.vOffset -= 0.06;
            mat.diffuseTexture.uOffset -= 0.06;

            mat2.diffuseTexture.vOffset -= 0.03;
            mat2.diffuseTexture.uOffset -= 0.03;      

            mat3.diffuseTexture.vOffset += 0.01;
            mat3.diffuseTexture.uOffset += 0.01;

            // Animate sphere vertexes according to music
            //var workingArray = myAnalyser.getByteFrequencyData();
            j = 0;
/*
            for (var i = 0; i < ico.getTotalVertices(); i++)
            {
                ico_vertices[i * 3 + 0] = fake_ico_vertices[i * 3 + 0] + 2.0 * Math.cos(workingArray[j] / 32); 
                ico_vertices[i * 3 + 1] = fake_ico_vertices[i * 3 + 1] + 2.0 * Math.cos(workingArray[j] / 32);
                ico_vertices[i * 3 + 2] = fake_ico_vertices[i * 3 + 2] + 2.0 * Math.cos(workingArray[j] / 32);

                j++;

                if (j>100) j=0;
            }
            ico.setVerticesData(BABYLON.VertexBuffer.PositionKind, ico_vertices);
*/
 

            
            // Not working
                      

            t += 0.01;   
        });
        
        this.gui.updateCamera();

        return this.scene;


    },
    
    render: function()
    {
      this.scene.render(engine);
    },
    
    renderBefore: function(workingArray)
    {

          if(workingArray[0] > 150 )
            this.layercycle +=1;

          if(this.layercycle>2)
            this.layercycle = 0;    

           
          //console.log(workingArray[0]);
                        
          switch(this.layercycle) {
             case 0:
                this.seatbelt.setVisible(true);
                this.shake.setVisible(false);
                this.embark.setVisible(false);
                break;
             case 1:
                this.seatbelt.setVisible(false);
                this.shake.setVisible(true);
                this.embark.setVisible(false);
                break;
             case 2:
                this.seatbelt.setVisible(false);
                this.shake.setVisible(false);
                this.embark.setVisible(true);
                break;
          }    

          this.interface1.mesh.material.alpha = 0.5;
          this.interface2.mesh.material.alpha =  workingArray[1] *0.005;
          
          var meshzoom = 1 + workingArray[200] *0.5;
          this.torus.scaling = new BABYLON.Vector3(meshzoom,meshzoom,0);
          this.torus2.scaling = new BABYLON.Vector3(meshzoom,meshzoom,0);
          this.torus3.scaling = new BABYLON.Vector3(meshzoom,meshzoom,0);
           
          this.zoom -= 0.4;
          this.ring.mesh.rotation = new BABYLON.Vector3(0,0,-0.0002*Date.now());
          this.ring.mesh.scaling = new BABYLON.Vector3(this.zoom,this.zoom,0);
           
           
      this.lensEffect.setChromaticAberration( workingArray[0] / 30 );
      //this.lensEffect.setEdgeBlur( workingArray[0] *0.1 );
      //fxMeter.lensEffect.setAperture( workingArray[0] *10);
      this.lensEffect.setFocusDistance( 10*workingArray[0]);   
    }

    	

};// JavaScript Document
