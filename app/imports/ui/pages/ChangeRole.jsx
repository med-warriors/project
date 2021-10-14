import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

const options = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Students', value: 'USER' },
  { label: 'Doctor', value: 'DOCTOR' },
];

const formSchema = new SimpleSchema({
  userEmail: String,
  role: {
    type: String,
    allowedValues: ['ADMIN', 'USER', 'DOCTOR'],
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const ChangeRole = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { role, userEmail } = data;
    if (this.props.users.find(user => user.email === userEmail)) {
      const user1 = this.props.users.find(user => user.email === userEmail);
      Meteor.call('changeRoles', user1._id, role);
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
            <TextField name='userEmail'/>
            <SelectField name="role" options={options} />
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
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
