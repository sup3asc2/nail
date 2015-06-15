    var fpsLabel = document.getElementById("fpsLabel");
    var camPosTxt = document.getElementById("camPosTxt");

    var meshTab = []; //Tableau d'objets
    var grp_tab = [];//tableau de groupes

    var DegToRad = function(deg)
    {
        return deg / 180 * Math.PI;
    };

    var createScene = function() {

        // free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), zone.scenes[zone.zone_id]);
        camera.checkCollisions = true;

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach camera to canvas
        camera.attachControl(canvas, true);

        //light
        var hemLlight = new BABYLON.HemisphericLight("hemLlight", new BABYLON.Vector3(0, 1, 0), zone.scenes[zone.zone_id]);
        hemLlight.intensity = 250 / 400;
        hemLlight.diffuse = new BABYLON.Color3(153 / 255, 190 / 255, 221 / 255);


        var dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-0.8, -0.95, 0.9), zone.scenes[zone.zone_id]);
        dirLight.intensity = 1;
        dirLight.diffuse = new BABYLON.Color3(245 / 255, 241 / 255, 214 / 255);

        //ground
        var ground = BABYLON.Mesh.CreateGround("ground1", 1000, 1000, 2, zone.scenes[zone.zone_id]);
        ground.renderingGroupId = 1;
        ground.material = new BABYLON.StandardMaterial("gMaterial", zone.scenes[zone.zone_id]);
        ground.material.specularColor = new BABYLON.Color3(0, 0, 0);

        ground.material.diffuseTexture = new BABYLON.Texture("img/ground/diffuse.png", zone.scenes[zone.zone_id]);
        ground.material.diffuseTexture.uScale = 30;
        ground.material.diffuseTexture.vScale = 30;

        ground.material.ambientTexture = new BABYLON.Texture("img/ground/ambient.png", zone.scenes[zone.zone_id]);
        ground.material.ambientTexture.uScale = 30;
        ground.material.ambientTexture.vScale = 30;

        ground.material.specularTexture = new BABYLON.Texture("img/ground/specular.png", zone.scenes[zone.zone_id]);
        ground.material.specularTexture.uScale = 30;
        ground.material.specularTexture.vScale = 30;

        ground.material.bumpTexture = new BABYLON.Texture("img/ground/normal.png", zone.scenes[zone.zone_id]);
        ground.material.bumpTexture.uScale = 30;
        ground.material.bumpTexture.vScale = 30;

        ground.checkCollisions = true;
        ground.position.y = -5;
        ground.receiveShadows = true;

        //creation des murs
        var wallMaterial = new BABYLON.StandardMaterial("gMaterial", zone.scenes[zone.zone_id]);
        wallMaterial.alpha  = 0;
        wallMaterial.specularColor = new BABYLON.Color4(0, 0, 0, 0);

        var wallFace = new BABYLON.Mesh.CreatePlane("wallFace", 1000, zone.scenes[zone.zone_id]);
        wallFace.material = wallMaterial;
        wallFace.position = new BABYLON.Vector3(0, 0, 500);
        wallFace.rotation = new BABYLON.Vector3(0, 0, 0);
        wallFace.checkCollisions = true;
        wallFace.renderingGroupId = 1;

        var wallGauche = new BABYLON.Mesh.CreatePlane("wallGauche", 1000, zone.scenes[zone.zone_id]);
        wallGauche.material = wallMaterial;
        wallGauche.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
        wallGauche.position = new BABYLON.Vector3(-500, 0, 0);
        wallGauche.checkCollisions = true;
        wallGauche.renderingGroupId = 1;

        var wallDroite = new BABYLON.Mesh.CreatePlane("wallDroite", 1000, zone.scenes[zone.zone_id]);
        wallDroite.material = wallMaterial;
        wallDroite.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        wallDroite.position = new BABYLON.Vector3(500, 0, 0);
        wallDroite.checkCollisions = true;
        wallDroite.renderingGroupId = 1;

        var wallDerriere = new BABYLON.Mesh.CreatePlane("wallDerriere", 1000, zone.scenes[zone.zone_id]);
        wallDerriere.material = wallMaterial;
        wallDerriere.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        wallDerriere.position = new BABYLON.Vector3(0, 0, -500);
        wallDerriere.checkCollisions = true;
        wallDerriere.renderingGroupId = 1;

        var wallDessus = new BABYLON.Mesh.CreatePlane("wallDessus", 1000, zone.scenes[zone.zone_id]);
        wallDessus.material = wallMaterial;
        wallDessus.rotation = new BABYLON.Vector3(3 * Math.PI / 2, 0, 0);
        wallDessus.position = new BABYLON.Vector3(0, 500, 0);
        wallDessus.checkCollisions = true;
        wallDessus.renderingGroupId = 1;

        // Création d'une material
        var sMaterial = new BABYLON.StandardMaterial("skyboxMaterial", zone.scenes[zone.zone_id]);
        sMaterial.backFaceCulling = false;
        sMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox/vertigo", zone.scenes[zone.zone_id]);
        sMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        sMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        // Création d'un cube avec la material adaptée
        var skybox = BABYLON.Mesh.CreateBox("skybox", 2000, zone.scenes[zone.zone_id]);
        skybox.material = sMaterial;
        skybox.infiniteDistance = true;

        return zone.scenes[zone.zone_id];
    };
    //****************Creation et gestion de MESH***********************************
    var meshCount = -1;

    function Mesh() {
        var type = document.getElementById("mesh-type").value;
        switch (type) {
            case "box":
                mesh = BABYLON.Mesh.CreateBox(nom.value, 2, zone.scenes[zone.zone_id]);
                break;

            case "sphere":
                mesh = BABYLON.Mesh.CreateSphere(nom.value, 50, 2, zone.scenes[zone.zone_id]);
                break;

            case "cylinder":
                mesh = BABYLON.Mesh.CreateCylinder(nom.value, 2, 2, 2, 50, 1, zone.scenes[zone.zone_id], false);
                break;

            case "pyramid":
                mesh = BABYLON.Mesh.CreatePyramid4(nom.value, 2, 2, zone.scenes[zone.zone_id], false);
                break;

            case "line":
                mesh = BABYLON.Mesh.CreateLines(nom.value, [
                    new BABYLON.Vector3(-1, 0, 0),
                    new BABYLON.Vector3(1, 0, 0),
                ], zone.scenes[zone.zone_id]);
                break;

            case "plane":
                mesh = BABYLON.Mesh.CreatePlane(nom.value, 1, zone.scenes[zone.zone_id]);
                mesh.scaling.x = 2;
                break;

            case "circle":
                mesh = new BABYLON.Mesh.CreateDisc(nom.value, 2, 50, zone.scenes[zone.zone_id]);
                break;

            default:
                alert("Ce type d'objet n'existe pas");
                break;
        }

        mesh.type = type;
        mesh.renderingGroupId = 1;

        var colorMat = new BABYLON.StandardMaterial("color", zone.scenes[zone.zone_id]);
        colorMat.diffuseColor = new BABYLON.Color3(R / 255, G / 255, B / 255);
        colorMat.backFaceCulling = false;
        mesh.material = colorMat;
        return (mesh);
    }



    //*********Convertisseur hexa en RGB****************************************
    var picker = document.getElementById('color'),
        c, R = 229.5,
        G = 229.5,
        B = 229.5;

    function hexToR(h) {
        return parseInt(h.substring(0, 2), 16)
    }

    function hexToG(h) {
        return parseInt(h.substring(2, 4), 16)
    }

    function hexToB(h) {
        return parseInt(h.substring(4, 6), 16)
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }
    picker.onchange = function() {
        c = cutHex(this.value);

        R = hexToR(c);
        G = hexToG(c);
        B = hexToB(c);

        meshTab[index].material.diffuseColor.r = R / 255;
        meshTab[index].material.diffuseColor.g = G / 255;
        meshTab[index].material.diffuseColor.b = B / 255;
    };

    //*********retourne les valeurs pour index du tableau***********************

    var index = 0;

    function indexation(x) { //En fonction du bouton cliqué donne l'index du tableau
        $(".grp").css("display", "none");
        $(".ungrp").css("display", "block");
        index = x;
        positionx.value = meshTab[index].position.x;
        positiony.value = meshTab[index].position.y;
        positionz.value = meshTab[index].position.z;
        nom.value = meshTab[index].name;
        taillex.value = meshTab[index].scaling.x;
        tailley.value = meshTab[index].scaling.y;
        taillez.value = meshTab[index].scaling.z;
        rotx.value = meshTab[index].rotation.x * 100;
        roty.value = meshTab[index].rotation.y * 100;
        rotz.value = meshTab[index].rotation.z * 100;
        picker.value = "#" + Math.round(meshTab[index].material.diffuseColor.r * 255).toString(16) + Math.round(meshTab[index].material.diffuseColor.g * 255).toString(16) + Math.round(meshTab[index].material.diffuseColor.b * 255).toString(16);
    };

    //*********Groups****************************************

    var btn_grp = document.getElementById('btn_grp');
    var grp_count = -1;
    btn_grp.onclick = function() { //Fonction groupe
        btn_ok.style.display = "block";
        Array.prototype.slice.call(document.getElementById("objets").querySelectorAll("[type=radio]")).forEach(function(e) {
            e.type = "checkbox";
        });
    };

    //var index_grp = 0;
    function grp_index(x) {
        $(".grp").css("display", "block");
        $(".ungrp").css("display", "none");
        index = x;
        grp_nom.value = document.getElementById(index).getAttribute("name");
    }

    var nom = document.getElementById('name');
    nom.oninput = function() {
        document.getElementById(index).innerHTML = '<input type="radio">' + nom.value;
        meshTab[index].name = nom.value;
    };

    var grp_nom = document.getElementById('grp_name');
    grp_nom.oninput = function() {
        document.getElementById(index).setAttribute("name", grp_nom.value);
        document.getElementById(index).innerHTML = '<input type="radio">' + grp_nom.value;
        grp_tab[Math.abs(index) - 1].name = grp_nom.value;
        console.log(grp_nom.value);
        console.log(index);
    };

    //***********Fin groupes************************************


    zone.scenes[zone.zone_id] = createScene();

    engine.runRenderLoop(function() {
      zone.scenes[zone.zone_id].render();
        fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";
        camPosTxt.innerHTML = 'Position de la caméra X:' + zone.scenes[zone.zone_id].activeCamera.position.x.toFixed(2) + '&nbsp Y:' + zone.scenes[zone.zone_id].activeCamera.position.y.toFixed(2) + "&nbsp Z:" + zone.scenes[zone.zone_id].activeCamera.position.z.toFixed(2);
    });

    //On Resize
    window.addEventListener("resize", function() {
        engine.resize();
    });

    //***********************************Save***************************************
    var save = document.getElementById("saveLink");
    save.onclick = function(e) {

            var meshs = meshTab.map(function(mesh) {
                return {
                    type: mesh.type,
                    position: mesh.position,
                    scaling: mesh.scaling,
                    diffuseColor: mesh.material.diffuseColor,
                    name: mesh.name
                };
            });

            var objectsToWrite = {
                meshs: meshs,
                grp_tab: grp_tab
                    //zone
                    //links
            };

            var textToWrite = JSON.stringify(objectsToWrite);

            var textFileAsBlob = new File([textToWrite], "world.nail", {
                type: 'application/octet-stream'
            });

            save.href = window.URL.createObjectURL(textFileAsBlob);

        }
        //*******************************Fin Save***************************************

    //***************************Load***********************************************
    var loadInput = document.getElementById("load");

    loadInput.onchange = function() {
            var file = loadInput.files[0];

            var fr = new FileReader();
            fr.onloadend = function() {
                var data = JSON.parse(fr.result);
                console.log(data);

                //supprime tous les meshs du canvas
                meshTab.forEach(function(mesh) {
                    mesh.dispose();
                });
                //supprime les boutons
                $("#objets").empty();
                meshTab = [];

                var meshCount = 0;
                data.meshs.forEach(function(e) {
                    var mesh;
                    switch (e.type) {
                        case "box":
                            mesh = BABYLON.Mesh.CreateBox(e.name, 2, zone.scenes[zone.zone_id]);
                            break;

                        case "sphere":
                            mesh = BABYLON.Mesh.CreateSphere(e.name, 50, 2, zone.scenes[zone.zone_id]);
                            break;

                        case "cylinder":
                            mesh = BABYLON.Mesh.CreateCylinder(e.name, 2, 2, 2, 50, 1, zone.scenes[zone.zone_id], false);
                            break;

                        case "pyramid":
                            mesh = BABYLON.Mesh.CreatePyramid4(e.name, 2, 2, zone.scenes[zone.zone_id], false);
                            break;

                        case "line":
                            mesh = BABYLON.Mesh.CreateLines(e.name, [
                                new BABYLON.Vector3(-1, 0, 0),
                                new BABYLON.Vector3(1, 0, 0),
                            ], zone.scenes[zone.zone_id]);
                            break;

                        case "plane":
                            mesh = BABYLON.Mesh.CreatePlane(e.name, 1, zone.scenes[zone.zone_id]);
                            mesh.scaling.x = 2;
                            break;

                        case "circle":
                            mesh = new BABYLON.Mesh.CreateDisc(e.name, 2, 50, zone.scenes[zone.zone_id]);
                            break;
                    }

                    mesh.position = e.position;
                    mesh.scaling = e.scaling;

                    //gestion du material
                    mesh.material = new BABYLON.StandardMaterial("color", zone.scenes[zone.zone_id]);
                    mesh.material.diffuseColor = e.diffuseColor;

                    //ajout du bouton dans l'interface
                    var button = document.createElement("label"); // Cree un bouton
                    button.innerHTML = '<input type="radio">' + e.name; // Met un titre au bouton
                    button.setAttribute("id", meshCount); // L'id sera l'index du tableau
                    button.setAttribute("onClick", "indexation(parseInt(this.id))"); // Donne la function qui gere quel bouton est cliqué
                    ["btn", "btn-success", "nav-justified"].forEach(function(e) {
                        button.classList.add(e)
                    }); // Ajoute des class
                    document.getElementById("objets").appendChild(button); // Ajoute le bouton dans la page

                    //ajout dans le tableau
                    meshTab[meshCount] = mesh;
                    meshCount++;

                });

                grp_tab = data.grp_tab;

                var grp_count = 0;
                grp_tab.forEach(function(e) {
                    //ajout du bouton de groupe
                    var button = document.createElement("label"); // Cree un bouton
                    button.innerHTML = '<input type="radio">' + e.name; // Met un titre au bouton
                    button.setAttribute("id", grp_count); // L'id sera l'index du tableau
                    button.setAttribute("name", "Groupe");
                    button.setAttribute("onClick", "grp_index(parseInt(this.id))"); // Donne la function qui gere quel bouton est cliqué
                    ["btn", "btn-violet", "nav-justified"].forEach(function(e) {
                        button.classList.add(e)
                    }); // Ajoute des class
                    document.getElementById("objets").appendChild(button); // Ajoute le bouton dans la page

                    grp_count++;
                });

            }
            fr.readAsText(file);
        }
        //********************************Fin Load**************************************
