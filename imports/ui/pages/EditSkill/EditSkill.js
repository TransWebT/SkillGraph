import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Skills from '../../../api/Skills/Skills';
import SkillEditor from '../../components/SkillEditor/SkillEditor';
import NotFound from '../NotFound/NotFound';

const EditSkill = ({ doc, history }) => (doc ? (
  <div className="EditSkill">
    <h4 className="page-header">{`Editing "${doc.name}"`}</h4>
    <SkillEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditSkill.defaultProps = {
  doc: null,
};

EditSkill.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const skillId = match.params._id;
  const subscription = Meteor.subscribe('skills.view', skillId);

  return {
    loading: !subscription.ready(),
    doc: Skills.findOne(skillId),
  };
})(EditSkill);
