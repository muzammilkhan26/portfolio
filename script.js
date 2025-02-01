document.addEventListener("DOMContentLoaded", () => {
  // Custom cursor
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px"
    cursor.style.top = e.clientY + "px"

    setTimeout(() => {
      cursorFollower.style.left = e.clientX + "px"
      cursorFollower.style.top = e.clientY + "px"
    }, 50)
  })

  document.addEventListener("mousedown", () => {
    cursor.style.transform = "scale(0.7)"
    cursorFollower.style.transform = "scale(1.2)"
  })

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "scale(1)"
    cursorFollower.style.transform = "scale(1)"
  })

  // Hover effect for links and buttons
  const interactiveElements = document.querySelectorAll("a, button, .menu-btn, .slider-btn")
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)"
      cursorFollower.style.transform = "scale(1.5)"
    })
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)"
      cursorFollower.style.transform = "scale(1)"
    })
  })

  // Mobile menu functionality
  const menuBtn = document.querySelector(".menu-btn")
  const navLinks = document.querySelector(".nav-links")
  let menuOpen = false

  menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
      menuBtn.classList.add("active")
      navLinks.classList.add("active")
      menuOpen = true
    } else {
      menuBtn.classList.remove("active")
      navLinks.classList.remove("active")
      menuOpen = false
    }
  })

  // Close menu when clicking on a link
  const navLinksArray = document.querySelectorAll(".nav-links a")
  navLinksArray.forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active")
      navLinks.classList.remove("active")
      menuOpen = false
    })
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar") && menuOpen) {
      menuBtn.classList.remove("active")
      navLinks.classList.remove("active")
      menuOpen = false
    }
  })

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      const offset = 80 // Height of fixed navbar
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    })
  })

  // Active section highlighting
  const sections = document.querySelectorAll(".section")
  const navItems = document.querySelectorAll(".nav-links a")

  window.addEventListener("scroll", () => {
    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href").slice(1) === current) {
        item.classList.add("active")
      }
    })
  })

  // Reveal animations
  const revealElements = document.querySelectorAll(".reveal")
  const revealElementsOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", revealElementsOnScroll)
  revealElementsOnScroll() // Initial check on page load

  // Certificate slider functionality
  function initCertificateSlider() {
    const slider = document.querySelector(".certificate-slider")
    const slides = document.querySelectorAll(".certificate-slide")
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")

    let currentIndex = 0

    function getSlidesToShow() {
      if (window.innerWidth <= 768) return 1
      if (window.innerWidth <= 1024) return 2
      return 3
    }

    function updateSlider() {
      const slidesToShow = getSlidesToShow()
      const slideWidth = slider.clientWidth / slidesToShow
      const offset = -currentIndex * slideWidth

      slider.style.transform = `translateX(${offset}px)`

      slides.forEach((slide, index) => {
        if (index >= currentIndex && index < currentIndex + slidesToShow) {
          slide.classList.add("active")
        } else {
          slide.classList.remove("active")
        }
      })

      // Update button states
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1"
      nextBtn.style.opacity = currentIndex >= slides.length - slidesToShow ? "0.5" : "1"
    }

    function nextSlide() {
      const slidesToShow = getSlidesToShow()
      if (currentIndex < slides.length - slidesToShow) {
        currentIndex++
        updateSlider()
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--
        updateSlider()
      }
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide)
    prevBtn.addEventListener("click", prevSlide)

    // Touch events for mobile
    let touchStartX = 0
    let touchEndX = 0

    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    slider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        if (touchStartX - touchEndX > 50) {
          nextSlide()
        } else if (touchEndX - touchStartX > 50) {
          prevSlide()
        }
      },
      { passive: true },
    )

    // Update on resize
    let resizeTimer
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        currentIndex = 0
        updateSlider()
      }, 250)
    })

    // Initial setup
    updateSlider()
  }

  // Initialize certificate slider
  initCertificateSlider()

  // Glitch text effect
  const glitchTexts = document.querySelectorAll(".glitch")
  glitchTexts.forEach((text) => {
    text.setAttribute("data-text", text.textContent)
  })

  // Loading animation
  window.addEventListener("load", () => {
    const loader = document.querySelector(".loading")
    if (loader) {
      loader.style.opacity = "0"
      setTimeout(() => {
        loader.style.display = "none"
      }, 500)
    }
  })

  // Parallax effect for hero section
  const heroSection = document.querySelector("#home")
  window.addEventListener("scroll", () => {
    const scrollPosition = window.pageYOffset
    heroSection.style.backgroundPositionY = scrollPosition * 0.7 + "px"
  })

  // Form submission with validation
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = contactForm.querySelector('input[type="text"]').value
      const email = contactForm.querySelector('input[type="email"]').value
      const message = contactForm.querySelector("textarea").value

      if (name && email && message) {
        // Here you would typically send the form data to a server
        console.log("Form submitted:", { name, email, message })
        alert("Thank you for your message! I will get back to you soon.")
        contactForm.reset()
      } else {
        alert("Please fill in all fields.")
      }
    })
  }

  // Typing effect for hero subtitle
  function typeWriter(element, text, speed = 50) {
    let i = 0
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(type, speed)
      }
    }
    type()
  }

  const heroSubtitle = document.querySelector(".hero-subtitle")
  if (heroSubtitle) {
    const subtitleText = heroSubtitle.textContent
    heroSubtitle.textContent = ""
    typeWriter(heroSubtitle, subtitleText)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".contact-form button").addEventListener("click", (e) => {
      e.preventDefault();
      sendEmail();
  });
});

function sendEmail() {
  const name = document.querySelector('input[type="text"]').value.trim();
  const email = document.querySelector('input[type="email"]').value.trim();
  const message = document.querySelector("textarea").value.trim();

  if (name && email && message) {
      const mailtoLink = `mailto:muzammil.khan92@hotmail.com?subject=New Message from ${name}&body=Email: ${email}%0A%0AMessage:%0A${message}`;
      window.location.href = mailtoLink;
  } else {
      alert("Please fill in all fields.");
  }
}
// Scroll to top functionality
const scrollToTopButton = document.getElementById("scroll-to-top")

// Show button when scrolling down
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    // Show button after 300px scroll
    scrollToTopButton.classList.add("visible")
  } else {
    scrollToTopButton.classList.remove("visible")
  }
})

// Smooth scroll to top when button is clicked
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})