var usuarioActual;
var DatosPerfilActual;

function comprobarSesion(){
	var url = window.location.href;
	switch(url.substring(url.lastIndexOf('/')+1)){
		case "index.html":
			if(!(localStorage['dni'] == "")) {
				var boton = '<button id="prueba" onclick="SignOut()">logout</button>';
				document.getElementById('form').innerHTML = boton;
			}
			break;
		case "perfilUsuario.html":
			if(localStorage['dni'] == "") {
				window.location.href = "../index.html";
			}
			break;
	}
}

function SignIn(){
	var usuario =document.getElementById('usuario').value;
	var contrasena = document.getElementById('contrasena').value;
	firebase.database().ref('Usuarios').child(usuario).on('value',function(snapshot) {
		if(snapshot.exists()) {
			usuarioActual=snapshot.val();
			if(usuarioActual.password == contrasena){
				localStorage['dni'] = document.getElementById('usuario').value;
				localStorage['password'] = document.getElementById('contrasena').value;
				localStorage['nombre'] = usuarioActual.nombre;
				location.reload();
			} else {
				alert('La contraseña es incorrecta');
			}
		} else {
			alert('No existe el usuario');
		}
	});
}

function SignOut(){
	localStorage['dni'] = "";
	localStorage['password'] = "";
	localStorage['nombre'] = "";
	location.reload();
}

function mostrarDatosUsuario() {
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value', function (snapshot) {
		usuarioActual = snapshot.val();
		var output = "<p> Nombre: " + usuarioActual.nombre + " </p>";
		output = output + "<p> Apellido: " + usuarioActual.apellido + " </p>";
		document.getElementById('container').innerHTML = output;
	});

}

function promocionarUsuario() {
	
	var premium;
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value', function(snapshot) {
		premium = snapshot.val().premium;
		});
		
	if(premium) {
			swal("Error, ya esta asociado a la cuenta premium");
			
		
	
		}else{
			
	//Consulta los tokens del usuario
	let tokens = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(localStorage['dni']).on('value', function (snapshot) {
			usuarioActual = snapshot.val();
			resolve(parseInt(usuarioActual.tokens));
		});
	});

	//Una vez se han consultado, se restan 5 tokens y se convierte el anuncio en premium
	tokens.then((res) => {
		if (res >= 5) {
			
			
			firebase.database().ref('Anuncios').child(localStorage['dni']).on('value', function (snapshot) {

				if(snapshot.val() != null){
					firebase.database().ref('Anuncios').child(localStorage['dni']).child('premium').set(true);
				}
				
			});
	
			firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(res - 5);
			firebase.database().ref('Usuarios').child(localStorage['dni']).child('premium').set(true);
			swal("Tu anuncio ha sido promocionado.");

		} else {
			swal("No tienes suficientes tokens.");
		}
	});
	}
	
	
}


function mostrarPremium(dni) {
	firebase.database().ref('Usuarios').child(dni).once('value').then(function(snapshot) {
		if(snapshot.val().premium) {

			var img = document.createElement('IMG');
			img.setAttribute('src', "../img/premium.jpg");
			img.setAttribute('height', "auto");
			img.setAttribute('width', "100%");
			var div = document.getElementById('premium');
			div.appendChild(img);
		}
	});
}

function transaccionTokens(dniEmisor, dniReceptor, cantidad) {
	let tokensEmisor = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(dniEmisor).on('value', function (snapshot) {
			resolve(parseInt(snapshot.val().tokens));
		});
	});

	tokensEmisor.then((res) => {
		firebase.database().ref('Usuarios').child(dniEmisor).child('tokens').set(res - cantidad);
	});

	let tokensReceptor = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(dniReceptor).on('value', function (snapshot) {
			resolve(parseInt(snapshot.val().tokens));
		});
	});

	tokensReceptor.then((res) => {
		firebase.database().ref('Usuarios').child(dniReceptor).child('tokens').set(res + cantidad);
	});

	var output = new Object();
	output.descripcion = "Se ha pagado la clase";
	output.precio = "10";
	output.receptor = dniReceptor;
	output.emisor = dniEmisor;

	firebase.database().ref('Usuarios').child(dniEmisor).child('notificaciones').push(output);
	firebase.database().ref('Usuarios').child(dniReceptor).child('notificaciones').push(output);
}

function mostrarInfoPerfil() {

	firebase.database().ref('Usuarios').on('value', function (dato) {

		var valor = null;

		dato.forEach(datosUsuario => {

			var dniProfe = datosUsuario.key;

			if (dniProfe == localStorage['dni']) {
				valor = datosUsuario.val();
				return true;
			}


		});

		DatosPerfilActual = valor;

		document.getElementById('cantTokens').innerHTML = " <span id='cantTokens'>" + valor.tokens + " </span> ";
		document.getElementById('nombre').innerHTML = "<i class='fa fa-user'></i> <strong> Nombre: </strong> <span id='nombre'>" + valor.nombre + " " + valor.apellido + " </span> ";
		document.getElementById('localidad').innerHTML = "<i class='fa fa-map-marker'></i> <strong> Localidad: </strong> <span id='localidad'>" + valor.Caracteristicas.Localidad + " </span> ";
		document.getElementById('valoracion').innerHTML = "<i class='fa fa-star'></i> Valoracion: <span id='localidad'>" + valor.Caracteristicas.Valoracion + " </span> ";
		document.getElementById('descripcion').innerHTML = "<i>" + valor.Caracteristicas.Descripcion + "</i>";
		document.getElementById('estudios').innerHTML = " <u> <strong> Estudios </strong> </u> </br></br> <span id='estudios'>" + valor.Caracteristicas.Estudios + " </span> <hr/> ";


		var listaIdiomas = " <u> <strong> Clases impartidas </strong> </u> </br></br>"
		var idiomas = valor.Idiomas;

		for (var i in idiomas) {
			var idioma = idiomas[i].Idioma;
			var nivel = idiomas[i].Nivel;
			var coste = idiomas[i].coste;

			listaIdiomas = listaIdiomas + "<li type='circle'> <span> Idioma " + idioma + " nivel: " + nivel + " - Precio: " + coste + " tokens" + "</span> </li> </br>"

		}

		document.getElementById('idiomas').innerHTML = listaIdiomas;

		var listaReseñas = ""
		var reseñas = valor.Caracteristicas.Reseñas;

		for (var i in reseñas) {
			listaReseñas = listaReseñas + "<span> <i class='fa fa-star' aria-hidden='true'></i>  <i>" + reseñas[i] + " </i> </span> </br></br>";
		}

		document.getElementById('reseñas').innerHTML = listaReseñas;

	});
}

