import Container from "../../components/container/Container";
import Input from "../../components/input/Input";
import Logo from "../../assets/logo.svg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ContextAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .email("Insira o email corretamente")
    .nonempty("Email e obrigatorio"),
  password: z.string().nonempty("Senha e obrigatoria"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const navigate = useNavigate();
  const { signed } = useContext(ContextAuth);

  if (signed) {
    return navigate("/");
  }

  async function fazerLogin(data: FormData) {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((e) => {
        toast.success("Login efetuado com sucesso");
        c;
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <Container>
        <section className="login d-flex flex-column justify-content-center align-items-center">
          <Link className="w-25 mb-3" to="/">
            <img src={Logo} alt="logo" />
          </Link>
          <form onSubmit={handleSubmit(fazerLogin)} className="w-50">
            <Input
              name="email"
              type="email"
              placeholder="Digite seu email"
              error={errors.email?.message}
              register={register}
            />
            <Input
              name="password"
              type="password"
              placeholder="Digite sua senha"
              error={errors.email?.message}
              register={register}
            />
            <button type="submit" className="btn btn-primary w-100 p-2">
              Entrar
            </button>
          </form>
          <Link to={"/register"} className="mt-3 text-decoration-none">
            Nao tem cadastro? Faca seu cadastro aqui!
          </Link>
        </section>
      </Container>
    </>
  );
}
