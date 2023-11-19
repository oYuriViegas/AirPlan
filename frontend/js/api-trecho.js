const apiBaseUrl = 'http://localhost:3000/trechos';

function getTrechos() {
    return axios.get(apiBaseUrl);
}

function createTrecho(trecho) {
    return axios.post(apiBaseUrl, trecho);
}

function updateTrecho(id, trecho) {
    return axios.put(`${apiBaseUrl}/${id}`, trecho);
}

function deleteTrecho(id) {
    return axios.delete(`${apiBaseUrl}/${id}`);
}

function getTrechoById(id) {
    return axios.get(`${apiBaseUrl}/${id}`);
}

export { getTrechos, getTrechoById, createTrecho, updateTrecho, deleteTrecho };
