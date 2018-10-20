function borrarUsuario(dni){
	firebase.database().ref('Anuncios').child(dni).remove();
	firebase.database().ref('Usuarios').child(dni).remove();
}

function crearUsuario(dni,nombre,apellido){
	//TODO
}