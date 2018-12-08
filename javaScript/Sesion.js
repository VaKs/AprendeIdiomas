var usuarioActual;
var DatosPerfilActual;

function comprobarSesion(){
	var url = window.location.href;
	switch(url.substring(url.lastIndexOf('/')+1)){
		case "index.html":
			if(!(localStorage['dni'] == "") && !(localStorage['dni'] == null)) {
				var boton = '<button id="prueba" onclick="SignOut()">logout</button>';
				document.getElementById('form').innerHTML = boton;
			}
			break;
		case "perfilUsuario.html":
			if((localStorage['dni'] == "") || (localStorage['dni'] == null)) {
				window.location.href = "../index.html";
			}
			break;
	}
}

function SignIn(){
	var usuario =document.getElementById('usuario').value;
	var contrasena = document.getElementById('contrasena').value;
	firebase.database().ref('Usuarios').child(usuario).once('value',function(snapshot) {
		if(snapshot.exists()) {
			usuarioActual=snapshot.val();
			if(usuarioActual.password == contrasena){
				localStorage['dni'] = document.getElementById('usuario').value;
				localStorage['password'] = document.getElementById('contrasena').value;
				localStorage['nombre'] = usuarioActual.nombre;
				location.reload();
			} else {
				swal("Error","La contraseña es incorrecta","error");
			}
		} else {
			swal("Error","No existe el usuario","error");
		}
	});
}

function SignUp(mode){
	if(!mode) {
		var form = '<a href = "index.html"><img src="img/ic_arrow_back.png" align="left"></a>'
			+'<input id= "usuario" type="text" placeholder="DNI"/>'
			+'<input id= "contrasena" type="password" placeholder="Contraseña"/>'
			+'<input id= "email" type="text" placeholder="Email"/>'
			+'<input id= "nombre" type="text" placeholder="Nombre"/>'
			+'<input id= "apellidos" type="text" placeholder="Apellidos"/>'
			+'<input id= "localidad" type="text" placeholder="Localidad"/>'
			+'<button style="background: #4CAF50;" id="prueba2" onclick="SignUp(true)">regístrate</button>';
		document.getElementById('form').innerHTML = form;
	} else {
		var i = 0;
		$("div#form > input").each(function () { if(this.value != '') { i++; } });

		if(i < 6) {
			swal("Error","Los campos son obligatorios","error");
		} else {
			var usuario = document.getElementById('usuario').value;
			var usuarios = firebase.database().ref('Usuarios');
			usuarios.child(usuario).once('value',function(snapshot) {
				if(!snapshot.exists()) {
					usuarios.child(usuario).set({
						password: document.getElementById('contrasena').value,
						email: document.getElementById('email').value,
						nombre: document.getElementById('nombre').value,
						apellido: document.getElementById('apellidos').value,
						localidad: document.getElementById('localidad').value,
						premium: false,
						tokens: 0
					}, function(error) {
					    if (error) {
					      swal("Error","No se ha podido registrar","error");
					    } else {
						    swal("Correcto","Se ha registrado correctamente. Ya puedes hacer el login","success").then((value) => {

								location.reload();

							});
					    }
					});
				} else {
					swal("Error","Ya existe el usuario","error");
				}
			});
		}
	}

}

function SignOut(){
	localStorage['dni'] = "";
	localStorage['password'] = "";
	localStorage['nombre'] = "";
	location.reload();
}

function mostrarDatosUsuario() {
	firebase.database().ref('Usuarios').child(localStorage['dni']).once('value', function (snapshot) {
		usuarioActual = snapshot.val();
		var output = "<p> Nombre: " + usuarioActual.nombre + " </p>";
		output = output + "<p> Apellido: " + usuarioActual.apellido + " </p>";
		document.getElementById('container').innerHTML = output;
	});

}

function promocionarUsuario() {
	
	var premium;
	firebase.database().ref('Usuarios').child(localStorage['dni']).once('value', function(snapshot) {
		premium = snapshot.val().premium;
		});
		
	if(premium) {
			swal("Error","Ya esta asociado a la cuenta premium","error");
			
		
	
		}else{
			
	//Consulta los tokens del usuario
	let tokens = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(localStorage['dni']).once('value', function (snapshot) {
			usuarioActual = snapshot.val();
			resolve(parseInt(usuarioActual.tokens));
		});
	});

	//Una vez se han consultado, se restan 5 tokens y se convierte el anuncio en premium
	tokens.then((res) => {
		if (res >= 5) {
			
			
			firebase.database().ref('Anuncios').child(localStorage['dni']).once('value', function (snapshot) {

				if(snapshot.val() != null){
					firebase.database().ref('Anuncios').child(localStorage['dni']).child('premium').set(true);
				}
				
			});
	
			firebase.database().ref('Usuarios').child(localStorage['dni']).child('tokens').set(res - 5);
			firebase.database().ref('Usuarios').child(localStorage['dni']).child('premium').set(true);
			

		} else {
			swal("Error","No tienes suficientes tokens.","error");
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
		firebase.database().ref('Usuarios').child(dniEmisor).once('value', function (snapshot) {
			resolve(parseInt(snapshot.val().tokens));
		});
	});

	tokensEmisor.then((res) => {
		firebase.database().ref('Usuarios').child(dniEmisor).child('tokens').set(res - cantidad);
	});

	let tokensReceptor = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(dniReceptor).once('value', function (snapshot) {
			resolve(parseInt(snapshot.val().tokens));
		});
	});

	tokensReceptor.then((res) => {
		firebase.database().ref('Usuarios').child(dniReceptor).child('tokens').set(res + cantidad);
	});

	var output = new Object();
	output.descripcion = "Se ha pagado la clase";
	output.precio = cantidad;
	output.receptor = dniReceptor;
	output.emisor = dniEmisor;

	firebase.database().ref('Usuarios').child(dniEmisor).child('notificaciones').push(output);
	firebase.database().ref('Usuarios').child(dniReceptor).child('notificaciones').push(output);
}

function mostrarInfoPerfil() {

	firebase.database().ref('Usuarios').once('value', function (dato) {

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

		
		firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Reseñas').once('value').then(function(snapshot) {
		var listaResenyas = "";
		
		snapshot.forEach(notificacionSnapshot => {
			
			var resenya = notificacionSnapshot.val();
			listaResenyas = listaResenyas + "<span> <i class='fa fa-star' aria-hidden='true'></i>  <i>" + resenya.valoracion+ " </i> </span> </br></br>";
			
		});
		document.getElementById('reseñas').innerHTML= listaResenyas;
		
		});

	

	});
}

