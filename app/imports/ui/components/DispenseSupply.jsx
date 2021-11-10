import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DispenseSupply = ({ inventories, addDispense }) => {
  const clickAdd = () => {
    addDispense(inventories._id, 'Supply');
  };

  return (
    <Table.Row>
      <Table.Cell>{inventories.supplyName}</Table.Cell>
      <Table.Cell>{inventories.quantity}</Table.Cell>
      <Table.Cell>{inventories.state}</Table.Cell>
      <Table.Cell>
        <Button color='red' content='Add' onClick={clickAdd}/>
      </Table.Cell>
    </Table.Row>
  );
};

// Require a document to be passed to this component.
DispenseSupply.propTypes = {
  inventories: PropTypes.shape({
    supplyName: String,
    quantity: Number,
    sourceName: String,
    acquire: String,
    cost: Number,
    receiveDate: Date,
    state: String,
    _id: PropTypes.string,
  }).isRequired,
  addDispense: PropTypes.func,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DispenseSupply);
