// import { Quagga } from "./quaggajs/quagga";

$(function(){
    // $('#modal').on('click', function () {
    //     // will only come inside after the modal is shown
    //     console.log("It works!");
    //   });
    $('#myModal').on('shown.bs.modal', function () {
        // Ejecutara hasta que el modal sea mostrado
        console.log("It works!");
        //Inizializa el equipo para la captura de video
        App.init();
    });

    var App = {
        init: function(){
            var self = this;
            //Inicializa los parametros de la configuracion
            Quagga.init(this.state, function(err){
                if(err){
                    return self.handleError(err);
                }
                //Verificar que el navegador cuente con las capacidades para zoom y encender el flash (No compatible con Firefox para android ni escritorio, tmapoco en Internet Explorer)
                //App.checkCapabilities();
                //Inicializa la camara y empieza a tratar de decodificar las imagenes
                Quagga.start();
            });
        },
        handleError: function(err){
            console.log(err);
        },
        //Checa si el navegador cuenta con las capacidades apra zoom y tortch
        // checkCapabilities: function() {
        //     var track = Quagga.CameraAccess.getActiveTrack();
        //     var capabilities = {};
        //     if (typeof track.getCapabilities === 'function') {
        //         capabilities = track.getCapabilities();
        //     }
        //     this.applySettingsVisibility('zoom', capabilities.zoom);
        //     this.applySettingsVisibility('torch', capabilities.torch);
        // },
        //Agrega los valores al select list para el rango que tendra el Zoom de la camara
        // updateOptionsForMediaRange: function(node, range) {
        //     console.log('updateOptionsForMediaRange', node, range);
        //     var NUM_STEPS = 6;
        //     var stepSize = (range.max - range.min) / NUM_STEPS;
        //     var option;
        //     var value;
        //     while (node.firstChild) {
        //         node.removeChild(node.firstChild);
        //     }
        //     for (var i = 0; i <= NUM_STEPS; i++) {
        //         value = range.min + (stepSize * i);
        //         option = document.createElement('option');
        //         option.value = value;
        //         option.innerHTML = value;
        //         node.appendChild(option);
        //     }
        // },
        //Lo manda a llamar el metodo checkCapabilities para checar si el navegador cuenta con las capacidades para poder usar el Zoom y Torch(EL flash)
        // applySettingsVisibility: function(setting, capability) {
        //     // depending on type of capability
        //     if (typeof capability === 'boolean') {
        //         var node = document.querySelector('input[name="settings_' + setting + '"]');
        //         if (node) {
        //             node.parentNode.style.display = capability ? 'block' : 'none';
        //         }
        //         return;
        //     }
        //     if (window.MediaSettingsRange && capability instanceof window.MediaSettingsRange) {
        //         var node = document.querySelector('select[name="settings_' + setting + '"]');
        //         if (node) {
        //             this.updateOptionsForMediaRange(node, capability);
        //             node.parentNode.style.display = 'block';
        //         }
        //         return;
        //     }
        // },
        //Initial configuration
        state: {
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: {min: 640},
                    height: {min: 480},
                    facingMode: "environment",
                    aspectRatio: {min: 1, max: 2}
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
            frequency: 10,
            decoder: {
                readers : [{
                    format: "code_39_reader",
                    config: {}
                }]
            },
            locate: true
        },
        lastResult : null
    }

    //Esta funcion es llamada por cada cuadro despues de que el procesaminento termina. El objeto result contiene detalles de la informacion aceraca
    //si la operacion fue exitosa o fallo.
    Quagga.onProcessed(function(result) {
        //Objeto para dibujar un canvas sobre el video al rededor del codio de barras
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    //Si encuentra algo que podria ser un codigo de barras lo encierra en un rectangulo verde.
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }
            //Si se encontro un codigo de barras correcto entonces lo encierra en un rectangulo azul
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }
            //Si el codigo de barras es correcto y se obtuvo el numero al que se busca entonces lo encierra en un rectangulo azul con una linea roja 
            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    //Si detecta una barra de codigos correcta toma un snapshot y lo agrega a la pagina
    Quagga.onDetected(function(result) {
        //Salva el numero que se leyo en una variable
        var code = result.codeResult.code;
        //Si es el ultimo resultado entonces agrea un snapshot y la anade en la parte de arriba de la imagen de la camara
        if (App.lastResult !== code) {
            App.lastResult = code;
            $('#no_empleado').val(code);
            Quagga.stop();
            App.lastResult = null;
            $('#myModal').modal('toggle');
            
        }
    });

    //Si se cierra el modal
    $('#close').click(function() {
        console.log("Hide");
        Quagga.stop();
    });
});