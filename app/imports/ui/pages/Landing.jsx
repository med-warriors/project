import React from 'react';
import { Grid, Icon, Header, Image } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <Grid id={PAGE_IDS.LANDING} verticalAlign='middle' textAlign='center' container centered stackable columns={3}>
    <Image className="landing_image" fluid src='http://cdn.cnn.com/cnnnext/dam/assets/201230100452-10-2021-travel-destinations-hawaii.jpg'/>
    <Grid.Column textAlign='center'>
      <Icon name='clipboard' size='huge'/>
      <Header as='h1'>Inventory</Header>
      <Header as='h3'>Inventory information about medications, vaccines, lab/testing supplies, and patient supplies.</Header>
    </Grid.Column>

    <Grid.Column textAlign='center'>
      <Icon name='chart bar' size='huge'/>
      <Header as='h1'>Records</Header>
      <Header as='h3'>Records the history and timeline of adding and removing items from inventory.</Header>
    </Grid.Column>

    <Grid.Column textAlign='center'>
      <Icon name='sticky note' size='huge'/>
      <Header as='h1'>Notes</Header>
      <Header as='h3'>Write a note when prescribing medicine or when adding meds and supplies to the inventory.</Header>
    </Grid.Column>

  </Grid>
);

export default Landing;
