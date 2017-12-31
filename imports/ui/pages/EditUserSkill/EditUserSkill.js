import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Skills from '../../../api/Skills/Skills';
import UserSkills from '../../../api/UserSkills/UserSkills';
import UserSkillEditor from '../../components/UserSkillEditor/UserSkillEditor';
import NotFound from '../NotFound/NotFound';

const EditUserSkill = ({ doc, skills, history }) => (doc ? (
  <div className="EditUserSkill">
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <UserSkillEditor doc={doc} skills={skills} history={history} />
  </div>
) : <NotFound />);

EditUserSkill.defaultProps = {
  doc: null,
  skills: null
};

EditUserSkill.propTypes = {
  doc: PropTypes.object,
  skills: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const userSkillId = match.params._id;
  const subscription = Meteor.subscribe('userSkills.view', userSkillId);
  const skillsSubscription = Meteor.subscribe('skills');

  return {
    loading: !(subscription.ready() && skillsSubscription.ready()),
    doc: UserSkills.findOne(userSkillId),
    skills: Skills.find()
  };
})(EditUserSkill);
