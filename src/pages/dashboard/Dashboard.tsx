import CarrosComponent from "../../components/carros/CarrosComponent";
import Container from "../../components/container/Container";
import DashboardHeader from "../../components/dashboadHeader/DashboardHeader";

export default function Dashboard() {
  return (
    <>
      <Container>
        <DashboardHeader />
        <CarrosComponent isCarUser={true} />
      </Container>
    </>
  );
}
