$( document ).ready(function() {

	firebase.database().ref('Usuarios').on('value',function(dato) {

		var dniSeleccionado = location.search.substring(1,location.search.length);

		var valor = null;

		dato.forEach(datosUsuario => {

			var dniProfe = datosUsuario.key;

			if(dniProfe==dniSeleccionado){
				valor = datosUsuario.val();
				return true;
			}
			
		
		});

		document.getElementById('nombre').innerHTML="<i class='fa fa-user'></i> <strong> Nombre: </strong> <span id='nombre'>" + valor.nombre + " " + valor.apellido + " </span> ";
		document.getElementById('localidad').innerHTML="<i class='fa fa-map-marker'></i> <strong> Localidad: </strong> <span id='localidad'>" + valor.Caracteristicas.Localidad + " </span> ";
		document.getElementById('valoracion').innerHTML="<i class='fa fa-star'></i> Valoracion: <span id='localidad'>" + valor.Caracteristicas.Valoracion + " </span> ";
		document.getElementById('descripcion').innerHTML="<i>" + valor.Caracteristicas.Descripcion + "</i>";
		document.getElementById('estudios').innerHTML=" <u> <strong> Estudios </strong> </u> </br></br> <span id='estudios'>" + valor.Caracteristicas.Estudios + " </span> <hr/> ";
		mostrarPremium(dniSeleccionado);

		var listaIdiomas = " <u> <strong> Clases impartidas </strong> </u> </br></br>"
		var idiomas = valor.Idiomas;

		for(var i in idiomas) {
			console.log("i", idiomas[i]);
			var idioma = idiomas[i].Idioma;
			var nivel = idiomas[i].Nivel;
			var coste = idiomas[i].coste;

		    listaIdiomas = listaIdiomas + "<li type='circle'> <span> Idioma " + idioma+" nivel: "+nivel+" - Precio: "+coste+" tokens" + "</span> </li> </br>"

		}

		document.getElementById('idiomas').innerHTML= listaIdiomas;

		var url = window.location.href;
		var dniUsuario=url.substring(url.lastIndexOf('?')+1);
		
		firebase.database().ref('Usuarios').child(dniUsuario).child('Caracteristicas').child('Reseñas').once('value').then(function(snapshot) {
		var listaResenyas = "";
		
		snapshot.forEach(notificacionSnapshot => {
			
			var resenya = notificacionSnapshot.val();
			listaResenyas = listaResenyas + "<span> <i class='fa fa-star' aria-hidden='true'></i>  <i>" + resenya.valoracion+ " </i> </span> </br></br>";
			
		});
		document.getElementById('reseñas').innerHTML= listaResenyas;
		
		});
	});

});

