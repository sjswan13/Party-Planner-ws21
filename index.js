const COHORT = "2109-CPU-RM-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector('#party');

const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', addParty);

//sync state with the API and rerender

async function render() {
  await getParties();
  renderParties();
}
render();

//update state with parties from API

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data; 
  } catch (error) {
    console.error(error);
  }
}

/**
 * handle form submission for adding a party
 * @param {Event} event
 */

async function addParty(event) {
  event.preventDefault();
  //each input has name property- access from orm element
  const name = addPartyForm.name.value;
  const date = addPartyForm.date.value;
  const location = addPartyForm.location.value;
  const description = addPartyForm.description.value;

  await createParty(
    name, 
    date,
    location,
    description,
  );
}
/**
 * Ask API to create a new party and rerender
 * @param {string} name name of party
 * @param {string} date date of party image
 * @param {string} location location of the party
 * @param {string} description description of the party
 */

async function createParty(name, date, location, description) {
  try{
    const isoDate = new Date(date).toISOString();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, date: isoDate, location, description}),
    });
    console.log(response);
    const json = await response.json();
console.log(json);
    if(json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to update an existing party and rerender
 * @param {number} id id of the party to update
 * @param {string} name new name of party
 * @param {string} date new url of party image
 * @param {string} location new description of the party
 * @param {string} description new description of the party
 */

async function updateParty(id, name, date, location, description) {
  try {
    const isoDate = new Date(date).toISOString();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, date: isoDate, location, description}),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to delet party and rerender
 * @param {number} id id of party to delete
 */

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if(!response.ok) {
      throw new Error('Party could not be deleted');
    }
    render();
  } catch (error) {
    console.log(error);
  }
}
//render parties from state

function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = '<li>No Parties Found.</li>';
    return;
  }

  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement('li');
    partyCard.classList.add('party');
    partyCard.innerHTML = `
    <h2>${party.name}<h2>
    <h3>${party.date}<h3>
    <h3>${party.location}<h3>
    <p>${party.description}<p>
    `;

    //when createElement is used, have to also addEventListener
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Party';
    partyCard.append(deleteButton);
    deleteButton.addEventListener('click', () => deleteParty(party.id));

    return partyCard;
  });
  partyList.replaceChildren(...partyCards);
}


