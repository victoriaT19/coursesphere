import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import Logo from "../components/Logo";

export default function CourseDetail(){
    const [course, setCourses] = useState(null)
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guest, setGuest] = useState(null);
    const {id} = useParams();
    const {user} = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState({open:false, message: "", onConfirm: null});
    const [statusFilter, setStatusFilter] = useState("all");
    const [enrolled, setEnrolled] = useState(false);
    const [enrolledCount, setEnrolledCount] = useState(0);

    useEffect(() => {
        api.get(`/courses/${id}`).then((data) => {
            setCourses(data);
            setLessons(data.lessons || []);
            setEnrolled(data.enrolled);
            setEnrolledCount(data.enrolled_count);
        }).catch(() => setCourses(null)).finally(() => setLoading(false));

        fetch("https://randomuser.me/api/").then((r) => r.json()).then((data) => setGuest(data.results[0]));
    }, [id]);

    const handleDeleteCourse = () => {
      setModal({
        open: true,
        message: "Tem certeza que deseja excluir este curso?",
        onConfirm: async () => {
          setModal({open:false});
          await api.delete(`/courses/${id}`);
          toast.success("Curso excluído com sucesso!");
          navigate("/dashboard");
        }
      });
    };

    const handleDeleteLesson = (lessonId) => {
        setModal({
          open: true,
          message: "Tem certeza que deseja excluir esta aula?",
          onConfirm: async () => {
            setModal({open:false});
            await api.delete(`/lessons/${lessonId}`);
            toast.success("Aula excluída com sucesso!");
            setLessons(lessons.filter((l) => l.id !== lessonId));
          }
        });
    };

    const handleEnroll = async () => {
        const data = await api.post(`/courses/${id}/enroll`, {});
        if(data.message) {
            toast.success(data.message);
            setEnrolled(true);
            setEnrolledCount(enrolledCount + 1);
        }
        else{
            toast.error(data.error);
        }
    };

    const handleUnenroll = async () => {
        const data = await api.delete(`/courses/${id}/unenroll`);
        toast.success("Inscrição cancelada!");
        setEnrolled(false);
        setEnrolledCount(enrolledCount - 1);
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Carregando...</p>
        </div>
    );
    if(!course) return <Navigate to = "/404"/>

    const isCreator = user?.id === course.creator_id;
    const filteredLessons = lessons.filter((l) => {
        if (!isCreator && l.status === "draft") return false;
        return statusFilter === "all" || l.status === statusFilter;
    });

    const publishedCount = lessons.filter((l) => l.status === "published").length;
    const draftCount = lessons.filter((l) => l.status === "draft").length;

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

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <div style={{ background: "#16162a", border: "0.5px solid #2a2a4a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "600", margin: "0 0 0.5rem" }}>{course.name}</h2>
                            {course.description && (
                                <p style={{ color: "#6b6b8a", fontSize: "14px", margin: "0 0 0.75rem" }}>{course.description}</p>
                            )}
                            <p style={{ color: "#4a4a6a", fontSize: "12px", margin: "0 0 0.25rem" }}>{course.start_date} → {course.end_date}</p>
                            <p style={{ color: "#4a4a6a", fontSize: "11px", margin: "0 0 0.75rem" }}>Criado por <span style={{ color: "#a78bfa" }}>{course.creator?.name}</span></p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ color: "#4a4a6a", fontSize: "12px" }}>{enrolledCount} inscrito{enrolledCount !== 1 ? "s" : ""}</span>
                                {!isCreator && (
                                    enrolled ? (
                                        <button onClick={handleUnenroll} style={{
                                            background: "transparent",
                                            border: "0.5px solid #7f1d1d",
                                            borderRadius: "6px",
                                            padding: "0.3rem 0.75rem",
                                            color: "#f87171",
                                            fontSize: "12px",
                                            cursor: "pointer"
                                        }}>Cancelar inscrição</button>
                                    ) : (
                                        <button onClick={handleEnroll} style={{
                                            background: "#7c3aed",
                                            border: "none",
                                            borderRadius: "6px",
                                            padding: "0.3rem 0.75rem",
                                            color: "white",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                            fontWeight: "500"
                                        }}>Inscrever-se</button>
                                    )
                                )}
                            </div>
                        </div>
                        {isCreator && (
                            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                                <button onClick={() => navigate(`/courses/${id}/edit`)} style={{
                                    background: "transparent",
                                    border: "0.5px solid #3b2f6e",
                                    borderRadius: "8px",
                                    padding: "0.4rem 0.875rem",
                                    color: "#a78bfa",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                }}>Editar</button>
                                <button onClick={handleDeleteCourse} style={{
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
                </div>

                {guest && (
                    <div style={{ background: "#16162a", border: "0.5px solid #2a2a4a", borderRadius: "12px", padding: "1rem 1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <img src={guest.picture.medium} alt="instrutor" style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #7c3aed" }} />
                        <div>
                            <p style={{ color: "#22d3ee", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.25rem" }}>Instrutor Convidado</p>
                            <p style={{ color: "white", fontSize: "14px", fontWeight: "500", margin: "0 0 0.125rem" }}>{guest.name.first} {guest.name.last}</p>
                            <p style={{ color: "#6b6b8a", fontSize: "12px", margin: 0 }}>{guest.location.country}</p>
                        </div>
                    </div>
                )}

                <div style={{ background: "#16162a", border: "0.5px solid #2a2a4a", borderRadius: "12px", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ color: "white", fontSize: "16px", fontWeight: "600", margin: 0 }}>Aulas</h3>
                        {isCreator && (
                            <button onClick={() => navigate(`/courses/${id}/lessons/new`)} style={{
                                background: "#7c3aed",
                                border: "none",
                                borderRadius: "8px",
                                padding: "0.4rem 0.875rem",
                                color: "white",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer"
                            }}>+ Nova Aula</button>
                        )}
                    </div>

                    {isCreator && (
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                            <span style={{ background: "#052e16", color: "#4ade80", fontSize: "11px", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "99px" }}>
                                {publishedCount} publicada{publishedCount !== 1 ? "s" : ""}
                            </span>
                            <span style={{ background: "#422006", color: "#fbbf24", fontSize: "11px", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "99px" }}>
                                {draftCount} rascunho{draftCount !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}

                    {isCreator && (
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                background: "#1e1e38",
                                border: "0.5px solid #3b2f6e",
                                borderRadius: "8px",
                                padding: "0.5rem 0.875rem",
                                color: "white",
                                fontSize: "13px",
                                outline: "none",
                                marginBottom: "1rem",
                                cursor: "pointer"
                            }}
                        >
                            <option value="all">Todas</option>
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                        </select>
                    )}

                    {filteredLessons.length === 0 ? (
                        <p style={{ color: "#4a4a6a", fontSize: "14px" }}>Nenhuma aula encontrada.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {filteredLessons.map((lesson) => (
                                <div key={lesson.id} style={{
                                    background: "#0f0f1a",
                                    border: "0.5px solid #2a2a4a",
                                    borderRadius: "8px",
                                    padding: "0.875rem 1rem",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <Link to={`/lessons/${lesson.id}`} style={{ color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
                                            onMouseEnter={e => e.target.style.color = "#22d3ee"}
                                            onMouseLeave={e => e.target.style.color = "white"}
                                        >
                                            {lesson.title}
                                        </Link>
                                        <span style={{
                                            display: "inline-block",
                                            marginLeft: "0.5rem",
                                            fontSize: "10px",
                                            fontWeight: "600",
                                            padding: "0.15rem 0.5rem",
                                            borderRadius: "99px",
                                            background: lesson.status === "published" ? "#052e16" : "#422006",
                                            color: lesson.status === "published" ? "#4ade80" : "#fbbf24"
                                        }}>
                                            {lesson.status === "published" ? "Publicado" : "Rascunho"}
                                        </span>
                                    </div>
                                    {isCreator && (
                                        <div style={{ display: "flex", gap: "0.375rem" }}>
                                            <button onClick={() => navigate(`/lessons/${lesson.id}/edit`)} style={{
                                                background: "transparent",
                                                border: "0.5px solid #3b2f6e",
                                                borderRadius: "6px",
                                                padding: "0.25rem 0.625rem",
                                                color: "#a78bfa",
                                                fontSize: "12px",
                                                cursor: "pointer"
                                            }}>Editar</button>
                                            <button onClick={() => handleDeleteLesson(lesson.id)} style={{
                                                background: "transparent",
                                                border: "0.5px solid #7f1d1d",
                                                borderRadius: "6px",
                                                padding: "0.25rem 0.625rem",
                                                color: "#f87171",
                                                fontSize: "12px",
                                                cursor: "pointer"
                                            }}>Excluir</button>
                                        </div>
                                    )}
                                </div>
                            ))}
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