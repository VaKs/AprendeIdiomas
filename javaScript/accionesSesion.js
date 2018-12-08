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
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Localidad').set(localidadNuevo);
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Descripcion').set(descripcionNuevo);
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Caracteristicas').child('Estudios').set(EstudiosNuevo);

	firebase.database().ref('Anuncios').child(localStorage['dni']).on('value', function (snapshot) {

		if (snapshot.val() != null) {
			firebase.database().ref('Anuncios').child(localStorage['dni']).child('nombre').set(nombreNuevo + ' ' + apellidoNuevo);
		}

	});


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

		output = output + "<div class='col-xs-6 col-md-6'>";
		output = output + "<li> Idioma: " + idiomaPrecio.idioma + " - Nivel " + idiomaPrecio.nivel;
		output = output + "</div>";
		output = output + "<div class='col-xs-6 col-md-6'> <div class='input-group'> <span class='input-group-addon'> <i class='fa fa-money' aria-hidden='true'></i> Tokens</span>";
		output = output + "<input onchange='setPrecioIdioma(this.id, this.value)' type='number' class='form-control' id='" + id + "' placeholder='Escribir N° tokens'> </div>";
		output = output + "</li>";
		output = output + "</br></div>";

	});

	output = output + "</div>";

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


	var horasLunes = $('select#horasLunes').val();
	var horasMartes = $('select#horasMartes').val();
	var horasMiercoles = $('select#horasMiercoles').val();
	var horasJueves = $('select#horasJueves').val();
	var horasViernes = $('select#horasViernes').val();
	var horasSabado = $('select#horasSabado').val();
	var horasDomingo = $('select#horasDomingo').val();

	var anioSeleccionado = $('select#anioSeleccionado').val();
	var hoy = new Date();
	var mesActual = hoy.getMonth() + 1;

	var arg = new Object();
	var listaHorarioArg = [];
	var listaIdiomasArg = [];

	for (var mes = mesActual; mes < 13; mes++) { //para cada mes

		hoy = new Date(anioSeleccionado, mes - 1, 1); //el mes comienza en enero = 0 y domingo=0

		let primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
		let ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

		for (var fechaDia = primerDia.getDate(); fechaDia < ultimoDia.getDate() + 1; fechaDia++) {
			hoy = new Date(anioSeleccionado, mes - 1, fechaDia); //el mes comienza en enero = 0

			let idDiaFecha = hoy.getDay();

			switch (idDiaFecha) {
				case 1: //LUNES

					horasLunes.forEach(horaLunes => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = horaLunes;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 2: //MARTES 

					horasMartes.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 3: //MIERCOLES

					horasMiercoles.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 4:	//JUEVES

					horasJueves.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 5: //VIERNES

					horasViernes.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 6: //SABADO

					horasSabado.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 0: //DOMINGO

					horasDomingo.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
			}

		}

	}


	if (listaIdiomaPrecio.length > 0) {

		listaIdiomaPrecio.forEach(function (idiomaPrecio) {

			var arg = new Object();
			arg.Idioma = idiomaPrecio.idioma.trim();
			arg.Nivel = idiomaPrecio.nivel.trim();
			arg.coste = idiomaPrecio.coste;

			listaIdiomasArg.push(arg);

			firebase.database().ref('Usuarios').child(localStorage['dni']).child('Idiomas').push(arg);

			$('#modalCrearAnuncio').modal('hide');

		});

		var argAnuncio = new Object();
		argAnuncio.dni = localStorage['dni'];
		argAnuncio.nombre = DatosPerfilActual.nombre + " " + DatosPerfilActual.apellido;
		argAnuncio.premium = DatosPerfilActual.premium;
		argAnuncio.Idiomas = listaIdiomasArg;
		argAnuncio.horario = listaHorarioArg;

		firebase.database().ref('Anuncios').child(localStorage['dni']).set({
			nombre: DatosPerfilActual.nombre + " " + DatosPerfilActual.apellido,
			premium: DatosPerfilActual.premium,
			Idiomas: listaIdiomasArg,
			horario: listaHorarioArg
		});


		location.reload(true);


	}
}

function verificarBotonCrearAnuncio() {


	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Idiomas').once('value').then(function (arg) {
		let idiomas = arg.val();
		let cont = 0;

		for (var i in idiomas) {
			cont++;
		}

		if (cont > 0) {
			//document.getElementById("btnCrearAnuncio").disabled = true;
			//document.getElementById("btnModificarAnuncio").disabled = false;
			document.getElementById('botonCrearModificar').innerHTML = "<button style='width:100%' id='btnModificarAnuncio' class='btn btn-primary' onclick='openModalModificarAnuncio()'> <i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;Modificar anuncio</button>";
		}
		else {
			document.getElementById('botonCrearModificar').innerHTML = "<button style='width:100%' id='btnCrearAnuncio' class='btn btn-primary' onclick='openModalCrearAnuncio()'> <i class='fa fa-newspaper-o' aria-hidden='true'></i>&nbsp;Crear anuncio</button>";
			//document.getElementById("btnCrearAnuncio").disabled = false;
			//document.getElementById("btnModificarAnuncio").disabled = true;
		}

	});

}


//MODIFICACION

function openModalModificarAnuncio() {

	var idiomasFormato = [];

	listaIdiomaFlex = [];

	listaIdiomaPrecio = [];

	firebase.database().ref('Anuncios').child(localStorage['dni']).on('value', function (dato) {

		var anuncioUsuario = dato.val();
		var idiomasUsuario = anuncioUsuario.Idiomas;
		var horarioUsuario = anuncioUsuario.horario

		var horasLunes = [];
		var horasMartes = [];
		var horasMiercoles = [];
		var horasJueves = [];
		var horasViernes = [];
		var horasSabado = [];
		var horasDomingo = [];

		var stringIdioma = '';

		//SET IDIOMAS MULTISELECT 

		for (var x = 0; x < idiomasUsuario.length; x++) {
			stringIdioma = idiomasUsuario[x].Idioma + ' - ' + idiomasUsuario[x].Nivel;
			idiomasFormato.push(stringIdioma);
			listaIdiomaFlex.push(stringIdioma);

			var idiomaPrecio = {
				"idioma": idiomasUsuario[x].Idioma,
				"nivel": idiomasUsuario[x].Nivel,
				"coste": idiomasUsuario[x].coste
			}

			listaIdiomaPrecio.push(idiomaPrecio);
		}

		for (var x = 0; x < idiomasFormato.length; x++) {
			$('#idiomasSelectMod').multiselect('select', idiomasFormato[x]);
		}

		//SET HORARIO MULTISELECT

		for (var x = 0; x < horarioUsuario.length; x++) {
			var hoy = new Date(horarioUsuario[x].anyo, horarioUsuario[x].mes - 1, horarioUsuario[x].dia);
			var idDiaFecha = hoy.getDay();

			switch (idDiaFecha) {
				case 1:
					var valorBusqueda = horasLunes.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasLunes.push(horarioUsuario[x].hora);
					}

					break;
				case 2:
					var valorBusqueda = horasMartes.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasMartes.push(horarioUsuario[x].hora);
					}

					break;
				case 3:
					var valorBusqueda = horasMiercoles.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasMiercoles.push(horarioUsuario[x].hora);
					}

					break;
				case 4:
					var valorBusqueda = horasJueves.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasJueves.push(horarioUsuario[x].hora);
					}

					break;
				case 5:
					var valorBusqueda = horasViernes.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasViernes.push(horarioUsuario[x].hora);
					}

					break;
				case 6:
					var valorBusqueda = horasSabado.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasSabado.push(horarioUsuario[x].hora);
					}

					break;
				case 0:
					var valorBusqueda = horasDomingo.indexOf(horarioUsuario[x].hora);

					if (valorBusqueda == -1) {
						horasDomingo.push(horarioUsuario[x].hora);
					}

					break;
			}
		}

		for (var x = 0; x < horasLunes.length; x++) {
			$('#horasLunesMod').multiselect('select', horasLunes[x]);
		}

		for (var x = 0; x < horasMartes.length; x++) {
			$('#horasMartesMod').multiselect('select', horasMartes[x]);
		}

		for (var x = 0; x < horasMiercoles.length; x++) {
			$('#horasMiercolesMod').multiselect('select', horasMiercoles[x]);
		}

		for (var x = 0; x < horasJueves.length; x++) {
			$('#horasJuevesMod').multiselect('select', horasJueves[x]);
		}

		for (var x = 0; x < horasViernes.length; x++) {
			$('#horasViernesMod').multiselect('select', horasViernes[x]);
		}

		for (var x = 0; x < horasSabado.length; x++) {
			$('#horasSabadoMod').multiselect('select', horasSabado[x]);
		}

		for (var x = 0; x < horasDomingo.length; x++) {
			$('#horasDomingoMod').multiselect('select', horasDomingo[x]);
		}

		//FIN A LA PRECARGA DE LOS MULTISELECT


		//LISTAPRECIOMOD

		var output = "<div class='row'>";

		idiomasUsuario.forEach(idiomaPrecio => { //PINTAR LA LISTA DE IDIOMAS AGREGADOR ACTUALMENTE


			let id = idiomaPrecio.Idioma.trim() + "_" + idiomaPrecio.Nivel.trim();

			output = output + "<div class='col-xs-6 col-md-6'>";
			output = output + "<li> Idioma: " + idiomaPrecio.Idioma + " - Nivel " + idiomaPrecio.Nivel;
			output = output + "</div>";
			output = output + "<div class='col-xs-6 col-md-6'> <div class='input-group'> <span class='input-group-addon'> <i class='fa fa-money' aria-hidden='true'></i> Tokens</span>";
			output = output + "<input onchange='setPrecioIdioma(this.id, this.value)' type='number' class='form-control' id='" + id + "' placeholder='Escribir N° tokens'> </div>";
			output = output + "</li>";
			output = output + "</br></div>";

		});

		output = output + "</div>";

		document.getElementById('listaPrecioMod').innerHTML = output;

		idiomasUsuario.forEach(idiomaPrecio => { //SET A LOS INPUT LOS COSTES INGRESADOS DE LOS IDIOMAS

			let id = idiomaPrecio.Idioma.trim() + "_" + idiomaPrecio.Nivel.trim();

			document.getElementById(id).value = idiomaPrecio.coste;

		});


		$('#modalModificarAnuncio').modal({ backdrop: 'static', keyboard: false })
		$('#modalModificarAnuncio').modal('show');


	});

}

function selectedIdiomaMod() {

	var listaIdiomasSelected = [];
	var output = "<div class='row'>";

	listaIdiomasSelected = $('select#idiomasSelectMod').val();

	if (listaIdiomasSelected.length > listaIdiomaFlex.length) { //AGREGO UN IDIOMA, listaIdiomaFlex -> es lo que hay actualmente

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

		output = output + "<div class='col-xs-6 col-md-6'>";
		output = output + "<li> Idioma: " + idiomaPrecio.idioma + " - Nivel " + idiomaPrecio.nivel;
		output = output + "</div>";
		output = output + "<div class='col-xs-6 col-md-6'> <div class='input-group'> <span class='input-group-addon'> <i class='fa fa-money' aria-hidden='true'></i> Tokens</span>";
		output = output + "<input onchange='setPrecioIdioma(this.id, this.value)' type='number' class='form-control' id='" + id + "' placeholder='Escribir N° tokens'> </div>";
		output = output + "</li>";
		output = output + "</br></div>";

	});

	output = output + "</div>";

	document.getElementById('listaPrecioMod').innerHTML = output;

	listaIdiomaPrecio.forEach(idiomaPrecio => { //SET A LOS INPUT LOS COSTES INGRESADOS DE LOS IDIOMAS

		let id = idiomaPrecio.idioma.trim() + "_" + idiomaPrecio.nivel.trim();

		document.getElementById(id).value = idiomaPrecio.coste;

	});


}

function guardarModificacion() {

	firebase.database().ref('Anuncios').child(localStorage['dni']).remove();
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('Idiomas').remove();


	var horasLunes = $('select#horasLunesMod').val();
	var horasMartes = $('select#horasMartesMod').val();
	var horasMiercoles = $('select#horasMiercolesMod').val();
	var horasJueves = $('select#horasJuevesMod').val();
	var horasViernes = $('select#horasViernesMod').val();
	var horasSabado = $('select#horasSabadoMod').val();
	var horasDomingo = $('select#horasDomingoMod').val();

	var anioSeleccionado = $('select#anioSeleccionado').val();
	var hoy = new Date();
	var mesActual = hoy.getMonth() + 1;

	var arg = new Object();
	var listaHorarioArg = [];
	var listaIdiomasArg = [];

	for (var mes = mesActual; mes < 13; mes++) { //para cada mes

		hoy = new Date(anioSeleccionado, mes - 1, 1); //el mes comienza en enero = 0 y domingo=0

		let primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
		let ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

		for (var fechaDia = primerDia.getDate(); fechaDia < ultimoDia.getDate() + 1; fechaDia++) {
			hoy = new Date(anioSeleccionado, mes - 1, fechaDia); //el mes comienza en enero = 0

			let idDiaFecha = hoy.getDay();

			switch (idDiaFecha) {
				case 1: //LUNES

					horasLunes.forEach(horaLunes => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = horaLunes;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 2: //MARTES 

					horasMartes.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 3: //MIERCOLES

					horasMiercoles.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 4:	//JUEVES

					horasJueves.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 5: //VIERNES

					horasViernes.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 6: //SABADO

					horasSabado.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
				case 0: //DOMINGO

					horasDomingo.forEach(hora => {

						arg = new Object();

						arg.anyo = Number(anioSeleccionado);
						arg.dia = fechaDia;
						arg.estado = "disponible";
						arg.hora = hora;
						arg.mes = mes;

						listaHorarioArg.push(arg);

					});

					break;
			}

		}

	}


	if (listaIdiomaPrecio.length > 0) {

		listaIdiomaPrecio.forEach(function (idiomaPrecio) {

			var arg = new Object();
			arg.Idioma = idiomaPrecio.idioma.trim();
			arg.Nivel = idiomaPrecio.nivel.trim();
			arg.coste = idiomaPrecio.coste;

			listaIdiomasArg.push(arg);

			firebase.database().ref('Usuarios').child(localStorage['dni']).child('Idiomas').push(arg);

			$('#modalModificarAnuncio').modal('hide');

		});

		var argAnuncio = new Object();
		argAnuncio.dni = localStorage['dni'];
		argAnuncio.nombre = DatosPerfilActual.nombre + " " + DatosPerfilActual.apellido;
		argAnuncio.premium = DatosPerfilActual.premium;
		argAnuncio.Idiomas = listaIdiomasArg;
		argAnuncio.horario = listaHorarioArg;

		firebase.database().ref('Anuncios').child(localStorage['dni']).set({
			nombre: DatosPerfilActual.nombre + " " + DatosPerfilActual.apellido,
			premium: DatosPerfilActual.premium,
			Idiomas: listaIdiomasArg,
			horario: listaHorarioArg
		});

		$('#modalModificarAnuncio').modal('hide');

		location.reload(true);

	}
	else {
		if (listaIdiomaPrecio.length == 0) {
			$('#modalModificarAnuncio').modal('hide');

			location.reload(true);
	
		}
	}
}