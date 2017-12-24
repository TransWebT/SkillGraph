/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Skills = new Mongo.Collection('Skills');

Skills.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Skills.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Skills.schema = new SimpleSchema({
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
  name: {
    type: String,
    label: 'The skill name.',
  },
  description: {
    type: String,
    label: 'A description for the skill.',
  },
  graphColor: {
    type: String,
    label: 'The graph color for this skill.',
  },
});

Skills.attachSchema(Skills.schema);

export default Skills;
