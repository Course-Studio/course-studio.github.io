console.log("hello from CS github");

const githubBase = "https://course-studio.github.io/img/";

// only run customizations in demo player for now
if (window.location.href.includes("course-player-demo-course-studio")) {
  formatLessonTitles();
  formatModuleTitles();
  replaceModuleProgressCircle();
  loadStyles();
  insertDashboardLink();
  insertNavPopup();
  popupCarousel();
}

// format lesson titles to follow design convention
function formatLessonTitles() {
  const list = document.querySelectorAll('[class*="content-item__title"]');

  if (list.length > 0) {
    list.forEach((item) => {
      const text = item.textContent.trim();

      if (text.includes(":")) {
        const [firstPart, secondPart] = text
          .split(":")
          .map((part) => part.trim());

        const label = document.createElement("div");
        label.className = "title-label";
        label.textContent = `${firstPart}:`;

        const title = document.createElement("div");
        title.className = "title-text";
        title.textContent = secondPart;

        item.innerHTML = "";
        item.appendChild(label);
        item.appendChild(title);
      } else {
        item.innerHTML = "";
        const title = document.createElement("div");
        title.className = "title-text";
        title.textContent = "Overview";
        item.appendChild(title);
      }
    });
  } else {
    setTimeout(formatLessonTitles, 500);
  }
}

function formatModuleTitles() {
  const list = document.querySelectorAll('[class*="_chapter-item__title_"]');

  if (list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      const text = list[i].textContent.trim();

      if (text.toLowerCase().includes("module")) {
        const [moduleLabel, moduleTitle] = text
          .split(":")
          .map((part) => part.trim());

        // Create the new elements
        const label = document.createElement("div");
        label.className = "module-label";
        label.textContent = `${moduleLabel}:`;

        const title = document.createElement("div");
        title.className = "module-title";
        title.textContent = moduleTitle;

        const moduleTitleContainer = document.createElement("div");
        moduleTitleContainer.className = "module-title-container";
        moduleTitleContainer.appendChild(label);
        moduleTitleContainer.appendChild(title);

        const parent = list[i].parentNode;
        parent.replaceChild(moduleTitleContainer, list[i]);
      }
    }
  } else {
    setTimeout(formatModuleTitles, 500);
  }
}

function replaceModuleProgressCircle() {
  const chapterContainers = document.querySelectorAll(
    ".course-player__chapters-item"
  );
  if (chapterContainers.length > 0) {
    chapterContainers.forEach((container) => {
      const thncProgessCircle = container.querySelector(
        ".course-player__progress"
      );
      const completionRate = container.querySelector(
        ".course-player__chapter-item__completion"
      );
      if (completionRate) {
        completionRate.style.display = "none";

        const percentCompleted = document.querySelector(
          "[data-percentage-completion]"
        );
        let percentage = 100;

        if (percentCompleted) {
          percentage = percentCompleted.getAttribute(
            "data-percentage-completion"
          );

          const progressCircle = document.createElement("div");
          progressCircle.className = "card";
          progressCircle.innerHTML = `
                <div class="percent">
                  <svg>
                    <circle cx="20" cy="20" r="20"></circle>
                    <circle cx="20" cy="20" r="20" style="--percent: ${percentage};"></circle>
                  </svg>
                  <div class="number">
                    <h3>${percentage}<span>%</span></h3>
                  </div>
                </div>
              `;

          const completedProgressCircle = document.createElement("div");
          completedProgressCircle.className = "card";
          completedProgressCircle.innerHTML = `
                <div class="percent">
                  <svg>
                    <circle cx="20" cy="20" r="20" style="fill: #0057B8;"></circle>
                  </svg>
                  <i class="toga-icon toga-icon-checkmark" role="img" aria-label="Completed"></i>
                </div>
              `;

          if (percentage == 100) {
            thncProgessCircle.replaceWith(completedProgressCircle);
          } else {
            thncProgessCircle.replaceWith(progressCircle);
          }
        }
      }
    });
  } else {
    setTimeout(replaceModuleProgressCircle, 500);
  }
}

function insertDashboardLink() {
  const container = document.querySelector("div._container_v3q4ce");

  if (container) {
    const newLink = document.createElement("a");
    const popupBtn = document.createElement("a");
    popupBtn.classList.add("mobile-popup-trigger");
    newLink.href = "/enrollments";
    newLink.textContent = "Return to Dashboard";
    newLink.classList.add("header-dashboard-link");

    container.appendChild(newLink);
    container.appendChild(popupBtn);
  } else {
    setTimeout(insertDashboardLink, 500);
  }
}

function loadStyles() {
  const styleLoader = document.createElement("link");
  styleLoader.rel = "stylesheet";
  styleLoader.href = `${githubBase}imgCoursePlayerStyles.css`;
  document.head.appendChild(styleLoader);
}

function addRiseFileListener() {
  let continueButtonHidden = false;
  if (typeof CoursePlayerV2 !== "undefined") {
    window.CoursePlayerV2.on("hooks:contentDidChange", function (data) {
      if (continueButtonHidden) {
        const continueButton = document.querySelector(
          'button[data-qa="complete-continue__btn"]'
        );
        continueButton.style.visibility = "visible";
      }
    });
  } else {
    setTimeout(addListener, 100);
  }

  window.onmessage = (e) => {
    const { complete } = e.data;
    const continueButton = document.querySelector(
      'button[data-qa="complete-continue__btn"]'
    );
    if (typeof complete === "boolean" && complete && continueButton) {
      continueButton.style.visibility = "visible";
      continueButtonHidden = false;
    } else if (typeof complete === "boolean" && !complete && continueButton) {
      continueButton.style.visibility = "hidden";
      continueButtonHidden = true;
    }
  };
}

function insertNavPopup() {
  const coursePlayerHeader = document.querySelector(
    ".course-player__content-header"
  );
  if (coursePlayerHeader) {
    const coursePlayerContainer = document.getElementsByClassName(
      "content-modal-wrapper"
    )[0];

    // create trigger button
    const triggerBtn = document.createElement("button");
    triggerBtn.innerHTML = "How to navigate your course";
    triggerBtn.classList.add("popup-trigger");
    coursePlayerHeader.append(triggerBtn);

    // create container for popup and carousel HTML
    const popupContainer = document.createElement("div");
    popupContainer.id = "fullscreen-popup";
    popupContainer.classList.add("hidden");
    popupContainer.innerHTML = `
          <div class="popup-container popup container">
          <div class="popup top-bar">
            <h3>Stay on track!</h3>
            <button class="popup popup-close">close</button>
          </div>
          <div class="popup main">
            <div class="popup slide" id="slide-1">
              <img class="popup main-img" />
              <p class="popup text">this is what to do on slide 1</p>
            </div>
            <div class="popup slide" id="slide-2">
              <img class="popup main-img" />
              <p class="popup text">something on slide 2</p>
            </div>
            <div class="popup slide" id="slide-3">
              <img class="popup main-img" />
              <p class="popup text">this lalala slide 3</p>
            </div>
            <div class="popup nav">
              <div class="popup nav-btns">
                <button class="nav-btn" id="nav-1"></button>
                <button class="nav-btn" id="nav-2"></button>
                <button class="nav-btn" id="nav-3"></button>
              </div>
              <button class="nav-next">Next</button>
            </div>
          </div>
          </div>
        `;
    coursePlayerContainer.appendChild(popupContainer);
  } else {
    setTimeout(insertNavPopup, 500);
  }
}

function popupCarousel() {
  const popupContainer = document.getElementById("fullscreen-popup");
  const popupTrigger = document.getElementsByClassName("popup-trigger")[0];
  const mobilePopupTrigger = document.getElementsByClassName(
    "mobile-popup-trigger"
  )[0];
  const popupCloseBtn = document.getElementsByClassName("popup-close")[0];
  const slides = document.getElementsByClassName("slide");
  const navBtns = Array.from(document.getElementsByClassName("nav-btn"));
  const navNextBtn = document.getElementsByClassName("nav-next")[0];
  let slideIndex = 0;

  if (navBtns.length < 0 || slides < 0 || !popupCloseBtn || !navNextBtn) {
    setTimeout(popupCarousel, 500);
  }

  navBtns[0].classList.add("active");
  slides[0].classList.add("visible");
  popupTrigger.addEventListener("click", () => openPopupCarousel());
  mobilePopupTrigger.addEventListener("click", () => openPopupCarousel());

  popupCloseBtn.addEventListener("click", () => closePopupCarousel());

  navNextBtn.addEventListener("click", function () {
    if (slideIndex < slides.length - 1) {
      shiftSlide(slideIndex + 1);
    } else {
      closePopupCarousel();
    }
  });

  navBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      shiftSlide(index);
    });
  });

  function shiftSlide(index) {
    slides[slideIndex].classList.remove("visible");
    navBtns[slideIndex].classList.remove("active");
    slideIndex = index;
    slides[index].classList.add("visible");
    navBtns[index].classList.add("active");

    if (slideIndex == slides.length - 1) {
      navNextBtn.innerHTML = "Close";
    } else {
      navNextBtn.innerHTML = "Next";
    }
  }

  function closePopupCarousel() {
    popupContainer.classList.add("hidden");
  }

  function openPopupCarousel() {
    popupContainer.classList.remove("hidden");
  }
}
