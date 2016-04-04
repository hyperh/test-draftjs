import {Mongo} from 'meteor/mongo';

export const RawDraftContentStates = new Mongo.Collection('rawDraftContentState');
export const Locks = new Mongo.Collection('locks');
