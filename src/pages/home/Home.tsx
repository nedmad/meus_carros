import { useEffect, useState } from "react";
import Container from "../../components/container/Container";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";
import type { GetCarros } from "../../types/carrosType";
import { BiSearch } from "react-icons/bi";

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
        <nav className="">
          <div className="container-fluid">
            <div className="w-100 row shadow border rounded-3">
              <input
                className="border-0 col-10 col-lg-11 p-3 rounded-start-3"
                type="search"
                placeholder="Pesquisa o nome do carro"
                style={{ outline: "none" }}
                value={searchCar}
                onChange={(e) => setSearchCar(e.target.value)}
              />
              <button
                className="btn col-2 col-lg-1 rounded-start-0 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#d3d3d3" }}
                onClick={buscarCarros}
                type="submit"
              >
                <BiSearch size={30} style={{ minWidth: 100 }} />
              </button>
            </div>
          </div>
        </nav>
        <section className="py-5">
          <div className="row ">
            {carros.map((val) => (
              <Link
                to={`/car/${val.id}`}
                key={val.name}
                className="col-12 col-sm-6 col-lg-4 hover-scale mt-4 text-decoration-none "
              >
                <div className="card shadow">
                  <div
                    className="card-img-top"
                    style={{
                      backgroundColor: "#e0e4cc",
                      minHeight: 250,
                      display: loadingCarros.includes(val.id)
                        ? "none"
                        : "block",
                    }}
                  ></div>
                  <img
                    src={val.images[0].url}
                    className="card-img-top "
                    alt="..."
                    onLoad={() => onloadCar(val.id)}
                    style={{
                      display: loadingCarros.includes(val.id)
                        ? "block"
                        : "none",
                    }}
                  />
                  <div className="card-body">
                    <p className="card-text">
                      <strong>{val.name}</strong>
                    </p>
                    <p>Ano {val.ano}</p>
                    <p className="card-text">
                      <strong>R$ {val.preco}</strong>
                    </p>
                    <p>{val.city}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
