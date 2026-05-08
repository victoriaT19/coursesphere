import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try{
            const data = await api.post("/auth/login", {email, password});
            if (data.token){
                login(data.user, data.token);
                navigate("/dashboard");
            }
            else {
                setError(data.error || "Email ou senha inválidos");
            }
        }

        catch {
            setError("Erro ao conectar com sevidor");
        }

        finally{
            setLoading(false);
        }
    };

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type = "email"
                    placeholder = "Email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
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
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
            <p>Não tem conta? <Link to = "/register">Registre-se</Link></p>
        </div>
    );
}