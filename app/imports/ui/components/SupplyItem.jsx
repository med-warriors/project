import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const SupplyItem = ({ inventories }) => (
  <Table.Row>
    <Table.Cell>{inventories.supplyName}</Table.Cell>
    <Table.Cell>{inventories.quantity}</Table.Cell>
    <Table.Cell>{inventories.state}</Table.Cell>
    <Button color='green' content= 'UPDATE'/>
  </Table.Row>
);

// Require a document to be passed to this component.
SupplyItem.propTypes = {
  inventories: PropTypes.shape({
    supplyName: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(SupplyItem);
