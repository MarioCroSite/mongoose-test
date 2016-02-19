var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/test');

var Osoba = mongoose.model('Osoba', {
	ime: String,
	prezime: String,
	_grad: { type: Schema.Types.ObjectId, ref: 'Grad' }
});

var Grad = mongoose.model('Grad', {
	naziv: String,
	pbr: Number
});

app.use(express.static('public'));

app.get('/:grad', function (request, response) {
	var grad = request.params.grad == '*' ? '' : request.params.grad;

	DobaviOsobeIzGrada(grad, function (podaci) {
		response.render(__dirname + '/views/ljudi.twig', {
			osobe: podaci
		});
	});
});

var server = app.listen(8081, function () {
	console.log('Boky8 server je pokrenut!');
});

function DobaviOsobeIzGrada(grad, callback) {
	Osoba
		.find()
		.populate('_grad')
		.exec(function (err, o) {
			if (err) return console.log('Greška');

			if (grad) {
				o = o.filter(function (x) {
					return x._grad.naziv == grad;
				});
			}
			
			callback(o);
		});
}