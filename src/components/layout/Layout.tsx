import { Link, Outlet } from "react-router-dom";
import Container from "../container/Container";
import LogoSvg from "../../assets/logo.svg";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useContext } from "react";
import { ContextAuth } from "../../context/AuthContext";
export default function Layout() {
  const { loading, signed } = useContext(ContextAuth);

  return (
    <>
      <header className="shadow mb-4">
        <Container>
          <div className="d-flex justify-content-between py-3">
            <div>
              <Link to={"/"}>
                <img src={LogoSvg} alt="" />
              </Link>
            </div>
            {!loading && signed && (
              <div className="border border-black p-2 rounded-5">
                <Link to={"/dashboard"}>
                  <FiUser size={30} />
                </Link>
              </div>
            )}
            {!loading && !signed && (
              <div>
                <Link to={"/login"}>
                  <FiLogOut
                    className="border border-black p-2 rounded-5"
                    size={47}
                  />
                </Link>
              </div>
            )}
          </div>
        </Container>
      </header>
      <Outlet />
    </>
  );
}
