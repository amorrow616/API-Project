import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import GetAllSpots from './components/GetAllSpots';
import GetSpot from './components/GetSpot';
import CreateSpot from './components/CreateSpot';
import ManageSpots from './components/ManageSpots';
import UpdateSpot from './components/UpdateSpot';
import UserBookings from './components/UserBookings';
import * as sessionActions from './store/session';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false); // loaded should be false by default

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch]); // when there is a change in the dispatch, set isLoaded to true
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/spots'>
            <CreateSpot />
          </Route>
          <Route exact path='/spots/current'>
            <ManageSpots />
          </Route>
          <Route exact path='/spots/:spotId/edit'>
            <UpdateSpot />
          </Route>
          <Route exact path='/spots/:spotId'>
            <GetSpot />
          </Route>
          <Route exact path='/bookings/current'>
            <UserBookings />
          </Route>
          <Route exact path='/'>
            <GetAllSpots />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
