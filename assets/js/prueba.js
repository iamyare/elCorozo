/*
curl --location --request POST 'https://api.cohere.ai/v1/generate' \
  --header 'Authorization: BEARER ATYkCpRBtP9oIgYG3bIBSvTfIbdTMxdtFWWmhwDp' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "model": "command",
      "prompt": "Hola",
      "max_tokens": 192,
      "temperature": 0.9,
      "k": 0,
      "stop_sequences": ["Respuesta: "],
      "return_likelihoods": "NONE"
    }'
*/

/*

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
*/
