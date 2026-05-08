import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function LessonForm() {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("draft");
    const [videoUrl, setVideoUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(lessonId);

    useEffect(() => {
        if (isEditing) {
        api.get(`/lessons/${lessonId}`).then((data) => {
            setTitle(data.title);
            setStatus(data.status);
            setVideoUrl(data.video_url || "");
        });
        }
    }, [lessonId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const body = { lesson: { title, status, video_url: videoUrl } };
        try {
        const data = isEditing
            ? await api.patch(`/lessons/${lessonId}`, body)
            : await api.post(`/courses/${courseId}/lessons`, body);
        if (data.id) {
            navigate(`/courses/${courseId || data.course_id}`);
        } else {
            setError(JSON.stringify(data));
        }
        } catch {
        setError("Erro ao salvar aula");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div>
        <Link to="/dashboard">← Voltar</Link>
        <h1>{isEditing ? "Editar Aula" : "Nova Aula"}</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            </select>
            <input
            type="url"
            placeholder="URL do vídeo (opcional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
            </button>
        </form>
        </div>
    );
}