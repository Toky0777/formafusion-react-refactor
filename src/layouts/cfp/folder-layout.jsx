import { Outlet } from "react-router-dom";
import { SearchProvider } from "../../contexts/cfp/SearchFolderContext";

export function FolderLayout() {
    return (
        <SearchProvider>
            <Outlet />
        </SearchProvider>
    );
}