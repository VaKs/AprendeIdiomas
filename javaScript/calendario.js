function calendario(paramMes,paramYear,selection){

localStorage['dni']
// DEFINICION DE VARIABLES Y ARRAIS A UTILIZAR
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
			if((i==5)||(i==6)){
				if((a==numDia)&&(mes==fecha.getMonth())&&(year==fecha.getFullYear())){
					tabla=(tabla+"<td id='hoy'>"+a+"</td>");
				}
				else{
					tabla=(tabla+"<td id='finDe'>"+a+"</td>");
				}
			}
			else{
				if((a==numDia)&&(mes==fecha.getMonth())&&(year==fecha.getFullYear())){
					tabla=(tabla+"<td id='hoy'>"+a+"</td>");
				}
				else{
					tabla=(tabla+"<td>"+a+"</td>");
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
}