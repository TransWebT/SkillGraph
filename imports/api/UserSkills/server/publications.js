import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import UserSkills from '../UserSkills';

Meteor.publish('userSkills', function userSkills() {
  return UserSkills.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('userSkills.view', function userSkillsView(userSkillId) {
  check(userSkillId, String);
  return UserSkills.find({ _id: userSkillId, owner: this.userId });
});
