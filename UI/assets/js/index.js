const recordList = document.querySelector('.record-list');
const feedFilterSwitch = document.querySelectorAll('.feed-filter__radio');
const feedCategoryLabel = document.querySelector('.feed-filter__label');

const state = { feedFilter: 'all' };

const spawnElement = (tagName = '', attrs = {}) => {
  const element = document.createElement(tagName);
  Object.keys(attrs).forEach(attr =>
    element.setAttribute(`${attr}`, attrs[attr])
  );
  return element;
};

// /* sample data */
const sampleRes = [
  {
    type: 'red-flag',
    title: `some people i'm suspicious of`,
    details: `oy! vey some individuals are really corrupt and very inconsiderate fa`
  },
  {
    type: 'intervention',
    title: `do help`,
    details: `oy! vey some individuals are really corrupt and very inconsiderate fa`
  },
  {
    type: 'red-flag',
    title: `hmm i'm suspicious of`,
    details: `oy! vey some individuals are really corrupt and very inconsiderate fa`
  }
];

const recordsToFeedComponents = recArray =>
  recArray.map(
    ({
      type,
      imgUrl = './UI/assets/images/234864-1600x1000.jpg',
      title,
      details
    }) => {
      const component = spawnElement('div', {
        class: `record-item ${type} card card--feed`
      });
      component.innerHTML = `
  <div class="record-item__image-div">
    <img
      class="record-item__image"
      src=${imgUrl}
      alt=""
    />
  </div>
  <div class="record-item__details">
    <h2 class="record-item__title">${title}</h2>
    <p class="record-item__summary">
      ${`${details.substring(0, 100)}...`}
    </p>
</div>`;
      return component;
    }
  );

const loadFeed = (records, nodeName) =>
  recordsToFeedComponents(records).forEach(component => {
    nodeName.appendChild(component);
  });

const filterFeed = (records, tag, feedNode) => {
  const components = [];
  feedNode.innerHTML = '';

  if (tag === 'all') {
    loadFeed(records, feedNode);
    state.feedFilter = tag;
    return;
  }
  recordsToFeedComponents(records).forEach(recordComponent => {
    if (recordComponent.classList.contains(`${tag}`)) {
      components.push(recordComponent);
    }
  });
  if (components.length > 0) {
    components.forEach(component => feedNode.appendChild(component));
  } else feedCategoryLabel.textContent = 'No Records found';
  state.feedFilter = tag;
};

feedFilterSwitch.forEach(filter => {
  filter.addEventListener('click', () => {
    if (state.feedFilter !== filter.value) {
      filterFeed(sampleRes, filter.value, recordList);
    }
  });
});

window.addEventListener('load', () => {
  loadFeed(sampleRes, recordList);
});
