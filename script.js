document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. ENTRANCE ANIMATION
  --------------------------------------------------------------------- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#nav', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .7 }, 0)
    .fromTo('[data-anim="eyebrow"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, .35)
    .fromTo('[data-anim="line1"]', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: .8 }, .5)
    .fromTo('[data-anim="line2"]', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: .8 }, .62)
    .fromTo('[data-anim="desc"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, .82)
    .fromTo('[data-anim="btn"]', { opacity: 0, y: 16, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .6 }, .95)
    .fromTo('[data-anim="arch"]', { opacity: 0, scale: .82, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.5)' }, .5);

  /* ---------------------------------------------------------------------
     2. WORD SWAP + ARCH IMAGE CROSSFADE (synced slideshow)
  --------------------------------------------------------------------- */
  const words = ['Monk', 'Peace'];
  const wordEl = document.getElementById('wordSwap');
  const archImgs = document.querySelectorAll('.hero__arch-img');
  const dots = document.querySelectorAll('.dot');

  let index = 0;
  const SLIDE_DURATION = 3600; // ms each slide is shown

  function goToSlide(next) {
    // text crossfade: blur+fade out current word, blur+fade in next word
    gsap.to(wordEl, {
      opacity: 0,
      y: -14,
      filter: 'blur(6px)',
      duration: .55,
      ease: 'power2.in',
      onComplete: () => {
        wordEl.textContent = words[next];
        gsap.fromTo(wordEl,
          { opacity: 0, y: 14, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, ease: 'power2.out' }
        );
      }
    });

    // image crossfade
    archImgs.forEach((img, i) => img.classList.toggle('is-active', i === next));

    // dots
    dots.forEach((d, i) => d.classList.toggle('is-active', i === next));

    index = next;
  }

  setInterval(() => {
    goToSlide((index + 1) % words.length);
  }, SLIDE_DURATION);

  /* ---------------------------------------------------------------------
     3. NAV — mobile burger toggle
  --------------------------------------------------------------------- */
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    menu.classList.toggle('is-open');
  });

  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      menu.classList.remove('is-open');
    });
  });

  /* ---------------------------------------------------------------------
     4. SUBTLE MOUSE PARALLAX on hero visuals
  --------------------------------------------------------------------- */
  const hero = document.getElementById('hero');
  const bg = document.getElementById('parallaxBg');
  const pattern = document.getElementById('parallaxPattern');
  const arch = document.querySelector('.hero__arch');

  let rafId = null;
  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - .5) * 2;   // -1 .. 1
    targetY = ((e.clientY - rect.top) / rect.height - .5) * 2;   // -1 .. 1
    if (!rafId) rafId = requestAnimationFrame(loop);
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0; targetY = 0;
    if (!rafId) rafId = requestAnimationFrame(loop);
  });

  function loop() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    if (bg) bg.style.transform = `translate(${curX * -10}px, ${curY * -8}px)`;
    if (pattern) pattern.style.transform = `translate(${curX * 14}px, ${curY * 10}px)`;
    if (arch) arch.style.marginLeft = `${curX * 6}px`;

    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  /* ---------------------------------------------------------------------
     5. HARMONY SECTION — scroll-triggered reveal + counter
  --------------------------------------------------------------------- */
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const harmonyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#harmony',
        start: 'top 78%',
        once: true
      },
      defaults: { ease: 'power3.out' }
    });

    harmonyTl
      .fromTo('[data-anim="h-stat"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7 }, 0)
      .fromTo('[data-anim="h-title"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8 }, .15)
      .fromTo('[data-anim="h-copy"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7 }, .3);

    // count-up 0 -> 42+
    const statNum = document.getElementById('statNum');
    if (statNum) {
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: '#harmony',
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: 42,
            duration: 1.4,
            delay: .2,
            ease: 'power2.out',
            onUpdate: () => { statNum.textContent = Math.round(counter.val) + '+'; }
          });
        }
      });
    }

    /* ---------------------------------------------------------------------
       6. WISDOM SECTION — scroll-triggered reveal + counter + testimonials
    --------------------------------------------------------------------- */
    const wisdomTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#wisdom',
        start: 'top 75%',
        once: true
      },
      defaults: { ease: 'power3.out' }
    });

    wisdomTl
      .fromTo('[data-anim="w-eyebrow"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, 0)
      .fromTo('[data-anim="w-title"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8 }, .12)
      .fromTo('[data-anim="w-desc"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7 }, .3)
      .fromTo('[data-anim="w-btn"]', { opacity: 0, y: 16, scale: .95 }, { opacity: 1, y: 0, scale: 1, duration: .6 }, .42)
      .fromTo('[data-anim="w-visual"]', { opacity: 0, y: 34, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, .2);

    const wisdomStatNum = document.getElementById('wisdomStatNum');
    if (wisdomStatNum) {
      const wCounter = { val: 0 };
      ScrollTrigger.create({
        trigger: '#wisdom',
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(wCounter, {
            val: 56,
            duration: 1.4,
            delay: .3,
            ease: 'power2.out',
            onUpdate: () => { wisdomStatNum.textContent = Math.round(wCounter.val) + '+'; }
          });
        }
      });
    }

    // testimonial carousel
    const testimonials = [
      { quote: 'The teachings, the community, and the peaceful atmosphere have helped me find my life.', name: 'Michael Anderson', city: 'Miami' },
      { quote: 'I never thought I would find such a welcoming and supportive community.', name: 'Emily Johnson', city: 'New York' }
    ];
    const qEl = document.getElementById('wisdomQuote');
    const nEl = document.getElementById('wisdomName');
    const cEl = document.getElementById('wisdomCity');
    const wDots = document.querySelectorAll('#wisdomDots .dot');
    let wIndex = 0;

    if (qEl) {
      setInterval(() => {
        wIndex = (wIndex + 1) % testimonials.length;
        const t = testimonials[wIndex];

        gsap.to([qEl, nEl, cEl], {
          opacity: 0,
          y: -10,
          duration: .4,
          ease: 'power2.in',
          onComplete: () => {
            qEl.textContent = t.quote;
            nEl.textContent = t.name;
            cEl.textContent = t.city;
            gsap.fromTo([qEl, nEl, cEl],
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: .5, ease: 'power2.out', stagger: .04 }
            );
          }
        });

        wDots.forEach((d, i) => d.classList.toggle('is-active', i === wIndex));
      }, 4000);
    }

    /* ==========================================================================
       BLOSSOM SECTION — lotus blooms open on scroll down,
       folds back pale (desaturated + collapsed) on scroll up
    ========================================================================== */

    const blossomLotus = document.getElementById('blossomLotus');
    const blossomFigure = document.getElementById('blossomFigure');

    // reveal the blossom copy text (eyebrow, title, desc, button)
    const blossomCopyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#blossom',
        start: 'top 78%',
        once: true
      },
      defaults: { ease: 'power3.out' }
    });

    blossomCopyTl
      .fromTo('[data-anim="b-eyebrow"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, 0)
      .fromTo('[data-anim="b-title"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8 }, .12)
      .fromTo('[data-anim="b-desc"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7 }, .28)
      .fromTo('[data-anim="b-btn"]', { opacity: 0, y: 16, scale: .95 }, { opacity: 1, y: 0, scale: 1, duration: .6 }, .4);

    if (blossomLotus) {

      const petalTargets = [
        { el: '.petal--0', rotate: 0 },
        { el: '.petal--1', rotate: -26 },
        { el: '.petal--2', rotate: 26 },
        { el: '.petal--3', rotate: -48 },
        { el: '.petal--4', rotate: 48 }
      ];

      const bloomTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#blossomFlower',
          start: 'top 60%',
          end: 'bottom 40%',
          toggleActions: 'play reverse play reverse'
        },
        defaults: { ease: 'back.out(1.5)' }
      });

      // Petals fan open from a closed, pale bud — center first, then outward pairs
      petalTargets.forEach((p, i) => {
        bloomTl.to(p.el, {
          rotate: p.rotate,
          scaleY: 1,
          filter: 'grayscale(0%)',
          opacity: p.el === '.petal--0' ? 1 : (p.el.includes('1') || p.el.includes('2') ? .95 : .92),
          duration: 1.1,
          ease: 'back.out(1.7)'
        }, i * .12);
      });

      // The monk portrait rises into the bloomed center (popup effect)
      bloomTl.to(blossomFigure, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: .85,
        ease: 'back.out(1.6)'
      }, .4);

      // When scroll back up, petals return automatically to closed state
      // (ScrollTrigger toggleActions handles this)
    }
  }
});