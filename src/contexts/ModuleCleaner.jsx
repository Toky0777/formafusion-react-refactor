import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useModuleContext } from "./ModuleContext";


export default function ModuleCleaner() {
    const location = useLocation();
    const { setIdModule } = useModuleContext();

    useEffect(() => {
        if (location.pathname !== "/create" && location.pathname !== "/liste") {
            localStorage.removeItem("idModule");
            localStorage.removeItem("module");
            setIdModule(null);
        }
    }, [location, setIdModule]);

    return null;
}
