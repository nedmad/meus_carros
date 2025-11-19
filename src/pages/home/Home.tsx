import { useEffect, useState } from "react";
import Container from "../../components/container/Container";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";
import type { GetCarros } from "../../types/carrosType";
import { BiSearch } from "react-icons/bi";
import CarrosComponent from "../../components/carros/CarrosComponent";

export default function Home() {
  const [carros, setCarros] = useState<GetCarros[]>([]);
  const [loadingCarros, setLoadingCarros] = useState<string[]>([]);
  const [searchCar, setSearchCar] = useState("");
  useEffect(() => {
    rederizarCarros();
  }, []);
  function rederizarCarros() {
    const colleCtionCarros = collection(db, "carros");
    const queryCarros = query(colleCtionCarros, orderBy("date", "desc"));
    getDocs(queryCarros).then((resp) => {
      let carrosEach = [] as GetCarros[];
      resp.forEach((car) => {
        carrosEach.push({
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
      });
      setCarros(carrosEach);
    });
  }
  async function buscarCarros() {
    if (!searchCar) {
      rederizarCarros();
      return;
    }
    const queryCar = query(
      collection(db, "carros"),
      where("name", ">=", searchCar.toUpperCase()),
      where("name", "<=", searchCar.toUpperCase() + "\uf8ff")
    );
    await getDocs(queryCar).then((cars) => {
      let carrosEach = [] as GetCarros[];
      cars.forEach((car) => {
        carrosEach.push({
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
      });
      setCarros(carrosEach);
    });
  }
  function onloadCar(id: string) {
    setLoadingCarros((val) => [...val, id]);
  }
  return (
    <>
      <Container>
        <CarrosComponent isCarUser={false} />
      </Container>
    </>
  );
}
