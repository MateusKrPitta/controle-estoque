import axios from 'axios';
import { baseUrl } from './url';

export async function fetchCidadesPorEstado(uf) {
    try {
        if (uf) {
            const response = await axios.get(`${baseUrl}/estados/${uf}/distritos`);
            // Certificando-se de que o formato de resposta seja correto
            const cidades = response.data.map(cidade => cidade.nome); // Ajuste se a estrutura da resposta for diferente
            return cidades.sort((a, b) => a.localeCompare(b)); // Ordenando as cidades
        }
        return [];
    } catch (error) {
        throw new Error(`Erro ao buscar cidades: ${error}`);
    }
}
