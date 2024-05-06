import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://champions-9d8bc-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

const endorsementInputEl = document.getElementById("endorsement-input");
const fromInputEl = document.getElementById("from-input");
const toInputEl = document.getElementById("to-input");
const publishBtnEl = document.getElementById("publish-btn");
const endorsementsListEl = document.getElementById("endorsements-list");

publishBtnEl.addEventListener("click", function () {
  let endorsementValue = endorsementInputEl.value;
  let fromValue = fromInputEl.value;
  let toValue = toInputEl.value;

  push(endorsementListInDB, {
    content: endorsementValue,
    from: fromValue,
    to: toValue,
    likes: 0,
  });

  clearInputFieldEl(endorsementInputEl);
  clearInputFieldEl(fromInputEl);
  clearInputFieldEl(toInputEl);

  publishBtnEl.textContent = "Added!";
  setTimeout(() => {
    publishBtnEl.textContent = "Publish";
  }, 1000);
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearEndorsementList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemValue = currentItem[1];
      let currentItemKey = currentItem[0];

      let endorsementItem = createEndorsementItem(
        currentItemValue,
        currentItemKey
      );
      appendItemToEndorsementListEl(endorsementItem);
      incrementLikeFunct(
        endorsementItem.querySelector("#endorsement-div-likes"),
        currentItemKey
      );
    }
  } else {
    endorsementsListEl.innerHTML = "No endorsement yet";
  }
});

function clearInputFieldEl(field) {
  field.value = "";
}

function clearEndorsementList() {
  endorsementsListEl.innerHTML = "";
}

function appendItemToEndorsementListEl(el) {
  endorsementsListEl.append(el);
}

function createEndorsementItem(endorsement, key) {
  let endorsementContent = endorsement.content;
  let endorsementFrom = endorsement.from;
  let endorsementTo = endorsement.to;
  let endorsementLikes = endorsement.likes;

  let newEl = document.createElement("li");
  let divEl = document.createElement("div");
  let divToEl = document.createElement("h3");
  let divContentEl = document.createElement("p");
  let divFooterEl = document.createElement("div");
  let divFromEl = document.createElement("span");
  let divLikesEl = document.createElement("span");

  divEl.setAttribute("id", "endorsement-div");
  divFooterEl.setAttribute("id", "endorsement-div-footer");
  divLikesEl.setAttribute("id", "endorsement-div-likes");

  divFromEl.textContent = `From ${endorsementFrom}`;
  divLikesEl.textContent = `🖤 ${endorsementLikes}`;
  divContentEl.textContent = endorsementContent;
  divToEl.textContent = `To ${endorsementTo}`;

  divFooterEl.append(divFromEl);
  divFooterEl.append(divLikesEl);
  divEl.append(divToEl);
  divEl.append(divContentEl);
  divEl.append(divFooterEl);
  newEl.append(divEl);

  return newEl;
}

function incrementLikeFunct(el, key) {
  el.addEventListener("click", function () {
    const endorsementRef = ref(database, `endorsementList/${key}/likes`);
    let likes = 0;

    let myData = localStorage.getItem(`${key}ClickedStorage`);

    if (myData === "clicked") {
      return;
    } else {
      localStorage.setItem(`${key}ClickedStorage`, "clicked");
      onValue(endorsementRef, function (snapshot) {
        likes = snapshot.val();
      });
      likes++;
      set(endorsementRef, likes);
    }
  });
}
