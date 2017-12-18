import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import SkillsCollection from '../../../api/Skills/Skills';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Skills.scss';

const handleRemove = (skillId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('skills.remove', skillId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Skill deleted!', 'success');
      }
    });
  }
};

const Skills = ({
  loading, skills, match, history,
}) => (!loading ? (
  <div className="Skills">
    <div className="page-header clearfix">
      <h4 className="pull-left">Skills</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Skill</Link>
    </div>
    {skills.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Description</th>
            <th>Graph Color</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {skills.map(({
            _id, name, description, graphColor, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{description}</td>
              <td>{graphColor}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${_id}`)}
                  block
                >
                  View
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id)}
                  block
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert bsStyle="warning">No skills yet!</Alert>}
  </div>
) : <Loading />);

Skills.propTypes = {
  loading: PropTypes.bool.isRequired,
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('skills');
  return {
    loading: !subscription.ready(),
    skills: SkillsCollection.find().fetch(),
  };
})(Skills);
