import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Skills from './Skills';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'skills.insert': function skillsInsert(doc) {
    check(doc, {
      name: String,
      description: String,
      graphColor: String
    });

    try {
      return Skills.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'skills.update': function skillsUpdate(doc) {
    check(doc, {
      _id: String,
      name: String,
      description: String,
      graphColor: String
    });

    try {
      const skillId = doc._id;
      Skills.update(skillId, { $set: doc });
      return skillId; // Return _id so we can redirect to skill after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'skills.remove': function skillsRemove(skillId) {
    check(skillId, String);

    try {
      return Skills.remove(skillId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'skills.insert',
    'skills.update',
    'skills.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
