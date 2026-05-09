import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-8xl font-bold text-indigo-500 mb-4">404</h1>
            <p className="text-2xl font-semibold mb-2">Página não encontrada</p>
            <p className="text-gray-400 mb-8">A página que você está procurando não existe.</p>
            <Link 
                to="/dashboard"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition">
                    Voltar ao início
                </Link>
        </div>
    );
}