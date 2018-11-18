function iniciar_perfil(){

	comprobarSesion();
	mostrarInfoPerfil();
	mostrarPremium(localStorage['dni']);
	listar_notificaciones();
	calendario();
	verificarBotonCrearAnuncio();
	
}