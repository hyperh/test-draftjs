import {Mongo} from 'meteor/mongo';

export const Notes = new Mongo.Collection('notes');
export const Locks = new Mongo.Collection('locks');
