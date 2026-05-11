const API_URL = "https://coursesphere-api-97fx.onrender.com" || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

const api = {
    get: (path) =>
        fetch(`${API_URL}${path}`, 
            {headers: {Authorization: `Bearer ${getToken()}`}, 
        }).then((r) => {
            if(!r.ok) return r.json().then((e) => Promise.reject(e));
            return r.json();
        }),

    post: (path, body) =>
        fetch(`${API_URL}${path}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(body),
            }).then((r) => r.json()),
    patch: (path, body) =>
        fetch(`${API_URL}${path}`,
            {
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(body),
            
        }).then((r) => r.json()),
    
    delete: (path) =>
        fetch(`${API_URL}${path}`,
            {
                method: "DELETE",
                headers: {Authorization: `Bearer ${getToken()}`},
            
        }).then((r) => {
            if (r.status === 204) return {};
            return r.json();
        }),
};

export default api;