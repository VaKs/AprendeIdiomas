$( document ).ready(function() {

	firebase.database().ref('Anuncios').on('value',function(snapshot) {
		console.log("snapshot", snapshot);
		document.getElementById('container').innerHTML="<div id='premium'></div><div id='noPremium'></div>";
		snapshot.forEach(anuncioSnapshot => {
			console.log("ANUNCIO SNAPSHOT", anuncioSnapshot.val());
			var output="";
			var dniProfe = anuncioSnapshot.key;
			var anuncioOutput = "<div id="+dniProfe+" class='anuncio'>";
			var valor = anuncioSnapshot.val();
			var premium = anuncioSnapshot.val().premium;

			console.log("valor", valor);

			
			//anuncioOutput =anuncioOutput+ "<h3>Profesor: <a href='usuario.html'>"+valor.nombre+"</a></h3> ";

			anuncioOutput =anuncioOutput+ "<h3>Profesor: <a onclick='test(\"" + dniProfe + "\")'>"+valor.nombre+"</a></h3> ";

			//anuncioOutput =anuncioOutput+ "<h3>Profesor: <a onclick='test(null)</a > " + valor.nombre + "</h3> ";
			
			var idiomas = anuncioSnapshot.val().Idiomas;
			for(var i in idiomas) {
				var idioma = idiomas[i].Idioma;
				var nivel = idiomas[i].Nivel;
				var coste = idiomas[i].coste;

				console.log("xxxx", idiomas[i]);

				var idIdioma="#"+dniProfe;
				anuncioOutput = anuncioOutput+"<label class='container'><b style='color:#f2f2f2;'>A</b>"+idioma+" nivel: "+nivel+", precio: "+coste+" tokens";
					anuncioOutput = anuncioOutput+"<input type='radio' name='idioma_"+dniProfe+"' value="+idioma+">";
					anuncioOutput = anuncioOutput+"<span class='checkmark'></span>";
				anuncioOutput = anuncioOutput+"</label>";
				//anuncioOutput = anuncioOutput+"<p>idioma: "+idioma+" nivel: "+nivel+" precio: "+coste+" tokens</p>";
			}
			var horarios=anuncioSnapshot.val().horario;
			anuncioOutput = anuncioOutput+"<p>Horario disponible:</p>";
			anuncioOutput = anuncioOutput+"<div class='custom-select' style='width:200px;'>";
			anuncioOutput = anuncioOutput+"<select class='horario_"+dniProfe+"'>";
				anuncioOutput = anuncioOutput+"<option value='0'> Seleccione clase: </option>";
			for(var i in horarios) {
				var estado = horarios[i].estado;
				var fecha = horarios[i].fecha;
				var hora = horarios[i].hora;
				
				anuncioOutput = anuncioOutput+"<option value="+fecha+"-"+hora+">"+fecha+" a las "+hora+"</option>";
			}
				anuncioOutput = anuncioOutput+"</select>";
			anuncioOutput = anuncioOutput+"</div>";
			anuncioOutput = anuncioOutput+"<button id='btn-"+dniProfe+"' class='btn btn-primary' onclick='solicitarClase(\"" + dniProfe + "\")'> Solicitar Clase </button>";
			anuncioOutput = anuncioOutput+"</div><br>";
			output=output+anuncioOutput;
			
			if(premium){
				var listaPremium = document.getElementById('premium').innerHTML;
				document.getElementById('premium').innerHTML=listaPremium+output;
				
			} else {
				
				var listaPremium = document.getElementById('noPremium').innerHTML;
				document.getElementById('noPremium').innerHTML=listaPremium+output;
				
			}	
		
		});
		buildSelectBox();

	});

});

function solicitarClase(profe){
	//TODO
}

function test(param){
	console.log("JEJEJE",param);

	//pagina +="usuario.html?"+param;
	location.href="usuario.html?"+param+"";
}

