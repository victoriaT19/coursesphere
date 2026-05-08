import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CourseDetail(){
    const [course, setCourses] = useState(null)
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guest, setGuest] = useState(null);
    const {id} = useParams();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        api.get(`/courses/${id}`).then((data) => {
            setCourses(data);
            setLessons(data.lessons || []);
        }).finally(() => setLoading(false));

        fetch("https://randomuser.me/api/").then((r) => r.json()).then((data) => setGuest(data.results[0]));
    }, [id]);

    const handleDeleteCourse = async () => {
        if(!confirm("Excluir curso?")) return;
        await api.delete(`/courses/${id}`);
        navigate("/dashboard");
    };

    const handleDeleteLesson = async (lessonId) => {
        if(!confirm("Excluir aula?")) return;
        await api.delete(`/lessons/${lessonId}`);
        setLessons(lessons.filter((l) => l.id !== lessonId));
    };

    if (loading) return <p>Carregando...</p>;
    if(!course) return <p>Curso não encontrado.</p>

    const isCreator = user?.id === course.creator_id;
    const filteredLessons = lessons.filter((l) =>
        statusFilter === "all" || l.status === statusFilter
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="text-indigo-400 hover:underline text-sm">← Voltar</Link>
                <h1 className="text-xl font-bold text-indigo-400">CourseSphere</h1>
                <div className="w-16" />
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{course.name}</h2>
                            {course.description && (
                                <p className="text-gray-400 mb-3">{course.description}</p>
                            )}
                            <p className="text-sm text-gray-500">{course.start_date} → {course.end_date}</p>
                        </div>
                        {isCreator && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/courses/${id}/edit`)}
                                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleDeleteCourse}
                                    className="px-4 py-2 text-sm bg-red-900 hover:bg-red-800 rounded-lg transition"
                                >
                                    Excluir
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {guest && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 flex items-center gap-4">
                        <img
                            src={guest.picture.medium}
                            alt="instrutor"
                            className="w-14 h-14 rounded-full border-2 border-indigo-500"
                        />
                        <div>
                            <p className="text-xs text-indigo-400 uppercase font-semibold mb-1">Instrutor Convidado</p>
                            <p className="text-white font-medium">{guest.name.first} {guest.name.last}</p>
                            <p className="text-gray-400 text-sm">{guest.location.country}</p>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Aulas</h3>
                        {isCreator && (
                            <button
                                onClick={() => navigate(`/courses/${id}/lessons/new`)}
                                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                            >
                                + Nova Aula
                            </button>
                        )}
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
                    >
                        <option value="all">Todas</option>
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                    </select>
                    {filteredLessons.length === 0 ? (
                        <p className="text-gray-400">Nenhuma aula encontrada.</p>
                    ) : (
                        <div className="grid gap-3">
                            {filteredLessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex justify-between items-center"
                                >
                                    <div>
                                        <h4 className="font-medium text-white">{lesson.title}</h4>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${
                                            lesson.status === "published"
                                                ? "bg-green-900 text-green-300"
                                                : "bg-yellow-900 text-yellow-300"
                                        }`}>
                                            {lesson.status === "published" ? "Publicado" : "Rascunho"}
                                        </span>
                                    </div>
                                    {isCreator && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/lessons/${lesson.id}/edit`)}
                                                className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="px-3 py-1 text-sm bg-red-900 hover:bg-red-800 rounded-lg transition"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}