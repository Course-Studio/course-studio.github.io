
const githubBase = "https://course-studio.github.io/img/";
let courseImageSrc = "";
let courseImageIsSet = false;

// only run in course player
if (window.location.href.includes("take")) {
    let retryCount = 0;
    const maxRetry = 5;
    changeCommunityCard();
    formatModuleTitles();
    formatLessonTitles();
    //replaceModuleProgressCircle();
    loadStyles();
    insertDashboardLink();
    //insertNavPopup();
    //popupCarousel();

    addRiseFileListener();
    styleCommunityPage();

    function updateMaxHeight() {
        const viewer = document.getElementById('content-inner');
        const vid = document.querySelector('.fr-video');

        if (viewer && vid) {
            if (window.innerWidth > 1000) {
                const viewerHeight = viewer.offsetHeight;

                // Calculate the height based on the 16:9 aspect ratio
                const calculatedHeight = (viewer.offsetWidth * 9) / 16;

                // Choose the smaller of the viewer height and calculated height
                const finalHeight = Math.min(viewerHeight - 45, calculatedHeight - 45);

                // Set the height of the video element
                vid.style.height = `${finalHeight}px`;
            } else {
                // If the width is less than or equal to 1000px, set the height to auto
                vid.style.height = 'auto';
            }
        } else {
            setTimeout(() => {
                updateMaxHeight();
            }, 500);
        }
    }

    // Update on page load and window resize
    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);

    function changeCommunityCard() {
        const parent = document.querySelector('.community-space__button-container._button-container_fbvij7');
        const desc = document.querySelector('.community-space__description');
        if (parent) {
            const link = parent.querySelector('a');
            if (link) {
                const contentContainer = link.querySelector('._content__container_1ifdrl');
                if (contentContainer) {
                    contentContainer.innerHTML = 'Join Community &#8250;';
                }
            }
            if (desc) {
                desc.innerHTML = "Explore The Community"
            }
        }
        else {
            retryCount++;
            if (retryCount < maxRetry) {
                setTimeout(() => {
                    changeCommunityCard();
                }, 500);
            }
        }
    }

    // community page styles need to be reapplied on navigation
    $(function () {
        if (typeof CoursePlayerV2 !== "undefined") {
            CoursePlayerV2.on("hooks:contentDidChange", function (data) {
                styleCommunityPage();

                courseImageSrc = data.course.logo;
                insertCourseImage();
                updateMaxHeight();
                setTimeout(() => {
                    updatePlayerHeader();
                }, 500);
            });
        }
    });
}

function formatLessonTitles() {
    const list = document.querySelectorAll('[class*="content-item__title"]');

    if (list.length > 0) {
        list.forEach((item) => {
            const contentTypeLabel = item.querySelector(".content-item__details");
            let defaultContentTypeLabel = contentTypeLabel.innerText.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
            if (contentTypeLabel) {
                contentTypeLabel.remove();
            }

            const text = item.textContent.trim();

            item.innerHTML = "";

            if (text.includes(":")) {
                const [firstPart, secondPart] = text
                    .split(":")
                    .map((part) => part.trim());

                const label = document.createElement("div");
                label.className = "title-label";
                label.textContent = `${firstPart}`;

                const title = document.createElement("div");
                title.className = "title-text";
                title.textContent = secondPart;

                item.appendChild(label);
                item.appendChild(title);
            } else {
                const label = document.createElement("div");
                label.className = 'title-label';
                label.textContent = defaultContentTypeLabel;

                const title = document.createElement("div");
                title.className = "title-text";
                title.textContent = text;
                item.appendChild(label);
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




function updatePlayerHeader() {
    const activeLink = document.querySelector(
        "a.course-player__content-item__link.active"
    );
    const coursePlayerHeader = document.querySelector(
        ".course-player__content-header"
    );
    const mobileContainer = document.querySelector("._container_v3q4ce");
    const chapterLists = document.getElementsByClassName(
        "course-player__chapters-item"
    );

    let moduleTitle = "";

    const existingModuleLabel = document.querySelector(".header-module-label");

    if (existingModuleLabel) {
        existingModuleLabel.style.display = "none";
    }

    if (coursePlayerHeader && mobileContainer && chapterLists.length > 0) {
        Array.from(chapterLists).forEach((chapter) => {
            const activeLink = chapter.querySelector(
                "a.course-player__content-item__link.active"
            );

            if (activeLink) {
                const moduleTitleElement = chapter.querySelector(
                    ".module-title-container"
                );

                if (moduleTitleElement) {
                    moduleTitle = moduleTitleElement.innerText;
                }

                // Remove existing label before adding a new one
                const existingHeaderModuleLabel = coursePlayerHeader.querySelector(
                    ".header-module-label"
                );
                if (existingHeaderModuleLabel) {
                    existingHeaderModuleLabel.remove();
                }

                const headerModuleLabel = document.createElement("div");
                headerModuleLabel.classList.add("header-module-label");
                headerModuleLabel.innerHTML = moduleTitle;
                coursePlayerHeader.appendChild(headerModuleLabel);
            }
        });

        const titleElement = activeLink?.querySelector(".title-text");

        if (titleElement) {
            const existingHeader = coursePlayerHeader.querySelector(
                ".cs-content-header-title"
            );
            const existingMobileHeader = mobileContainer.querySelector(
                ".cs-content-header-title"
            );

            if (existingHeader) existingHeader.remove();
            if (existingMobileHeader) existingMobileHeader.remove();

            const headerModLabel = document.querySelector(".header-module-label");

            if (headerModLabel) {

                let newLabel = document.createElement("div");
                newLabel.className =
                    "course-player__content-header__title cs-content-header-title";
                newLabel.innerHTML = titleElement.innerText;
                headerModLabel.appendChild(newLabel);
                mobileContainer.appendChild(newLabel.cloneNode(true));
            }
        }
    } else {
        setTimeout(updatePlayerHeader, 500);
    }
}


function updateModuleProgess() {

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

            const chapContainer = container.querySelector(".course-player__chapter-item__container");
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
                    progressCircle.innerHTML =
                        `<div class="percent">
                  <svg>
                    <circle cx="20" cy="20" r="20"></circle>
                    <circle cx="20" cy="20" r="20" style="--percent: ${percentage};"></circle>
                  </svg>
                  <div class="number">
                    <h3>${percentage}<span>%</span></h3>
                  </div>
                </div>`
                        ;

                    const completedProgressCircle = document.createElement("div");
                    completedProgressCircle.className = "card";
                    completedProgressCircle.innerHTML =
                        `<div class="percent">
                  <svg>
                    <circle cx="20" cy="20" r="20" style="fill: #0057B8;"></circle>
                  </svg>
                  <i class="toga-icon toga-icon-checkmark" role="img" aria-label="Completed"></i>
                </div>`
                        ;

                    if (percentage == 100) {
                        chapContainer.prepend(completedProgressCircle);
                        //thncProgessCircle.insertAdjacentElement("afterend",completedProgressCircle);
                    } else {
                        chapContainer.prepend(progressCircle);
                        //thncProgessCircle.insertAdjacentElement("afterend", progressCircle);
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
        newLink.textContent = "Go to Dashboard";
        newLink.classList.add("header-dashboard-link");

        container.appendChild(newLink);
        //container.replaceWith(popupBtn);
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
        setTimeout(addRiseFileListener, 100);
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

    if (
        navBtns.length == 0 ||
        slides.length == 0 ||
        !popupCloseBtn ||
        !navNextBtn
    ) {
        setTimeout(popupCarousel, 500);
        return;
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

function applyCommunityStyles(communityIframe) {
    document.querySelector(".brand-color__background.brand-color__dynamic-text._button--default--small_142a8m._button--icon-right--small_142a8m").disabled = false;
    try {
        if (
            !communityIframe ||
            !communityIframe.contentWindow ||
            !communityIframe.contentWindow.document
        ) {
            setTimeout(() => applyCommunityStyles(communityIframe), 500);
            return;
        }

        var iframeDoc =
            communityIframe.contentDocument || communityIframe.contentWindow.document;
        var head = iframeDoc.head;

        if (head) {
            if (window.innerWidth > 640) {
                clickMainCommentsButton(iframeDoc);
            }
            let lastWidth = window.innerWidth;
            window.addEventListener("resize", () => {
                if (window.innerWidth > 640 && lastWidth <= 640) {
                    clickMainCommentsButton(iframeDoc);
                }
                lastWidth = window.innerWidth;
            });

            var style = document.createElement("style");
            style.type = "text/css";
            style.textContent = `
        @media(min-width: 1024px) {
            [class^="MenuTab_menu-tab__container"],
            [class^="MenuTab_menu-tab__content"]{
                width: 100% !important;
                margin-top: -24px;
                height: 100%;
            }
            
            [data-qa="menu-tab__container"] {
                right: 0 !important;
            }  
        }
      
          ._communityId__right-content__UfXy8 {
            width: 0 !important;
        }
        ._communityId__community-wrapper__ODtDm {
            grid-row-gap: 0px !important;
        }
        
        .MobileMenu_mobile-menu__wrapper__EHtIM {
           display: none; 
        }
        .TopBarMobilePostPage_comment-top-bar-mobile__XSXZv {
            display: none;
        }
        ._communityId__community-wrapper--post-detail__ZAwgg {
           top: 0 !important;
            overflow: hidden;
        }
        .Comment_comment__aN_9n {
            background-color: #F1F4F7;
        }
        .Comment_comment__detail__Ta51D,
        .Comment_comment__container__RXGsC,
        .ReplyThread_comment-list__earvV,
        .ReplyThread_comment-input__wrapper__fB0uk,
        .ReplyThread_comment-list__earvV,
        .Post_post__container__UsNWu {
            background-color: #F1F4F7 !important;
        }
        .comment-list {
            border-radius: 12px;
            margin-bottom: 8px;
            overflow: hidden;
        }
        
        div.course-community-card-container > div > img {
            width: 232px;
            border-radius: 12px 12px 0px 0px;
        }
        
        @media (min-width: 1024px) {
            ._communityId__community-wrapper__ODtDm._communityId__is-spaces-in-communities-enabled__tsSMS {
                grid-template-columns: 0 auto 0;
            }
        }
        
        .Post_post__container__UsNWu {
            display: flex;
            gap: 63px;
        }
        
        .course-community-card-container {
            border-radius: 12px;
            border: 1px solid #DCE3EB;
            height: fit-content;
            margin: 24px 24px 0 0;
            overflow: hidden;
            min-width: 232px;
            background: white;
        }
        
        div.course-community-card-container > div > div {
            padding: 16px;
        }
        
        ._communityId__main-content__g_lZi {
            padding: 0;
        }
        
        div.course-community-card-container > div > div > p {
            font-weight: 800;
            margin: 0px 0 16px;
        }
        
        div.course-community-card-container > div > div > a {
            text-decoration: none;
            color: #0057B8;
        }
        
        ._communityId__community-wrapper--post-detail__ZAwgg {
            max-height: 100vh;
        }
        
        .UserDetail_user-detail__moderator-badge__7a3zl,
        .UserDetail_user-detail__edited__2YHcY,
        .CommentList_comment-list-button__W_dvU {
            display: none !important;
        }
        
        ._communityId__community-main__tr8NM {
            grid-area: none;
            overflow-x: hidden;
        }
        
        .Post_post__container__UsNWu {
            border-radius: 12px;
            background: white !important;
            margin-top: -40px;
        }
        
        .user-detail__time {
            text-transform: none;
        }
        
        [data-qa="top-bar"],
        [data-qa="spaces-list__wrapper--draggable"],
        [data-qa="community-actions-list__create-space"] {
          display: none !important;
        }
        
        [class^="TopBar_top-bar__container__"] {
            display: none !important;
        }
        
        aside .Post_post__W_1Ii:first-of-type {
            margin-top: 32px;
        }
        
        aside,
        ._communityId__button__breadcrumb__yYFfQ,
        header,
        .ReplyThread_comment-input__wrapper__fB0uk,
        .UserDetail_user-detail__total-replies__L_ctt,
        .BreadCrumb_breadcrumb__B_2cq {
           // display: none !important;
        }
        
        .Post_post__detail__Zi_YA {
            background: white;
            border-radius: 8px;
        }
        
        .Post_comment-container__rV3fl {
            display: flex;
            flex-direction: column;
        }
        
        .Post_comment-input__wrapper__76GeJ {
            order: -1;
        }
        
        
        @media(max-width: 768px) {
            .Post_post__container__UsNWu {
                flex-direction: column-reverse;
                gap: 8px;
            }
            
            .course-community-card-container {
                margin: 0;
            }
            
            .course-community-card {
                display: flex;
                background: white;
            }
            
            div.course-community-card-container > div > img {
                max-width: 232px;
                border-radius: 12px 0px 0px 12px;
            }
        }
        
        @media(max-width: 396px) {
            .course-community-card {
                flex-direction: column;
            }
            
            div.course-community-card-container > div > img {
                max-width: unset;
                width: -webkit-fill-available;
            }
        }
      `;
            head.appendChild(style);
        } else {
            setTimeout(() => applyCommunityStyles(communityIframe), 500);
        }
    } catch (error) {
        setTimeout(() => applyCommunityStyles(communityIframe), 500);
    }

    function clickMainCommentsButton(iframeDoc) {
        const button = iframeDoc.querySelector("[data-qa='main-comments_text']");
        if (button) {
            console.log("Found button — clicking:", button);
            button.click();
        } else {
            setTimeout(() => clickMainCommentsButton(iframeDoc), 100);
        }
    }
}

function styleCommunityPage() {
    var communityIframe = [...document.querySelectorAll("iframe")].find(
        (iframe) =>
            iframe.src &&
            (iframe.src.includes("communities") || iframe.title.includes("Locker Room") || iframe.title.includes("Ask Coach Anything"))
    );


    if (!communityIframe) {
        setTimeout(styleCommunityPage, 500);
        return;
    }

    // thnc loading can be delayed /
    // or instant if frame was already visited
    communityIframe.onload = function () {
        applyCommunityStyles(communityIframe);
    };

    applyCommunityStyles(communityIframe);
}


function insertCourseImage() {
    const courseName = document.querySelector('.course-progress__title');
    if (courseName && !courseImageIsSet) {
        courseName.insertAdjacentHTML('afterend', `<img class="course-logo" src="${courseImageSrc}" />`);
        courseImageIsSet = true;
    } else {
        setTimeout(insertCourseImage, 500);
    }

};
