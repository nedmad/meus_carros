import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

export default function DashboardHeader() {
  const navigate = useNavigate();
  async function Sair() {
    await signOut(auth)
      .then(() => {
        toast.success("Logout efetuado com sucesso!");
        navigate("/login");
      })
      .catch((error) => {
        console.log("Erro ao sair: \n" + error);
      });
  }
  return (
    <>
      <section className="bg-danger rounded-1 mt-3 shadow px-3 py-2">
        <div className="d-flex justify-content-between align-items-center text-light">
          <div className="cadastrar">
            <Link
              className="text-decoration-none text-light"
              to={"/dashboard/new"}
            >
              <strong>Cadastrar carro</strong>
            </Link>
          </div>
          <div onClick={Sair} className="Sair btn text-light">
            <strong>Sair</strong>
          </div>
        </div>
      </section>
    </>
  );
}
