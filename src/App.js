import './App.css';
import Grid from './components/Grid';

function App() {
  return (
    <div className="App">
      <h1>moogle gaps</h1>
      <p>
        place some road pieces then place the green start point and red end point. <br/>
        then select you pathfinding algorithm! <br/>
        (some algorithms are not as good as others)
      </p>
      <Grid />
    </div>
  );
}

export default App;
