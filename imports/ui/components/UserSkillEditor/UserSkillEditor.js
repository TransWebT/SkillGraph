/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
// import MaskedInput from 'react-text-mask';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Cleave from 'cleave.js/react';
import moment from 'moment';

function onAfterDeleteRow(rowKeys, rows) {
  console.log('The rowkey you drop: ' + rowKeys);
}

const options = {
  afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
};

const evalDateFormatTemplate = 'YYYY-MM';

// validator function pass the user input value and row object. In addition, a bool return value is expected
function evalDateValidator(value, row) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!moment(value, evalDateFormatTemplate, true).isValid()) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Eval Date must be in the format ' + evalDateFormatTemplate;
    response.notification.title = 'Invalid Value';
  }
  return response;
}

class EvalDateEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onUpdateField = this.onUpdateField.bind(this);
    this.state = { evalDate: props.defaultValue };
  }
  focus() {
  }

  onUpdateField(event) {
    this.props.onUpdate( event.target.value );
  }

  render() {
    return (
        <Cleave placeholder={evalDateFormatTemplate}
                options={{date: true, delimiter: '-', datePattern: ['Y', 'm']}}
                onBlur={this.onUpdateField.bind(this)} />
    );
  }
}

/* ToDo: change this to an evalDateFormatter */
// const evalDateFormatter = (cell, row) => (<span>{ (cell || []).join(',') }</span>);
const createEvalDateEditor = (onUpdate, props) => (<EvalDateEditor onUpdate={ onUpdate } {...props}/>);


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

    this.testSkillData = [
          { id: 1, evalDate: '1987-12', score: 5 },
          { id: 2, evalDate: '1994-05', score: 2 },
          { id: 3, evalDate: '2012-03', score: 8 },
          { id: 4, evalDate: '2018-01', score: 6 }
      ];
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

  onDateChange(event) {
        // formatted pretty value
        console.log(event.target.value);

        // raw value
        console.log(event.target.rawValue);
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
console.log(this.refs.table.store.data);
console.log(existingUserSkill);
    const doc = {
      skillId: this.state.selectedOption.value.trim(),
      skillData: this.refs.table.store.data
      /*
      skillData: [
        { evalDate: new Date().toString(), score: 5 },
        { evalDate: new Date().toString(), score: 2 },
        { evalDate: new Date().toString(), score: 8 },
      ],
      */
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

    // ToDo: reactive table evalDate field needs to be a selector for YYYY/MM - consider cellEdit example
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
                ref='table'
                exportCSV
                keyField='id'
                insertRow={ true }
                cellEdit={ this.cellEditProp }
                deleteRow={ true }
                selectRow={ this.selectRowProp }
                options={ options }
            >
                <TableHeaderColumn dataField='id' hidden autoValue>Id</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='evalDate'
                    customEditor={ { getElement: createEvalDateEditor } }
                    editable={ { validator: evalDateValidator } }
                >Eval Date {evalDateFormatTemplate}</TableHeaderColumn>
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

/*
// this goes in the BootstrapTable getElement
data= { this.testSkillData  }

<FormGroup> Date:
<Cleave placeholder={evalDateFormatTemplate}
                options={{date: true, datePattern: ['Y', 'm']}}
                onChange={this.onDateChange.bind(this)} />
</FormGroup>

*/

UserSkillEditor.defaultProps = {
  doc: { skillId: '', skillData: [] },
};

UserSkillEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default UserSkillEditor;
