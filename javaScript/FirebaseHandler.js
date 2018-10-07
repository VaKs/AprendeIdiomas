$( document ).ready(function() {
	
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBGuWwDQ2PQCL6gH6G1pVxN_zc57B2wakI",
    authDomain: "aprendeidiomas-a5ce1.firebaseapp.com",
    databaseURL: "https://aprendeidiomas-a5ce1.firebaseio.com",
    projectId: "aprendeidiomas-a5ce1",
    storageBucket: "",
    messagingSenderId: "3604413179"
  };
	firebase.initializeApp(config);
	var database = firebase.database();	
});

/*  Write and read
function writeData() {
  firebase.database().ref('prueba/').set({
    id : 2
  });
}

function readData(){
	return firebase.database().ref('multipleChoice').child('B2').once('value').then(function(snapshot) {
		return snapshot.val();
	});
	
	ó
	
	return firebase.database().ref('multipleChoice').child('B2').on('value',function(snapshot) {
		return snapshot.val();
	});
}
*/