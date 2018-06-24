import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import UserSkills from '../UserSkills';
import Skills from '../../Skills/Skills';


Meteor.publish('userSkills', function userSkills() {
  return UserSkills.find({ owner: this.userId });
});

// Note: userSkills.view is also used when editing an existing userSkill.
Meteor.publish('userSkills.view', function userSkillsView(userSkillId) {
  check(userSkillId, String);
  return UserSkills.find({ _id: userSkillId, owner: this.userId });
});

Meteor.publish('skills.view', function skillsView(skillId) {
  check(skillId, String);
  return Skills.find({ _id: skillId });
});
