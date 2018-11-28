
function listar_notificaciones(){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').on('value',function(snapshot) {
	var output = "";

		listaOrdenada = new Array();

		snapshot.forEach(notificacionSnapshot => {
			 listaOrdenada.unshift(notificacionSnapshot);
		});

		listaOrdenada.forEach(notificacionSnapshot => {
			var key = notificacionSnapshot.key;
			var notificacion = notificacionSnapshot.val();

			if(notificacion.tipo != "clase"){
				output =output+ "<li><i>"+ notificacion.descripcion + "</i></li>";
			}
			else{

				output =output+ "</br> <strong style='color:#167da7'> <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>"+ notificacion.descripcion;

				output = output + ": " + notificacion.dia +"/"+notificacion.mes+"/"+notificacion.anyo+" a las  "+ notificacion.hora +" de " + notificacion.idioma + " por " + notificacion.solicitante +
				"<br><button id='botonaceptar' class='btn btn-success' onclick='aceptar_clase(\""+key+"\")'>Aceptar</button> "+
				"<button id='botonrechazar' class='btn btn-danger' onclick='rechazar_clase(\""+key+"\")'>Rechazar</button> </br></br>";
				output = output + "</strong>";
			}
		});


		output = output + "";
		document.getElementById('container1').innerHTML = output;
	});
	
}

function aceptar_clase(key){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).child('estado').set('aceptada');
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).once('value').then(function(snapshot) {
		var notificacion = snapshot.val();
		
		var clase = new Object();
		clase.dnialumno = notificacion.solicitante;
		clase.dia = notificacion.dia;
		clase.mes = notificacion.mes;
		clase.anyo = notificacion.anyo;
		clase.hora = notificacion.hora;
		clase.idioma = notificacion.idioma;
		clase.precio = notificacion.precio;
		clase.profesor = notificacion.profesor;
		clase.nombreProfe = notificacion.nombreProfe;
		clase.nombreSolicitante=notificacion.nombreSolicitante;
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').push(clase);
		firebase.database().ref('Usuarios').child(clase.dnialumno).child('clases').push(clase);
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
		var notificacionAceptacion = new Object();
		notificacionAceptacion.descripcion = "Se ha aceptado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.dia +"/"+notificacion.mes+"/"+notificacion.anyo+"-"+notificacion.hora;
		notificarUsuario(notificacion.solicitante,notificacionAceptacion);
		
		notificacionAceptacion.descripcion = "Se ha aceptado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.dia +"/"+notificacion.mes+"/"+notificacion.anyo+"-"+notificacion.hora;
		notificarUsuario(notificacion.profesor,notificacionAceptacion);
		
		calendario();
	});
}

function rechazar_clase(key){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).once('value').then(function(snapshot) {
		var notificacion = snapshot.val();
		var idhorario=notificacion.idHorario;
		var notificacionRechazada = new Object();		
		notificacionRechazada.descripcion = "Se ha rechazado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.dia+"/"+notificacion.mes+"/"+notificacion.anyo+"-"+notificacion.hora;
		
		notificarUsuario(notificacion.solicitante,notificacionRechazada);

		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).child('estado').set('rechazada');
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
		firebase.database().ref('Anuncios').child(localStorage['dni']).child("horario").child(idhorario).child("estado").set("disponible");
	});	
}

var resolve;
function comprarTokens(){
 
 firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(dato) {
		
		resolve =dato.val().tokens	
		
		
		});
		
 swal("Indique cuantos tokens deséa ingresar:", {
  content: "input",
  
})
.then((value1) => {
 
	if(parseInt(value1) >= 1 ){
		resolve += parseInt(value1);
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(resolve);
	swal("Exito",`Se han ingresado: ${value1} Tokens en su cuenta personal de AprendeIdiomas`,"success");
	}
	else{	
	swal("Error",`No puede ingresar ${value1} en tus tokens`,"error");
	}
});	
		
}

function retirarDinero(){
	
	
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(dato) {
		
	resolve =dato.val().tokens
	
	});
	
	swal("Indique cuantos tokens desea retirar:", {
	content: "input",
})
.then((value2) => {
	if(parseInt(value2) >= 1 ){
		
	if(resolve<value2){
		
		swal("Error",`No puede retirar ${value2} tokens, la cantidad que posee en su cuenta es de ${resolve} tokens`,"error");
		
		}else{
		resolve-=value2;
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(resolve);
		swal("Exito",`Se ha realizado la transaccion de ${value2} tokens, en dos dias se efectuara el ingreso en cuenta bancaria`,"success");
	
	
	}
	}
	else{	
	swal("Error",`No puede retirar ${value2} en tus tokens`,"error");
	}
	});	
		

}

function notificarUsuario(dni,notificacion){
	firebase.database().ref('Usuarios').child(dni).child('notificaciones').push(notificacion);
	
}



