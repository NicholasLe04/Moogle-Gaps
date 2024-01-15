import './App.css';
import Grid from './components/Grid';

function App() {
  return (
    <div className="App">
      <h1>moogle gaps</h1>
      <p>
        Build out a custom map by placing roads, buildings, and a start/end point!<br/>
        Then select a pathfinding algorithm and press 'Find a Path!' to find a path from your start to end point!<br/>
        Buildings will create 'traffic' in surrounding road tiles which can affect pathfinding. <br/>
        Experiment with different road and building layouts and examine how paths change!
      </p>
      <Grid />
    </div>
  );
}

export default App;
