import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const withRouter = (Component) => (props) => (
  <BrowserRouter>
    <Component {...props} />
  </BrowserRouter>
);
