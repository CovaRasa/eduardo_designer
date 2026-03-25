const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const topbar = document.querySelector(".topbar");
const headerSun = document.querySelector(".header-sun");

if (topbar && headerSun) {
  const updateSunPosition = (event) => {
    const rect = topbar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = ((event.clientX - centerX) / rect.width) * 30;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;

    headerSun.style.setProperty("--sun-offset-x", `${offsetX.toFixed(2)}px`);
    headerSun.style.setProperty("--sun-offset-y", `${offsetY.toFixed(2)}px`);
  };

  const resetSunPosition = () => {
    headerSun.style.setProperty("--sun-offset-x", "0px");
    headerSun.style.setProperty("--sun-offset-y", "0px");
  };

  topbar.addEventListener("pointermove", updateSunPosition);
  topbar.addEventListener("pointerleave", resetSunPosition);
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".menu a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navItems.forEach((item) => {
        const isActive = item.getAttribute("href") === `#${id}`;
        item.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-40% 0px -45% 0px",
    threshold: 0.1,
  }
);

sections.forEach((section) => navObserver.observe(section));

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const tabButtons = document.querySelectorAll(".tab-btn");
const galleryTrack = document.getElementById("gallery-track");
const galleryCards = galleryTrack ? Array.from(galleryTrack.querySelectorAll(".project-card")) : [];
const scrollButtons = document.querySelectorAll(".gallery-scroll");

const updateScrollButtons = () => {
  if (!galleryTrack || !scrollButtons.length) {
    return;
  }

  const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;

  scrollButtons.forEach((button) => {
    const direction = button.dataset.direction;

    if (maxScroll <= 8) {
      button.disabled = true;
      return;
    }

    if (direction === "prev") {
      button.disabled = galleryTrack.scrollLeft <= 5;
      return;
    }

    button.disabled = galleryTrack.scrollLeft >= maxScroll - 5;
  });
};

const applyTab = (tab) => {
  tabButtons.forEach((button) => {
    const isActive = (button.dataset.tab || "") === tab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  galleryCards.forEach((card) => {
    const category = card.dataset.category || "";
    const shouldShow = tab === "all" || category === tab;
    card.classList.toggle("is-hidden", !shouldShow);
  });

  if (galleryTrack) {
    galleryTrack.scrollTo({ left: 0, behavior: "smooth" });
    window.setTimeout(updateScrollButtons, 180);
  }
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab || "all";
    applyTab(selectedTab);
  });
});

if (galleryTrack) {
  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.direction === "prev" ? -1 : 1;
      const jump = Math.max(galleryTrack.clientWidth * 0.72, 260);
      galleryTrack.scrollBy({ left: direction * jump, behavior: "smooth" });
    });
  });

  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  galleryTrack.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = galleryTrack.scrollLeft;
    galleryTrack.classList.add("dragging");
    galleryTrack.setPointerCapture(event.pointerId);
  });

  galleryTrack.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    const dragDistance = event.clientX - dragStartX;
    galleryTrack.scrollLeft = dragStartScroll - dragDistance;
  });

  const stopDrag = (event) => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    galleryTrack.classList.remove("dragging");

    if (galleryTrack.hasPointerCapture(event.pointerId)) {
      galleryTrack.releasePointerCapture(event.pointerId);
    }

    updateScrollButtons();
  };

  galleryTrack.addEventListener("pointerup", stopDrag);
  galleryTrack.addEventListener("pointercancel", stopDrag);
  galleryTrack.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      stopDrag(event);
    }
  });

  galleryTrack.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateScrollButtons);
  });

  window.addEventListener("resize", updateScrollButtons);
  updateScrollButtons();
}

if (tabButtons.length) {
  applyTab("all");
}

const magneticElements = document.querySelectorAll(".magnetic");

magneticElements.forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.setProperty("--mx", `${(x * 0.12).toFixed(2)}px`);
    element.style.setProperty("--my", `${(y * 0.15).toFixed(2)}px`);
  });

  element.addEventListener("pointerleave", () => {
    element.style.setProperty("--mx", "0px");
    element.style.setProperty("--my", "0px");
  });
});

const rippleTargets = document.querySelectorAll(".btn, .tab-btn, .gallery-scroll");

rippleTargets.forEach((target) => {
  target.addEventListener("pointerdown", (event) => {
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    target.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  });
});

const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (form && formMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = form.querySelector("#nome");
    const name = nameField && nameField.value.trim() ? nameField.value.trim() : "voce";

    formMessage.textContent = `Obrigado, ${name}. Sua mensagem foi recebida e eu retorno em breve.`;
    form.reset();
  });
}

const canvas = document.getElementById("bg-canvas");

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext("2d");

  if (context) {
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    let stars = [];
    let galaxies = [];
    let shootingStars = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const randomRange = (min, max) => min + Math.random() * (max - min);

    const starCount = () => {
      const density = (window.innerWidth * window.innerHeight) / 4200;
      return Math.max(180, Math.min(520, Math.floor(density)));
    };

    const galaxyCount = () => (window.innerWidth < 700 ? 2 : 3);

    const createStars = () => {
      const count = starCount();
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: randomRange(0.35, 1.9),
        depth: randomRange(0.25, 1),
        twinkleSpeed: randomRange(0.4, 1.6),
        twinklePhase: randomRange(0, Math.PI * 2),
        driftX: randomRange(-0.05, 0.05),
        driftY: randomRange(-0.04, 0.04),
      }));
    };

    const createGalaxies = () => {
      const layouts = [
        { x: 0.23, y: 0.24, radius: 0.26, hue: 206, spin: 1 },
        { x: 0.79, y: 0.4, radius: 0.2, hue: 42, spin: -1 },
        { x: 0.53, y: 0.77, radius: 0.18, hue: 188, spin: 1 },
      ];

      galaxies = layouts.slice(0, galaxyCount()).map((layout, index) => ({
        cx: width * layout.x,
        cy: height * layout.y,
        radius: Math.min(width, height) * layout.radius,
        hue: layout.hue,
        spin: layout.spin,
        armCount: 4 + (index % 2),
        rotationSpeed: randomRange(0.00005, 0.00012),
        intensity: randomRange(0.78, 1.15),
      }));
    };

    const spawnShootingStar = (
      originX = randomRange(width * 0.1, width * 0.9),
      originY = randomRange(-height * 0.2, height * 0.22),
      velocityX = randomRange(4.2, 8.4),
      velocityY = randomRange(1.6, 3.8)
    ) => {
      shootingStars.push({
        x: originX,
        y: originY,
        vx: velocityX,
        vy: velocityY,
        life: 1,
        trail: randomRange(18, 32),
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      createStars();
      createGalaxies();
      shootingStars = [];
    };

    const drawBackdrop = () => {
      const baseGradient = context.createLinearGradient(0, 0, width, height);
      baseGradient.addColorStop(0, "rgba(0, 0, 0, 0.82)");
      baseGradient.addColorStop(0.48, "rgba(3, 8, 18, 0.56)");
      baseGradient.addColorStop(1, "rgba(6, 14, 28, 0.44)");

      context.fillStyle = baseGradient;
      context.fillRect(0, 0, width, height);
    };

    const drawGalaxies = (time) => {
      galaxies.forEach((galaxy) => {
        const pointerOffsetX = ((pointer.x - width / 2) / width) * 24 * galaxy.intensity;
        const pointerOffsetY = ((pointer.y - height / 2) / height) * 18 * galaxy.intensity;
        const centerX = galaxy.cx + pointerOffsetX;
        const centerY = galaxy.cy + pointerOffsetY;

        const nebula = context.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          galaxy.radius * 1.24
        );
        nebula.addColorStop(0, `hsla(${galaxy.hue}, 68%, 66%, 0.2)`);
        nebula.addColorStop(0.4, `hsla(${galaxy.hue + 24}, 55%, 40%, 0.11)`);
        nebula.addColorStop(1, "rgba(0, 0, 0, 0)");

        context.fillStyle = nebula;
        context.beginPath();
        context.arc(centerX, centerY, galaxy.radius * 1.24, 0, Math.PI * 2);
        context.fill();

        for (let arm = 0; arm < galaxy.armCount; arm += 1) {
          for (let i = 0; i < 116; i += 1) {
            const t = i / 115;
            const armAngle = (Math.PI * 2 * arm) / galaxy.armCount;
            const spinPhase = time * galaxy.rotationSpeed * galaxy.spin;
            const curve = t * Math.PI * 7.4 + armAngle + spinPhase;
            const distance = t * galaxy.radius + Math.sin(time * 0.00042 + i * 0.7) * galaxy.radius * 0.014;
            const x = centerX + Math.cos(curve) * distance;
            const y = centerY + Math.sin(curve) * distance * 0.72;
            const alpha = Math.max(0, (1 - t) * 0.24);
            const size = (1 - t) * 1.45 + 0.18;

            context.fillStyle = `hsla(${galaxy.hue + t * 34}, 72%, ${62 - t * 16}%, ${alpha})`;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
          }
        }

        const core = context.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          galaxy.radius * 0.22
        );
        core.addColorStop(0, "rgba(255, 241, 214, 0.95)");
        core.addColorStop(1, "rgba(255, 241, 214, 0)");

        context.fillStyle = core;
        context.beginPath();
        context.arc(centerX, centerY, galaxy.radius * 0.22, 0, Math.PI * 2);
        context.fill();
      });
    };

    const projectStarPosition = (star, parallaxX, parallaxY) => ({
      x: star.x + parallaxX * star.depth,
      y: star.y + parallaxY * star.depth,
    });

    const updateAndDrawStars = (time) => {
      const parallaxX = ((pointer.x - width / 2) / width) * 28;
      const parallaxY = ((pointer.y - height / 2) / height) * 20;
      const constellationCandidates = [];

      stars.forEach((star) => {
        star.x += star.driftX * star.depth;
        star.y += star.driftY * star.depth;

        if (star.x < -4) {
          star.x = width + 4;
        } else if (star.x > width + 4) {
          star.x = -4;
        }

        if (star.y < -4) {
          star.y = height + 4;
        } else if (star.y > height + 4) {
          star.y = -4;
        }

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase);
        const alpha = 0.24 + twinkle * 0.72;
        const size = star.size * (0.82 + twinkle * 0.35);
        const point = projectStarPosition(star, parallaxX, parallaxY);
        const x = point.x;
        const y = point.y;

        context.fillStyle = `rgba(245, 230, 204, ${alpha})`;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();

        if (size > 1.28 && alpha > 0.5) {
          constellationCandidates.push({ x, y, size, alpha });
        }

        if (twinkle > 0.95) {
          context.strokeStyle = `rgba(245, 230, 204, ${alpha * 0.35})`;
          context.lineWidth = 0.65;
          context.beginPath();
          context.moveTo(x - size * 3, y);
          context.lineTo(x + size * 3, y);
          context.moveTo(x, y - size * 3);
          context.lineTo(x, y + size * 3);
          context.stroke();
        }
      });

      return constellationCandidates;
    };

    const drawConstellations = (points, time) => {
      if (points.length < 2) {
        return;
      }

      const maxDistance = 170;
      const linksPerPoint = 2;
      const selectedPoints = [...points].sort((a, b) => b.size - a.size).slice(0, 58);
      const drawnLinks = new Set();

      for (let i = 0; i < selectedPoints.length; i += 1) {
        const current = selectedPoints[i];
        const nearest = [];

        for (let j = 0; j < selectedPoints.length; j += 1) {
          if (i === j) {
            continue;
          }

          const other = selectedPoints[j];
          const distance = Math.hypot(current.x - other.x, current.y - other.y);

          if (distance <= maxDistance) {
            nearest.push({ index: j, distance });
          }
        }

        nearest.sort((a, b) => a.distance - b.distance);

        nearest.slice(0, linksPerPoint).forEach((candidate) => {
          const a = Math.min(i, candidate.index);
          const b = Math.max(i, candidate.index);
          const key = `${a}-${b}`;

          if (drawnLinks.has(key)) {
            return;
          }

          drawnLinks.add(key);

          const target = selectedPoints[candidate.index];
          const pulse = 0.58 + 0.42 * Math.sin(time * 0.001 + (i + candidate.index) * 0.72);
          const alpha = (1 - candidate.distance / maxDistance) * 0.38 * pulse;

          context.strokeStyle = `rgba(146, 220, 255, ${Math.max(alpha, 0.06)})`;
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(target.x, target.y);
          context.stroke();
        });
      }

      selectedPoints.forEach((point) => {
        context.fillStyle = `rgba(255, 236, 190, ${Math.min(point.alpha, 0.95)})`;
        context.beginPath();
        context.arc(point.x, point.y, Math.max(point.size * 0.62, 1), 0, Math.PI * 2);
        context.fill();
      });
    };

    const updateAndDrawShootingStars = () => {
      for (let i = shootingStars.length - 1; i >= 0; i -= 1) {
        const star = shootingStars[i];

        star.x += star.vx;
        star.y += star.vy;
        star.life -= 0.013;

        const tailX = star.x - star.vx * star.trail;
        const tailY = star.y - star.vy * star.trail;
        const trail = context.createLinearGradient(star.x, star.y, tailX, tailY);
        trail.addColorStop(0, `rgba(255, 239, 204, ${Math.max(star.life, 0)})`);
        trail.addColorStop(1, "rgba(255, 239, 204, 0)");

        context.strokeStyle = trail;
        context.lineWidth = 1.3;
        context.beginPath();
        context.moveTo(star.x, star.y);
        context.lineTo(tailX, tailY);
        context.stroke();

        if (star.life <= 0 || star.x > width + 220 || star.y > height + 220 || star.x < -220) {
          shootingStars.splice(i, 1);
        }
      }
    };

    const drawPointerAura = () => {
      if (!pointer.active) {
        return;
      }

      const aura = context.createRadialGradient(pointer.x, pointer.y, 3, pointer.x, pointer.y, 160);
      aura.addColorStop(0, "rgba(125, 203, 255, 0.2)");
      aura.addColorStop(1, "rgba(125, 203, 255, 0)");

      context.fillStyle = aura;
      context.beginPath();
      context.arc(pointer.x, pointer.y, 160, 0, Math.PI * 2);
      context.fill();
    };

    const animate = (time) => {
      context.clearRect(0, 0, width, height);
      drawBackdrop();
      drawGalaxies(time);
      const constellationPoints = updateAndDrawStars(time);
      drawConstellations(constellationPoints, time);

      if (Math.random() < 0.0032 && shootingStars.length < 4) {
        spawnShootingStar();
      }

      updateAndDrawShootingStars();
      drawPointerAura();

      window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);

    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });

    window.addEventListener("pointerout", (event) => {
      if (event.relatedTarget === null) {
        pointer.active = false;
        pointer.x = width / 2;
        pointer.y = height / 2;
      }
    });

    window.addEventListener("click", (event) => {
      spawnShootingStar(event.clientX - 80, event.clientY - 40, randomRange(5, 8.8), randomRange(1.8, 3.7));
    });

    resize();
    animate();
  }
}