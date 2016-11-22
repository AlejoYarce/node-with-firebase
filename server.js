var express = require('express');
var app = express();

//setup Server
var server = app.listen(3000, function() {
    console.log('We have started our server on port 3000');
});

//setup Firebase
var firebase = require('firebase');

//setup dotenv
require('dotenv').config();

//Require html files
require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

firebase.initializeApp({
	apiKey: process.env.FIREBASE_INIT_API_KEY,
    authDomain: process.env.FIREBASE_INIT_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_INIT_DATABASE_URL,
    storageBucket: process.env.FIREBASE_INIT_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_INIT_MESSAGING_SENDER_ID
});

//setup database
var db = firebase.database();
var usersRef = db.ref("users");

var auth = firebase.auth();
var user = {};
user.mail = process.env.FIREBASE_USER_MAIL;
user.pass = process.env.FIREBASE_USER_PASS;

firebase.auth().signInWithEmailAndPassword(user.mail, user.pass).then(function(result) {
	result.uid;
	result.displayName;
	result.photoURL;
	result.email;

	setUIdRef(result.uid);
}).catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
});

function setUIdRef(uId) {
	user.uid = uId;
	var uIdRef = usersRef.child('' + user.uid + '');

	uIdRef.on('child_changed', function(snapshot) {
		console.log(snapshot.val());
		console.log(snapshot.key);
	});

	uIdRef.update({
		info: {
			name : 'Alejo Yarce',
			created_on : '21-10-2016'
		}
	});
}










