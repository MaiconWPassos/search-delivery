import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import CreateCompany from './pages/CreateCompany';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} exact />
      <Route path="/create-supermarket" component={CreateCompany} exact />
    </BrowserRouter>
  );
};

export default Routes;
