import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DispenseMedicine = ({ inventories, addDispense }) => {
  const clickAdd = () => {
    addDispense(inventories._id, 'Medicine');
  };

  let highlight;

  // if medicine is expired or no quantity, medicine will not show up on Dispense field
  if (inventories.quantity <= 10 || inventories.quantity === 0 || inventories.quantity === undefined) {
    // highlights in red when quantity is between 0 and 10 or undefined
    highlight = 'error';
  } else if (inventories.quantity <= 50 && inventories.quantity > 10) {
    // highlights in yellow when quantity is between 11 and 50
    highlight = 'warning';
  } else {
    // highlights in green when overall quantity of medicine is good (over 50)
    highlight = 'positive';
  }

  return (
    <Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
      <Table.Cell>{inventories.lotNumber}</Table.Cell>
      <Table.Cell>{inventories.medName}</Table.Cell>
      <Table.Cell>{inventories.quantity}</Table.Cell>
      <Table.Cell>{inventories.expDate.toDateString()}</Table.Cell>
      <Table.Cell>{inventories.state}</Table.Cell>
      <Table.Cell>
        <Button color='red' content='Add' onClick={clickAdd} id={COMPONENT_IDS.DISPENSE_ADD}/>
      </Table.Cell>
    </Table.Row>
  );
};

// Require a document to be passed to this component.
DispenseMedicine.propTypes = {
  inventories: PropTypes.shape({
    lotNumber: PropTypes.string,
    medName: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    expDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  addDispense: PropTypes.func,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DispenseMedicine);
