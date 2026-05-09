import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function CourseForm(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    useEffect(() => {
        if(isEditing){
            api.get(`/courses/${id}`).then((data) =>
            {
                setName (data.name);
                setDescription(data.description || "");
                setStartDate(data.start_date);
                setEndDate(data.end_date);
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const body = { course: {name, description, start_date: startDate, end_date: endDate}};
        try {
            const data = isEditing ? await api.patch(`/courses/${id}`, body) : await api.post("/courses", body);
            if(data.id){
                toast.success(isEditing? "Curso atualizado!" : "Curso criado!");
                navigate(`/courses/${data.id}`);
            }
            else{
                setError(JSON.stringify(data));
            }
        }

        catch {
            toast.error("Erro ao salvar curso");
            setError("Erro ao salvar curso");
        }

        finally{
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-indigo-500";

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="text-indigo-400 hover:underline text-sm">← Voltar</Link>
                <h1 className="text-xl font-bold text-indigo-400">CourseSphere</h1>
                <div className="w-16" />
            </nav>
            <main className="max-w-2xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold mb-6">{isEditing ? "Editar Curso" : "Novo Curso"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome do curso"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputClass}
                    />
                    <textarea
                        placeholder="Descrição (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className={inputClass}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Data de início</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Data de término</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </form>
            </main>
        </div>
    );
}