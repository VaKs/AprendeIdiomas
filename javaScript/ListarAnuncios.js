$( document ).ready(function() {

	firebase.database().ref('Anuncios').on('value',function(snapshot) {
		var output="";
	
		snapshot.forEach(anuncioSnapshot => {
			
			var dniProfe = anuncioSnapshot.key;
			
			var anuncioOutput = "<div id="+dniProfe+" class='anuncio'>";
			
			var valor = anuncioSnapshot.val();
			
			anuncioOutput =anuncioOutput+ "<h3>Profesor: <a href='#'>"+valor.nombre+"</a></h3> ";
			
			var idiomas = anuncioSnapshot.val().Idiomas;
			for(var i in idiomas) {
				var idioma = idiomas[i].Idioma;
				var nivel = idiomas[i].Nivel;
				var coste = idiomas[i].coste;

				anuncioOutput = anuncioOutput+"<label class='container'><b style='color:#f2f2f2;'>A</b>"+idioma+" nivel: "+nivel+", precio: "+coste+" tokens";
					anuncioOutput = anuncioOutput+"<input type='radio' name="+dniProfe+">";
					anuncioOutput = anuncioOutput+"<span class='checkmark'></span>";
				anuncioOutput = anuncioOutput+"</label>";
				//anuncioOutput = anuncioOutput+"<p>idioma: "+idioma+" nivel: "+nivel+" precio: "+coste+" tokens</p>";
			}
			var horarios=anuncioSnapshot.val().horario;
			anuncioOutput = anuncioOutput+"<p>Horario disponible:</p>";
			anuncioOutput = anuncioOutput+"<div class='custom-select' style='width:200px;'>";
			anuncioOutput = anuncioOutput+"<select>";
				anuncioOutput = anuncioOutput+"<option value='0'> Seleccione clase: </option>";
			for(var i in horarios) {
				var estado = horarios[i].estado;
				var fecha = horarios[i].fecha;
				var hora = horarios[i].hora;
				
				anuncioOutput = anuncioOutput+"<option value="+fecha+"-"+hora+">"+fecha+" a las "+hora+"</option>";
				
				//anuncioOutput = anuncioOutput+"<p>Horario: "+fecha+" - "+hora+", estado: "+estado+"</p>";
			}
				anuncioOutput = anuncioOutput+"</select>";
			anuncioOutput = anuncioOutput+"</div>";
			
			anuncioOutput = anuncioOutput+"</div><br>";
			output=output+anuncioOutput;
		});
		document.getElementById('container').innerHTML=output;	
		buildSelectBox();

	});

});