import React from 'react';
import { Image, Grid, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Profile table. See pages/ViewProfile.jsx. */
class ProfileItem extends React.Component {
  render() {
    return (

      <Grid id="profile-grid">
        <Grid.Row>
          <Header as='h2' id="welcome-name" icon textAlign='center'>
            <Header.Content> <Header as='h3' block>
              Welcome, {this.props.profile.username}
            </Header></Header.Content>
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5}>
            <Image src={this.props.profile.image} size='large' circular/>
          </Grid.Column>
          <Grid.Column width={8} floated='left'>
            <Header id="profile-name" size={'huge'}>
              {this.props.profile.name}
            </Header>
            <Header id="profile-number" as="h3">
              ID # :{this.props.profile.idnumber}
            </Header>
            <Header id="profile-role" as="h3">
              Affiliations :  {this.props.profile.role}
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

// Require a document to be passed to this component.
ProfileItem.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    idnumber: PropTypes.string,
    role: PropTypes.string,
    image: PropTypes.string,
    owner: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ProfileItem);
