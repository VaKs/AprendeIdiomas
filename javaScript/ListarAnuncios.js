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
				var nombreProfe = valor.nombre;
				var premium = anuncioSnapshot.val().premium;
				
				anuncioOutput =anuncioOutput+"<div id='calendario_"+dniProfe+"' class='calendario'></div>"
        
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
				anuncioOutput = anuncioOutput+"<p id='txtHorario'>Horario disponible:</p>";
				anuncioOutput = anuncioOutput+"<div class='custom-select' style='width:200px;'>";
				anuncioOutput = anuncioOutput+"<select id = 'horario_"+dniProfe+"' class='btn btn-primary dropdown-toggle'>";
				anuncioOutput = anuncioOutput+"<option value='0'> Seleccione dia: </option>";
				
				anuncioOutput = anuncioOutput+"</select>";
				anuncioOutput = anuncioOutput+"</div>";
				anuncioOutput = anuncioOutput+"<button id='btn-"+dniProfe+"' class='btn btn-primary' onclick='solicitarClase(\"" + dniProfe + "\",\"" + nombreProfe + "\")'> Solicitar Clase </button>";
				anuncioOutput = anuncioOutput+"</div><br>";
				output=output+anuncioOutput;
				
				if(premium){
					var listaPremium = document.getElementById('premium').innerHTML;
					document.getElementById('premium').innerHTML=listaPremium+output;
					
				} else {
					
					var listaNoPremium = document.getElementById('noPremium').innerHTML;
					document.getElementById('noPremium').innerHTML=listaNoPremium+output;
					
				}
				calendarioAnuncio(dniProfe);
				cantidad_anuncios++;
			}
		});
	});
	
});

function seleccionarDia(dni,dia,mes,anyo){
	var seleccion = document.getElementById("horario_"+dni);
	while(seleccion.length > 0) {
		seleccion.remove(seleccion.length-1);
	}
	firebase.database().ref('Anuncios').child(dni).child('horario').on('value',function(snapshot) {
		snapshot.forEach(horaSnapshot => {
			var horario =horaSnapshot.val();
			var idHorario=horaSnapshot.key;
			var estado = horario.estado;
			
			if((horario.dia==dia) && (horario.mes==mes) && (horario.anyo==anyo) && (estado=="disponible")){
				
				var fecha = horario.dia+"/"+horario.mes+"/"+horario.anyo;
				var hora = horario.hora;
				$("#horario_"+dni).append(new Option(hora, idHorario));	
				document.getElementById("txtHorario").innerHTML = "Horario disponible para "+fecha+":";
			}
		});
	
		
	});
};

function solicitarClase(profe,nombreProfe){
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
	var idhorario = selectBox.options[selectBox.selectedIndex].value;
	
	firebase.database().ref('Anuncios').child(profe).child("horario").child(idhorario).once('value').then(function(snapshot) {
		var horario=snapshot.val();
		var hora = horario.hora;
		var dniAlumno = localStorage['dni'];
		var mes = horario.mes;
		var dia = horario.dia;
		var anyo = horario.anyo;
		
		
		var output = new Object();
			output.descripcion = "Solicitud de clase";
			output.estado = "pendiente";
			output.dia= dia;
			output.mes=mes;
			output.anyo=anyo;
			output.hora = hora;
			output.idioma = idiomaSele;
			output.solicitante = dniAlumno;
			output.profesor = profe;
			output.nombreProfe=nombreProfe;
			output.idHorario= idhorario;
			output.tipo = "clase";
			output.nombreSolicitante=localStorage['nombre'];
			output.precio = 10; //to do 
		
		
		if((idiomaSele != undefined) && (horario != "")){
				
				firebase.database().ref('Usuarios').child(profe).child('notificaciones').push(output);
				guarda = dniAlumno;
				alert("Solicitud enviada correctamente");
				//mostrar_boton();
				firebase.database().ref('Anuncios').child(profe).child("horario").child(idhorario).child("estado").set("ocupado");

		}else{
			alert("Elija Idioma y fecha");
		}
		anunant=profe;
	});
}	
		
 function verPerfil(param){
	location.href="usuario.html?"+param+"";
}



