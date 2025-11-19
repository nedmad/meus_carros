import CarForm from "../../../components/carros/CarForm";
import Container from "../../../components/container/Container";

export default function New() {
  return (
    <>
      <Container>
        <CarForm atualizar={false} />
      </Container>
    </>
  );
}
