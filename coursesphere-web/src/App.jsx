import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import CourseForm from "./pages/CourseForm";
import LessonForm from "./pages/LessonForm";
import LessonDetail from "./pages/LessonDetail";

function PrivateRoute({children}){
  const {user} = useAuth();
  return user? children : <Navigate to="/login"/>;
}

export default function App(){
  return(
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path="/courses/new" element={<PrivateRoute><CourseForm/></PrivateRoute>}/>
      <Route path="/courses/:id" element={<PrivateRoute><CourseDetail/></PrivateRoute>}/>
      <Route path="/courses/:id/edit" element={<PrivateRoute><CourseForm/></PrivateRoute>}/>
      <Route path="/courses/:courseId/lessons/new" element = {<PrivateRoute><LessonForm/></PrivateRoute>}/>
      <Route path="/lessons/:lessonId/edit" element = {<PrivateRoute><LessonForm/></PrivateRoute>}/>
      <Route path="/lessons/:lessonId" element={<PrivateRoute><LessonDetail /></PrivateRoute>} />
      <Route path="*" element = {<Navigate to="/login"/>}/>
    </Routes>
  );
}