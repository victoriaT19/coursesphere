import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Logo from "../components/Logo";

export default function Dashboard(){
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("newest");

    useEffect(() =>{
        setLoading(true);
        api.get(`/courses?search=${search}&page=${page}&sort=${sort}`).then((data) => {
            setCourses(data.courses);
            setTotalPages(data.total_pages);
    }).finally(() => setLoading(false));
    }, [search, page, sort]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const inputStyle = {
        background: "#1e1e38",
        border: "0.5px solid #3b2f6e",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        color: "white",
        fontSize: "14px",
        outline: "none",
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Logo size={32} />
                    <span style={{ fontWeight: "600", fontSize: "16px", color: "white" }}>CourseSphere</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link to="/profile" style={{ color: "#a78bfa", fontSize: "13px", textDecoration: "none" }}>
                        {user?.name}
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "transparent",
                            border: "0.5px solid #3b2f6e",
                            borderRadius: "8px",
                            padding: "0.4rem 0.875rem",
                            color: "#6b6b8a",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        Sair
                    </button>
                </div>
            </nav>

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Buscar curso..."
                        value={search}
                        onChange={handleSearch}
                        style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
                        onFocus={e => e.target.style.borderColor = "#7c3aed"}
                        onBlur={e => e.target.style.borderColor = "#3b2f6e"}
                    />
                    <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        style={{ ...inputStyle, width: "160px" }}
                    >
                        <option value="newest">Mais recentes</option>
                        <option value="oldest">Mais antigos</option>
                        <option value="name">Nome A-Z</option>
                        <option value="name_desc">Nome Z-A</option>
                    </select>
                    <button
                        onClick={() => navigate("/courses/new")}
                        style={{
                            background: "#7c3aed",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.75rem 1.25rem",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        + Novo Curso
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                background: "#16162a",
                                border: "0.5px solid #2a2a4a",
                                borderRadius: "12px",
                                padding: "1.5rem",
                                animation: "pulse 1.5s infinite"
                            }}>
                                <div style={{ height: "16px", background: "#2a2a4a", borderRadius: "4px", width: "40%", marginBottom: "12px" }} />
                                <div style={{ height: "12px", background: "#1e1e38", borderRadius: "4px", width: "25%" }} />
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <p style={{ color: "#6b6b8a", textAlign: "center", marginTop: "3rem" }}>Nenhum curso encontrado.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {courses.map((course) => (
                            <Link
                                to={`/courses/${course.id}`}
                                key={course.id}
                                style={{
                                    display: "block",
                                    background: "#16162a",
                                    border: "0.5px solid #2a2a4a",
                                    borderRadius: "12px",
                                    padding: "1.25rem 1.5rem",
                                    textDecoration: "none",
                                    transition: "border-color 0.2s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}
                            >
                                <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: "0 0 0.375rem" }}>
                                    {course.name}
                                </h3>
                                <p style={{ color: "#6b6b8a", fontSize: "12px", margin: "0 0 0.375rem" }}>
                                    {course.start_date} → {course.end_date}
                                </p>
                                <span style={{
                                    color: "#22d3ee",
                                    fontSize: "11px",
                                    fontWeight: "500"
                                }}>
                                    {course.lessons_count} {course.lessons_count === 1 ? "aula" : "aulas"}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "2rem" }}>
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            style={{
                                background: "transparent",
                                border: "0.5px solid #3b2f6e",
                                borderRadius: "8px",
                                padding: "0.5rem 1rem",
                                color: page === 1 ? "#4a4a6a" : "#a78bfa",
                                fontSize: "13px",
                                cursor: page === 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            ← Anterior
                        </button>
                        <span style={{ color: "#6b6b8a", fontSize: "13px" }}>{page} / {totalPages}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            style={{
                                background: "transparent",
                                border: "0.5px solid #3b2f6e",
                                borderRadius: "8px",
                                padding: "0.5rem 1rem",
                                color: page === totalPages ? "#4a4a6a" : "#a78bfa",
                                fontSize: "13px",
                                cursor: page === totalPages ? "not-allowed" : "pointer"
                            }}
                        >
                            Próxima →
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}