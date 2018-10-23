
/*var alumno, decision;

function mostrar_boton(){
	
	
	var b = "<button id='classtest' class='btn btn-primary' onclick='manejador_clase()'>Manejar clases</button>";
	
	var notificacion = document.getElementById('container1').innerHTML;
		document.getElementById('container1').innerHTML= notificacion + b;
}
function manejador_clase(){
	
	swal("¿Desea aceptar la clase?", {
  buttons: {
    cancelar: true, 
    aceptar: {
      text: "Aceptar",
      value: "accept",
    },

  },
})
.then((value) => {
  switch (value) {
 
   //* case "cancel":
   //    swal("La clase ha sido cancelada","Se ha notificado al alumno","error");
  //    break;
 
    case "accept":
      swal("La clase ha sido aceptada","Se ha añadido la clase a su calendario", "success");
	  notificar(true);
      break;
 
    default:
	swal("La clase ha sido cancelada","Se ha notificado al alumno","error");
	notificar(false);

      break;
  }
});
  }

function notificar(decision){
	
		
	
		if(decision){
			var output="<p> La clase de X ha sido aceptada </p>";
			var notificacion = document.getElementById('container1').innerHTML;
			document.getElementById('container1').innerHTML= notificacion + output;
				
		}else{
			var output="<p> La clase de X ha sido rechazada </p>";	
			var notificacion = document.getElementById('container1').innerHTML;		
			document.getElementById('container1').innerHTML= notificacion + output;
		
		}
	
	
}
*/
function listar_notificaciones(){
	
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').on('value',function(snapshot) {
	var output = "<p> Notificaciones: </p><br><ul>";
	snapshot.forEach(notificacionSnapshot => {
		var key = notificacionSnapshot.key;
		var notificacion = notificacionSnapshot.val();
		output =output+ "<li>"+ notificacion.descripcion;
		if(notificacion.tipo == "clase"){
			
			output = output + ": " + notificacion.fecha +" a las  "+ notificacion.hora +" de " + notificacion.idioma + " por " + notificacion.solicitante +
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
		clase.fecha = notificacion.fecha;
		clase.hora = notificacion.hora;
		clase.idioma = notificacion.idioma;
		clase.precio = notificacion.precio;
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').push(clase);
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
		
		var notificacionAceptacion = new Object();
		notificacionAceptacion.descripcion = "Se ha aceptado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.fecha+"-"+notificacion.hora;
		
		notificarUsuario(notificacion.solicitante,notificacionAceptacion);
		
	});
	
	
	
}

function rechazar_clase(key){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).once('value').then(function(snapshot) {
		var notificacion = snapshot.val();
		var notificacionRechazada = new Object();		
		notificacionRechazada.descripcion = "Se ha rechazado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.fecha+"-"+notificacion.hora;
		
		notificarUsuario(notificacion.solicitante,notificacionRechazada);

		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).child('estado').set('rechazada');
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
	});	
}

function notificarUsuario(dni,notificacion){
	firebase.database().ref('Usuarios').child(dni).child('notificaciones').push(notificacion);
	
}



