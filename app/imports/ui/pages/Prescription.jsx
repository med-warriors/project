import React from 'react';
import { Grid, Header, Button, Form } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders the Page for adding a document. */

const Prescription = () => (
  <Grid id={PAGE_IDS.PRESCRIPTION} container centered stackable>
    <Grid.Column>
      <Header as="h2" textAlign="center">Prescription</Header>
      <Form>
        <Form.Field>
          <label>Lot</label>
          <input placeholder='Lot' />
        </Form.Field>
        <Form.Field>
          <label>Medicine Name</label>
          <input placeholder='Medicine Name' />
        </Form.Field>
        <Form.Field>
          <label>Patient Name</label>
          <input placeholder='Patient Name' />
        </Form.Field>
        <Form.Field>
          <label>Quantity</label>
          <input placeholder='Quantity' />
        </Form.Field>
        <Form.Field>
          <label>Detail</label>
          <input placeholder='Detail' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </Grid.Column>
  </Grid>
);

export default Prescription;
