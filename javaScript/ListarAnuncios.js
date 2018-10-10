$( document ).ready(function() {

	firebase.database().ref('Anuncios').on('value',function(snapshot) {
		var output="";
	
		snapshot.forEach(anuncioSnapshot => {
			
			var dniProfe = anuncioSnapshot.key;
			
			var anuncioOutput = "<div id="+dniProfe+"><p>Profesor: "+dniProfe+"</p> ";
			
			var valor = anuncioSnapshot.val();
			
			var idiomas = anuncioSnapshot.val().Idiomas;
			for(var i in idiomas) {
				var idioma = idiomas[i].Idioma;
				var nivel = idiomas[i].Nivel;
				var coste = idiomas[i].coste;
				anuncioOutput = anuncioOutput+"<p>idioma: "+idioma+" nivel: "+nivel+" precio: "+coste+" tokens</p>";
			}
			var horarios=anuncioSnapshot.val().horario;
			for(var i in horarios) {
				var estado = horarios[i].estado;
				var fecha = horarios[i].fecha;
				var hora = horarios[i].hora;
				anuncioOutput = anuncioOutput+"<p>Horario: "+fecha+" - "+hora+", estado: "+estado+"</p>";
			}
			
			anuncioOutput = anuncioOutput+"</div>";
			output=output+anuncioOutput;
		});
		document.getElementById('container').innerHTML=output;
	});

});