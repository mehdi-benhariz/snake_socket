import {Switch ,Route} from "react-router-dom"
import GameBoard from "./components/GameBoard";
import Login from "./components/Login";

function App() {
  return (
      <Switch>
        <Route exact path="/" component={Login}  />
        <Route path="/game" component={GameBoard}  />
      </Switch>     
  );
}

export default App;
