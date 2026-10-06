import { Link } from "react-router-dom";

export function Footer()
{
    return <>
        <footer className="bottom-0 w-full bg-white border-gray-100 shadow-inner">
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <nav className="flex flex-wrap justify-center space-x-6 text-xs text-gray-500">
                    <Link to="/aide" className="transition-colors hover:text-gray-900">Aide</Link>
                    <Link to="/contact" className="transition-colors hover:text-gray-900">Contact</Link>
                    <Link to="/securite" className="transition-colors hover:text-gray-900">Sécurité</Link>
                    <Link to="/respect-vie-prive" className="transition-colors hover:text-gray-900">Respect de la vie privée</Link>
                    <Link to="/contrat" className="transition-colors hover:text-gray-900">Contrat d'utilisations</Link>
                    <Link to="/mention-legale" className="transition-colors hover:text-gray-900">Mentions Légales</Link>
                </nav>

                <p className="mt-4 text-xs text-center text-gray-400">© 2025 FormaFusion. Tous droits réservés.</p>
            </div>
        </footer>
    </>
}