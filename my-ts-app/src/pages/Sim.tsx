import Header from "../components/header";
import Footer from "../components/footer";

export default function Sim() {
  return (
    <div className="login-page">
      <Header />
    <div>
      {/* Sim content */}
      <strong style = {{fontSize: "100px", marginTop: "1000px"}}>Simulation</strong>
      <header style = {{fontSize: "50px"}}> Choose your character:</header>
    </div>
    <Footer />
    </div>
  );
}