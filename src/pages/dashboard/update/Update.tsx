import CarForm from "../../../components/carros/CarForm";
import Container from "../../../components/container/Container";

export default function Update() {
  return (
    <>
      <Container>
        <CarForm atualizar={true} />
      </Container>
    </>
  );
}
