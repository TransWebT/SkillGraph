import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import UserSkills from './UserSkills';
import rateLimit from '../../modules/rate-limit';

// TODO: update this to follow new schema
Meteor.methods({
  'userSkills.insert': function userSkillsInsert(doc) {
    check(doc, {
      title: String,
      body: String,
    });

    try {
      return UserSkills.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'userSkills.update': function userSkillsUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const userSkillId = doc._id;
      UserSkills.update(userSkillId, { $set: doc });
      return userSkillId; // Return _id so we can redirect to userskill after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'userSkills.remove': function userSkillsRemove(userSkillId) {
    check(userSkillId, String);

    try {
      return UserSkills.remove(userSkillId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'userSkills.insert',
    'userSkills.update',
    'userSkills.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
