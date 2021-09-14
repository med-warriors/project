import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
class CurrentMedicine extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.stuff.lotNumber}</Table.Cell>
        <Table.Cell>{this.props.stuff.name}</Table.Cell>
        <Table.Cell>{this.props.stuff.type}</Table.Cell>
        <Table.Cell>{this.props.stuff.location}</Table.Cell>
        <Table.Cell>{this.props.stuff.quantity}</Table.Cell>
        <Table.Cell>{this.props.stuff.expirationDate}</Table.Cell>
        <Table.Cell>
          <Link to={`/edit/${this.props.stuff._id}`}>Edit</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
CurrentMedicine.propTypes = {
  stuff: PropTypes.shape({
    lotNumber: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    quantity: PropTypes.number,
    expirationDate: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentMedicine);
