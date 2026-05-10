import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Logo from "../components/Logo";

export default function CourseForm(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loadingCourse, setLoadingCourse] = useState(true);

    useEffect(() => {
        if(isEditing){
            api.get(`/courses/${id}`).then((data) =>
            {
                if(data.creator_id !== JSON.parse(localStorage.getItem("user"))?.id){
                    navigate(`/courses/${id}`);
                    return;
                }
                setName (data.name);
                setDescription(data.description || "");
                setStartDate(data.start_date);
                setEndDate(data.end_date);
            }).catch(() => navigate("/404")).finally(() => setLoadingCourse(false));
        }
        else {
            setLoadingCourse(false);
        }
    }, [id]);

    if (loadingCourse) return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#6b6b8a" }}>Carregando...</p>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split("T")[0];
        if(endDate < today){
            setError("A data de término não pode ser anterior a hoje");
            return;
        }
        setLoading(true);
        setError("");
        const body = { course: {name, description, start_date: startDate, end_date: endDate}};
        try {
            const data = isEditing ? await api.patch(`/courses/${id}`, body) : await api.post("/courses", body);
            if(data.id){
                toast.success(isEditing? "Curso atualizado!" : "Curso criado!");
                navigate(`/courses/${data.id}`);
            }
            else{
                setError(JSON.stringify(data));
            }
        }

        catch {
            toast.error("Erro ao salvar curso");
            setError("Erro ao salvar curso");
        }

        finally{
            setLoading(false);
        }
    };

    const inputStyle = {
        background: "#1e1e38",
        border: "0.5px solid #3b2f6e",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        color: "white",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "white" }}>
            <nav style={{
                background: "#16162a",
                borderBottom: "0.5px solid #2a2a4a",
                padding: "0.875rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Link to="/dashboard" style={{ color: "#a78bfa", fontSize: "13px", textDecoration: "none" }}>← Voltar</Link>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Logo size={28} />
                    <span style={{ fontWeight: "600", fontSize: "15px", color: "white" }}>CourseSphere</span>
                </div>
                <div style={{ width: "60px" }} />
            </nav>
            <main style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "1.5rem", color: "white" }}>
                    {isEditing ? "Editar Curso" : "Novo Curso"}
                </h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    <input
                        type="text"
                        placeholder="Nome do curso"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    <textarea
                        placeholder="Descrição (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label style={{ color: "#6b6b8a", fontSize: "12px", display: "block", marginBottom: "0.375rem" }}>Data de início</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                                onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                            />
                        </div>
                        <div>
                            <label style={{ color: "#6b6b8a", fontSize: "12px", display: "block", marginBottom: "0.375rem" }}>Data de término</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                                onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                            />
                        </div>
                    </div>
                    {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
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
                            marginTop: "0.25rem"
                        }}
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </form>
            </main>
        </div>
    );
}