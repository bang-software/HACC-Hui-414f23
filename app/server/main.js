import '../imports/startup/server';
import '../imports/api/base';
import '../imports/api/challenge';
import '../imports/api/hacc-hui';
import '../imports/api/interest';
import '../imports/api/level';
import '../imports/api/role';
import '../imports/api/skill';
import '../imports/api/slackbot';
import '../imports/api/slug';
import '../imports/api/team';
import '../imports/api/tool';
import '../imports/api/user';
import '../imports/api/suggestions';

import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { check } from 'meteor/check';
import { Challenges } from '../imports/api/challenge/ChallengeCollection';
import { Skills } from '../imports/api/skill/SkillCollection';
import { Tools } from '../imports/api/tool/ToolCollection';
import { Users } from '../imports/api/user/UserCollection';
import { Teams } from '../imports/api/team/TeamCollection';
import {Participants} from "../imports/api/user/ParticipantCollection";

function getCollectionByName(name) {
    // Mapping of collection names to their corresponding collection instances
    const collections = {
        Challenges: Challenges,
        Skills: Skills,
        Tools: Tools,
        Users: Users,
        Teams: Teams,
        Participants: Participants,
    };

    return collections[name];
}

Meteor.methods({
    'BaseCollection.removeAll'(collectionName) {
        check(collectionName, String);

        // Get the collection instance
        const collection = getCollectionByName(collectionName);
        if (collection) {
            return collection.removeAll();
        }
            throw new Meteor.Error('not-found', 'Collection not found');
    },
});
