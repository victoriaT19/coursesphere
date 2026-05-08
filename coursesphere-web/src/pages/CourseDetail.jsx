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
        if(!confirm("Exluir aula?")) return;
        await api.delete(`/lessons/${lessonId}`);
        setLessons(lessons.filter((l) => l.id !== lessonId));
    };

    if (loading) return <p>Carregando...</p>;
    if(!course) return <p>Curso não encontrado.</p>

    const isCreator = user?.id === course.creator_id;

    return (
    <div>
      <Link to="/dashboard">← Voltar</Link>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <p>{course.start_date} → {course.end_date}</p>

      {isCreator && (
        <div>
          <button onClick={() => navigate(`/courses/${id}/edit`)}>Editar Curso</button>
          <button onClick={handleDeleteCourse}>Excluir Curso</button>
        </div>
      )}

      {guest && (
        <div>
          <h3>Instrutor Convidado</h3>
          <img src={guest.picture.medium} alt="instrutor" />
          <p>{guest.name.first} {guest.name.last}</p>
        </div>
      )}

      <h2>Aulas</h2>
      <button onClick={() => navigate(`/courses/${id}/lessons/new`)}>Nova Aula</button>
      {lessons.length === 0 ? (
        <p>Nenhuma aula cadastrada.</p>
      ) : (
        lessons.map((lesson) => (
          <div key={lesson.id}>
            <h4>{lesson.title}</h4>
            <p>{lesson.status}</p>
            <button onClick={() => navigate(`/lessons/${lesson.id}/edit`)}>Editar</button>
            <button onClick={() => handleDeleteLesson(lesson.id)}>Excluir</button>
          </div>
        ))
      )}
    </div>
    );
}