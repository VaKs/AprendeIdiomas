var usuarioActual;

function SignIn(){
	localStorage['dni']="12345678A";
	firebase.database().ref('Usuarios').child(localStorage['dni']).on('value',function(snapshot) {
		usuarioActual=snapshot.val();
		localStorage['nombre']=usuarioActual.nombre;
	
		window.location.href = "./web/perfilUsuario.html";
	});
	
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
				firebase.database().ref('Usuarios').child(localStorage['dni']).child('premium').set(true);
				alert("Tu anuncio ha sido promocionado.");

		} else {
				alert("No tienes suficientes tokens.");
		}
	});
}

function mostrarPremium() {
	firebase.database().ref('Usuarios').child(localStorage['dni']).once('value').then(function(snapshot) {
		if(snapshot.val().premium) {
			var img = document.createElement('IMG');
			img.setAttribute('src', "../img/premium.jpg");
			img.setAttribute('height', "auto");
			img.setAttribute('width', "10%");
			var div = document.getElementById('premium');
			div.appendChild(img);
		}
	});
}



function transaccionTokens(dniEmisor, dniReceptor, cantidad) {
	let tokensEmisor = new Promise((resolve, reject) => {
		firebase.database().ref('Usuarios').child(dniEmisor).on('value',function(snapshot) {
			resolve(parseInt(snapshot.val().tokens));
		});
	});

	tokensEmisor.then((res) => {
		firebase.database().ref('Usuarios').child(dniEmisor).child('tokens').set(res - cantidad);
	});

		let tokensReceptor = new Promise((resolve, reject) => {
			firebase.database().ref('Usuarios').child(dniReceptor).on('value',function(snapshot) {
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

