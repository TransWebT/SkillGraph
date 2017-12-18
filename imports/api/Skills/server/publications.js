import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Skills from '../Skills';

Meteor.publish('skills', function skills() {
  return Skills.find();
});

// Note: skills.view is also used when editing an existing skill.
Meteor.publish('skills.view', function skillsView(skillId) {
  check(skillId, String);
  return Skills.find({ _id: skillId });
});
