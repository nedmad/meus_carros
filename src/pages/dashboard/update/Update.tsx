import { FiTrash, FiUpload } from "react-icons/fi";
import Container from "../../../components/container/Container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/input/Input";
import {
  useContext,
  useState,
  type ChangeEvent,
  useTransition,
  useEffect,
} from "react";
import { ContextAuth } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { storage, db } from "../../../services/firebase";
import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
} from "firebase/storage";
import { addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import CarForm from "../../../components/carros/CarForm";

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
export default function Update() {
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
    getCar();
  }, []);
  return (
    <>
      <Container>
        <CarForm atualizar={false} />
      </Container>
    </>
  );
}
