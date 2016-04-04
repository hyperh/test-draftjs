export default {
  edit({Meteor, Collections, FlowRouter}, rawDraftContentState) {
    Meteor.call('edit', {rawDraftContentState});
  }
};
