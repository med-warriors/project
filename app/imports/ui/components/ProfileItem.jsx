import React from 'react';
import { Image, Grid, Header, Label, Segment, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';

class ProfileItem extends React.Component {
  render() {
    return (
      <Grid id="profile-grid">
        <Grid.Row>
          <Grid.Column><Header as='h2' icon textAlign='center'>
            <Header.Content> <Header as='h3' block textAlign='center'>
              Welcome, {this.props.profile.username}
            </Header></Header.Content>
          </Header></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5}>
            <Image src={this.props.profile.image} size='large' circular/>
            <Button id="edit-prof">
              <Button.Content visible as={NavLink} activeClassName="active" exact to="/editprof" key='editprof'>Edit Profile <Icon name='edit' /></Button.Content>
            </Button>
          </Grid.Column>
          <Grid.Column id="profile-info" width={9}>
            <Segment floated='right'>
              <Grid.Row>
                <Header id="profile-name" size={'huge'} textAlign='left'>
                  {this.props.profile.name}
                </Header></Grid.Row>
              <Grid.Row><Header id="profile-number" as="h3" textAlign='left'>
                  ID # : <Label color='black'>{this.props.profile.idnumber}</Label>
              </Header>
              </Grid.Row>
              <Grid.Row><Header id="profile-username" as="h3" textAlign='left'>
                Username : {this.props.profile.username}
              </Header></Grid.Row>
              <Grid.Row><Header id="profile-role" as="h3" textAlign='left'>
                  Affiliations : <Label circular>{this.props.profile.role}</Label>
              </Header></Grid.Row></Segment>
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
