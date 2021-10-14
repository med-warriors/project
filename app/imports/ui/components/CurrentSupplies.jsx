import React from 'react';
import { Table, Button, Modal, Icon, Container, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a single row in the List Supplies table with a Modal pop up. See pages/MedicineandSupplies.jsx. */
const CurrentSupplies = ({ supply }) => {

  const [firstOpen, setFirstOpen] = React.useState(false);
  return (
    <Table.Row>
      <Table.Cell>{supply.name}</Table.Cell>
      <Table.Cell>{supply.location}</Table.Cell>
      <Table.Cell>{supply.quantity}</Table.Cell>
      <Table.Cell>{supply.source}</Table.Cell>
      <Table.Cell>{supply.status}</Table.Cell>
      <Table.Cell>
        <Modal
          onClose={() => setFirstOpen(false)}
          onOpen={() => setFirstOpen(true)}
          open={firstOpen}
          trigger={<Button size='mini' icon='minus' color='grey' />}
          id={COMPONENT_IDS.LIST_SUPPLY_EDIT}
        >
          <Modal.Header>Supply Information</Modal.Header>
          <Modal.Content image>
            <div className='image'></div>
            <Modal.Description>
              <Header as='h3'>{supply.name}</Header>
              <Container id={PAGE_IDS.LIST_MEDICINES}>
                <List size='small'>
                  <List.Item>
                    <List.Header>Name :</List.Header>{supply.name}
                  </List.Item>
                  <List.Item>
                    <List.Header>Location :</List.Header>{supply.location}
                  </List.Item>
                  <List.Item>
                    <List.Header>Quantity :</List.Header>{supply.quantity}
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Source :</List.Header>{supply.source}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Status :</List.Header>{supply.status}
                    </List.Content>
                  </List.Item>
                </List>
              </Container>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button>
              <Link className={COMPONENT_IDS.LIST_SUPPLY_EDIT} to={`/edit/${supply._id}`}>Update<Icon name='exclamation'/></Link>
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
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentSupplies);
