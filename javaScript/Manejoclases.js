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
		clase.nombreProfe = notificacion.nombreProfe;
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
  swal("Exito",`Se han ingresado: ${value1} Tokens en su cuenta personal de AprendeIdiomas`,"success");
		
		resolve += parseInt(value1);
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(resolve);
  
  
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
	
	if(resolve<value2){
		
		swal("Error",`No puede retirar ${value2} tokens, la cantidad que posee en su cuenta es de ${resolve} tokens`,"error");
		
		}else{
		resolve-=value2;
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(resolve);
		swal("Exito",`Se ha realizado la transaccion de ${value2} tokens, en dos dias se efectuara el ingreso en cuenta bancaria`,"success");
	
	
	}
	
	});	
		

}

function notificarUsuario(dni,notificacion){
	firebase.database().ref('Usuarios').child(dni).child('notificaciones').push(notificacion);
	
}



