import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx. */
class StuffItemAdmin extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.stuff.lotNumber}</Table.Cell>
        <Table.Cell>{this.props.stuff.name}</Table.Cell>
        <Table.Cell>{this.props.stuff.type}</Table.Cell>
        <Table.Cell>{this.props.stuff.location}</Table.Cell>
        <Table.Cell>{this.props.stuff.quantity}</Table.Cell>
        <Table.Cell>{this.props.stuff.expirationDate}</Table.Cell>
        <Table.Cell>{this.props.stuff.owner}</Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
StuffItemAdmin.propTypes = {
  stuff: PropTypes.shape({
    lotNumber: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    quantity: PropTypes.number,
    expirationDate: PropTypes.string,
    _id: PropTypes.string,
    owner: PropTypes.string,
  }).isRequired,
};

export default StuffItemAdmin;
