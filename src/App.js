import logo from "./logo.svg";
import "./App.css";
import WalletConnect from "./WalletConnectComponent/WallectConnect";
import "bootstrap/dist/css/bootstrap.min.css";
import Deploy from "./DeployComponent/Deploy";
import Mint from "./MintComponent/Mint";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WalletConnect></WalletConnect>
      </header>
      <div className="App-Container">
        <Deploy />
        <Mint />
      </div>
    </div>
  );
}

export default App;
