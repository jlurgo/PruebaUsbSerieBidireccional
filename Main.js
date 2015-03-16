var onDeviceReady = function() {  
	DivConsola.start();
	console.log("Arrancando..");
//	vx.start({verbose:true});
//    
//    vx.conectarPorWebSockets({
//        url:'https://router-vortex.herokuapp.com'
//    }); 
	var errorCallback = function(message) {
		console.log('Error: ' + message);
	};
	
	var abrirPuertoSerie = function(){
		serial.open ({baudRate: 115200},
			function(successMessage) {
				console.log("puerto serie abierto:", successMessage);
				$("#btn_enviar").bind('touchstart', function(){
					var mensaje = JSON.stringify({
							estadoBoton:"presionado"
						})+'|';
					console.log(mensaje);
					serial.write(
						mensaje,
						function(successMessage) {
							console.log(successMessage);
						},
						function(err){
							console.log("error al enviar por puerto serie:", err);
						}
					);	
				});

				$("#btn_enviar").bind('touchend', function(){
					var mensaje = JSON.stringify({
							estadoBoton:"suelto"
						})+'|';
					console.log(mensaje);
					serial.write(
						mensaje,
						function(successMessage) {
							console.log(successMessage);
						},
						function(err){
							console.log("error al enviar por puerto serie:", err);
						}
					);	
				});
				
				serial.registerReadCallback(
					function(data){
						var view = new Uint8Array(data);
						console.log("recibido:", String.fromCharCode.apply(null, view));
					},
					function(err){
						console.log("error al registrar callback:", err);
					}
				);
			},
			function(err){
				console.log("error al abrir puerto serie:", err);
			}
		);
	};
	
	serial.requestPermission(//{vid: '0x2341', pid: '0x0001'}, 
							 function(successMessage) {
			console.log("permiso concedido para usar puerto serie:", successMessage);
			serial.close(function(){
				console.log("puerto serie cerrado");
				abrirPuertoSerie();
			}, function(err){
				console.log("error al cerrar puerto serie");
				abrirPuertoSerie();
			});
		},
		function(err){
			console.log("error al pedir permiso para usar puerto serie:", err);
		}
	);
};

$(document).ready(function() {  
    //toda esta garcha es para detectar si la aplicacion esta corriendo en un celular o en una pc.
    //En el celular para arrancar la app hay que esperar al evento deviceReady, en la pc solo al documentReady
    window.isphone = false;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        window.isphone = true;
    }

    if(window.isphone) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

