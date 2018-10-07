var usuarioActual;

function SignIn(){
	localStorage['dni']="12345678A";
	window.location.href = "./web/perfilUsuario.html";
	
}

function mostrarDatosUsuario(){
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(snapshot) {
		usuarioActual=snapshot.val();

		var output="<p> Nombre: "+ usuarioActual.nombre+" </p>";
		output=output+"<p> Apellido: "+ usuarioActual.apellido+" </p>";	
		document.getElementById('content').innerHTML=output;
	});
	
}

