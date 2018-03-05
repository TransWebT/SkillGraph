import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import UserSkills from '../../../api/UserSkills/UserSkills';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (userSkillId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('userSkills.remove', userSkillId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('UserSkill deleted!', 'success');
        history.push('/userSkills');
      }
    });
  }
};

const renderUserSkill = (doc, match, history) => (doc ? (
  <div className="ViewUserSkill">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.skillName() }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewUserSkill = ({
  loading, doc, match, history,
}) => (
  !loading ? renderUserSkill(doc, match, history) : <Loading />
);

ViewUserSkill.defaultProps = {
  doc: null,
};

ViewUserSkill.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const userSkillId = match.params._id;
  const subscription = Meteor.subscribe('userSkills.view', userSkillId);

  return {
    loading: !subscription.ready(),
    doc: UserSkills.findOne(userSkillId),
  };
})(ViewUserSkill);
