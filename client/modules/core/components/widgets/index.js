import Widget from '/client/modules/widget/containers/widget';
import DraggableWidget from '/client/modules/draggableWidget/components/DraggableWidget.jsx';
import TestWidget from '/client/modules/testWidget/components/TestWidget.jsx';
import EditorWidget from '/client/modules/editorWidget/components/EditorWidget.jsx';
import TodoWidget from '/client/modules/todoWidget/components/App';
import VoteWidget from '/client/modules/voteWidget/components/App';

export default {
  widget: Widget,
  draggable: DraggableWidget,
  editor: EditorWidget,
  test: TestWidget,
  todo: TodoWidget,
  vote: VoteWidget
};
