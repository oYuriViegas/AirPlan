const apiBaseUrl = 'http://localhost:3000/voos';

function getVoos() {
    return axios.get(apiBaseUrl);
}

function createVoo(voo) {
    return axios.post(apiBaseUrl, voo);
}

function updateVoo(id, voo) {
    return axios.put(`${apiBaseUrl}/${id}`, voo);
}

function deleteVoo(id) {
    return axios.delete(`${apiBaseUrl}/${id}`);
}

function getVooById(id) {
    return axios.get(`${apiBaseUrl}/${id}`);
}

export { getVoos, getVooById, createVoo, updateVoo, deleteVoo };
