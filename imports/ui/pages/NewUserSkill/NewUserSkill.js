import React from 'react';
import PropTypes from 'prop-types';
import UserSkillEditor from '../../components/UserSkillEditor/UserSkillEditor';

const NewUserSkill = ({ history }) => (
  <div className="NewUserSkill">
    <h4 className="page-header">New UserSkill</h4>
    <UserSkillEditor history={history} />
  </div>
);

NewUserSkill.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewUserSkill;
