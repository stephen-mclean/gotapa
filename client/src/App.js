import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faLongArrowAltRight, 
  faSpinner, 
  faSync, 
  faExclamationTriangle, 
  faHeart as faSolidHeart,
  faCircle,
  faChevronLeft,
  faInfoCircle,
  faMapPin 
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import styled, { ThemeProvider } from 'styled-components';

import Nav from './components/Nav/Nav';
import PageContainer from './components/platform/PageContainer';
import Home from './components/Home/Home';
import Stop from './components/Stop/Stop';
import Favourites from './components/Favourites/Favourites';
import MapView from './components/MapView/MapView';
import Themes from './utils/ThemeUtil';

const StyledLink = styled(Link)`
  text-decoration: none; 
  color: ${props => props.theme.background};
`;

library.add(faLongArrowAltRight, faSpinner, faSync, faExclamationTriangle, faHeart, 
  faSolidHeart, faCircle, faChevronLeft, faInfoCircle, faMapPin);

class App extends Component {

  render() {
    return (
      <Router>
        <ThemeProvider theme={Themes.main}>
          <div>

            <Nav>
              <StyledLink to="/">GoTapa</StyledLink>
            </Nav>

            <PageContainer>
              <Route exact path="/" component={Home}></Route>
              <Route path="/stops/:stopId" component={Stop}></Route>
              <Route path="/favourites" render={props => <Favourites {...props} displayAll={true} />}></Route>
              <Route path="/map" component={MapView}></Route>
            </PageContainer>
          </div>
        </ThemeProvider>
      </Router>
    );
  }

}

export default App;
