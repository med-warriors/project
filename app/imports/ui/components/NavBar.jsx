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
      {Roles.userIsInRole(Meteor.userId(), [ROLE.GUEST]) ? (
        [<Dropdown id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN} item text="Information" key="list-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_MEDICINE_AND_SUPPLIES} as={NavLink} activeClassName="active" exact to="/medicine-and-supplies2" key='medicine-and-supplies2'><Icon name="medkit"/>Medicine And Supplies</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_RECORD} as={NavLink} activeClassName="active" exact to="/record" key='record'><Icon name="book"/>Record</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>,
        ]
      ) : ''}
      {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.USER]) ? (
        [<Dropdown id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN} item text="Information" key="list-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_LIST_DROPDOWN_MEDICINE_AND_SUPPLIES} as={NavLink} activeClassName="active" exact to="/medicine-and-supplies" key='medicine-and-supplies'><Icon name="medkit"/>Medicine And Supplies</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_RECORD} as={NavLink} activeClassName="active" exact to="/record" key='record'><Icon name="book"/>Record</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>,
        <Dropdown id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN} item text="Transaction" key="transaction-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_DISPENSE} as={NavLink} activeClassName="active" exact to="/dispense" key='dispense'><Icon name="pills"/>Dispense</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_ADD_MEDICINE} as={NavLink} activeClassName="active" exact to="/add-new-medicine" key='add-medicine'><Icon name="plus"/>Add New Medicine</Dropdown.Item>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_TRANSACTION_DROPDOWN_ADD_SUPPLIES} as={NavLink} activeClassName="active" exact to="/add-new-supply" key='add-supply'><Icon name="plus"/>Add New Supply</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>,
        ]
      ) : ''}
      {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
        [<Dropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} item text="Manage" key="manage-dropdown">
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} exact to="/manage-database" content="Database" />
            <Dropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_CHANGE_ROLE} as={NavLink} activeClassName="active" exact to="/ChangeRole/" key='manage-roles'>Change Role</Dropdown.Item>
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
