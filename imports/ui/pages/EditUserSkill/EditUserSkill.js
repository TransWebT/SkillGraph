import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import UserSkills from '../../../api/UserSkills/UserSkills';
import UserSkillEditor from '../../components/UserSkillEditor/UserSkillEditor';
import NotFound from '../NotFound/NotFound';

const EditUserSkill = ({ doc, history }) => (doc ? (
  <div className="EditUserSkill">
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <UserSkillEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditUserSkill.defaultProps = {
  doc: null,
};

EditUserSkill.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const userSkillId = match.params._id;
  const subscription = Meteor.subscribe('userSkills.view', userSkillId);

  return {
    loading: !subscription.ready(),
    doc: UserSkills.findOne(userSkillId),
  };
})(EditUserSkill);
