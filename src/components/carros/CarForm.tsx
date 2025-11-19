import { FiTrash, FiUpload } from "react-icons/fi";
import Container from "../../components/container/Container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/input/Input";
import {
  useContext,
  useState,
  type ChangeEvent,
  useTransition,
  useEffect,
} from "react";
import { ContextAuth } from "../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { storage, db } from "../../services/firebase";
import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
} from "firebase/storage";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

//validacoes do zod
const schema = z.object({
  name: z.string().nonempty("Nome e obrigatorio"),
  model: z.string().nonempty("Modelo e obrigatorio"),
  ano: z.string().nonempty("Ano e obrigatorio"),
  km: z.string().nonempty("Km e obrigatorio"),
  preco: z.string().nonempty("Preco e obrigatorio"),
  city: z.string().nonempty("Cidade e obrigatorio"),
  whatsapp: z
    .string()
    .min(1, "Whatsapp e obrigatorio")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Numero de telefone invalido",
    }),
  descricao: z.string().nonempty("Descricao e obrigatorio"),
});
//tipagen zod
type FormData = z.infer<typeof schema>;
//tipagem imagem carro
interface ImageCar {
  name: string;
  uid: string | undefined;
  previewUrl: string;
  url: string;
}
interface isUpdate {
  atualizar: boolean;
}
export default function CarForm({ atualizar }: isUpdate) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { userAuth } = useContext(ContextAuth);
  const [imageCar, setImageCar] = useState<ImageCar[]>([]);
  const { id } = useParams();
  const [imageErro, setImageErro] = useState("");
  const [isPeding, setPeding] = useTransition();
  const navigate = useNavigate();

  async function CadastrarCarro(data: FormData) {
    if (imageCar.length == 0) {
      setImageErro("Selecione uma imagem");
      return;
    }
    setPeding(async () => {
      try {
        await addDoc(collection(db, "carros"), {
          name: data.name.toUpperCase(),
          model: data.model,
          ano: data.ano,
          km: data.km,
          preco: data.preco,
          city: data.city,
          whatsapp: data.whatsapp,
          images: imageCar,
          date: new Date(),
          uid: userAuth?.uid,
          descricao: data.descricao,
        })
          .then(() => {
            toast.success(`${data.name} cadastro com sucesso`);
            setImageCar([]);
            reset();
          })
          .catch((e) => {
            toast.error(`Erro ao cadastrar ${data.name} ${e}`);
          });
      } catch (error) {
        console.log(error);
      }
    });
  }
  async function AtualizarCarrro(data: FormData) {
    if (imageCar.length == 0) {
      setImageErro("Selecione uma imagem");
      return;
    }
    if (!id) {
      toast.error("Item nao encontrado");
      return;
    }
    const updaTadeCarros = {
      ...data,
      images: imageCar,
      date: new Date(),
      uid: userAuth?.uid,
    };
    setPeding(async () => {
      try {
        const refDoc = doc(db, "carros", id);

        await updateDoc(refDoc, updaTadeCarros)
          .then(() => {
            toast.success("Atualizado com sucesso!");
          })
          .catch((e) => {
            toast.error(`Erro ao atualizar carro: ${e}`);
          });
      } catch (error) {
        console.log(error);
      }
    });
  }
  function enviarImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (
        image.type === "image/jpeg" ||
        image.type === "image/png" ||
        image.type === "image/webp"
      ) {
        enviarFireBaeImage(image);
      } else {
        toast.error("Selecione image jpeg, png ou webp");
        return;
      }
    }
  }
  async function enviarFireBaeImage(image: File) {
    const uidUser = userAuth?.uid;
    const uidImage = uuidV4();

    const refImage = ref(storage, `image/${uidUser}/${uidImage}`); //ref faz uma referencia de link da imagem para o storage
    setPeding(async () => {
      await uploadBytes(refImage, image) //uploadBytes faz o envio da imagem. image seria o tipo de arquivo
        .then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((downloadImage) => {
            //getDownloadURL pega os dados da imagem que foi enviado para o firebase
            const imageItem: ImageCar = {
              name: uidImage,
              uid: uidUser,
              previewUrl: URL.createObjectURL(image),
              url: downloadImage,
            };
            setImageCar((imagens) => [...imagens, imageItem]);
          });
        })
        .catch((error) => console.log("Erro a enviar imagem \n" + error));
    });
  }
  async function deleteImage(image: ImageCar) {
    const imagePath = `image/${image.uid}/${image.name}`;
    const imageRef = ref(storage, imagePath);
    setPeding(async () => {
      try {
        await deleteObject(imageRef);
        setImageCar(imageCar.filter((e) => e.url != image.url));
      } catch (err) {
        console.log("erro ao apagar" + err);
      }
    });
  }
  useEffect(() => {
    async function getCar() {
      if (!id) {
        return;
      }
      const docCar = doc(db, "carros", id);
      await getDoc(docCar).then((e) => {
        if (!e.data()) {
          navigate("/");
        }
        reset({
          name: e.data()?.name,
          model: e.data()?.model,
          ano: e.data()?.ano,
          km: e.data()?.km,
          preco: e.data()?.preco,
          city: e.data()?.city,
          whatsapp: e.data()?.whatsapp,
          descricao: e.data()?.descricao,
        });
        setImageCar(e.data()?.images);
      });
    }
    atualizar && getCar();
  }, []);
  return (
    <>
      <Container>
        <section className="row gap-2 align-items-center mb-4">
          <section className="col-2 ">
            <div className="border rounded-3 py-4 px-2  border-dark w-100 d-flex position-relative justify-content-center align-items-center">
              <button
                disabled={isPeding}
                className="position-absolute btn border-0"
              >
                <FiUpload size={50} />
              </button>
              <div className="img-upload opacity-0" style={{ zIndex: 1 }}>
                <input
                  style={{ cursor: "pointer" }}
                  type="file"
                  accept="image/*"
                  onChange={enviarImage}
                  disabled={isPeding}
                />
              </div>
            </div>
          </section>
          {imageCar.map((ima) => (
            <div
              className="col p-0  position-relative d-flex justify-content-center align-items-center"
              key={ima.name}
            >
              <button
                className="btn position-absolute text-light"
                style={{ zIndex: 2 }}
                onClick={() => deleteImage(ima)}
                disabled={isPeding}
              >
                <FiTrash size={30} />
              </button>
              <img
                className="w-100  object-fit-cover rounded-2"
                style={{ maxHeight: 100 }}
                src={ima.url}
                alt=""
              />
            </div>
          ))}
          {imageErro && <div className="text-danger">{imageErro}</div>}
        </section>
        <form
          onSubmit={
            atualizar
              ? handleSubmit(AtualizarCarrro)
              : handleSubmit(CadastrarCarro)
          }
        >
          <section className="row">
            <div className="col-12">
              <div className="mb-1">Nome do carro</div>
              <Input
                name={"name"}
                placeholder={"Digite o nome do carro"}
                type={"text"}
                error={errors.name?.message}
                register={register}
              />
            </div>
            <div className="col-12">
              <div className="mb-1">Modelo</div>
              <Input
                name={"model"}
                placeholder={"Digite o modelo"}
                type={"text"}
                error={errors.model?.message}
                register={register}
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="mb-1">Ano</div>
              <Input
                name={"ano"}
                placeholder={"Ano do carro"}
                type={"text"}
                error={errors.ano?.message}
                register={register}
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="mb-1">Km rodado</div>
              <Input
                name={"km"}
                placeholder={"Km rodado"}
                type={"text"}
                error={errors.km?.message}
                register={register}
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="mb-1">Telefone/Whatsapp</div>
              <Input
                name={"whatsapp"}
                placeholder={"Digite o whatsapp ou telefone"}
                type={"text"}
                error={errors.whatsapp?.message}
                register={register}
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="mb-1">Cidade</div>
              <Input
                name={"city"}
                placeholder={"Digite o nome da cidade"}
                type={"text"}
                error={errors.city?.message}
                register={register}
              />
            </div>
            <div className="col-12">
              <div className="mb-1">Preco do carro</div>
              <Input
                name={"preco"}
                placeholder={"Digite o preco do carro"}
                type={"text"}
                error={errors.preco?.message}
                register={register}
              />
            </div>
            <div className="col-12 mb-3">
              <div className="mb-1">Descricao</div>
              <textarea
                className="w-100 focus-ring p-3 rounded-3"
                style={{ minHeight: 200 }}
                id="descricao"
                {...register("descricao")}
              ></textarea>
              <div className="text-danger">{errors.descricao?.message}</div>
            </div>
            <div className="col mb-3">
              <button
                disabled={isPeding}
                type="submit"
                className="btn btn-primary w-100 p-3"
              >
                <strong>{atualizar ? "Atualizar" : "Cadastrar Carro"}</strong>
              </button>
            </div>
          </section>
        </form>
      </Container>
    </>
  );
}
