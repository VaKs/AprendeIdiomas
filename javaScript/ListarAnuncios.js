$( document ).ready(function() {

	firebase.database().ref('Anuncios').on('value',function(snapshot) {
		var cantidad_anuncios = 0;

		document.getElementById('container').innerHTML="<div id='premium'></div><div id='noPremium'></div>";
		snapshot.forEach(anuncioSnapshot => {
			if(cantidad_anuncios<=20){
				var output="";
				var dniProfe = anuncioSnapshot.key;
				var anuncioOutput = "<div id="+dniProfe+" class='anuncio'>";
				var valor = anuncioSnapshot.val();
				var premium = anuncioSnapshot.val().premium;
        
        anuncioOutput =anuncioOutput+ "<h3>Profesor: <a onclick='verPerfil(\"" + dniProfe + "\")'>"+valor.nombre+"</a></h3> ";
				
				var idiomas = anuncioSnapshot.val().Idiomas;
				for(var i in idiomas) {
					var idioma = idiomas[i].Idioma;
					var nivel = idiomas[i].Nivel;
					var coste = idiomas[i].coste;

					var idIdioma="#"+dniProfe;
					anuncioOutput = anuncioOutput+"<label class='container'><b style='color:#f2f2f2;'>A</b>"+idioma+" nivel: "+nivel+", precio: "+coste+" tokens";

						anuncioOutput = anuncioOutput+"<input type='radio' name='idioma_"+dniProfe+"' value='"+idioma+"'><input type='hidden' id="+dniProfe+i+" value="+nivel+"'>";
					
						anuncioOutput = anuncioOutput+"<span class='checkmark'></span>";
					anuncioOutput = anuncioOutput+"</label>";
				}
				var horarios=anuncioSnapshot.val().horario;
				anuncioOutput = anuncioOutput+"<p>Horario disponible:</p>";
				anuncioOutput = anuncioOutput+"<div class='custom-select' style='width:200px;'>";
				anuncioOutput = anuncioOutput+"<select id = 'horario_"+dniProfe+"' class='horario_"+dniProfe+"'>";
				anuncioOutput = anuncioOutput+"<option value='0'> Seleccione clase: </option>";
				for(var i in horarios) {
					var estado = horarios[i].estado;
					var fecha = horarios[i].dia+"/"+horarios[i].mes+"/"+horarios[i].año;
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
				cantidad_anuncios++;
			}
		});
		buildSelectBox();

	});
	
});

function solicitarClase(profe){
	
	var profeid = "idioma_"+profe;
	var input_radio = document.getElementsByName(profeid);
	
		for(var x=0;x<input_radio.length;x++){
			
			if(input_radio[x].checked){
				
				var idiomaSele = input_radio[x].value;
				var nivel = profe+x;
				var IdiomaNiv = document.getElementById(nivel).value;
				
			}
		}
		
	
	var fechaId = "horario_"+profe;
	var selectBox = document.getElementById(fechaId);
	var horario = selectBox.options[selectBox.selectedIndex].value;
	var fechaSol = horario.substring(0,9);
	var horario = horario.substring(10,15);
	var dniAlumno = localStorage['dni'];
	var mes = fechaSol.substring(2, 4);
	var dia = fechaSol.substring(0, 1);
	var anyo = fechaSol.substring(5, 9);
	
	
	var output = new Object();
		output.descripcion = "Solicitud de clase";
		output.estado = "pendiente";
		output.dia= dia;
		output.mes=mes;
		output.año=anyo;
		output.hora = horario;
		output.idioma = idiomaSele;
		output.solicitante = dniAlumno;
		output.profesor = profe;
		output.tipo = "clase";
		output.nombreSolicitante=localStorage['nombre'];
		output.precio = 10; //to do 
	
	
	if((idiomaSele != undefined) && (horario != "")){
			
			firebase.database().ref('Usuarios').child(profe).child('notificaciones').push(output);
			guarda = dniAlumno;
			alert("Solicitud enviada correctamente");
			mostrar_boton();

	}else{
		alert("Elija Idioma y fecha");
	}
	anunant=profe;
	
}	
		
 function verPerfil(param){
	location.href="usuario.html?"+param+"";
}



