import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Skills from '../../../api/Skills/Skills';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (skillId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('skills.remove', skillId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Skill deleted!', 'success');
        history.push('/skills');
      }
    });
  }
};

const renderSkill = (doc, match, history) => (doc ? (
  <div className="ViewSkill">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.name }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.description }
  </div>
) : <NotFound />);

const ViewSkill = ({
  loading, doc, match, history,
}) => (
  !loading ? renderSkill(doc, match, history) : <Loading />
);

ViewSkill.defaultProps = {
  doc: null,
};

ViewSkill.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const skillId = match.params._id;
  const subscription = Meteor.subscribe('skills.view', skillId);

  return {
    loading: !subscription.ready(),
    doc: Skills.findOne(skillId),
  };
})(ViewSkill);
