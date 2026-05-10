import { useState, useEffect } from "react";
import { useParams, useNavigate, Link} from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Logo from "../components/Logo";

export default function LessonForm() {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("draft");
    const [videoUrl, setVideoUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(lessonId);
    const [content, setContent] = useState("");
    const [loadingLesson, setLoadingLesson] = useState(true);

    useEffect(() => {
        if (isEditing) {
        api.get(`/lessons/${lessonId}`).then((data) => {
            if(data.course?.creator_id !== JSON.parse(localStorage.getItem("user"))?.id){
                navigate("/404");
                return;
            }
            setTitle(data.title);
            setStatus(data.status);
            setVideoUrl(data.video_url || "");
            setContent(data.content || "");
            }).catch(() => navigate("/404")).finally(() => setLoadingLesson(false));
        }
        else{
            setLoadingLesson(false);
        }
    }, [lessonId]);

    if (loadingLesson) return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#6b6b8a" }}>Carregando...</p>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const body = { lesson: { title, status, video_url: videoUrl, content} };
        try {
            const data = isEditing
                ? await api.patch(`/lessons/${lessonId}`, body)
                : await api.post(`/courses/${courseId}/lessons`, body);
            if(data.id) {
                toast.success(isEditing? "Aula atualizada!" : "Aula criada!");
                navigate(`/courses/${courseId || data.course_id}`);
            } 
            else {
                setError(JSON.stringify(data));
            }
        } 
        
        catch {
            toast.error("Erro ao salvar aula");
            setError("Erro ao salvar aula");
        } 
        
        finally {
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
                    {isEditing ? "Editar Aula" : "Nova Aula"}
                </h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    <input
                        type="text"
                        placeholder="Título da aula"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    <div>
                        <label style={{ color: "#6b6b8a", fontSize: "12px", display: "block", marginBottom: "0.375rem" }}>Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ ...inputStyle, cursor: "pointer" }}
                        >
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                        </select>
                    </div>
                    <input
                        type="url"
                        placeholder="URL do vídeo (opcional)"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    <div>
                        <label style={{ color: "#6b6b8a", fontSize: "12px", display: "block", marginBottom: "0.375rem" }}>
                            Conteúdo da aula (opcional)
                        </label>
                        <textarea
                            placeholder="Escreva o conteúdo da aula..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            style={{ ...inputStyle, resize: "vertical" }}
                            onFocus={e => e.target.style.borderColor = "#7c3aed"}
                            onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                        />
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