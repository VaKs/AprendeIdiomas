
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
		
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').child(notificacion.claseKeyProfe).child("estado").set("aceptada");
		firebase.database().ref('Usuarios').child(notificacion.solicitante).child('clases').child(notificacion.claseKeyAlumno).child("estado").set("aceptada");
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
		var notificacionAceptacion = new Object();
		notificacionAceptacion.descripcion = "Se ha aceptado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.dia +"/"+notificacion.mes+"/"+notificacion.anyo+"-"+notificacion.hora;
		notificarUsuario(notificacion.solicitante,notificacionAceptacion);
		notificarUsuario(notificacion.profesor,notificacionAceptacion);
		
		calendario();
		mostrarClasesAcordadas();
	});
}

function rechazar_clase(key){
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).once('value').then(function(snapshot) {
		var notificacion = snapshot.val();
		var idhorario=notificacion.idHorario;
		var claseKeyProfe=notificacion.claseKeyProfe;
		var claseKeyAlumno = notificacion.claseKeyAlumno;
		var dniAlumno=notificacion.solicitante;
		var notificacionRechazada = new Object();		
		notificacionRechazada.descripcion = "Se ha rechazado la solicitud para la clase de "+notificacion.idioma+" en fecha: "+notificacion.dia+"/"+notificacion.mes+"/"+notificacion.anyo+"-"+notificacion.hora;
		notificarUsuario(notificacion.solicitante,notificacionRechazada);

		firebase.database().ref('Usuarios').child(localStorage['dni']).child('notificaciones').child(key).remove();
		firebase.database().ref('Usuarios').child(dniAlumno).child('clases').child(claseKeyAlumno).remove();
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').child(claseKeyProfe).remove();
		firebase.database().ref('Anuncios').child(localStorage['dni']).child("horario").child(idhorario).child("estado").set("disponible");
		
		calendario();
		mostrarClasesAcordadas();
	});	
}


function cancelar_clase(key){
	
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').child(key).once('value').then(function(snapshot) {
		
		clase = snapshot.val();
		dniAlumno=clase.solicitante;
		dniProfe=clase.profesor;
		idHorario=clase.idHorario;
		notificacion=new Object();
		notificacion.descripcion="Se ha cancelado la clase de "+clase.idioma+" de la fecha "+clase.dia+"/"+clase.mes+"/"+clase.anyo+" a las "+clase.hora;
		
		notificarUsuario(dniProfe,notificacion);
		notificarUsuario(dniAlumno,notificacion);
		firebase.database().ref('Anuncios').child(dniProfe).child("horario").child(idHorario).child("estado").set("disponible");
		firebase.database().ref('Usuarios').child(dniAlumno).child('clases').child(clase.claseKeyAlumno).remove();
		firebase.database().ref('Usuarios').child(dniProfe).child('clases').child(clase.claseKeyProfe).remove();
		mostrarClasesAcordadas();
		calendario();
	});	

}

function mostrarClasesAcordadas(){
	

	firebase.database().ref('Usuarios').child(localStorage['dni']).child("clases").on('value', function(snapshot){
		$('#containerCancelados').html("");
		
		snapshot.forEach(Clasesvalor => {
			 key = Clasesvalor.key;
			 clase = Clasesvalor.val();
			 if(clase.estado=="aceptada"){
			 output = clase.idioma+" de la fecha "+clase.dia+"/"+clase.mes+"/"+clase.anyo+" a las "+clase.hora;
			$('#containerCancelados').append("<li>"+output+"<br><button id='botonrechazar' class='btn btn-danger' onclick='cancelar_clase(\""+key+"\")'>Cancelar Clase</button></li>");
			 }
		});
		
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



