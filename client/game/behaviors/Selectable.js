function Selectable(entity) {
  function onSelect() {
    entity.emit('selected')
  }

  function onDeselect() {
    entity.emit('selected')
  }

  entity.on('click', onSelect);
}

Selectable.EVENT_SELECTED = 'EVENT_SELECTED';
Selectable.EVENT_DESELECTED = 'EVENT_DESELECTED';

export default Selectable;