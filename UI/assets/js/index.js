const recordList = document.querySelector('.record-list');
const feedFilterSwitch = document.querySelectorAll('.feed-filter__radio');
const feedCategoryLabel = document.querySelector('.feed-filter__label');

const state = { feedFilter: 'all' };

// /* sample data */
const sampleRes = [
  {
    type: 'red-flag',
    title: `some people i'm suspicious of`,
    details: ` True story accompanying image
    At the foothills of the Himalayas lies the rural district of Jhanjharpur.
    Located on the banks of the River Kamala, this is a fertile region for agriculture. 
    Yet with little money for irrigation or equipment, life remains a daily struggle for the many small-scale farmers.
    Take Murali* for example. He wanted to expand his business with new seeds and a pond, but lacked the funds to do it. Like many others, he saw no option but to apply for a government agricultural subsidy.
    Yet instead of granting money, Murali says, the official demanded it – refusing to process the application unless Murali paid a bribe. Unable to pay, Murali left empty-handed. He returned many times,
    but nothing changed. `
  },
  {
    type: 'red-flag',
    title: `some people i'm suspicious of`,
    details: ` True story accompanying image
    At the foothills of the Himalayas lies the rural district of Jhanjharpur.
    Located on the banks of the River Kamala, this is a fertile region for agriculture. 
    Yet with little money for irrigation or equipment, life remains a daily struggle for the many small-scale farmers.
    Take Murali* for example. He wanted to expand his business with new seeds and a pond, but lacked the funds to do it. Like many others, he saw no option but to apply for a government agricultural subsidy.
    Yet instead of granting money, Murali says, the official demanded it – refusing to process the application unless Murali paid a bribe. Unable to pay, Murali left empty-handed. He returned many times,
    but nothing changed. `
  },
  {
    type: 'red-flag',
    title: `some people i'm suspicious of`,
    details: ` True story accompanying image
    At the foothills of the Himalayas lies the rural district of Jhanjharpur.
    Located on the banks of the River Kamala, this is a fertile region for agriculture. 
    Yet with little money for irrigation or equipment, life remains a daily struggle for the many small-scale farmers.
    Take Murali* for example. He wanted to expand his business with new seeds and a pond, but lacked the funds to do it. Like many others, he saw no option but to apply for a government agricultural subsidy.
    Yet instead of granting money, Murali says, the official demanded it – refusing to process the application unless Murali paid a bribe. Unable to pay, Murali left empty-handed. He returned many times,
    but nothing changed. `
  },
  {
    type: 'intervention',
    title: `do help`,
    details: `True story accompanying image
    At the foothills of the Himalayas lies the rural district of Jhanjharpur.
    Located on the banks of the River Kamala, this is a fertile region for agriculture. 
    Yet with little money for irrigation or equipment, life remains a daily struggle for the many small-scale farmers.
    Take Murali* for example. He wanted to expand his business with new seeds and a pond, but lacked the funds to do it. Like many others, he saw no option but to apply for a government agricultural subsidy.
    Yet instead of granting money, Murali says, the official demanded it – refusing to process the application unless Murali paid a bribe. Unable to pay, Murali left empty-handed. He returned many times,
    but nothing changed.`
  },
  {
    type: 'red-flag',
    title: `reporting activities`,
    details: `1. Name and contact details (optional) 
    Anyone is entitled to make an anonymous complaint but this may affect the effectiveness of the investigation as the ICAC may need to verify matters, or obtain further details which can be difficult without contact information. In addition, the ICAC will not be able to advise the complainant of any decisions or action on the matter. 
    
    2. Names of NSW agencies and public sector officials involved
    Provide the names and positions of the officials involved if known.
    
    3. How you became aware of the matter
    Include any relevant dates and the name and position of any person with whom you interacted or observed.
    
    4. A summary of the matter
    Include names, any relevant dates, locations and all other relevant information.
    
    5. Other people aware of the matter
    Include the names and contact details of other people who may be able to assist the ICAC.
    
    6. Other organisations contacted
    Provide the names of any organisations or regulators the matter was reported to, the date of contact and their response.
    
    7. Documentary evidence
    Include details on any relevant documents or other information that may help the ICAC in its assessment. The actual documentation does not need to be included in the report.`
  },
  {
    type: 'red-flag',
    title: `hmm i'm suspicious of`,
    details: `True story accompanying image
    At the foothills of the Himalayas lies the rural district of Jhanjharpur.
    Located on the banks of the River Kamala, this is a fertile region for agriculture. 
    Yet with little money for irrigation or equipment, life remains a daily struggle for the many small-scale farmers.`
  },
  {
    type: 'intervention',
    title: `hmm i'm suspicious of`,
    details: `True story accompanying image
    At the foothills of the Himalayas lies the rural district of Jhanjharpur.
    Located on the banks of the River Kamala, this is a fertile region for agriculture. 
    Yet with little money for irrigation or equipment, life remains a daily struggle for the many small-scale farmers.`
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
    <p class="record-item__summary thin-scroll">
      ${details}
    </p>
  </div>`;
      return component;
    }
  );

feedFilterSwitch.forEach(filter => {
  filter.addEventListener('click', () => {
    if (state.feedFilter !== filter.value) {
      state.feedFilter = filterFeed(
        recordsToFeedComponents(sampleRes),
        filter.value,
        recordList,
        feedCategoryLabel
      );
    }
  });
});

window.addEventListener('load', () => {
  loadFeed(recordsToFeedComponents(sampleRes), recordList);
});
