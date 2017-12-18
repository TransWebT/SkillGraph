/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class SkillEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        description: {
          required: false,
        },
        graphColor: {
          required: false
        }
      },
      messages: {
        name: {
          required: 'A name for the skill is required.',
        },
        graphColor: {
          required: 'A color for the graph of this skill should be provided.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingSkill = this.props.doc && this.props.doc._id;
    const methodToCall = existingSkill ? 'skills.update' : 'skills.insert';
    const doc = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      graphColor: this.graphColor.value.trim()
    };

    if (existingSkill) doc._id = existingSkill;

    Meteor.call(methodToCall, doc, (error, skillId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingSkill ? 'Skill updated!' : 'Skill added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/skills/${skillId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Skill Name</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="name"
            ref={name => (this.name = name)}
            defaultValue={doc && doc.name}
            placeholder="Skill name?"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <textarea
            className="form-control"
            name="description"
            ref={description => (this.description = description)}
            defaultValue={doc && doc.description}
            placeholder="What is that skill all about?"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Graph Color</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="graphColor"
            ref={graphColor => (this.graphColor = graphColor)}
            defaultValue={doc && doc.graphColor}
            placeholder="What color would you like to use for this skill?"
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add Skill'}
        </Button>
      </form>
    );
  }
}

SkillEditor.defaultProps = {
  doc: { name: '', description: '', graphColor: '#777777' },
};

SkillEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default SkillEditor;
