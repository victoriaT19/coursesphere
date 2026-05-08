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

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-white text-center mb-8">CourseSphere</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="Senha (mínimo 6 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </form>
                <p className="text-gray-400 text-center mt-6 text-sm">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-indigo-400 hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}