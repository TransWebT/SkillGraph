/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class UserSkillEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        body: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        body: {
          required: 'This thneeds a body, please.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingUserSkill = this.props.doc && this.props.doc._id;
    const methodToCall = existingUserSkill ? 'userSkills.update' : 'userSkills.insert';
    const doc = {
      title: this.title.value.trim(),
      body: this.body.value.trim(),
    };

    if (existingUserSkill) doc._id = existingUserSkill;

    Meteor.call(methodToCall, doc, (error, userSkillId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingUserSkill ? 'UserSkill updated!' : 'UserSkill added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/userSkills/${userSkillId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="title"
            ref={title => (this.title = title)}
            defaultValue={doc && doc.title}
            placeholder="Oh, The Places You'll Go!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Body</ControlLabel>
          <textarea
            className="form-control"
            name="body"
            ref={body => (this.body = body)}
            defaultValue={doc && doc.body}
            placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add UserSkill'}
        </Button>
      </form>
    );
  }
}

UserSkillEditor.defaultProps = {
  doc: { title: '', body: '' },
};

UserSkillEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default UserSkillEditor;
