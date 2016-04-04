import {Mongo} from 'meteor/mongo';

export const EditorStates = new Mongo.Collection('editorStates');
export const RawDraftContentStates = new Mongo.Collection('rawDraftContentState');
