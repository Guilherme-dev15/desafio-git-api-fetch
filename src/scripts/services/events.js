import { baseUrl, eventsQuantity } from "../variables.js";



async function getEvents(userName) {
    try {
        const response = await fetch(`${baseUrl}/${userName}/events?per_page=${eventsQuantity}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar eventos: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error); // Melhoria: Log do erro no console
        return null;
    }
}

export { getEvents };
