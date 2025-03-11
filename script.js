document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  const preloader = document.querySelector(".preloader")
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0"
      preloader.style.visibility = "hidden"

      // Start animations after preloader is gone
      animateSkillBars()
      initAOS()
    }, 1500)
  })

  // Custom Cursor
  const cursorDot = document.querySelector(".cursor-dot")
  const cursorOutline = document.querySelector(".cursor-outline")
  const cursorGlow = document.querySelector(".cursor-glow")

  document.addEventListener("mousemove", (e) => {
    const posX = e.clientX
    const posY = e.clientY

    cursorDot.style.left = `${posX}px`
    cursorDot.style.top = `${posY}px`

    cursorOutline.style.left = `${posX}px`
    cursorOutline.style.top = `${posY}px`

    cursorGlow.style.left = `${posX}px`
    cursorGlow.style.top = `${posY}px`
  })

  // Cursor effects for interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .menu-btn, .certificate-card, .tool-item, .social-links a",
  )

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorOutline.style.borderColor = "var(--accent-primary)"
      cursorGlow.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorGlow.style.opacity = "0.8"
    })

    el.addEventListener("mouseleave", () => {
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)"
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1)"
      cursorOutline.style.borderColor = "var(--accent-primary)"
      cursorGlow.style.transform = "translate(-50%, -50%) scale(1)"
      cursorGlow.style.opacity = "0.5"
    })
  })

  // Hide cursor when mouse leaves window
  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = "0"
    cursorOutline.style.opacity = "0"
    cursorGlow.style.opacity = "0"
  })

  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = "1"
    cursorOutline.style.opacity = "1"
    cursorGlow.style.opacity = "0.5"
  })

  // Particle Background
  function initParticles() {
    const canvas = document.getElementById("particles-canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 100

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = "var(--accent-primary)"
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function createParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = "var(--accent-primary)"
            ctx.globalAlpha = 0.1 * (1 - distance / 100)
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animateParticles)
    }

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })

    createParticles()
    animateParticles()
  }

  initParticles()

  // Header Scroll Effect
  const header = document.querySelector(".header")
  const progressFill = document.querySelector(".progress-fill")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    // Update progress bar
    const scrollTop = window.scrollY
    const docHeight = document.body.offsetHeight
    const winHeight = window.innerHeight
    const scrollPercent = scrollTop / (docHeight - winHeight)
    progressFill.style.width = `${scrollPercent * 100}%`
  })

  // Mobile Menu
  const menuBtn = document.querySelector(".menu-btn")
  const navLinks = document.querySelector(".nav-links")

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open")
    navLinks.classList.toggle("active")

    // Prevent scrolling when menu is open
    if (navLinks.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  })

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("open")
      navLinks.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Typed Text Effect
  function typeWriter() {
    const typedTextElement = document.querySelector(".typed-text")
    const cursorElement = document.querySelector(".cursor")
    const textArray = ["Cybersecurity Specialist", "Penetration Tester", "Ethical Hacker", "Security Researcher"]
    let textArrayIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typingSpeed = 100

    function type() {
      const currentText = textArray[textArrayIndex]

      if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1)
        charIndex--
        typingSpeed = 50
      } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1)
        charIndex++
        typingSpeed = 100
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true
        typingSpeed = 1000 // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        textArrayIndex = (textArrayIndex + 1) % textArray.length
        typingSpeed = 500 // Pause before typing next
      }

      setTimeout(type, typingSpeed)
    }

    if (typedTextElement) {
      setTimeout(type, 1000)
    }
  }

  typeWriter()

  // Education Tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanels = document.querySelectorAll(".tab-panel")
  const tabIndicator = document.querySelector(".tab-indicator")

  function setActiveTab(index) {
    tabBtns.forEach((btn) => btn.classList.remove("active"))
    tabPanels.forEach((panel) => panel.classList.remove("active"))

    tabBtns[index].classList.add("active")
    tabPanels[index].classList.add("active")

    // Update indicator position
    if (tabIndicator) {
      const activeBtn = tabBtns[index]
      tabIndicator.style.width = `${activeBtn.offsetWidth}px`
      tabIndicator.style.left = `${activeBtn.offsetLeft}px`
    }
  }

  tabBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      setActiveTab(index)
    })
  })

  // Initialize first tab
  if (tabBtns.length > 0) {
    setActiveTab(0)
  }

  // Certificate Slider
  const certificateSlider = document.querySelector(".certificate-slider")
  const certificateSlides = document.querySelectorAll(".certificate-slide")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")
  const paginationContainer = document.querySelector(".slider-pagination")

  let currentIndex = 0
  let slidesToShow = getSlidesToShow()

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1
    if (window.innerWidth <= 1200) return 2
    return 3
  }

  function createPagination() {
    if (!paginationContainer) return

    paginationContainer.innerHTML = ""
    const totalPages = Math.ceil(certificateSlides.length / slidesToShow)

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div")
      dot.classList.add("pagination-dot")
      if (i === 0) dot.classList.add("active")

      dot.addEventListener("click", () => {
        goToSlide(i * slidesToShow)
      })

      paginationContainer.appendChild(dot)
    }
  }

  function updatePagination() {
    if (!paginationContainer) return

    const dots = paginationContainer.querySelectorAll(".pagination-dot")
    const activePage = Math.floor(currentIndex / slidesToShow)

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activePage)
    })
  }

  function goToSlide(index) {
    currentIndex = index
    const slideWidth = certificateSlider.clientWidth / slidesToShow
    certificateSlider.style.transform = `translateX(-${currentIndex * slideWidth}px)`
    updatePagination()
  }

  function nextSlide() {
    if (currentIndex < certificateSlides.length - slidesToShow) {
      goToSlide(currentIndex + 1)
    } else {
      goToSlide(0) // Loop back to start
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1)
    } else {
      goToSlide(certificateSlides.length - slidesToShow) // Loop to end
    }
  }

  if (certificateSlider && certificateSlides.length > 0) {
    // Initialize slider
    createPagination()

    // Event listeners
    if (prevBtn) prevBtn.addEventListener("click", prevSlide)
    if (nextBtn) nextBtn.addEventListener("click", nextSlide)

    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000)

    certificateSlider.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    certificateSlider.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000)
    })

    // Flip cards on click
    certificateSlides.forEach((slide) => {
      const card = slide.querySelector(".certificate-card")
      if (card) {
        card.addEventListener("click", () => {
          card.classList.toggle("flipped")
        })
      }
    })

    // Update on resize
    window.addEventListener("resize", () => {
      const newSlidesToShow = getSlidesToShow()
      if (newSlidesToShow !== slidesToShow) {
        slidesToShow = newSlidesToShow
        createPagination()
        goToSlide(0)
      }
    })
  }

  // Skill Progress Bars
  function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress")

    skillBars.forEach((bar) => {
      const percent = bar.getAttribute("data-percent")
      bar.style.width = `${percent}%`
    })
  }

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById("scroll-to-top")

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible")
    } else {
      scrollToTopBtn.classList.remove("visible")
    }
  })

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Contact Form
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value.trim()
      const email = document.getElementById("email").value.trim()
      const message = document.getElementById("message").value.trim()

      if (name && email && message) {
        const mailtoLink = `mailto:muzammil.khan92@hotmail.com?subject=Contact from ${name}&body=From: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`
        window.location.href = mailtoLink

        // Reset form
        contactForm.reset()
      } else {
        alert("Please fill in all fields.")
      }
    })
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Active Navigation Link on Scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-links a")

    let currentSection = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const headerHeight = document.querySelector(".header").offsetHeight

      if (window.pageYOffset >= sectionTop - headerHeight - 100) {
        currentSection = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", updateActiveNavLink)
  updateActiveNavLink()

  // AOS (Animate On Scroll) Initialization
  function initAOS() {
    const elements = document.querySelectorAll("[data-aos]")
    const windowHeight = window.innerHeight

    function checkPosition() {
      elements.forEach((element) => {
        const positionFromTop = element.getBoundingClientRect().top

        if (positionFromTop - windowHeight <= -100) {
          const delay = element.getAttribute("data-aos-delay") || 0
          setTimeout(() => {
            element.classList.add("aos-animate")
          }, delay)
        }
      })
    }

    window.addEventListener("scroll", checkPosition)
    checkPosition()
  }
})

document.addEventListener("DOMContentLoaded", () => {
  // Certificate hover effect enhancement
  const certificateCards = document.querySelectorAll(".certificate-card")

  certificateCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      certificateCards.forEach((c) => (c.style.opacity = "0.7"))
      card.style.opacity = "1"
    })

    card.addEventListener("mouseleave", () => {
      certificateCards.forEach((c) => (c.style.opacity = "1"))
    })
  })
})

