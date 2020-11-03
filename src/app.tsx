import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './component/home';
import Play from './component/play';
import Json from './component/json';

function App() {
  return (
    <div className="app">
      <Navbar bg="dark" variant="dark" className="mr-auto">
        <Navbar.Brand href={process.env.PUBLIC_URL}>言えるかな?</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="https://github.com/ecto0310/can_you_say">ソースコード</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/:id' component={Play} />
          <Route exact path='/:id/json' component={Json} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
