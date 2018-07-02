import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import UserSkillsCollection from '../../../api/UserSkills/UserSkills';
// import SkillsCollection from '../../../api/Skills/Skills';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import './UserSkills.scss';

const data = [
      {date: '2015-11', java: 6},
      {date: '2016-01', java: 8, perl: 3},
      {date: '2016-02', java: 9, perl: 5},
      {date: '2016-03', java: 5, perl: 2},
      {date: '2016-04', java: 1, perl: 8},
      {date: '2016-05', java: 4, perl: 2},
      {date: '2016-06', java: 5, perl: 6},
];

function range(start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}

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
       <XAxis dataKey="date"/>
       <YAxis type="number"  ticks={range(0,10,1)} domain={range(0,10,1)}/>
       <CartesianGrid strokeDasharray="1 1"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="java" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="perl" stroke="#82ca9d" />
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
          {userSkills.map((userSkill) => (
            <tr key={userSkill._id}>
              <td>{userSkill.owner}</td>
              <td>{userSkill.skillName()}</td>
              <td>{timeago(userSkill.updatedAt)}</td>
              <td>{monthDayYearAtTime(userSkill.createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${userSkill._id}`)}
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
  const userSkillsSub = Meteor.subscribe('userSkills');
  const skillsSub = Meteor.subscribe('skills');
  return {
    loading: !(userSkillsSub.ready() && skillsSub.ready()),
    userSkills: UserSkillsCollection.find().fetch(),
  };
})(UserSkills);
