import axios from 'axios';

export async function createPlayer(player, headers) {
    try {
        const response = await axios.post(`http://localhost:9000/player`, player, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}