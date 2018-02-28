/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const testSkillData = [
    { id: 1, evalDate: '12/1987', score: 5 },
    { id: 2, evalDate: '5/1994', score: 2 },
    { id: 3, evalDate: '9/2012', score: 8 },
    { id: 4, evalDate: '3/2018', score: 6 }
];

function onAfterDeleteRow(rowKeys, rows) {
  alert('The rowkey you drop: ' + rowKeys);
}

const options = {
  afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
};


class UserSkillEditor extends React.Component {
  constructor(props) {
     super(props);
     this.handleChange = this.handleChange.bind(this);
     this.onAfterSaveCell = this.onAfterSaveCell.bind(this);

     this.cellEditProp = {
       mode: 'click',
       blurToSave: true,
       afterSaveCell: this.onAfterSaveCell
     };

     this.selectRowProp = {
       mode: 'checkbox'
     };

     this.state = {
       selectedOption: '',
      };

   }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        skillId: {
          required: true,
        },
        /*
        skillData: {
          required: true,
        },
        */
      },
      messages: {
        skillId: {
          required: 'A skill must be selected to provide scores.',
        },
        /*
        skillData: {
          required: 'At least one data point is required.',
        },
        */
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
  }


   onAfterSaveCell(row, cellName, cellValue) {
    console.log(`Save cell ${cellName} with value ${cellValue}`);
    console.log('The whole row :');
    console.log(row);
  }

  getSkillOptions() {
      const { skills } = this.props;
      const skillNames = skills.map(function(a) {
        return {value: a._id, label: a.name}
      });
      return skillNames;
  }

  handleSubmit() {
    const { history } = this.props;
    const existingUserSkill = this.props.doc && this.props.doc._id;
    const methodToCall = existingUserSkill ? 'userSkills.update' : 'userSkills.insert';
    const doc = {
      skillId: this.state.selectedOption.value.trim(),
      skillData: [
        { evalDate: new Date().toString(), score: 5 },
        { evalDate: new Date().toString(), score: 2 },
        { evalDate: new Date().toString(), score: 8 },
      ],
    };

    if (existingUserSkill) doc._id = existingUserSkill;

    Meteor.call(methodToCall, doc, (error, userSkillId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingUserSkill ? 'UserSkill updated!' : 'UserSkill added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/userSkills/${userSkillId}`);
      }
    });
  }

  invalidJobStatus(cell, row) {
    console.log(`${cell} at row id: ${row.id} fails on editing`);
    return 'invalid-jobstatus-class';
  }

  editingJobStatus(cell, row) {
    console.log(`${cell} at row id: ${row.id} in current editing`);
    return 'editing-jobstatus-class';
  }



  render() {
    const { doc } = this.props;
    const { skills } = this.props;

    // const { selectedOption } = doc.skillId;
  	// const value = selectedOption && selectedOption.value;
    // const value = doc && doc.skillId;
    const value = this.state.selectedOption.value;

    // ToDo: reactive table evalDate field needs to be a selector for MM-YYYY - consider cellEdit example
    //    Date picker candidates:
    //       https://github.com/airbnb/react-dates
    //       https://github.com/Hacker0x01/react-datepicker
    //    Custom field example (note exporting of main class):
    //       https://github.com/AllenFang/react-bootstrap-table/blob/master/examples/js/column-format/react-column-format-table.js
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Select Skill</ControlLabel>
          <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange}
                options={this.getSkillOptions()}
              />
        </FormGroup>

        <FormGroup>
            <ControlLabel>Skill Data for Selected Skill</ControlLabel>
            <BootstrapTable
                data= { testSkillData }
                keyField='id'
                insertRow={ true }
                cellEdit={ this.cellEditProp }
                deleteRow={ true }
                selectRow={ this.selectRowProp }
                options={ options }
            >
                <TableHeaderColumn dataField='id' hidden autoValue>Id</TableHeaderColumn>
                <TableHeaderColumn dataField='evalDate'>Eval Date (MM/YYYY)</TableHeaderColumn>
                <TableHeaderColumn dataField='score'>Score</TableHeaderColumn>
            </BootstrapTable>
        </FormGroup>

        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add UserSkill'}
        </Button>
      </form>
    );
  }
}

UserSkillEditor.defaultProps = {
  doc: { skillId: '', skillData: [] },
};

UserSkillEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default UserSkillEditor;


{/*

    const jobs = [];
    const jobTypes = [ 'A', 'B', 'C', 'D' ];

    function addJobs(quantity) {
      const startId = jobs.length;
      for (let i = 0; i < quantity; i++) {
        const id = startId + i;
        jobs.push({
          id: id,
          status: '200',
          name: 'Item name ' + id,
          type: 'Java',
          active: i % 2 === 0 ? 'Y' : 'N'
        });
      }
    }
    addJobs(5);

    // validator function pass the user input value and should return true|false.
    function jobNameValidator(value) {
      const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
      if (!value) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must be inserted';
        response.notification.title = 'Requested Value';
      } else if (value.length < 10) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Value must have 10+ characters';
        response.notification.title = 'Invalid Value';
      }
      return response;
    }

    function jobStatusValidator(value) {
      const nan = isNaN(parseInt(value, 10));
      if (nan) {
        return 'Job Status must be a integer!';
      }
      return true;
    }

      getSkillNames() {
          const { skills } = this.props;
          const skillNames = skills.map(function(a) {return a.name;});
          return skillNames;
      }


    <BootstrapTable data={ doc } cellEdit={ cellEditProp } insertRow={ true }>
         <TableHeaderColumn dataField='_id' isKey={ true }>User Skill ID</TableHeaderColumn>
         <TableHeaderColumn dataField='status' editable={ { validator: jobStatusValidator } } editColumnClassName={ this.editingJobStatus } invalidEditColumnClassName={ this.invalidJobStatus }>Job Status</TableHeaderColumn>
         <TableHeaderColumn dataField='name' editable={ { type: 'textarea', validator: jobNameValidator } } editColumnClassName='editing-jobsname-class' invalidEditColumnClassName='invalid-jobsname-class'>Job Name</TableHeaderColumn>
         <TableHeaderColumn dataField='type' editable={ { type: 'select', options: { values: this.getSkillNames() } } }>Job Type</TableHeaderColumn>
         <TableHeaderColumn dataField='active' editable={ { type: 'checkbox', options: { values: 'Y:N' } } }>Active</TableHeaderColumn>
</BootstrapTable>
*/}
