import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".competitor-comparison").forEach(section => {
    const tabs = section.querySelectorAll(".competitor-comparison__tab");
    const grid = section.querySelector(".competitor-comparison__grid");
    const gridBlocks = grid ? grid.querySelectorAll(".competitor-comparison__block") : [];
    const tabColorHighlight = section.dataset.tabColorHighlight;
    const tabColorDefault = '#ffffff';

    let competitorSwiper;

    tabs.forEach(tab => {
      tab.classList.remove("competitor-comparison__tab--active");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      tab.style.backgroundColor = tabColorDefault;
    });
    if (tabs[1]) {
      tabs[1].classList.add("competitor-comparison__tab--active");
      tabs[1].setAttribute("aria-selected", "true");
      tabs[1].setAttribute("tabindex", "0");
      tabs[1].style.backgroundColor = tabColorHighlight;
    }

    gridBlocks.forEach(block => block.classList.remove("active"));
    if (gridBlocks[1]) gridBlocks[1].classList.add("active");

    function setActiveTab(index) {
      tabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.classList.toggle("competitor-comparison__tab--active", isActive);
        tab.style.backgroundColor = isActive ? tabColorHighlight : tabColorDefault;
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      gridBlocks.forEach((block, i) => {
        block.classList.toggle("active", i === index);
      });
    }

    function initSwiper() {
      if (!grid) return;

      if (window.innerWidth < 768 && !competitorSwiper) {
        grid.classList.add("swiper-container");

        const slides = Array.from(grid.children);
        const wrapper = document.createElement("div");
        wrapper.classList.add("swiper-wrapper");

        slides.forEach(slide => {
          slide.classList.add("swiper-slide");
          wrapper.appendChild(slide);
        });

        grid.innerHTML = "";
        grid.appendChild(wrapper);

        competitorSwiper = new Swiper(grid, {
          slidesPerView: 1,
          centeredSlides: true,
          spaceBetween: 0,
          initialSlide: 1,
          speed: 400,
          navigation: {
            nextEl: section.querySelector(".swiper-button-next"),
            prevEl: section.querySelector(".swiper-button-prev"),
          },
        });

        competitorSwiper.on("slideChange", () => setActiveTab(competitorSwiper.realIndex));

        tabs.forEach((tab, index) => {
          tab.addEventListener("click", () => {
            competitorSwiper.slideTo(index);
            setActiveTab(index);
          });
        });

        setActiveTab(competitorSwiper.realIndex);
      }

      if (window.innerWidth >= 768 && competitorSwiper) {
        competitorSwiper.destroy(true, true);
        competitorSwiper = null;

        const wrapper = grid.querySelector(".swiper-wrapper");
        if (wrapper) {
          while (wrapper.firstChild) grid.appendChild(wrapper.firstChild);
          wrapper.remove();
          grid.classList.remove("swiper-container");
        }

        setActiveTab(1);
      }
    }

    initSwiper();
    window.addEventListener("resize", initSwiper);

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        if (!competitorSwiper) setActiveTab(index);
      });
    });
  });
});