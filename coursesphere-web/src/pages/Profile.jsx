import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

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

    if(loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Carregando...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="text-indigo-400 hover:underline text-sm">← Dashboard</Link>
                <h1 className="text-xl font-bold text-indigo-400">CourseSphere</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                    Sair
                </button>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                            {profile.user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{profile.user.name}</h2>
                            <p className="text-gray-400 text-sm">{profile.user.email}</p>
                            <p className="text-gray-600 text-xs mt-1">
                                Membro desde{new Date(profile.user.created_at).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold mb-4">
                        Cursos criados ({profile.created_courses.length})
                    </h3>
                    {profile.created_courses.length === 0 ? 
                        (<p className="text-gray-400">Nenhum curso criado ainda</p>) : (
                        <div className="grid gap-4">
                            {profile.created_courses.map((course) => (
                                <Link 
                                    to={`/courses/${course.id}`}
                                    key={course.id}
                                    className="block bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl  p-6 transition"
                                >       
                                    <h4 className="text-lg font-semibold text-white mb-1">{course.name}</h4>
                                    <p className="text-gray-400 text-sm">{course.start_date} → {course.end_date}</p>
                                    <p className="text-gray-500 text-xs mt-1">{course.lessons_count} {course.lessons_count === 1 ? "aula" : "aulas"}</p>  
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">
                        Cursos inscritos ({profile.enrolled_courses.length})
                    </h3>
                    {profile.enrolled_courses.length === 0 ? (
                        <p className="text-gray-400">Nenhum curso inscrito ainda.</p>
                    ):(
                        <div className="grid gap-4">
                            {profile.enrolled_courses.map((course) => (
                                <Link 
                                    to={`/courses/${course.id}`}
                                    key={course.id}
                                    className="block bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-6 transition"
                                >
                                    <h4 className="text-lg font-semibold text-white mb-1">{course.name}</h4>
                                    <p className="text-gray-400 text-sm">{course.start_date} → {course.end_date}</p>
                                    <p className="text-gray-500 text-xs mt-1">{course.lessons_count} {course.lessons_count === 1 ? "aula" : "aulas"}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}