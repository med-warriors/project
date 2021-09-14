import React from 'react';
import { Grid, Icon, Header, Image } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
      <div>
        <Grid container centered stackable columns={3}>
          <Image fluid src='https://gray-khnl-prod.cdn.arcpublishing.com/resizer/wKrMDX6-cwwjWHL8Y1Hi7-IazNs=/980x0/smart/filters:quality(85)/cloudfront-us-east-1.images.arcpublishing.com/gray/XUWXBOR2LJCC3DN2NZTME6QFIY.jpg'/>

          <Grid.Column textAlign='center'>
            <Icon name='clipboard' size='huge'/>
            <Header as='h1'>Inventory</Header>
            <Header as='h3'>Inventory information about medications, vaccine, lab/testing supplies, and patient supplies.</Header>
          </Grid.Column>

          <Grid.Column textAlign='center'>
            <Icon name='chart bar' size='huge'/>
            <Header as='h1'>Reports</Header>
            <Header as='h3'>Generate reports of our usage and when stocks are getting low.</Header>
          </Grid.Column>

          <Grid.Column textAlign='center'>
            <Icon name='barcode' size='huge'/>
            <Header as='h1'>Barcode</Header>
            <Header as='h3'>A barcode for each item so it is easy to inventory.</Header>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

export default Landing;
