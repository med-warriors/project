import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, BoolField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { ROLE } from '../../api/role/Role';

const formSchema = new SimpleSchema({
  userEmail: String,
  doctor: { type: Boolean, defaultValue: false },
  student: { type: Boolean, defaultValue: false },
  admin: { type: Boolean, defaultValue: false },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const ChangeRole = (propTypes) => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { doctor, student, admin, userEmail } = data;
    const user1 = propTypes.users.find(user => user.username === userEmail);
    if ((doctor === false && student === false && admin === false)) {
      swal('Error', 'Did not pick a role to change to', 'error');
    } else if (doctor === true && student === true) {
      swal('Error', 'Student cannot be doctor', 'error');
    } else if (user1) {
      if (doctor === true && student === false && admin === false) {
        Meteor.call('changeRoles', user1._id, ROLE.DOCTOR);
        formRef.reset();
      } else if (doctor === false && student === true && admin === false) {
        Meteor.call('changeRoles', user1._id, ROLE.USER);
        formRef.reset();
      } else if (doctor === false && student === false && admin === true) {
        Meteor.call('changeRoles', user1._id, ROLE.ADMIN);
        formRef.reset();
      } else if (doctor === true && student === false && admin === true) {
        Meteor.call('changeRoles2', user1._id, ROLE.DOCTOR, ROLE.ADMIN);
        formRef.reset();
      } else if (doctor === false && student === true && admin === true) {
        Meteor.call('changeRoles2', user1._id, ROLE.USER, ROLE.ADMIN);
        formRef.reset();
      }
      swal('Success', 'Role Updated successfully', 'success');
      formRef.reset();
    } else {
      swal('Error', 'Role NOT Updated successfully', 'error');
    }
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  const changeRolePage = { paddingTop: '15px', paddingBottom: '20px' };
  return (
    <Grid container centered style={changeRolePage} id='editrole-page'>
      <Grid.Column>
        <Header as="h2" textAlign="center">Change Role</Header>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)} >
          <Segment>
            <TextField label='User&apos;s Email' name='userEmail'/>
            <Header as="h4" textAlign="center">Roles (Pick at least one)</Header>
            <BoolField name="doctor"/>
            <BoolField name="student"/>
            <BoolField name="admin"/>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

/** Require the presence of a user document in the props object. Uniforms adds 'model' to the props, which we use. */
ChangeRole.propTypes = {
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('adminPermission');
  return {
    users: Meteor.users.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ChangeRole);
