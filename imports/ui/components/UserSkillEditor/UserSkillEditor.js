/* eslint-disable max-len, no-return-assign */

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import '../../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


//const PropTypes = require('prop-types');
// next line is only required until ron-react-autocomplete is rebuilt and republished
PropTypes.component = PropTypes.element;
require('react').PropTypes = PropTypes;
require('react').createClass = require('create-react-class');
import ReactDataGrid from 'react-data-grid';
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;

import { Editors, Formatters} from 'react-data-grid-addons';
const { DropDownFormatter } = Formatters;

// import update from 'immutability-helper';
// options for priorities autocomplete editor
const priorities = [{ id: 0, title: 'Critical' }, { id: 1, title: 'High' }, { id: 2, title: 'Medium' }, { id: 3, title: 'Low'} ];
const PrioritiesEditor = <AutoCompleteEditor options={priorities} />;


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


class UserSkillEditor extends React.Component {
  constructor(props) {
     super(props);
     this.handleChange = this.handleChange.bind(this);
     this.rowGetter = this.rowGetter.bind(this);
     this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);

     const cellEditProp = {
       mode: 'click',
       blurToSave: true
     };

     this._columns = [
        {
          key: 'id',
          name: 'ID',
          width: 80
        },
        {
          key: 'task',
          name: 'Title',
          editable: true
        },
        {
          key: 'priority',
          name: 'Priority',
          editor: PrioritiesEditor
        },
        {
          key: 'issueType',
          name: 'Issue Type',
          editor: IssueTypesEditor,
          formatter: IssueTypesFormatter
        }
      ];

     this.createRows();
     this.state = {
       selectedOption: '',
       rows: this.createRows(1000)
      };

   }

   // these funcs for ReactDataGrid
   createRows(numberOfRows) {
       let rows = [];
       for (let i = 1; i < numberOfRows; i++) {
         rows.push({
           id: i,
           task: 'Task ' + i,
           priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
           issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
         });
       }

       return rows;
     }

     rowGetter(i) {
       return this.state.rows[i];
     }

    handleGridRowsUpdated({ fromRow, toRow, updated })
    {
        let rows = this.state.rows.slice();

        for (let i = fromRow; i <= toRow; i++) {
          let rowToUpdate = rows[i];
          let updatedRow = update(rowToUpdate, {$merge: updated});
          rows[i] = updatedRow;
        }

        this.setState({ rows });
    };



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

  getSkillNames() {
      const { skills } = this.props;
      const skillNames = skills.map(function(a) {return a.name;});
      return skillNames;
  }

  getSkillDataPointColumns() {
    return [
      {
        dataField: "evalDate",
        text: "Eval Date",
        editable: true
      },
      {
        dataField: "score",
        text: "Score (1 - 10)",
        editable: true
      }
    ];
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

    // ToDo: in JS debugger, find value of this.cellEditProp within return().
    // ToDo: reactive table needs prop for adding new rows.
    // ToDo: reactive table evalDate field needs to be a selector for YYYY-MM
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      {/*
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="title"
            ref={title => (this.title = title)}
            defaultValue={doc && doc.title}
            placeholder="Oh, The Places You'll Go!"
          />
        </FormGroup>
        */}

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange}
                options={this.getSkillOptions()}
              />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <BootstrapTable
            keyField = "_id"
            data={ doc.skillData }
            columns={ this.getSkillDataPointColumns() }
            cellEdit={ cellEditFactory(this.cellEditProp) }
            insertRow={ true } />
        </FormGroup>


        <FormGroup>
        <ReactDataGrid
            enableCellSelect={true}
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={500}
            onGridRowsUpdated={this.handleGridRowsUpdated} />
        </FormGroup>


        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add UserSkill'}
        </Button>
      </form>
    );
  }
}

UserSkillEditor.defaultProps = {
  // doc: { skillId: ''},
  doc: { skillId: '', skillData: [] },
};

UserSkillEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default UserSkillEditor;


{/*
  // replace jobs below with userSkills - an array of userSkill rows
    <BootstrapTable data={ doc } cellEdit={ cellEditProp } insertRow={ true }>
         <TableHeaderColumn dataField='_id' isKey={ true }>User Skill ID</TableHeaderColumn>
         <TableHeaderColumn dataField='status' editable={ { validator: jobStatusValidator } } editColumnClassName={ this.editingJobStatus } invalidEditColumnClassName={ this.invalidJobStatus }>Job Status</TableHeaderColumn>
         <TableHeaderColumn dataField='name' editable={ { type: 'textarea', validator: jobNameValidator } } editColumnClassName='editing-jobsname-class' invalidEditColumnClassName='invalid-jobsname-class'>Job Name</TableHeaderColumn>
         <TableHeaderColumn dataField='type' editable={ { type: 'select', options: { values: this.getSkillNames() } } }>Job Type</TableHeaderColumn>
         <TableHeaderColumn dataField='active' editable={ { type: 'checkbox', options: { values: 'Y:N' } } }>Active</TableHeaderColumn>
</BootstrapTable>

    <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          ref={title => (this.title = title)}
          defaultValue={doc && doc.title}
          placeholder="Oh, The Places You'll Go!"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Body</ControlLabel>
        <textarea
          className="form-control"
          name="body"
          ref={body => (this.body = body)}
          defaultValue={doc && doc.body}
          placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        {doc && doc._id ? 'Save Changes' : 'Add UserSkill'}
      </Button>
    </form>
*/}
