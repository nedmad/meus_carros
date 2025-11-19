import { useContext, useEffect, useState, useTransition } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { ContextAuth } from "../../context/AuthContext";
import type { GetCarros } from "../../types/carrosType";
import { deleteObject, ref } from "firebase/storage";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
interface IsCarUser {
  isCarUser: boolean;
}
export default function CarrosComponent({ isCarUser }: IsCarUser) {
  const { userAuth } = useContext(ContextAuth);
  const [carros, setCarros] = useState<GetCarros[]>([]);
  const [loadingCarros, setLoadingCarros] = useState<string[]>([]);
  const [peding, setPeding] = useTransition();
  console.log(isCarUser);

  useEffect(() => {
    const colleCtionRef = collection(db, "carros");

    const queryCarro = isCarUser
      ? query(
          colleCtionRef,
          where("uid", "==", userAuth?.uid),
          orderBy("date", "desc")
        )
      : query(colleCtionRef, orderBy("date", "desc"));

    getDocs(queryCarro).then((res) => {
      const pushCarros = [] as GetCarros[];
      res.forEach((car) => {
        pushCarros.push({
          id: car.id,
          name: car.data().name,
          model: car.data().model,
          ano: car.data().ano,
          km: car.data().km,
          preco: car.data().preco,
          city: car.data().city,
          whatsapp: car.data().whatsapp,
          images: car.data().images,
          date: car.data().date,
          uid: car.data().uid,
        });
        setCarros(pushCarros);
      });
    });
  }, []);
  async function deleteCar(car: GetCarros) {
    const docRef = doc(db, "carros", car.id);
    setPeding(async () => {
      try {
        await deleteDoc(docRef);
      } catch (erro) {
        toast.error("Erro ao deletar item");
      }
    });
    car.images.forEach(async (cars) => {
      const ImagePath = `image/${car.uid}/${cars.uid}`;
      const imageRef = ref(storage, ImagePath);
      try {
        toast.success(`${car.name} deletado com sucesso`, { duration: 3000 });
        await deleteObject(imageRef);
      } catch (e) {
        console.log(`Erro ao apagar imagem`);
      }
    });
    setCarros((e) => e.filter((i) => i.id !== car.id));
  }
  function onloadCar(id: string) {
    setLoadingCarros((val) => [...val, id]);
  }
  return (
    <>
      <section className="py-5">
        <div className="row ">
          {carros.map((e) => (
            <section className="col-12 col-sm-6 col-lg-4 hover-scale mt-4">
              <div className="card shadow">
                {isCarUser && (
                  <div className="d-flex">
                    <button
                      className="lixeira bg-light p-2 d-flex border-0 justify-content-center rounded-2 position-absolute end-0 m-2 "
                      style={{ width: 40, cursor: "pointer", color: "red" }}
                      onClick={() => deleteCar(e)}
                      disabled={peding}
                    >
                      <FiTrash2 size={26} />
                    </button>
                    <Link
                      to={`/dashboard/update/${e.id}`}
                      className="text-black bg-light p-2 d-flex justify-content-center rounded-2 position-absolute m-2"
                    >
                      <FiEdit2 size={26} />
                    </Link>
                  </div>
                )}

                <div
                  className="card-img-top"
                  style={{
                    backgroundColor: "#e0e4cc",
                    minHeight: 250,
                    display: loadingCarros.includes(e.id) ? "none" : "block",
                  }}
                ></div>
                <Link
                  to={`/car/${e.id}`}
                  className="text-decoration-none text-black"
                >
                  <img
                    src={e.images[0].url}
                    className="card-img-top "
                    alt="..."
                    style={{
                      display: loadingCarros.includes(e.id) ? "block" : "none",
                      maxHeight: 210,
                    }}
                    onLoad={() => onloadCar(e.id)}
                  />
                  <div className="card-body">
                    <p className="card-text">
                      <strong>{e.name}</strong>
                    </p>
                    <p>{e.ano}</p>
                    <p className="card-text">
                      <strong>R$ {e.preco}</strong>
                    </p>
                    <p>{e.city}</p>
                  </div>
                </Link>
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
