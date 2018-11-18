var listaIdiomaFlex = [];
var listaIdiomaPrecio = [];

function openModalEditarPerfil() {

	document.getElementById("nombrePerfil").value = DatosPerfilActual.nombre;
	document.getElementById("apellidoPerfil").value = DatosPerfilActual.apellido;
	document.getElementById("localidadPerfil").value = DatosPerfilActual.Caracteristicas.Localidad;
	document.getElementById("descripcionPerfil").value = DatosPerfilActual.Caracteristicas.Descripcion;
	document.getElementById("estudiosPerfil").value = DatosPerfilActual.Caracteristicas.Estudios;

	$('#modalEditarPerfil').modal({ backdrop: 'static', keyboard: false })
	$('#modalEditarPerfil').modal('show');
}

function guardarEditarPerfil() {

	var nombreNuevo = document.getElementById("nombrePerfil").value;
	var apellidoNuevo = document.getElementById("apellidoPerfil").value;
	var localidadNuevo = document.getElementById("localidadPerfil").value;
	var descripcionNuevo = document.getElementById("descripcionPerfil").value;

	var EstudiosNuevo = document.getElementById("estudiosPerfil").value;

	firebase.database().ref('Usuarios').child(localStorage['dni']).child('nombre').set(nombreNuevo);
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('apellido').set(apellidoNuevo);
	firebase.database().ref('Anuncios').child(localStorage['dni']).child('nombre').set(nombreNuevo + ' ' + apellidoNuevo);
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Localidad').set(localidadNuevo);
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Descripcion').set(descripcionNuevo);

	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Estudios').set(EstudiosNuevo);

	$('#modalEditarPerfil').modal('hide');
}

function openModalCrearAnuncio() {

	$('#modalCrearAnuncio').modal({ backdrop: 'static', keyboard: false })
	$('#modalCrearAnuncio').modal('show');
}

function selectedIdioma() {

	var listaIdiomasSelected = [];
	var output = "<div class='row'>";

	listaIdiomasSelected = $('select#idiomasSelect').val();

	if (listaIdiomasSelected.length > listaIdiomaFlex.length) { //AGREGO UN IDIOMA

		listaIdiomasSelected.forEach(idiomaSelected => {

			if (listaIdiomaFlex.indexOf(idiomaSelected) == -1) { //PARA ENCONTRAR EL IDIOMA AGREGADO

				let splitIdioma = idiomaSelected.split("-");

				var idiomaPrecio = {
					"idioma": splitIdioma[0],
					"nivel": splitIdioma[1],
					"coste": 0
				}

				listaIdiomaPrecio.push(idiomaPrecio);
				listaIdiomaFlex = listaIdiomasSelected;
			}
		});

	}
	else {
		if (listaIdiomasSelected.length == listaIdiomaFlex.length) { //NO HAY CAMBIOS
			console.log("NO HAY CAMBIOS");
		}
		else { // QUITO UN IDIOMA

			let idiomaBorradoSplit;

			listaIdiomaFlex.forEach(function (idiomaFlex, index) {
				if (listaIdiomasSelected.indexOf(idiomaFlex) == -1) {
					idiomaBorradoSplit = idiomaFlex.split("-");
				}
			});

			listaIdiomaPrecioCopia = listaIdiomaPrecio;
			listaIdiomaPrecio = [];

			listaIdiomaPrecioCopia.forEach(function (idiomaPrecio, index) {
				if (idiomaPrecio.idioma.trim() == idiomaBorradoSplit[0].trim() && idiomaPrecio.nivel.trim() == idiomaBorradoSplit[1].trim()) {
				}
				else {
					listaIdiomaPrecio.push(idiomaPrecio);
				}
			});

			listaIdiomaFlex = listaIdiomasSelected;

		}
	}

	listaIdiomaPrecio.forEach(idiomaPrecio => { //PINTAR LA LISTA DE IDIOMAS AGREGADOR ACTUALMENTE

		let id = idiomaPrecio.idioma.trim() + "_" + idiomaPrecio.nivel.trim();

		output=output+"<div class='col-xs-6 col-md-6'>";
		output = output + "<li> Idioma: " + idiomaPrecio.idioma + " - Nivel " + idiomaPrecio.nivel;
		output=output+"</div>";
		output=output+"<div class='col-xs-6 col-md-6'> <div class='input-group'> <span class='input-group-addon'> <i class='fa fa-money' aria-hidden='true'></i> Tokens</span>";
		output = output + "<input onchange='setPrecioIdioma(this.id, this.value)' type='number' class='form-control' id='" + id + "' placeholder='Enter email'> </div>";
		output = output + "</li>";
		output=output+"</br></div>";

	});

	output=output+"</div>";

	document.getElementById('listaPrecio').innerHTML = output;

	listaIdiomaPrecio.forEach(idiomaPrecio => { //SET A LOS INPUT LOS COSTES INGRESADOS DE LOS IDIOMAS

		let id = idiomaPrecio.idioma.trim() + "_" + idiomaPrecio.nivel.trim();

		document.getElementById(id).value = idiomaPrecio.coste;

	});


}

function setPrecioIdioma(id, valor) {

	var splitId = id.split("_");

	listaIdiomaPrecio.forEach(function (idiomaPrecio, index) {
		let nuevoPrecio;
		if (listaIdiomaPrecio[index].idioma.trim() == splitId[0].trim() && listaIdiomaPrecio[index].nivel.trim() == splitId[1].trim()) {
			nuevoPrecio = {
				"idioma": listaIdiomaPrecio[index].idioma,
				"nivel": listaIdiomaPrecio[index].nivel,
				"coste": Number(valor)
			}

			listaIdiomaPrecio[index] = nuevoPrecio;

		}
	});

}

function crearAnuncio() {

	listaIdiomaPrecio.forEach(function (idiomaPrecio) {

		var arg = new Object();
		arg.Idioma = idiomaPrecio.idioma.trim();
		arg.Nivel = idiomaPrecio.nivel.trim();
		arg.coste = idiomaPrecio.coste;

		firebase.database().ref('Usuarios').child(localStorage['dni']).child('Idiomas').push(arg);
		firebase.database().ref('Anuncios').child(localStorage['dni']).child('Idiomas').push(arg);

		$('#modalCrearAnuncio').modal('hide');
		swal("Exito", "Anuncio creado exitosamente", "success");
		verificarBotonCrearAnuncio();

	});
}

function verificarBotonCrearAnuncio() {


	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Idiomas').once('value').then(function (arg) {
		let idiomas = arg.val();
		let cont = 0;

		for (var i in idiomas) {
			cont++;
		}

		if (cont > 0) document.getElementById("btnCrearAnuncio").disabled = true;
		else document.getElementById("btnCrearAnuncio").disabled = false;
	});

}
