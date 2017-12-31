import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Skills from '../../../api/Skills/Skills';
import UserSkillEditor from '../../components/UserSkillEditor/UserSkillEditor';

const NewUserSkill = ({ skills, history }) => (
  <div className="NewUserSkill">
    <h4 className="page-header">New UserSkill</h4>
    <UserSkillEditor history={history} skills={skills} />
  </div>
);

NewUserSkill.propTypes = {
  history: PropTypes.object.isRequired,
  skills: PropTypes.object,
};

export default withTracker(({ skills }) => {
  const skillsSubscription = Meteor.subscribe('skills');

  return {
    loading: !skillsSubscription.ready(),
    skills: Skills.find()
  };
})(NewUserSkill);

// export default NewUserSkill;
