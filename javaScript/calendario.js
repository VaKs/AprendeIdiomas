var clases= [];


function calendario(paramMes,paramYear,selection){
	clases= [];
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').on('value',function(snapshot) {
		tabla="";
		fecha=new Date();
		dias = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
		meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
		diasMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if(selection==true){
		 mes=paramMes;
		 year=paramYear;
		}
		else{
			if(paramMes){
				mes = mes+paramMes;
				if(paramYear){
					year = year+paramYear;
				}
			}
			else{
				year = fecha.getFullYear();
				mes = fecha.getMonth();
			}
			if(mes<0){
				mes=11;
				year=year-1;
			}
			if(mes>11){
				mes=0;
				year=year+1;
			}
		}
		// Se introducen las clases de este mes en el array clases
		snapshot.forEach(claseSnapshot => {
			var clase = claseSnapshot.val();
			// se le suma 1 al mes porque en la lógica del calendario van de 0 a 11
			if((clase.mes==mes+1)&&(clase.anyo==year)){
				clases.push(clase);
			}
			
		});
		


		diaSem = fecha.getDay();
		numDia = fecha.getDate();
		cantDiasMes = diasMes[mes];
		// Esto es para saber si un año es bisiesto
		if (((year%4==0) && ((year%100!= 0) || (year%400==0))) && (mes==1)){
		cantDiasMes = 29;
		}



		// CONSTRUCCION DE LA TABLA
		tabla=(tabla+"<table align='center' border='0' cellpadding='5' cellspacing='5'>");

		tabla=(tabla+"<tr align='center' id='cabeza'>");
		tabla=(tabla+"<td id='cambiar'><a href='javascript:calendario(-1)'><<</a></td>");
		tabla=(tabla+"<td colspan='5'>"+meses[mes]+" de "+year+"</td>");
		tabla=(tabla+"<td id='cambiar'><a href='javascript:calendario(+1)'>>></a></td>");
		tabla=(tabla+"</tr>");

		tabla=(tabla+"<tr id='diasSema' align='center'>");
		tabla=(tabla+"<td>L</td><td>M</td><td>X</td><td>J</td><td>V</td><td id='d'>S</td><td id='d'>D</td>");
		tabla=(tabla+"</tr>");

		// Averiguar cuantos espacios en blanco se dejan antes del dia 1

		primerDia=new Date(year, mes, 1).toString();
		primerDia=primerDia.substring(0,3);
		nomDias = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

		for(d=0;d<8;d++){
			if(nomDias[d]==primerDia){
				empezar=d;
			}
		}
		
		var doyClase=false;
		var reciboClase=false;

		// Escribir los dias en la tabla
		for (a=1;a<=cantDiasMes;) {
			tabla=(tabla+"<tr>");
			 
			for(i=0;i<7;i++){
				if(a>=(cantDiasMes+1)){}
				else{
					for(;i<empezar;i++){
						tabla=(tabla+"<td> </td>");
					}
					empezar=0;
					
					// se da clase hoy?
					for (c=0;c<clases.length;c++) {
						if(clases[c].dia==a){
							if(clases[c].profesor==localStorage['dni']){
								doyClase=true;
							}else{
								reciboClase=true;
							}
						}
					}
					// escribe los dias
					if((i==5)||(i==6)){
						if((a==numDia)&&(mes==fecha.getMonth())&&(year==fecha.getFullYear())){
							if(doyClase) {
								tabla=(tabla+"<td id='hoy' onmouseover='mostrarInformacionClase("+a+")' onmouseout='borrarInformacionClase()'>"+a+"</td>");
								doyClase=false;
							}else if(reciboClase){
								tabla=(tabla+"<td id='hoy' onmouseover='mostrarInformacionClase("+a+")' onmouseout='borrarInformacionClase()'>"+a+"</td>");
								reciboClase=false;
							}else {
								tabla=(tabla+"<td id='hoy'>"+a+"</td>");
							}
						}else{
							if(doyClase) {
								tabla=(tabla+"<td id='doyClase' onmouseover='mostrarInformacionClase("+a+")' onmouseout='borrarInformacionClase()'>"+a+"</td>");
								doyClase=false;
							}else if(reciboClase){
								tabla=(tabla+"<td id='reciboClase' onmouseover='mostrarInformacionClase("+a+")' onmouseout='borrarInformacionClase()'>"+a+"</td>");
								reciboClase=false;
							}else {
								tabla=(tabla+"<td id='finDe'>"+a+"</td>");
							}
						}
					}else{
						if((a==numDia)&&(mes==fecha.getMonth())&&(year==fecha.getFullYear())){
							tabla=(tabla+"<td id='hoy'>"+a+"</td>");
						}else{
							if(doyClase) {
								tabla=(tabla+"<td id='doyClase' onmouseover='mostrarInformacionClase("+a+")' onmouseout='borrarInformacionClase()'>"+a+"</td>");
								doyClase=false;
							}else if(reciboClase){
								tabla=(tabla+"<td id='reciboClase' onmouseover='mostrarInformacionClase("+a+")' onmouseout='borrarInformacionClase()'>"+a+"</td>");
								reciboClase=false;
							}else {
								tabla=(tabla+"<td>"+a+"</td>");
							}
						}
					}
					a++;
				}
				
			}
			tabla=(tabla+"</tr>");
		}
		tabla=(tabla+"</table>");
		document.getElementById("calendario").innerHTML=tabla;
		selection=false;		
	});
}

function mostrarInformacionClase(dia){
	var td=document.getElementById("calInfo");
	var output="<ul>";
	for (c=0;c<clases.length;c++) {
		if(clases[c].dia==dia){
			if(clases[c].profesor==localStorage['dni']){
				output=output+"<li>"+clases[c].hora+": Dar clase de "+clases[c].idioma+" a "+clases[c].nombreSolicitante+"</li>";
			}else{
				output=output+"<li>"+clases[c].hora+": Recibir clase de "+clases[c].idioma+" a "+clases[c].nombreSolicitante+"</li>";
			}
		}
	}
	output=output+"</ul>";
	sigueme();
	td.innerHTML=output;
}
function borrarInformacionClase(){
	document.getElementById("calInfo").innerHTML="";
}
function sigueme(){
	var x = window.event.x;
	var y = window.event.y;
	
	document.getElementById("calInfo").style.left = x + "px";
	document.getElementById("calInfo").style.top = y + "px";
}

function calendarioAnuncio(dni,paramMes,paramYear,selection){
	clases= [];
	firebase.database().ref('Anuncios').child(dni).child('horario').on('value',function(snapshot) {
		tabla="";
		fecha=new Date();
		dias = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
		meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
		diasMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if(selection==true){
		 mes=paramMes;
		 year=paramYear;
		}
		else{
			if(paramMes){
				mes = mes+paramMes;
				if(paramYear){
					year = year+paramYear;
				}
			}
			else{
				year = fecha.getFullYear();
				mes = fecha.getMonth();
			}
			if(mes<0){
				mes=11;
				year=year-1;
			}
			if(mes>11){
				mes=0;
				year=year+1;
			}
		}
		// Se introducen las clases de este mes en el array clases
		snapshot.forEach(claseSnapshot => {
			var clase = claseSnapshot.val();
			// se le suma 1 al mes porque en la lógica del calendario van de 0 a 11
			if((clase.mes==mes+1)&&(clase.anyo==year)&&(clase.estado=="disponible")){
				clases.push(clase);
			}
			
		});		


		diaSem = fecha.getDay();
		numDia = fecha.getDate();
		cantDiasMes = diasMes[mes];
		// Esto es para saber si un año es bisiesto
		if (((year%4==0) && ((year%100!= 0) || (year%400==0))) && (mes==1)){
		cantDiasMes = 29;
		}



		// CONSTRUCCION DE LA TABLA
		tabla=(tabla+"<table align='center' border='0' cellpadding='5' cellspacing='5'>");

		tabla=(tabla+"<tr align='center' id='cabeza'>");
		tabla=(tabla+"<td id='cambiar'><a href='javascript:calendarioAnuncio(\"" + dni + "\",-1)'><<</a></td>");
		tabla=(tabla+"<td colspan='5'>"+meses[mes]+" de "+year+"</td>");
		tabla=(tabla+"<td id='cambiar'><a href='javascript:calendarioAnuncio(\"" + dni + "\",+1)'>>></a></td>");
		tabla=(tabla+"</tr>");

		tabla=(tabla+"<tr id='diasSema' align='center'>");
		tabla=(tabla+"<td>L</td><td>M</td><td>X</td><td>J</td><td>V</td><td id='d'>S</td><td id='d'>D</td>");
		tabla=(tabla+"</tr>");

		// Averiguar cuantos espacios en blanco se dejan antes del dia 1

		primerDia=new Date(year, mes, 1).toString();
		primerDia=primerDia.substring(0,3);
		nomDias = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

		for(d=0;d<8;d++){
			if(nomDias[d]==primerDia){
				empezar=d;
			}
		}
		
		var doyClase=false;
		var reciboClase=false;

		// Escribir los dias en la tabla
		for (a=1;a<=cantDiasMes;) {
			tabla=(tabla+"<tr>");
			 
			for(i=0;i<7;i++){
				if(a>=(cantDiasMes+1)){}
				else{
					for(;i<empezar;i++){
						tabla=(tabla+"<td> </td>");
					}
					empezar=0;
					
					// se da clase hoy?
					for (c=0;c<clases.length;c++) {
						if(clases[c].dia==a){
							doyClase=true;
						}
					}
					// escribe los dias
					if((i==5)||(i==6)){
						if((a==numDia)&&(mes==fecha.getMonth())&&(year==fecha.getFullYear())){
							if(doyClase) {
								tabla=(tabla+"<td id='doyClase' onclick='seleccionarDia(\"" + dni + "\",\"" + a + "\")'>"+a+"</td>");
								doyClase=false;
							}else {
								tabla=(tabla+"<td>"+a+"</td>");
							}
						}else{
							if(doyClase) {
								tabla=(tabla+"<td id='doyClase' onclick='seleccionarDia(\"" + dni + "\",\"" + a + "\")'>"+a+"</td>");
								doyClase=false;
							}else {
								tabla=(tabla+"<td id='finDe'>"+a+"</td>");
							}
						}
					}else{
						if((a==numDia)&&(mes==fecha.getMonth())&&(year==fecha.getFullYear())){
							if(doyClase) {
								tabla=(tabla+"<td id='doyClase' onclick='seleccionarDia(\"" + dni + "\",\"" + a + "\")'>"+a+"</td>");
								doyClase=false;
							}else {
								tabla=(tabla+"<td>"+a+"</td>");
							}
						}else{
							if(doyClase) {
								tabla=(tabla+"<td id='doyClase' onclick='seleccionarDia(\"" + dni + "\",\"" + a + "\")'>"+a+"</td>");
								doyClase=false;
							}else {
								tabla=(tabla+"<td>"+a+"</td>");
							}
						}
					}
					a++;
				}
				
			}
			tabla=(tabla+"</tr>");
		}
		tabla=(tabla+"</table>");
		var idCalendario="calendario_"+dni;
		document.getElementById(idCalendario).innerHTML=tabla;
		selection=false;		
	});
}