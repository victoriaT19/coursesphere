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

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-400">CourseSphere</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">Olá, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                    >
                        Sair
                    </button>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Buscar curso..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        onClick={() => navigate("/courses/new")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        + Novo Curso
                    </button>
                </div>
                {loading ? (
                    <p className="text-gray-400">Carregando...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-400">Nenhum curso encontrado.</p>
                ) : (
                    <div className="grid gap-4">
                        {filtered.map((course) => (
                            <Link
                                to={`/courses/${course.id}`}
                                key={course.id}
                                className="block bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-6 transition"
                            >
                                <h3 className="text-lg font-semibold text-white mb-1">{course.name}</h3>
                                <p className="text-gray-400 text-sm">{course.start_date} → {course.end_date}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );

}