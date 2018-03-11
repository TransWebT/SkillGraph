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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import './UserSkills.scss';

const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

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

    <div className="UserSkills">
      <LineChart width={600} height={300} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>

    {userSkills.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Person</th>
            <th>Skill</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {userSkills.map(({
            _id, owner, skillId, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{owner}</td>
              <td>{skillId}</td>
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
