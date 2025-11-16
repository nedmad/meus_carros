import Container from "../../components/container/Container";
import Input from "../../components/input/Input";
import Logo from "../../assets/logo.svg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useState, useTransition } from "react";
import { ContextAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().nonempty("Nome e obrigatorio"),
  email: z
    .string()
    .email("Insira o email corretamente")
    .nonempty("Email e obrigatorio"),

  password: z
    .string()
    .min(8, "No minimo 8 caracteres")
    .nonempty("Senha e obrigatoria"),
});

type FormData = z.infer<typeof schema>;

export default function Regiter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const [errorGeral, setErrorGeral] = useState("");
  const navigate = useNavigate();
  const { signed } = useContext(ContextAuth);
  const [isPedding, setIsPedding] = useTransition();
  if (signed) {
    return <Navigate to={"/"} />;
  }

  async function fazerCadastro(data: FormData) {
    setIsPedding(async () => {
      await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
          await updateProfile(user.user, {
            displayName: data.name,
          });
          toast.success("Cadastro efetuado com sucesso");
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            setErrorGeral("Email ja existe");
          }
        });
    });
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          setErrorGeral("Email ja existe");
        }
      });
  }
  return (
    <>
      <Container>
        <div>{errorGeral}</div>
        <section className="login d-flex flex-column justify-content-center align-items-center">
          <Link className="w-25 mb-3" to="/">
            <img src={Logo} alt="logo" />
          </Link>
          <form onSubmit={handleSubmit(fazerCadastro)} className="w-50">
            <Input
              name="name"
              type="text"
              placeholder="Digite seu nome"
              error={errors.name?.message}
              register={register}
            />
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
              error={errors.password?.message}
              register={register}
            />
            <button
              disabled={isPedding}
              type="submit"
              className="btn btn-primary w-100 p-2"
            >
              Registrar
            </button>
          </form>
          <Link className="mt-3 text-decoration-none" to={"/login"}>
            Ja tem usurio? Face seu login aqui!
          </Link>
        </section>
      </Container>
    </>
  );
}
