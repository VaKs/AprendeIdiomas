function iniciar_perfil() {


	$(document).ready(function () {

		$('#idiomasSelect').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay idiomas seleccionados',
			nSelectedText: ' Idiomas seleccionados',
			numberDisplayed: 1,

		});

		$('#idiomasSelectMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay idiomas seleccionados',
			nSelectedText: ' Idiomas seleccionados',
			numberDisplayed: 1,

		});

		$('#horasLunes').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasLunesMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasMartes').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasMartesMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasMiercoles').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasMiercolesMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasJueves').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasJuevesMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasViernes').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasViernesMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasSabado').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasSabadoMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasDomingo').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});

		$('#horasDomingoMod').multiselect({
			buttonWidth: '100%',

			nonSelectedText: 'No hay horas selecionadas',
			nSelectedText: ' Horas seleccionadas',
			numberDisplayed: 1,

		});


	});

	$(document).ready(function () {
		$(".nav-tabs a").click(function () {
			$(this).tab('show');
		});

	});


	comprobarSesion();
	mostrarInfoPerfil();
	mostrarPremium(localStorage['dni']);
	listar_notificaciones();
	calendario();
	verificarBotonCrearAnuncio();
	//verificarBotonModificarAnuncio();
	pagaClase();
	setInterval(pagaClase, 60000);

}
function pagaClase() {
	firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').once('value').then(function(snapshot) {
		fecha = new Date();
		mes = fecha.getMonth()+1;
		dia = fecha.getDate();
		year = fecha.getFullYear();
		hora = fecha.getHours()-1;
		minuto = fecha.getMinutes()
		
		snapshot.forEach(claseSnapshot => {
			clase = claseSnapshot.val();
			keyClase = claseSnapshot.key;
			if(clase.dia==dia && clase.mes==mes && clase.anyo==year && clase.hora===hora+":"+minuto){
				transaccionTokens(clase.dnialumno, clase.profesor, clase.precio);
				firebase.database().ref('Usuarios').child(localStorage['dni']).child('clases').child(keyClase).remove();
			}
			
			
		});

	});
}
	