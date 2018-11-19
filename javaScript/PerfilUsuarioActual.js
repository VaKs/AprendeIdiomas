function iniciar_perfil() {


	$(document).ready(function () {

		$('#idiomasSelect').multiselect({
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

		$('#horasMartes').multiselect({
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

		$('#horasJueves').multiselect({
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

		$('#horasSabado').multiselect({
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

}