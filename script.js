//DOM elements
const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const search = document.querySelector("#search");
const list = document.querySelector("#list");
const next = document.querySelector("#next");
const results = document.querySelector("#results");
//Fetch headers
const headers = {
  method: "GET",
};
//Fetch websites
const baseUrl = "https://www.facebook.com/";
let searchUrl;

//Iteration purposes
let index = 0,
  maxCount = 0;
const fixedIterations = 100;

//Search duplicate accounts
const searchAccounts = (response, index, iteration) => {
  if (response.status !== 404) {
    const listItem = document.createElement("li");
    const name = document.createElement("a");
    listItem.className = "list-group-item";
    name.className = "text-danger font-weight-bold";

    name.href = response.url;
    name.target = "_blank";
    name.textContent = response.url;
    listItem.appendChild(name);
    list.appendChild(listItem);
  }
  maxCount = index > maxCount ? index : maxCount;
  results.textContent = `Searched ${maxCount} out of ${
    iteration + fixedIterations
  }`;
};

//Function to fetch for duplicate accounts
const fetchAccounts = (url, currentCount) => {
  let maxCount = currentCount;
  for (let i = currentCount; i <= currentCount + fixedIterations; i++) {
    let checkUrl = `${url}${i}`;
    fetch(checkUrl, headers)
      .then((response) => searchAccounts(response, i, currentCount))
      .catch((error) => console.log(error));
  }
  /*const nextBtn = document.createElement("btn");
  nextBtn.className = "btn btn-primary btn-block";
  nextBtn.id = "next";

  nextBtn.addEventListener("click", () => {
    index += fixedIterations;
    fetchAccounts(searchUrl, index);
  });

  list.appendChild(nextBtn);*/
};

//Format names
const formatName = (firstName, lastName) => {
  firstName = firstName.includes(" ")
    ? firstName.split(" ").join("").toLowerCase()
    : firstName.toLowerCase();

  lastName = lastName.includes(" ")
    ? lastName.split(" ").join("").toLowerCase()
    : lastName.toLowerCase();

  return `${firstName}.${lastName}.`;
};

//Check if the text inputs has a value or not
search.addEventListener("click", () => {
  if (
    firstName.value === null ||
    firstName.value === undefined ||
    firstName.value === ""
  )
    return;
  if (
    lastName.value === null ||
    lastName.value === undefined ||
    lastName.value === ""
  )
    return;

  const searchName = formatName(firstName.value, lastName.value);
  searchUrl = `${baseUrl}${searchName}`;

  //Reset the display once the user searches another name
  maxCount = 0;
  index = 0;
  list.textContent = "";

  fetchAccounts(searchUrl, index);
  next.disabled = false; //Disables the next iteration button

  //Removes the warning message
  document
    .querySelector("#card-body")
    .removeChild(document.querySelector("#warning-message"));
});

next.addEventListener("click", () => {
  index += fixedIterations;
  fetchAccounts(searchUrl, index);
});
