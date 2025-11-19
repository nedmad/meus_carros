import Container from "../../components/container/Container";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate, useParams } from "react-router-dom";
import type { GetCarros } from "../../types/carrosType";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Car() {
  const { id } = useParams();
  const [car, setCar] = useState<GetCarros>();
  const [slidePreview, setSlidePreview] = useState<number>(2);
  const navigate = useNavigate();

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
        setCar({
          id: e.id,
          name: e.data()?.name,
          model: e.data()?.model,
          ano: e.data()?.ano,
          km: e.data()?.km,
          preco: e.data()?.preco,
          city: e.data()?.city,
          whatsapp: e.data()?.whatsapp,
          images: e.data()?.images,
          date: e.data()?.date,
          uid: e.data()?.uid,
          descricao: e.data()?.descricao,
        });
      });
    }
    getCar();
  }, []);
  useEffect(() => {
    function resolutionImage() {
      if (window.innerWidth < 720) {
        setSlidePreview(1);
      } else {
        setSlidePreview(2);
      }
    }
    window.addEventListener("resize", resolutionImage);
    return () => {
      window.removeEventListener("resize", resolutionImage);
    };
  }, []);

  return (
    <>
      <Container>
        <Swiper
          slidesPerView={slidePreview}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide>
              <img
                src={image.url}
                className="w-100 object-fit-cover rounded-2"
                style={{ height: 200 }}
                alt=""
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <section>
          <div className="row align-items-center mt-4">
            <div className="col-6">
              <h3>
                <strong>{car?.name}</strong>
              </h3>
            </div>
            <div className="precoCar col-6 d-flex justify-content-end">
              <h4 className="me-4">
                <strong>R$ {car?.preco}</strong>
              </h4>
            </div>
            <div className="descricao col-12 mt-3">{car?.descricao}</div>
            <div className="tel col-12 mt-4 mb-4 ">
              <div className="row justify-content-center">
                <div className="col-12">
                  <strong>Telefone</strong>
                  <p>{car?.whatsapp}</p>
                </div>
                <button className="col-12 btn btn-success w-75 p-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Estou enteressado no carro ${car?.name}`}
                    target="_blank"
                    className="text-decoration-none"
                  >
                    <strong className="text-light">
                      Enviar mensagem whatsapp{" "}
                      <FaWhatsapp size={20} className="ms-2" />
                    </strong>
                  </a>
                </button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
