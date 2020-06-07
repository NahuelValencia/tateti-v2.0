import axios from 'axios';

export async function createGame(body, headers) {
    try {
        let response = await axios.post(`http://localhost:9000/game`, body, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function searchGameById(gameId, headers) {
    try {
        let response = await axios.get(`http://localhost:9000/game/${gameId}`, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function makeMovement(body, headers) {
    try {
        let response = await axios.put(`http://localhost:9000/game/move`, body, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}