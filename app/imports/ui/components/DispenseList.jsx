import React from 'react';
import { Button, Icon, Dropdown, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DispenseItem = ({ inventories, removeDispense, outDispenseQuantity }) => {
  const quantityOptions = [];
  let type; let lot; let name; let expDate;

  const clickRemove = () => {
    removeDispense(inventories._id);
  };

  const outQuantity = (e, data) => {
    e.preventDefault();
    outDispenseQuantity(inventories._id, data.value);
  };

  for (let i = 1; i <= inventories.quantity; i++) {
    const optionValue = { key: i, value: i, text: i };
    quantityOptions.push(optionValue);
  }

  if (inventories.lotNumber) {
    type = <Icon name="pills"/>;
    lot = inventories.lotNumber;
    name = inventories.medName;
    expDate = inventories.expDate.toDateString();
  } else {
    type = <Icon name='band aid'/>;
    lot = '-';
    name = inventories.supplyName;
    expDate = '-';
  }

  return (
    <Table.Row>
      <Table.Cell>{type}</Table.Cell>
      <Table.Cell>{lot}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{inventories.quantity}</Table.Cell>
      <Table.Cell>{expDate}</Table.Cell>
      <Table.Cell>{inventories.state}</Table.Cell>
      <Table.Cell>
        <Dropdown placeholder='Select quantity' search selection options={quantityOptions} onChange={outQuantity} id={COMPONENT_IDS.DISPENSE_QUANTITY}/>
      </Table.Cell>
      <Table.Cell>
        <Button color='yellow' content='Remove' onClick={clickRemove}/>
      </Table.Cell>
    </Table.Row>
  );
};

// Require a document to be passed to this component.
DispenseItem.propTypes = {
  inventories: PropTypes.shape({
    lotNumber: PropTypes.string,
    supplyName: PropTypes.string,
    medName: PropTypes.string,
    location: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    expDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  removeDispense: PropTypes.func,
  outDispenseQuantity: PropTypes.func,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DispenseItem);
