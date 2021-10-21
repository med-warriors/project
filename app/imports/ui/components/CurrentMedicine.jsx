import React from 'react';
import { Button, Container, Divider, Header, Icon, List, Modal, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PAGE_IDS } from '../utilities/PageIDs';

// Changes text to red, yellow, or green, based on quantity of medicine
const getColor = (quantity) => {
  if (quantity >= 50) return '#25A18E';
  if (quantity > 10 && quantity < 50) return '#A18E25';
  return '#A12358';
};

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const CurrentMedicine = ({ medicine }) => {
  let highlight;
  const [firstOpen, setFirstOpen] = React.useState(false);
  if (medicine.quantity < 5) {
    highlight = 'error';
  } else
  if (medicine.quantity < 20) {
    highlight = 'warning';
  }
  return (<Table.Row error={highlight === 'error'} warning={highlight === 'warning'}>
    <Table.Cell>{medicine.lotNumber}</Table.Cell>
    <Table.Cell>{medicine.name}</Table.Cell>
    <Table.Cell>{medicine.type}</Table.Cell>
    <Table.Cell>{medicine.location}</Table.Cell>
    <Table.Cell style={{ color: getColor(medicine.quantity) }}>{medicine.quantity}</Table.Cell>
    <Table.Cell>{medicine.expirationDate.toDateString()}</Table.Cell>
    <Table.Cell>{medicine.source}</Table.Cell>
    <Table.Cell>
      <Modal
        onClose={() => setFirstOpen(false)}
        onOpen={() => setFirstOpen(true)}
        open={firstOpen}
        trigger={<Button size='mini' icon='minus' color='grey'/>}
        id={COMPONENT_IDS.LIST_MEDICINE_EDIT}>
        <Modal.Header>Supply Information</Modal.Header>
        <Modal.Content image>
          <div className='image'></div>
          <Modal.Description>
            <Header as='h3'>{medicine.name}</Header>
            <Container id={PAGE_IDS.LIST_MEDICINES}>
              <List size='small'>
                <List.Item>
                  <List.Header>Name :</List.Header>{medicine.name}
                </List.Item>
                <List.Item>
                  <List.Header>Location :</List.Header>{medicine.location}
                </List.Item>
                <List.Item>
                  <List.Header>Quantity :</List.Header>{medicine.quantity}
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>Source :</List.Header>{medicine.source}
                  </List.Content>
                </List.Item>
              </List>
              <Divider section/>
              <List bulleted>
                <Header as='h5'>Notes <Icon name='sticky note'/></Header>
                <List.Item floated="left">
                  Item must be stored in a room temperature environment.
                </List.Item>
                <List.Item floated="left">
                  Let Staff know before updating inventory using the form.
                </List.Item>
                <List.Item floated="left">
                  Please put extra supplies in bags in the right hand side of the van.
                </List.Item>
              </List>
            </Container>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button>
            <Link className={COMPONENT_IDS.LIST_MEDICINE_EDIT} to={`/edit-med/${medicine._id}`}>Update<Icon name='exclamation'/></Link>
          </Button>
        </Modal.Actions>
      </Modal>
    </Table.Cell>
  </Table.Row>);
};

// Require a document to be passed to this component.
CurrentMedicine.propTypes = {
  medicine: PropTypes.shape({
    lotNumber: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    quantity: PropTypes.number,
    expirationDate: PropTypes.instanceOf(Date),
    source: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentMedicine);
