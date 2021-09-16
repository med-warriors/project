import React from 'react';
import { Container, Table, Header, Loader, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import CurrentMedicine from '../components/CurrentMedicine';
import CurrentSupplies from '../components/CurrentSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */
const MedicineAndSupplies = ({ ready, stuffs, dispatch, column, direction }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_STUFF}>
    <Header as="h2" textAlign="center">Medicine and Supplies</Header>
    <Tab panes = {[
      // eslint-disable-next-line react/display-name
      { menuItem: 'Medicine', render: () => <Tab.Pane>
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'lot' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'lot' })}
              >Lot #</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
              >Name</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'type' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'type' })}
              >Type</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'location' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'location' })}
              >Location</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'quantity' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'quantity' })}
              >Quantity</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'expirationdate' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'expirationdate' })}
              >Expiration Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stuffs.map((stuff) => <CurrentMedicine key={stuff._id} stuff={stuff}/>)}
          </Table.Body>
        </Table>
      </Tab.Pane> },
      // eslint-disable-next-line react/display-name
      { menuItem: 'Supplies', render: () => <Tab.Pane>
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
              >Name</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'location' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'location' })}
              >Location</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'quantity' ? direction : null}
                onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'quantity' })}
              >Quantity</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stuffs.map((stuff) => <CurrentSupplies key={stuff._id} stuff={stuff} />)}
          </Table.Body>
        </Table>
      </Tab.Pane> }]}/>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Medicine documents in the props.
MedicineAndSupplies.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  column: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicine and supplies documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Medicine documents and sort them by name.
  const stuffs = Stuffs.find({}, { sort: { name: 1 } }).fetch();
  // Reduce the Medicine documents in sortable table cell.
  const sortReducer = (state, action) => {
    switch (action.type) {
    case 'CHANGE_SORT':
      if (state.column === action.column) {
        //  Reverse the Medicine and supplies documents to according to the column.
        return {
          ...state,
          direction:
              state.direction === 'ascending' ? 'descending' : 'ascending',
        };
      }
      // Sort Medicine and supplies documents to according to the column at increasing order.
      return {
        column: action.column,
        direction: 'ascending',
      };
    default:
      throw new Error();
    }
  };
  // Determine the sorted state of Medicine documents by column and direction.
  const [state, dispatch] = React.useReducer(sortReducer, {
    column: null,
    direction: null,
  });
  const { column, direction } = state;
  return {
    stuffs,
    dispatch,
    column,
    direction,
    ready,
  };
})(MedicineAndSupplies);
