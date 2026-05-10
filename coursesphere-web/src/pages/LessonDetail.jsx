import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import Logo from "../components/Logo";

export default function LessonDetail(){
    const [lesson, setLessons] = useState(null);
    const [loading, setLoading] = useState(true);
    const {lessonId} = useParams();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [modal, setModal] = useState({open: false, message: "", onConfirm: null});

    useEffect(() => {
        api.get(`/lessons/${lessonId}`).then((data) => setLessons(data)).finally(() => setLoading(false));
    }, [lessonId]);

    const handleDelete = () =>{
        setModal({
            open: true,
            message: "Tem certeza que deseja excluir esta aula?",
            onConfirm: async () => {
                setModal({open:false});
                await api.delete(`/lessons/${lessonId}`);
                toast.success("Aula excluída com sucesso!");
                navigate(`/courses/${lesson.course_id}`);
            }
        });    
    };

    const getYoutubeId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const renderVideo = (url) => {
        const youtubeId = getYoutubeId(url);
        if (youtubeId) {
            return (
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ color: "#6b6b8a", fontSize: "12px", marginBottom: "0.75rem" }}>Vídeo da aula</p>
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "8px", overflow: "hidden" }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div style={{ marginTop: "1rem" }}>
                <p style={{ color: "#6b6b8a", fontSize: "12px", marginBottom: "0.75rem" }}>Vídeo da aula</p>
                <video
                    controls
                    style={{ width: "100%", borderRadius: "8px", background: "#0f0f1a" }}
                >
                    <source src={url} />
                    Seu navegador não suporta o player de vídeo.
                </video>
            </div>
        );
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#6b6b8a" }}>Carregando...</p>
        </div>
    );

    if (!lesson) return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#6b6b8a" }}>Aula não encontrada.</p>
        </div>
    );

    const isCreator = lesson.course?.creator_id === user?.id;

    if (!isCreator && lesson.status === "draft") return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#6b6b8a" }}>Esta aula não está disponível.</p>
        </div>
    );

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
                <Link to={`/courses/${lesson.course_id}`} style={{ color: "#a78bfa", fontSize: "13px", textDecoration: "none" }}>← Voltar ao curso</Link>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Logo size={28} />
                    <span style={{ fontWeight: "600", fontSize: "15px", color: "white" }}>CourseSphere</span>
                </div>
                <div style={{ width: "60px" }} />
            </nav>

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <div style={{ background: "#16162a", border: "0.5px solid #2a2a4a", borderRadius: "12px", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        <div>
                            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "600", margin: "0 0 0.5rem" }}>{lesson.title}</h2>
                            <span style={{
                                fontSize: "10px",
                                fontWeight: "600",
                                padding: "0.2rem 0.6rem",
                                borderRadius: "99px",
                                background: lesson.status === "published" ? "#052e16" : "#422006",
                                color: lesson.status === "published" ? "#4ade80" : "#fbbf24"
                            }}>
                                {lesson.status === "published" ? "Publicado" : "Rascunho"}
                            </span>
                        </div>
                        {isCreator && (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => navigate(`/lessons/${lessonId}/edit`)} style={{
                                    background: "transparent",
                                    border: "0.5px solid #3b2f6e",
                                    borderRadius: "8px",
                                    padding: "0.4rem 0.875rem",
                                    color: "#a78bfa",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}>Editar</button>
                                <button onClick={handleDelete} style={{
                                    background: "transparent",
                                    border: "0.5px solid #7f1d1d",
                                    borderRadius: "8px",
                                    padding: "0.4rem 0.875rem",
                                    color: "#f87171",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}>Excluir</button>
                            </div>
                        )}
                    </div>

                    {lesson.video_url ? renderVideo(lesson.video_url) : (
                        <p style={{ color: "#4a4a6a", fontSize: "13px", marginTop: "1rem" }}>Nenhum vídeo cadastrado para esta aula.</p>
                    )}
                    {lesson.content && (
                        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "0.5px solid #2a2a4a" }}>
                            <p style={{ color: "#6b6b8a", fontSize: "12px", marginBottom: "0.75rem" }}>Conteúdo da aula</p>
                            <p style={{ color: "#d1d1e0", fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{lesson.content}</p>
                        </div>
                    )}
                </div>
            </main>

            {modal.open && (
                <ConfirmModal
                    message={modal.message}
                    onConfirm={modal.onConfirm}
                    onCancel={() => setModal({ open: false })}
                />
            )}
        </div>
    );
}