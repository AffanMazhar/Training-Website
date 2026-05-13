let themeButton = document.getElementById("theme-button");

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
  document.documentElement.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "Light Mode";
  } else {
    themeButton.textContent = "Dark Mode";
  }
};

themeButton.addEventListener("click", toggleDarkMode);

let rsvpButton = document.getElementById("rsvp-button");
let reduceMotionButton = document.getElementById("reduce-motion-button");
let closeModalButton = document.getElementById("close-modal-button");

let revealableContainers = document.querySelectorAll(".revealable");

let intervalId = null;
let modalTimeoutId = null;

const addParticipant = (person) => {
  let newParticipant = document.createElement("p");
  newParticipant.textContent = "🎟️ " + person.name + " from " + person.state + " has RSVP'd.";

  let participantsDiv = document.querySelector(".rsvp-participants");
  participantsDiv.appendChild(newParticipant);
};

const toggleModal = (person) => {
  let modal = document.getElementById("thanks-modal");
  let modalContent = document.getElementById("thanks-modal-content");
  let modalImage = document.getElementById("modal-image");

  modal.style.display = "flex";
  modalContent.textContent =
    "Thanks for RSVPing, " + person.name + "! We can't wait to see you at Elevate with Affan.";

  let scaleFactor = 1;
  let growing = true;

  clearInterval(intervalId);
  clearTimeout(modalTimeoutId);

  if (!document.body.classList.contains("reduce-motion")) {
    intervalId = setInterval(() => {
      if (growing) {
        scaleFactor += 0.05;
      } else {
        scaleFactor -= 0.05;
      }

      if (scaleFactor >= 1.2) {
        growing = false;
      } else if (scaleFactor <= 1) {
        growing = true;
      }

      modalImage.style.transform = "scale(" + scaleFactor + ")";
    }, 200);
  }

  modalTimeoutId = setTimeout(() => {
    modal.style.display = "none";
    modalImage.style.transform = "scale(1)";
    clearInterval(intervalId);
  }, 4000);
};

const closeModal = () => {
  let modal = document.getElementById("thanks-modal");
  let modalImage = document.getElementById("modal-image");

  modal.style.display = "none";
  modalImage.style.transform = "scale(1)";
  clearInterval(intervalId);
  clearTimeout(modalTimeoutId);
};

const validateForm = (event) => {
  event.preventDefault();

  let containsErrors = false;
  let rsvpInputs = document.getElementById("rsvp-form").elements;

  const person = {
    name: document.getElementById("rsvp-name").value,
    email: document.getElementById("rsvp-email").value,
    state: document.getElementById("rsvp-state").value
  };

  for (let i = 0; i < rsvpInputs.length; i++) {
    if (rsvpInputs[i].value.trim().length < 2) {
      containsErrors = true;
      rsvpInputs[i].classList.add("error");
    } else {
      rsvpInputs[i].classList.remove("error");
    }
  }

  let email = document.getElementById("rsvp-email");

  if (!email.value.includes("@")) {
    containsErrors = true;
    email.classList.add("error");
  }

  if (containsErrors === false) {
    addParticipant(person);
    toggleModal(person);

    for (let i = 0; i < rsvpInputs.length; i++) {
      rsvpInputs[i].value = "";
    }
  }
};

rsvpButton.addEventListener("click", validateForm);

const reveal = () => {
  if (document.body.classList.contains("reduce-motion")) {
    for (let i = 0; i < revealableContainers.length; i++) {
      revealableContainers[i].classList.add("active");
    }
    return;
  }

  for (let i = 0; i < revealableContainers.length; i++) {
    let current = revealableContainers[i];

    let windowHeight = window.innerHeight;
    let topOfRevealableContainer = current.getBoundingClientRect().top;
    let revealDistance = parseInt(
      getComputedStyle(current).getPropertyValue("--reveal-distance"),
      10
    );

    if (topOfRevealableContainer < windowHeight - revealDistance) {
      current.classList.add("active");
    } else {
      current.classList.remove("active");
    }
  }
};

window.addEventListener("scroll", reveal);
reveal();

const reduceMotion = () => {
  document.body.classList.toggle("reduce-motion");

  if (document.body.classList.contains("reduce-motion")) {
    reduceMotionButton.textContent = "Reduce Motion ON";
    clearInterval(intervalId);

    let modalImage = document.getElementById("modal-image");
    if (modalImage) {
      modalImage.style.transform = "scale(1)";
    }
  } else {
    reduceMotionButton.textContent = "Reduce Motion OFF";
  }

  reveal();
};

reduceMotionButton.addEventListener("click", reduceMotion);
closeModalButton.addEventListener("click", closeModal);