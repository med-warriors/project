import React from 'react';
import { Container, Table, Header, Loader, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { SupplySourecs } from '../../api/source/SupplySourceCollection';
import SupplySourceItem from '../components/SupplySourceItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class SupplySource extends React.Component {
  state = {
    search: '',
  }

  onchange = e => {
    this.setState({ search: e.target.value });
  }

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const { search } = this.state;
    const filteredSites = this.props.supplySources.filter(site => (site.name.toLowerCase().indexOf(search.toLowerCase()) !== -1));
    return (
      <Container>
        <Header as="h2" textAlign="center">Supply Source</Header>
        <Input icon="search" placeholder="Search by names..." onChange={this.onchange}/>
        <Table celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan='2'>Name</Table.HeaderCell>
              <Table.HeaderCell colSpan='3'>Contact Information</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Phone Number</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredSites.map((supplySource) => <SupplySourceItem key={supplySource._id} supplysource={ supplySource }/>)}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

// Require an array of Stuff documents in the props.
SupplySource.propTypes = {
  supplySources: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = SupplySourecs.subscribeSupplySource();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort by owner then name
  const supplySources = SupplySourecs.find({}).fetch();
  // console.log(stuffs, ready);
  return {
    supplySources,
    ready,
  };
})(SupplySource);
