import { useState, useEffect } from "react";
import { useParams, useNavigate, Link} from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

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

    const inputClass = "w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500";

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="text-indigo-400 hover:underline text-sm">← Voltar</Link>
                <h1 className="text-xl font-bold text-indigo-400">CourseSphere</h1>
                <div className="w-16" />
            </nav>
            <main className="max-w-2xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold mb-6">{isEditing ? "Editar Aula" : "Nova Aula"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Título da aula"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={inputClass}
                    />
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={inputClass}
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
                        className={inputClass}
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </form>
            </main>
        </div>
    );
}