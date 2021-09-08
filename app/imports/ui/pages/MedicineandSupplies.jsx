import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader, Tab, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/Stuff';
import CurrentMedicineandSupplies from '../components/CurrentMedicineandSupplies';

/** Renders a table containing all of the Medicine documents. Use <MedicineItem> to render each row. */
class ListMedicine extends React.Component {

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the page once subscriptions have been received.
  renderPage() {
    return (
      <Container>
        <Header as="h2" textAlign="center">Medicine and Supplies</Header>
        <Tab panes={[
          { menuItem: 'Medicine', render: () => <Tab.Pane>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell><Button>Lot #</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Name</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Type</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Location</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Quantity</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Expiration Date</Button></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.stuffs.map((stuff) => <CurrentMedicineandSupplies key={stuff._id} stuff={stuff}/>)}
              </Table.Body>
            </Table>
          </Tab.Pane> },
          { menuItem: 'Supplies', render: () => <Tab.Pane>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell><Button>Name</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Location</Button></Table.HeaderCell>
                  <Table.HeaderCell><Button>Quantity</Button></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.stuffs.map((stuff) => <CurrentMedicineandSupplies key={stuff._id} stuff={stuff} />)}
              </Table.Body>
            </Table>
          </Tab.Pane> }]}/>
      </Container>
    );
  }
}

// Require an array of Medicine and Supplies documents in the props.
ListMedicine.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicine documents.
  const subscription = Meteor.subscribe(Stuffs.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Medicine documents
  const stuffs = Stuffs.collection.find({}).fetch();
  return {
    stuffs,
    ready,
  };
})(ListMedicine);
