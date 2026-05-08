import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(password.length < 6){
            setError("Senha deve ter pelo menos 6 caracteres");
            return;
        }
        setLoading(true);
        setError("");

        try{
            const data = await api.post("/auth/register", {name, email, password});
            if (data.token){
                login(data.user, data.token);
                navigate("/dashboard");
            }
            else{
                setError(data.error || "Erro ao registrar");
            }
        }

        catch{
            setError("Erro ao conectar com o servidor");
        }

        finally{
            setLoading(false);
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{color: "red"}}>{error}</p>}
                <button type="submit" disabled = {loading}>
                    {loading ? "registrando..." : "Registrar"}
                </button>
            </form>
            <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        </div>
    );
}