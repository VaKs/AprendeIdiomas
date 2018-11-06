function listar_notificaciones(){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').on('value',function(snapshot) {
	var output = "<p> Notificaciones: </p><br><ul>";
		snapshot.forEach(notificacionSnapshot => {
			var key = notificacionSnapshot.key;
			var notificacion = notificacionSnapshot.val();
			output =output+ "<li>"+ notificacion.descripcion;
			if(notificacion.tipo == "clase"){
				output = output + ": " + notificacion.dia +"/"+notificacion.mes+"/"+notificacion.anyo+" a las  "+ notificacion.hora +" de " + notificacion.idioma + " por " + notificacion.solicitante +
				"<br><button id='botonaceptar' class='btn btn-success' onclick='aceptar_clase(\""+key+"\")'>Aceptar</button> "+
				"<button id='botonrechazar' class='btn btn-danger' onclick='rechazar_clase(\""+key+"\")'>Rechazar</button>";
			}
			output = output + "</li>";
		});
		output = output + "</ul>";
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
		clase.nombreSolicitante=notificacion.nombreSolicitante;
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').push(clase);
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
		
		var notificacionAceptacion = new Object();
		notificacionAceptacion.descripcion = "Se ha aceptado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.dia +"/"+notificacion.mes+"/"+notificacion.año+"-"+notificacion.hora;
		
		notificarUsuario(notificacion.solicitante,notificacionAceptacion);
		calendario();
	});
}

function rechazar_clase(key){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).once('value').then(function(snapshot) {
		var notificacion = snapshot.val();
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
		resolve += 10;
		
		});
		
		
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(resolve);
		
		alert('se va a proceder a realizar un cobro en su cuenta');
		alert('a recargado 10 tokens');
}


function retirarDinero(){
	
	
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(dato) {
		
	resolve =dato.val().tokens
	
	});
	
	if(resolve<50){
		alert('No tiene suficientes tokens para realizar una transaccion bancaria, 50 tokens minimo');
	}else{
		resolve=50;
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(resolve);
		alert('Se ha realizado una transaccion de 50 tokens en su cuenta bancaria, en dos dias recibira el dinero');	

	}

}

function notificarUsuario(dni,notificacion){
	firebase.database().ref('Usuarios').child(dni).child('notificaciones').push(notificacion);
	
}



