import { Link } from "react-router-dom";

export function ServiceLogo() {
    return <>
        <div className='inline-flex items-center gap-2'>
            <div className="flex items-center gap-6">
                <a 
                href="/" 
                className="flex items-center p-1.5 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 group"
                >
                <img
                    src="https://evaluations.forma-fusion.com/img/icones/Evaluation.png"
                    alt="Logo"
                    className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                />
                </a>
                <Link
                    to="/"
                    className="text-lg font-bold transition-all duration-300 text-slate-800 hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:bg-clip-text"
                >
                    Evaluation
                </Link>
            </div>
        </div>
    </>
}