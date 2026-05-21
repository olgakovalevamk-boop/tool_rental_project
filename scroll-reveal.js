/**
 * Адаптация React-компонента ScrollReveal для ванильного HTML.
 * GSAP + ScrollTrigger: поворот блока, появление слов, размытие при прокрутке.
 */
(function (global) {
  const SECTION_IDS = ["каталог", "как-арендовать", "условия", "контакты"];

  const DEFAULTS = {
    baseOpacity: 0.1,
    enableBlur: true,
    baseRotation: 0,
    blurStrength: 4,
    transformOrigin: "50% 50%",
  };

  let triggers = [];

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function splitWords(container) {
    const text = container.textContent.trim();
    container.textContent = "";
    text.split(/(\s+)/).forEach((part) => {
      if (/^\s+$/.test(part)) {
        container.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement("span");
      span.className = "scroll-reveal__word";
      span.textContent = part;
      container.appendChild(span);
    });
  }

  function prepareTextElement(el) {
    let inner = el.querySelector(".scroll-reveal__text");
    if (!inner) {
      inner = document.createElement("span");
      inner.className = "scroll-reveal__text";
      inner.textContent = el.textContent.trim();
      el.textContent = "";
      el.appendChild(inner);
    }
    if (!inner.querySelector(".scroll-reveal__word")) {
      splitWords(inner);
    }
    return inner;
  }

  function killTriggers() {
    triggers.forEach((t) => t.kill());
    triggers = [];
    if (global.ScrollTrigger) {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
  }

  /**
   * Эффект как в React ScrollReveal: rotate + opacity + blur по словам
   */
  function initTextScrollReveal(el, options) {
    const opts = { ...DEFAULTS, ...options };
    const words = prepareTextElement(el).querySelectorAll(".scroll-reveal__word");
    if (!words.length || !global.gsap || !global.ScrollTrigger) return;

    const origin = opts.transformOrigin;
    const wordTween = {
      opacity: opts.baseOpacity,
      willChange: "opacity",
    };
    const wordTo = {
      ease: "none",
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        start: "top bottom-=20%",
        end: "bottom bottom",
        scrub: true,
      },
    };

    if (opts.baseRotation) {
      triggers.push(
        gsap.fromTo(
          el,
          { transformOrigin: origin, rotate: opts.baseRotation },
          {
            ease: "none",
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          }
        )
      );
    }

    triggers.push(gsap.fromTo(words, wordTween, wordTo));

    if (opts.enableBlur) {
      triggers.push(
        gsap.fromTo(
          words,
          { filter: `blur(${opts.blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=20%",
              end: "bottom bottom",
              scrub: true,
            },
          }
        )
      );
    }
  }

  /** Плавное появление блоков контента секции */
  function initContentReveal(section, selector, start) {
    const items = section.querySelectorAll(selector);
    if (!items.length || !global.gsap) return;

    gsap.set(items, { opacity: 0, y: 32 });

    triggers.push(
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: start || "top 78%",
          toggleActions: "play none none none",
        },
      })
    );
  }

  function initEyebrow(section) {
    const eyebrow = section.querySelector(".section__eyebrow");
    if (!eyebrow || !global.gsap) return;

    gsap.set(eyebrow, { opacity: 0, y: 12 });
    triggers.push(
      gsap.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })
    );
  }

  const SECTION_TEXT_OPTS = {
    baseRotation: 0,
    transformOrigin: "50% 50%",
    blurStrength: 3,
  };

  function initSection(section) {
    const header = section.querySelector(".section-header") || section;
    const title = header.querySelector(".section__title.scroll-reveal");
    const intro = header.querySelector(".section__intro.scroll-reveal");

    if (title) {
      initTextScrollReveal(title, SECTION_TEXT_OPTS);
    }

    if (intro) {
      initTextScrollReveal(intro, {
        ...SECTION_TEXT_OPTS,
        baseOpacity: 0.15,
        blurStrength: 2,
      });
    } else if (!title) {
      const plainTitle = section.querySelector(".section__title");
      if (plainTitle) {
        plainTitle.classList.add("scroll-reveal");
        const inner = document.createElement("span");
        inner.className = "scroll-reveal__text";
        inner.textContent = plainTitle.textContent.trim();
        plainTitle.textContent = "";
        plainTitle.appendChild(inner);
        initTextScrollReveal(plainTitle, SECTION_TEXT_OPTS);
      }
    }

    initEyebrow(header);

    const id = section.id;
    if (id === "каталог") {
      initContentReveal(section, ".tool-card", "top 80%");
    } else if (id === "как-арендовать") {
      initContentReveal(section, ".steps__item", "top 82%");
    } else if (id === "условия") {
      initContentReveal(section, ".terms-card", "top 82%");
    } else if (id === "контакты") {
      initContentReveal(section, ".contact-block", "top 85%");
    }
  }

  function showAllWithoutAnimation() {
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      section.querySelectorAll(
        ".scroll-reveal, .scroll-reveal__word, .section__eyebrow, .tool-card, .steps__item, .terms-card, .contact-block"
      ).forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    });
  }

  function initGsapScrollReveal() {
    if (!global.gsap || !global.ScrollTrigger) {
      console.warn("GSAP или ScrollTrigger не загружены — анимация прокрутки отключена.");
      return false;
    }

    gsap.registerPlugin(ScrollTrigger);
    killTriggers();

    if (prefersReducedMotion()) {
      showAllWithoutAnimation();
      return true;
    }

    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) initSection(section);
    });

    ScrollTrigger.refresh();
    return true;
  }

  global.initGsapScrollReveal = initGsapScrollReveal;
  global.refreshGsapScrollReveal = function () {
    if (global.ScrollTrigger) ScrollTrigger.refresh();
  };
})();
