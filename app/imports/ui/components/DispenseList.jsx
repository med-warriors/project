import React from 'react';
import { Button, Input, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DispenseItem = ({ inventories }) => {

  return (
    <Table.Row>
      <Table.Cell>{inventories.lotNumber}</Table.Cell>
      <Table.Cell>{inventories.medName}</Table.Cell>
      <Table.Cell>{inventories.quantity}</Table.Cell>
      <Table.Cell>{inventories.location}</Table.Cell>
      <Table.Cell>{inventories.expDate.toDateString()}</Table.Cell>
      <Table.Cell>{inventories.state}</Table.Cell>
      <Table.Cell>
        <Input placeholder='Dispense quantity'/>
      </Table.Cell>
      <Table.Cell>
        <Button color='yellow' content='Remove'/>
      </Table.Cell>
    </Table.Row>
  );
};

// Require a document to be passed to this component.
DispenseItem.propTypes = {
  inventories: PropTypes.shape({
    lotNumber: PropTypes.string,
    medName: PropTypes.string,
    quantity: PropTypes.number,
    location: PropTypes.string,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    expDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DispenseItem);
