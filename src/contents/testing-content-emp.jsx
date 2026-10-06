import { Outlet } from "react-router-dom";
import { NavBarTestEmp } from "../components/navbar/navbar-testing-emp";

export function TestingContentEmp() {
  return (
    <>
      <NavBarTestEmp />
      <Outlet />
    </>
  );
}
