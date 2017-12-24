/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Skills } from '/imports/api/Skills/Skills.js';

const UserSkills = new Mongo.Collection('UserSkills');

UserSkills.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

UserSkills.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

export const SkillDataPointSchema = new SimpleSchema({
    evalDate: {
        type: String
    },
    score: {
        type: String
    }
});

UserSkills.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this document belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this document was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this document was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  skillId: {
    type: Skills.schema,
    label: 'Skill',
  },
  skillData: {
      type: Array
  },
  'skillData.$': {
      type: SkillDataPointSchema,
      label: "Skill Data"
  },
});

UserSkills.attachSchema(UserSkills.schema);

export default UserSkills;
