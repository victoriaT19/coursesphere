import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Logo from "../components/Logo";

export default function Profile(){
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const {logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/profile").then((data) => setProfile(data)).finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#6b6b8a" }}>Carregando...</p>
        </div>
    );

    const courseCardStyle = {
        display: "block",
        background: "#16162a",
        border: "0.5px solid #2a2a4a",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        textDecoration: "none",
        transition: "border-color 0.2s"
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
                <Link to="/dashboard" style={{ color: "#a78bfa", fontSize: "13px", textDecoration: "none" }}>← Dashboard</Link>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Logo size={28} />
                    <span style={{ fontWeight: "600", fontSize: "15px", color: "white" }}>CourseSphere</span>
                </div>
                <button onClick={handleLogout} style={{
                    background: "transparent",
                    border: "0.5px solid #3b2f6e",
                    borderRadius: "8px",
                    padding: "0.4rem 0.875rem",
                    color: "#6b6b8a",
                    fontSize: "13px",
                    cursor: "pointer"
                }}>Sair</button>
            </nav>

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <div style={{ background: "#16162a", border: "0.5px solid #2a2a4a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{
                            width: "56px", height: "56px", borderRadius: "50%",
                            background: "#7c3aed",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "22px", fontWeight: "600", color: "white"
                        }}>
                            {profile.user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ color: "white", fontSize: "18px", fontWeight: "600", margin: "0 0 0.25rem" }}>{profile.user.name}</h2>
                            <p style={{ color: "#6b6b8a", fontSize: "13px", margin: "0 0 0.25rem" }}>{profile.user.email}</p>
                            <p style={{ color: "#4a4a6a", fontSize: "11px", margin: 0 }}>
                                Membro desde {new Date(profile.user.created_at).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", marginBottom: "0.875rem" }}>
                        Cursos criados <span style={{ color: "#4a4a6a", fontWeight: "400" }}>({profile.created_courses.length})</span>
                    </h3>
                    {profile.created_courses.length === 0 ? (
                        <p style={{ color: "#4a4a6a", fontSize: "14px" }}>Nenhum curso criado ainda.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                            {profile.created_courses.map((course) => (
                                <Link
                                    to={`/courses/${course.id}`}
                                    key={course.id}
                                    style={courseCardStyle}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}
                                >
                                    <h4 style={{ color: "white", fontSize: "14px", fontWeight: "500", margin: "0 0 0.25rem" }}>{course.name}</h4>
                                    <p style={{ color: "#6b6b8a", fontSize: "12px", margin: "0 0 0.25rem" }}>{course.start_date} → {course.end_date}</p>
                                    <span style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "500" }}>
                                        {course.lessons_count} {course.lessons_count === 1 ? "aula" : "aulas"}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", marginBottom: "0.875rem" }}>
                        Cursos inscritos <span style={{ color: "#4a4a6a", fontWeight: "400" }}>({profile.enrolled_courses.length})</span>
                    </h3>
                    {profile.enrolled_courses.length === 0 ? (
                        <p style={{ color: "#4a4a6a", fontSize: "14px" }}>Nenhum curso inscrito ainda.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                            {profile.enrolled_courses.map((course) => (
                                <Link
                                    to={`/courses/${course.id}`}
                                    key={course.id}
                                    style={courseCardStyle}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#22d3ee"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}
                                >
                                    <h4 style={{ color: "white", fontSize: "14px", fontWeight: "500", margin: "0 0 0.25rem" }}>{course.name}</h4>
                                    <p style={{ color: "#6b6b8a", fontSize: "12px", margin: "0 0 0.25rem" }}>{course.start_date} → {course.end_date}</p>
                                    <span style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "500" }}>
                                        {course.lessons_count} {course.lessons_count === 1 ? "aula" : "aulas"}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}