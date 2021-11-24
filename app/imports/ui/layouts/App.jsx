import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import ListStuff from '../pages/ListStuff';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddStuff from '../pages/AddStuff';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import MedicineAndSupplies from '../pages/MedicineAndSupplies';
import PatientInformation from '../pages/PatientInformation';
import UserProfile from '../pages/UserProfile';
import ManageDatabase from '../pages/ManageDatabase';
import Dispense from '../pages/Dispense';
import AddMedicine from '../pages/AddMedicine';
import AddSupply from '../pages/AddSupply';
import { ROLE } from '../../api/role/Role';
import EditProfile from '../pages/EditProfile';
import EditSupply from '../pages/EditSupply';
import EditMedicine from '../pages/EditMedicine';
import ChangeRole from '../pages/ChangeRole';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Landing}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signout" component={Signout}/>
            <ProtectedRoute path="/editprof" component={EditProfile}/>
            <ProtectedRoute path="/viewuser" component={UserProfile}/>
            <ProtectedRoute path="/list" component={ListStuff}/>
            <ProtectedRoute path="/add" component={AddStuff}/>
            <ProtectedRoute path="/update-sup/:_id" component={EditSupply}/>
            <ProtectedRoute path="/medicine-and-supplies" component={MedicineAndSupplies}/>
            <ProtectedRoute path="/add-new-medicine" component={AddMedicine}/>
            <ProtectedRoute path="/add-new-supply" component={AddSupply}/>
            <ProtectedRoute path="/patient-info" component={PatientInformation}/>
            <DoctorProtectedRoute path="/dispense" component={Dispense}/>
            <ProtectedRoute path="/edit/:_id" component={EditMedicine}/>
            <AdminProtectedRoute path="/admin" component={ListStuffAdmin}/>
            <AdminProtectedRoute path="/manage-database" component={ManageDatabase}/>
            <AdminProtectedRoute path="/ChangeRole/" component={ChangeRole}/>
            <Route component={NotFound}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const DoctorProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isDoctor = Roles.userIsInRole(Meteor.userId(), ROLE.DOCTOR);
      return (isLogged && isDoctor) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
DoctorProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;
