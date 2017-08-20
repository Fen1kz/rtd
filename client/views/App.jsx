import React from 'react';
import {connect} from 'react-redux';
import {
  Router,
  Route,
  Link
} from 'react-router-dom'

import RouteHome from './RouteHome';
// import RouteLogin from '../modules/auth/routes/RouteLogin';
// import RouteGame from '../modules/game/RouteGame';

export class App extends React.PureComponent {
  render() {
    return (<div>
      <Router history={this.props.history}>
        <div>

          {/*<ul>*/}
            {/*<li><Link to="/">Home</Link></li>*/}
            {/*<li><Link to="/login">Login</Link></li>*/}
            {/*<li><Link to="/game">Game</Link></li>*/}
          {/*</ul>*/}

          <Route exact path="/" component={RouteHome}/>
          {/*<Route path="/login" component={RouteLogin}/>*/}
          {/*<Route path="/game" component={RouteGame}/>*/}
        </div>
      </Router>
    </div>);
  }
}

export default App;
// export default connect((state) => ({state}))(App);