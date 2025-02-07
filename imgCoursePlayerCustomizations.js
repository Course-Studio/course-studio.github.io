// only run customizations in demo player for now
if (window.location.href.includes("course-player-demo-course-studio")) {
  formatLessonTitles();
  formatModuleTitles();
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
