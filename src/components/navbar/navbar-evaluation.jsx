import { useState } from "react";
import { NavigationList } from "./navigation-evaluation";
import SearchBarEvaluation from "../search/search-bar-evaluation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export function NavbarEvaluation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* NavBar avec hauteurs responsives */}
            <nav className="mt-3 bg-gray-50">
                <div className="flex items-center justify-center w-full h-full px-3 sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <NavigationList />
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
                        {/* Mobile Actions */}
                        <div className="flex items-center gap-1 sm:gap-2 lg:hidden">

                            {/* Mobile Menu Button avec tailles responsives */}
                            <button
                                onClick={toggleMobileMenu}
                                className="p-1.5 sm:p-2 md:p-2.5 text-gray-600 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600 active:scale-95"
                                aria-label='Menu'
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                ) : (
                                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay avec design amélioré */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                        onClick={toggleMobileMenu}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed inset-y-0 right-0 z-50 flex flex-col min-h-screen w-72 sm:w-80 md:w-96 max-w-[85vw] bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col h-full">
                                {/* Mobile Menu Header avec hauteur responsive */}
                                <div className="flex items-center justify-between p-3 border-b border-gray-100 sm:p-4 md:p-5 bg-gradient-to-r from-purple-50 to-indigo-50">
                                    <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                                    <button
                                        onClick={toggleMobileMenu}
                                        className="p-1.5 sm:p-2 text-gray-600 transition-colors rounded-lg hover:bg-purple-100 active:scale-95"
                                        aria-label='Close'
                                    >
                                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>

                                {/* Mobile Search avec padding responsive */}
                                <div className="p-3 border-b border-gray-100 sm:p-4 md:p-5 md:hidden bg-gray-50">
                                    <SearchBarEvaluation />
                                </div>

                                {/* Mobile Navigation avec espacement amélioré */}
                                <div className="flex-1 p-3 overflow-y-auto sm:p-4 md:p-5">
                                    <NavigationList isMobile={true} onItemClick={toggleMobileMenu} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}