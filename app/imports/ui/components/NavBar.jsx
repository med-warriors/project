import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
const NavBar = ({ currentUser }) => {
  const menuStyle = { marginBottom: '10px', backgroundColor: '#25A18E' };
  return (
    <Menu style={menuStyle} attached="top" inverted borderless>
      <Menu.Item id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} activeClassName="" exact to="/">
        <Header inverted as='h1'>MED-Warriors</Header>
      </Menu.Item>
      {currentUser ? (
        [<Dropdown id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN} item text="Information" key="list-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_MEDICINE_AND_SUPPLIES} as={NavLink} activeClassName="active" exact to="/medicine-and-supplies" key='medicine-and-supplies'><Icon name="medkit"/>Medicine And Supplies</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_SUPPLY_SOURCE} as={NavLink} activeClassName="active" exact to="/supply-source" key='supply-source'><Icon name="box"/>Supply Source</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_HISTORY_REPORT} as={NavLink} activeClassName="active" exact to="/history-report" key='history-report'><Icon name="wait"/>History Report</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_PATIENT_INFORMATION} as={NavLink} activeClassName="active" exact to="/patient-info" key='patient-info'><Icon name="user"/>Patient Information</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>,
        <Dropdown id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN} item text="Transaction" key="transaction-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_PRESCRIPTION} as={NavLink} activeClassName="active" exact to="/prescription" key='prescription'>Prescription</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_ADD_MEDICINE} as={NavLink} activeClassName="active" exact to="/add-medicine" key='add-medicine'>Add Medicine</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_ADD_SUPPLIES} as={NavLink} activeClassName="active" exact to="/add-supply" key='add-supply'>Add Supply</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>,
        ]
      ) : ''}
      {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
        [<Dropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} item text="Manage" key="manage-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} exact to="/manage-database" content="Database" />
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} as={NavLink} activeClassName="active" exact to="/ChangeRole/" key='manage-roles'>Change Role</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>]
      ) : ''}
      <Menu.Item position="right">
        {currentUser === '' ? (
          <Dropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} text="Login" pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} icon="user" text="Sign In" as={NavLink} exact to="/signin" />
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} icon="add user" text="Sign Up" as={NavLink} exact to="/signup" />
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Dropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} text={currentUser} pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
              <Dropdown.Item id={COMPONENT_IDS.NAVBAR_VIEW_PROFILE} icon="user" text="View Profile" as={NavLink} exact to="/viewuser" key='viewuser'/>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Menu.Item>
    </Menu>
  );
};

// Declare the types of all properties.
NavBar.propTypes =
{
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return {
    currentUser,
  };
})(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(NavBarContainer);
