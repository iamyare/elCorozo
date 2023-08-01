//Variables globales
var activado = false;
let escuchando = true;
let productos = [];
let rec;
let ia = false;

//Inicio de la api
const api = "https://api.cohere.ai/v1/generate";
//Token de la api ATYkCpRBtP9oIgYG3bIBSvTfIbdTMxdtFWWmhwDp
const toke = "ATYkCpRBtP9oIgYG3bIBSvTfIbdTMxdtFWWmhwDp";

//Funcion para enviar el mensaje a la api
const enviarMensaje = async (comando) => {
	const respuesta = await fetch(api, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${toke}`,
		},
		body: JSON.stringify({
			model: "command",
			prompt: `Que precio tiene la cocacola de 1.25 litros?
            respuesta: Coca-Cola 1.25L
            --
            ¿Cuánto cuesta la Coca-Cola de 3 litros?
            respuesta: Coca-Cola 3L
            --
            ¿cual es el precio del aprende conmigo?
            respuesta: Aprende conmigo
            --
            Me pregunto cuanto costara el churro doritos
            respuesta: Dorito
            --
            Cuanto cuesta el fresco de 1 litro
            respuesta: Fresco 1L
            --
			Que valen los huevos?
			respuesta: Huevos
			--
            ${comando}`,
			max_tokens: 20,
			temperature: 0.2,
			k: 0,
			stop_sequences: ["--"],
			return_likelihoods: "NONE",
		}),
	});
	const data = await respuesta.json();
	return data.generations[0].text;
};

if (!("webkitSpeechRecognition" in window)) {
	alert("Disculpas, no puedes usar la API");
} else {
	rec = new webkitSpeechRecognition();
	rec.lang = "es-AR";
	rec.continuous = true; //para que no se detenga cuando termines de hablar
	rec.interim = false; //para que muestre los resultados parciales
	rec.maxAlternatives = 1; //para que muestre los resultados parciales
	rec.addEventListener("result", reconocimiento);
}

rec.start();
const activeWork = "Coroso";

function reconocimiento(event) {
	//Palabra de activacion
	let texto = "";

	for (let i = event.resultIndex; i < event.results.length; i++) {
		texto = event.results[i][0].transcript;

		if (texto.includes(activeWork)) {
			activado = true;
			ejecutarComando(texto);
		}
	}
}

const ejecutarComando = (comando) => {
	//Eliminar la palabra de activacion y todas las palabras que esten antes de ella
	//Ejemplo: "me pregunto si Coroso buscar" -> "buscar"
	comando = comando.substring(comando.indexOf(activeWork) + activeWork.length + 1);
	//Eliminar los acentos de la palabra comando
	comando = comando.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

	if (ia) {
		comando = enviarMensaje(comando);
		comando.then((comando) => {
			//eliminar espacio en blanco
			comando = comando.replace(/\s+/g, " ").trim();
			//eliminar la palabra comandopuesta: y todo lo que este antes de ella si es que existe, asi como los espacios en blanco del inicio y final
			comando = comando.substring(comando.indexOf("respuesta:") + 10).trim();

			console.log(comando);
			const seEscucho = document.getElementById("seEscucho");
			seEscucho.innerText = comando;
			//agregar la clase escribiendo a seEscucho
			seEscucho.classList.remove("invisible");
			seEscucho.classList.add("escribiendo");
			//Eliminar la clase escribiendo a seEscucho despues de 3 segundos
			setTimeout(() => {
				seEscucho.classList.remove("escribiendo");
			}, 3000);
			const divResultadoContenedor = document.getElementById("divResultadoContenedor");
			divResultadoContenedor.classList.remove("invisible");
			buscador(comando);
			activado = false;
		});
	} else {
		const seEscucho = document.getElementById("seEscucho");
		seEscucho.innerText = comando;
		//agregar la clase escribiendo a seEscucho
		seEscucho.classList.remove("invisible");
		seEscucho.classList.add("escribiendo");
		//Eliminar la clase escribiendo a seEscucho despues de 3 segundos
		setTimeout(() => {
			seEscucho.classList.remove("escribiendo");
		}, 3000);
		const divResultadoContenedor = document.getElementById("divResultadoContenedor");
		divResultadoContenedor.classList.remove("invisible");
		buscador(comando);
		activado = false;
	}
};

const leerBaseDatos = () => {
	var archivo = new XMLHttpRequest();
	archivo.open("GET", "../data/productos.csv", false);
	archivo.send(null);

	var texto = archivo.responseText;
	var producto = texto.split("\n");
	var nombre = [];
	var precio = [];

	for (var i = 0; i < producto.length; i++) {
		var linea = producto[i].split(",");
		//Eliminar \r
		linea[1] = linea[1].replace("\r", "");
		//Quitar acentos
		nombre[i] = linea[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		precio[i] = linea[1];
	}

	//Guardar en un array el producto y el precio
	for (var i = 0; i < nombre.length; i++) {
		//Obejto
		productos[i] = {
			nombre: nombre[i],
			precio: precio[i],
		};
	}
};

leerBaseDatos();

const buscador = (comando) => {
	console.log(`Buscando: ${comando}`);
	let encontrado = false;
	let productoEncontrado = [];

	//Buscar el producto en la base de datos no importa si esta en mayuscula o minuscula
	//Tambien pueden ser multiples resultados
	productos.forEach((producto) => {
		if (producto.nombre.toLowerCase().includes(comando.toLowerCase())) {
			encontrado = true;
			let product = {
				nombre: producto.nombre,
				precio: producto.precio,
			};
			productoEncontrado.push(product);
		}
	});
	if (encontrado) {
		if (productoEncontrado.length > 1) {
			leerMensaje(`Se econtraron ${productoEncontrado.length} resultados`);
		} else {
			leerMensaje(
				`${productoEncontrado[0].nombre} Cuesta ${productoEncontrado[0].precio} Lempiras}`
			);
		}
		//Mostrar los resultados
		const divResultado = document.getElementById("divResultadoContenedor");
		divResultado.innerHTML = `
        <h5 class="text-center text-secondary">Resultado:</h5>`;
		productoEncontrado.forEach((producto) => {
			divResultado.innerHTML += `
            <h1
                class="text-center text-body tada animated my-2"
                style="color: var(--bs-indigo) !important"
            >
                ${producto.nombre} - Lps.${producto.precio}
            </h1>
            `;
		});
	} else {
		leerMensaje("No se encontró el producto");
		const divResultado = document.getElementById("divResultadoContenedor");
		divResultado.innerHTML = `
        <h5 class="text-center text-secondary">Resultado:</h5>
        <h1
            class="text-center text-body tada animated my-2"
            style="color: var(--bs-danger) !important"
        >
            No se encontró el producto
        </h1>
        <div class="mx-auto invisible" style="width: fit-content;"><button class="btn btn-primary" type="button" data-bs-target="#modal-1" data-bs-toggle="modal">Busqueda Manual</button></div>
        `;
	}
};

//Leer mensaje con tts (text to speech) de google, voiceURI
function leerMensaje(mensaje) {
	const voz = new SpeechSynthesisUtterance();
	voz.voiceURI = "Paulina";
	voz.volume = 1;
	voz.rate = 1;
	voz.pitch = 1;
	voz.text = mensaje;
	voz.lang = "es-MX";
	speechSynthesis.speak(voz);
}

const btnAlternar = () => {
	const principal = document.getElementById("principal");
	const logo = document.getElementById("logo");
	if (escuchando) {
		escuchando = false;
		principal.classList.add("invisible");

		console.log("Desactivado");
	} else {
		escuchando = true;
		principal.classList.remove("invisible");

		console.log("Activado");
	}
	reconocimientoAlternar();
};

const reconocimientoAlternar = () => {
	if (escuchando) {
		rec.start();
	} else {
		rec.stop();
	}
};
