import { FiTrash, FiUpload } from "react-icons/fi";
import Container from "../../../components/container/Container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/input/Input";
import { useContext, useState, type ChangeEvent, useTransition } from "react";
import { ContextAuth } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { storage, db } from "../../../services/firebase";
import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
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
export default function New() {
  return (
    <>
      <Container>
        <CarForm atualizar={false} />
      </Container>
    </>
  );
}
