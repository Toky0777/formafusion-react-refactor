import { Outlet } from "react-router-dom";
import { TestSearchProvider } from "../contexts/Apprenants/TestProvider";
import { NavBarTestingCfp } from "../components/navbar/navbar-testing-cfp";

export function TestingContent() {
  return (
    <TestSearchProvider>
      <NavBarTestingCfp />
      <Outlet />
    </TestSearchProvider>
  );
}
