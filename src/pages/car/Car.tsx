import Container from "../../components/container/Container";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate, useParams } from "react-router-dom";
import type { GetCarros } from "../../types/carrosType";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

export default function Car() {
  const { id } = useParams();
  const [car, setCar] = useState<GetCarros>();
  const [slidePreview, setSlidePreview] = useState<number>(2);
  const navigate = useNavigate();

  const lightboxRef = useRef<any>(null);
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
    if (car?.images.length == 1) {
      setSlidePreview(1);
    }
    window.addEventListener("resize", resolutionImage);
    return () => {
      window.removeEventListener("resize", resolutionImage);
    };
  }, [car?.images]);

  return (
    <>
      <Container>
        <section>
          <LightGallery
            onInit={(ref) => (lightboxRef.current = ref.instance)}
            plugins={[lgThumbnail, lgZoom]}
            dynamic
            speed={500}
            elementClassNames="my-gallery"
            dynamicEl={
              car?.images.map((img) => ({
                src: img.url,
                thumb: img.url,
              })) ?? []
            }
          >
            <Swiper
              slidesPerView={slidePreview}
              pagination={{ clickable: true }}
              modules={[Navigation]}
              navigation
            >
              {car?.images.map((image, index) => (
                <SwiperSlide key={image.name}>
                  <img
                    src={image.url}
                    className="w-100 object-fit-cover rounded-2"
                    style={{ height: 200 }}
                    alt=""
                    onClick={() => {
                      lightboxRef.current.openGallery(index);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </LightGallery>
        </section>
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
