import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MedicineSource, quantityState, expState } from '../../api/medSource/MedicineSourceCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const MedicineItem = ({ inventories }) => {
  let highlight;
  const expStatus = MedicineSource.checkExpStatus(inventories.expDate);
  const quantityStatus = MedicineSource.checkQuantityStatus(inventories.quantity);
  const collectionName = MedicineSource.getCollectionName();
  const updateData = { id: inventories._id, quantityStatus, expStatus };
  updateMethod.callPromise({ collectionName, updateData });

  // if medicine is expired or low quantity, medicine will not show up on Dispense field
  if (inventories.expStatus === expState.expired || inventories.quantityStatus === quantityState.bad) {
    highlight = 'error';
  } else if (inventories.expStatus === expState.soon || inventories.quantityStatus === quantityState.ok) {
    highlight = 'warning';
  } else {
    highlight = 'positive';
  }

  return (
    <Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
      <Table.Cell>{inventories.lotNumber}</Table.Cell>
      <Table.Cell>{inventories.medName}</Table.Cell>
      <Table.Cell>{inventories.quantity}</Table.Cell>
      <Table.Cell>{inventories.expDate.toDateString()}</Table.Cell>
      <Table.Cell>{inventories.state}</Table.Cell>
      <Button color='green' content='UPDATE'/>
    </Table.Row>);
};

// Require a document to be passed to this component.
MedicineItem.propTypes = {
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
    expStatus: PropTypes.string,
    quantityStatus: PropTypes.string,
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(MedicineItem);
