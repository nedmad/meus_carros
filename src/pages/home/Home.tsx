import CarrosComponent from "../../components/carros/CarrosComponent";
import Container from "../../components/container/Container";

export default function Home() {
  return (
    <>
      <Container>
        <CarrosComponent isCarUser={false} />
      </Container>
    </>
  );
}
