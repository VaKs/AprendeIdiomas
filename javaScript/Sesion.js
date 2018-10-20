var usuarioActual;

function SignIn(){
	localStorage['dni']="12345678A";
	window.location.href = "./web/perfilUsuario.html";
	//document.getElementById('container').load("../web/perfilUsuario.txt"); 
	
}

function mostrarDatosUsuario(){
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(snapshot) {
		usuarioActual=snapshot.val();
		var output="<p> Nombre: "+ usuarioActual.nombre+" </p>";
		output=output+"<p> Apellido: "+ usuarioActual.apellido+" </p>";
		document.getElementById('container').innerHTML=output;
	});
	
}

function promocionarUsuario(){
	//Consulta los tokens del usuario
	let tokens = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(snapshot) {
			usuarioActual=snapshot.val();
			resolve(parseInt(usuarioActual.tokens));
		});
	});

	//Una vez se han consultado, se restan 5 tokens y se convierte el anuncio en premium
	tokens.then((res) => {
		if(res >= 5){
				firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(res - 5);
				firebase.database().ref('Anuncios').child(localStorage['dni']).child('premium').set(true);
				alert("Tu anuncio ha sido promocionado.");

		} else {
				alert("No tienes suficientes tokens.");
		}
	});
}

