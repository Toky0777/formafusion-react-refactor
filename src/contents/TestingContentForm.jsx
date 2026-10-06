import { Outlet } from "react-router-dom";
import { TestSearchProvider } from "../contexts/Apprenants/TestProvider";
import { NavigationTestFormateur } from "../components/navbar/navigation-testing-formateur";


export function TestingContentForm() {
  return (
    <TestSearchProvider>
      <NavigationTestFormateur />
      <Outlet />
    </TestSearchProvider>
  );
}
