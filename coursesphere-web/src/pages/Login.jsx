import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Logo from "../components/Logo";

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

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0f0f1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "400px",
                background: "#16162a",
                borderRadius: "16px",
                border: "0.5px solid #2a2a4a",
                padding: "2.5rem 2rem"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
                    <Logo size={56} />
                    <h1 style={{ color: "white", fontSize: "20px", fontWeight: "600", margin: "0.75rem 0 0.25rem" }}>
                        CourseSphere
                    </h1>
                    <p style={{ color: "#7c6fa0", fontSize: "12px", margin: 0 }}>
                        Aprenda. Ensine. Colabore.
                    </p>
                </div>

                <p style={{ color: "#a78bfa", fontSize: "13px", fontWeight: "500", textAlign: "center", marginBottom: "1.5rem" }}>
                    Entrar na sua conta
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            background: "#1e1e38",
                            border: "0.5px solid #3b2f6e",
                            borderRadius: "8px",
                            padding: "0.75rem 1rem",
                            color: "white",
                            fontSize: "14px",
                            outline: "none",
                            width: "100%",
                            boxSizing: "border-box"
                        }}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            background: "#1e1e38",
                            border: "0.5px solid #3b2f6e",
                            borderRadius: "8px",
                            padding: "0.75rem 1rem",
                            color: "white",
                            fontSize: "14px",
                            outline: "none",
                            width: "100%",
                            boxSizing: "border-box"
                        }}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    {error && (
                        <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: loading ? "#4a3080" : "#7c3aed",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.75rem",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "0.5rem",
                            transition: "background 0.2s"
                        }}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p style={{ color: "#6b6b8a", fontSize: "13px", textAlign: "center", marginTop: "1.5rem" }}>
                    Não tem conta?{" "}
                    <Link to="/register" style={{ color: "#22d3ee", textDecoration: "none", fontWeight: "500" }}>
                        Registre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}