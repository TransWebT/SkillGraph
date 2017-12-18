import React from 'react';
import PropTypes from 'prop-types';
import SkillEditor from '../../components/SkillEditor/SkillEditor';

const NewSkill = ({ history }) => (
  <div className="NewSkill">
    <h4 className="page-header">New Skill</h4>
    <SkillEditor history={history} />
  </div>
);

NewSkill.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewSkill;
