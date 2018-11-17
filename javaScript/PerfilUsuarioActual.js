function iniciar_perfil(){

	//console.log("DNI", localStorage['dni']);

	comprobarSesion();
	mostrarInfoPerfil();
	mostrarPremium(localStorage['dni']);
	listar_notificaciones();
	calendario();
	
}