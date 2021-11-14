import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MedicineSource, quantityState, expState } from '../../api/medSource/MedicineSourceCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const InventoryItem = ({ inventories }) => {
  let status;
  const expStatus = MedicineSource.checkExpStatus(inventories.expDate);
  const quantityStatus = MedicineSource.checkQuantityStatus(inventories.quantity);
  const collectionName = MedicineSource.getCollectionName();
  const updateData = { id: inventories._id, quantityStatus, expStatus };
  updateMethod.callPromise({ collectionName, updateData });

  // if medicine is expired or low quantity, medicine will not show up on Dispense field
  if (inventories.expStatus === expState.expired || inventories.quantityStatus === quantityState.bad) {
    status =
      <Table.Cell style={{ backgroundColor: '#e0b4b4' }}>
        {inventories.expDate.toLocaleDateString()}
      </Table.Cell>;
  } else if (inventories.expStatus === expState.soon || inventories.quantityStatus === quantityState.ok) {
    status =
      <Table.Cell style={{ backgroundColor: '#c9ba9b' }}>
        {inventories.expDate.toLocaleDateString()}
      </Table.Cell>;
  } else {
    status =
      <Table.Cell style={{ backgroundColor: '#a3c293' }}>
        {inventories.expDate.toLocaleDateString()}
      </Table.Cell>;
  }

  return (
    <Table.Row>
      <Table.Cell>{inventories.lotNumber}</Table.Cell>
      <Table.Cell>{inventories.medName}</Table.Cell>
      {status}
      <Table.Cell>{inventories.state}</Table.Cell>
      <Button color='green' content='UPDATE'/>
    </Table.Row>);
};

// Require a document to be passed to this component.
InventoryItem.propTypes = {
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
export default withRouter(InventoryItem);
