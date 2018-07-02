/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import SkillsCollection from '../Skills/Skills.js';

import { Documents } from '../Documents/Documents';

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

UserSkills.helpers({
  skillName() {
    const skillId = this.skillId;
    const skill = SkillsCollection.findOne(skillId);
    if (skill) return skill.name; else return '';
  },
  ownerFullname() {
    const ownerProfile = Meteor.users.findOne(this.owner).profile;
    return `${ownerProfile.name.first} ${ownerProfile.name.last}`;
  },
});

export const SkillDataPointSchema = new SimpleSchema({
  id: {
    type: String
  },
  evalDate: {
    type: String
  },
  score: {
    type: Number
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
    type: String,
    label: 'Skill',
  },
  skillData: {
      type: Array
  },
  'skillData.$': {
    type: SkillDataPointSchema
  }
});

UserSkills.attachSchema(UserSkills.schema);

export default UserSkills;
