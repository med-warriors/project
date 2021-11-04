import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const SupplySourceItem = ({ supplysource }) => (
  <Table.Row>
    <Table.Cell>{supplysource.name}</Table.Cell>
    <Table.Cell>{supplysource.location}</Table.Cell>
    <Table.Cell>{supplysource.phoneNumber}</Table.Cell>
    <Table.Cell>{supplysource.email}</Table.Cell>
    <Table.Cell>
      <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={`/edit/${supplysource._id}`}>Edit</Link>
    </Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
SupplySourceItem.propTypes = {
  supplysource: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    phoneNumber: PropTypes.number,
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(SupplySourceItem);
