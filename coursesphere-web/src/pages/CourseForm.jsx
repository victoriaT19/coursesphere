import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
            if (data.id){
                navigate(`/courses/${data.id}`);
            }
            else{
                setError(JSON.stringify(data));
            }
        }

        catch {
            setError("Erro ao salvar curso");
        }

        finally{
            setLoading(false);
        }
    };

    return (
    <div>
      <Link to="/dashboard">← Voltar</Link>
      <h1>{isEditing ? "Editar Curso" : "Novo Curso"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
    );
}