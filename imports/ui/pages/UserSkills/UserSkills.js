import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import UserSkillsCollection from '../../../api/UserSkills/UserSkills';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './UserSkills.scss';

const handleRemove = (userSkillId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('userSkills.remove', userSkillId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('UserSkill deleted!', 'success');
      }
    });
  }
};

const UserSkills = ({
  loading, userSkills, match, history,
}) => (!loading ? (
  <div className="UserSkills">
    <div className="page-header clearfix">
      <h4 className="pull-left">UserSkills</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add UserSkill</Link>
    </div>
    {userSkills.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {userSkills.map(({
            _id, title, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{title}</td>
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
      </Table> : <Alert bsStyle="warning">No userSkills yet!</Alert>}
  </div>
) : <Loading />);

UserSkills.propTypes = {
  loading: PropTypes.bool.isRequired,
  userSkills: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('userSkills');
  return {
    loading: !subscription.ready(),
    userSkills: UserSkillsCollection.find().fetch(),
  };
})(UserSkills);
