const loadFeed = (feedComponents, nodeName) =>
  feedComponents.forEach(component => {
    nodeName.appendChild(component);
  });

const filterFeed = (records, tag, feedNode, feedCategoryLabel) => {
  const components = [];
  feedNode.innerHTML = '';
  if (tag === 'all') {
    loadFeed(records, feedNode);

    return tag;
  }
  records.forEach(recordComponent => {
    if (recordComponent.classList.contains(`${tag}`)) {
      components.push(recordComponent);
    }
  });
  if (components.length > 0) {
    components.forEach(component => feedNode.appendChild(component));
  } else feedCategoryLabel.textContent = 'No Records found';

  return tag;
};

const spawnElement = (tagName = '', attrs = {}) => {
  const element = document.createElement(tagName);
  Object.keys(attrs).forEach(attr =>
    element.setAttribute(`${attr}`, attrs[attr])
  );
  return element;
};
