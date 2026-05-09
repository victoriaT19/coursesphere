import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

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

    if(loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Carregando...</p>
        </div>
    )

    if(!lesson) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Aula não encontrada</p>
        </div>
    )

    const isCreator = lesson.course?.creator_id === user?.id;
    if (!isCreator && lesson.status === "draft") {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400">Esta aula não está disponível.</p>
        </div>
    );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <Link to={`/courses/${lesson.course_id}`} className="text-indigo-400 hover:underline text-sm">← Voltar ao curso</Link>
                <h1 className="text-xl font-bold text-indigo-400">CourseSphere</h1>
                <div className="w-16"/>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                                lesson.status === "published" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>
                                    {lesson.status === "published" ? "Publicado" : "Rascunho"}
                            </span>
                        </div>
                        {isCreator && (
                            <div>
                                <button 
                                    onClick = {() => navigate(`/lessons/${lessonId}/edit`)}
                                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition"    
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm bg-red-900 hover:bg-red-800 rounded-lg transition"
                                >
                                    Excluir
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {lesson.video_url ? (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">Vídeo da Aula:</p>
                            <a
                                href={lesson.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition"
                            >
                                Assistir vídeo →
                            </a>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm mt-4">Nenhum vídeo cadastrado para está aula.</p>
                    )}

                </div>
            </main>
            {modal.open && (
              <ConfirmModal
                message={modal.message}
                onConfirm={modal.onConfirm}
                onCancel={() => setModal({open:false})}
              />
            )}
        </div>
    )
}