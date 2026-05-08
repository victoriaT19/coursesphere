import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard(){
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() =>{
        api.get("/courses").then((data) => setCourses(data)).finally(() => setLoading(false))
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const filtered = courses.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return(
        <div>
            <div>
                <h1>Olá, {user?.name}</h1>
                <button onClick={handleLogout}>Sair</button>
            </div>
            <input
                type="text"
                placeholder="Buscar curso..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => navigate("/courses/new")}>Novo Curso</button>
            {
                loading ? (<p>Carregando...</p>) : filtered.length === 0? (<p>Nenhum curso encontrado.</p>) : (
                    filtered.map((course) => (
                        <div key={course.id}>
                            <Link to={`/courses/${course.id}`}>
                                <h3>{course.name}</h3>
                            </Link>
                            <p>{course.start_date} → {course.end_date}</p>
                        </div>
                    ))
                )}
        </div>
    );

}