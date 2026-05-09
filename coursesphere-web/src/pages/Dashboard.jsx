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
                        onChange={handleSearch}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    />
                    <select
                        value = {sort}
                        onChange = {(e) => {setSort(e.target.value); setPage(1);}}
                        className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
                    >
                        <option value="newest">Mais recentes</option>
                        <option value="oldest">Mais antigos</option>
                        <option value="name">Nome A-Z</option>
                        <option value="name_desc">Nome Z-A</option>
                    </select>
                    <button
                        onClick={() => navigate("/courses/new")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        + Novo Curso
                    </button>
                </div>
                {loading ? (
                    <div className="grid gap-4">
                        {[1,2,3].map((i) => (
                            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
                                <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
                                <div className="h-3 bg-gray-800 rounded w-1/4 mb-2"></div>
                                <div className="h-3 bg-gray-800 rounded w-1/6"></div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <p className="text-gray-400">Nenhum curso encontrado.</p>
                ) : (
                    <div className="grid gap-4">
                        {courses.map((course) => (
                            <Link
                                to={`/courses/${course.id}`}
                                key={course.id}
                                className="block bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-6 transition"
                            >
                                <h3 className="text-lg font-semibold text-white mb-1">{course.name}</h3>
                                <p className="text-gray-400 text-sm">{course.start_date} → {course.end_date}</p>
                                <p className="text-gray-500 text-xs mt-1">{course.lessons_count} {course.lessons_count === 1 ? "aula" : "aulas"}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled = {page === 1}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition disabled:opacity-50"
                        >
                            ← Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-400 text-sm">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled = {page === totalPages}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition disabled:opacity-50"
                        >
                            Próxima →
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}