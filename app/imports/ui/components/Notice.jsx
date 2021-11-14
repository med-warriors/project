import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Loader, Modal, ItemDescription } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MedicineSource, quantityState, expState } from '../../api/medSource/MedicineSourceCollection';
import InventoryItem from './MedicineItem';

const Notice = ({ ready, warning, medicine }) => {
  let note;
  const [open, setOpen] = React.useState(false);

  // Displays different note based on expiration status
  if (warning.expStatus === expState.expired) {
    note =
      <ItemDescription>
        Expiration date: {medicine.expDate}
        This item has already been expired.
      </ItemDescription>;
  } else if (warning.expStatus === expState.soon) {
    note =
      <ItemDescription>
        Expiration date: {medicine.expDate}
        This item will expire within...
      </ItemDescription>;
  } else {
    note = <ItemDescription>Expiration date: {medicine.expDate}</ItemDescription>;
  }

  return ((ready) ? (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size={'large'}
      trigger={<Button color='yellow'>NOTICE</Button>}
    >
      <Modal.Header>{medicine.name}</Modal.Header>
      <ItemDescription>
        {warning.map((inventories) => <MedicineItem key={inventories._id} inventories={inventories}/>)}
      </ItemDescription>
      {note}
    </Modal>
  ) : <Loader active>Getting data</Loader>);
};

Notice.propTypes = {
  medicine: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    should_have: PropTypes.number,
    expDate: PropTypes.instanceOf(Date),
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  warning: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

const NoticeContainer = withTracker(() => {
  // Provides access to Medicine Source documents
  const subscription = MedicineSource.subscribeMedicineSource();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Provides the Medicine Source documents and sorts them by name.
  const warning = MedicineSource.find({
    quantityStatus: { $in: [quantityState.bad, quantityState.ok] },
    expirationStatus: { $in: [expState.expired, expState.soon] },
  }).fetch().reverse();
  return {
    warning,
    ready,
  };
})(Notice);

export default withRouter(NoticeContainer);
