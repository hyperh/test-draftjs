export default {
  edit({Meteor, Collections, FlowRouter}, editorState) {
    Meteor.call('edit', {editorState});
  }
};
