
var alumno, decision;
function manejador_clase(){
	
	swal("¿Desea aceptar la clase?", {
  buttons: {
    cancelar: true, 
    aceptar: {
      text: "Aceptar",
      value: "accept",
    },

  },
})
.then((value) => {
  switch (value) {
 
   //* case "cancel":
   //    swal("La clase ha sido cancelada","Se ha notificado al alumno","error");
  //    break;
 
    case "accept":
      swal("La clase ha sido aceptada","Se ha añadido la clase a su calendario", "success");
	  notificar(true);
      break;
 
    default:
	swal("La clase ha sido cancelada","Se ha notificado al alumno","error");
	notificar(false);

      break;
  }
});
  }

function notificar(decision){
	
	if(decision){
		var output="<p> La clase de X ha sido aceptada </p>";
		var notificacion = document.getElementById('container1').innerHTML;
		document.getElementById('container1').innerHTML= notificacion + output;
			
	}else{
		var output="<p> La clase de X ha sido rechazada </p>";	
		var notificacion = document.getElementById('container1').innerHTML;		
		document.getElementById('container1').innerHTML= notificacion + output;
		
	}
	
	
}


