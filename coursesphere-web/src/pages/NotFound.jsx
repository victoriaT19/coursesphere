import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#0f0f1a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
        }}>
            <Logo size={64} />
            <h1 style={{ fontSize: "96px", fontWeight: "700", color: "#7c3aed", margin: "1rem 0 0.5rem", lineHeight: 1 }}>404</h1>
            <p style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 0.5rem" }}>Página não encontrada</p>
            <p style={{ color: "#6b6b8a", fontSize: "14px", margin: "0 0 2rem" }}>A página que você está procurando não existe.</p>
            <Link to="/dashboard" style={{
                background: "#7c3aed",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none"
            }}>
                Voltar ao início
            </Link>
        </div>
    );
}