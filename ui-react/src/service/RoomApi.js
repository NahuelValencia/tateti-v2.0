import axios from 'axios'

export async function getAvaiableRooms(headers) {
    try {
        const response = await axios.get(`http://localhost:9000/room`, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function searhRoomById(roomId, headers) {
    try {
        let response = await axios.get(`http://localhost:9000/room/${roomId}`, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function createRoom(playerId, headers) {
    try {
        const response = await axios.post(`http://localhost:9000/room`, playerId, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function joinRoom(roomId, playerId, headers) {
    try {
        let response = await axios.post(`http://localhost:9000/room/${roomId}/join`, playerId, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function deleteRoom(roomId, headers) {
    try {
        let response = await axios.delete(`http://localhost:9000/room/${roomId}`, { headers: headers })
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error)
    }
}