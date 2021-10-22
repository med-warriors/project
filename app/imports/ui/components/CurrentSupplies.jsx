import React from 'react';
import { Table, Button, Modal, Icon, Container, Header, List, Segment, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PAGE_IDS } from '../utilities/PageIDs';

// Changes text to red, yellow, or green, based on quantity of supplies
const getColor = (quantity) => {
  if (quantity >= 20) return '#25A18E';
  if (quantity > 10 && quantity < 20) return '#A18E25';
  return '#A12358';
};

/** Renders a single row in the List Supplies table. See pages/MedicineandSupplies.jsx. */
const CurrentSupplies = ({ supply }) => {
  const [firstOpen, setFirstOpen] = React.useState(false);
  return (
    <Table.Row>
      <Table.Cell>{supply.name}</Table.Cell>
      <Table.Cell>{supply.location}</Table.Cell>
      <Table.Cell style={{ color: getColor(supply.quantity) }}>{supply.quantity}</Table.Cell>
      <Table.Cell>{supply.source}</Table.Cell>
      <Table.Cell>
        <Modal
          onClose={() => setFirstOpen(false)}
          onOpen={() => setFirstOpen(true)}
          open={firstOpen}
          trigger={<Button size='mini' icon='minus' color='grey'/>}
          id={COMPONENT_IDS.LIST_SUPPLY_EDIT}>
          <Modal.Header>Supply Information</Modal.Header>
          <Modal.Content image>
            <Container id={PAGE_IDS.LIST_MEDICINES}>
              <Segment><Modal.Description>
                <List size='small'>
                  <List.Item>
                    <Label id="information-label"> Name </Label>
                  </List.Item>
                  <List.Item>
                    {supply.name}
                  </List.Item>
                  <List.Item>
                    <Label id="information-label"> Location </Label>
                  </List.Item>
                  <List.Item>
                    {supply.location}
                  </List.Item>
                  <List.Item>
                    <Label id="information-label"> Quantity </Label>
                  </List.Item>
                  <List.Item>
                    {supply.quantity}
                  </List.Item>
                  <List.Item>
                    <Label id="information-label"> Source </Label>
                  </List.Item>
                  <List.Item>
                    {supply.source}
                  </List.Item>
                </List>
              </Modal.Description></Segment>

              <Segment><Modal.Description>
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
              </Modal.Description></Segment>
            </Container>
          </Modal.Content>
          <Modal.Actions>
            <Button id="update-button">
              <Link className={COMPONENT_IDS.LIST_SUPPLY_EDIT} to={`/edit-sup/${supply._id}`}>Update<Icon name='angle right'/></Link>
            </Button>
          </Modal.Actions>
        </Modal>
      </Table.Cell>
    </Table.Row>
  );
};

// Require a document to be passed to this component.
CurrentSupplies.propTypes = {
  supply: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    location: PropTypes.string,
    source: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentSupplies);
