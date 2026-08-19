(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav toggle ---- */
  var navLinks = document.getElementById('navLinks');
  var toggleBtn = document.querySelector('.mobile-toggle');

  window.toggleMenu = function () {
    var isOpen = navLinks.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Smooth scroll for in-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    });
  });

  /* ---- Scroll-reveal for sections ---- */
  if (prefersReducedMotion) {
    document.querySelectorAll('section').forEach(function (section) {
      section.style.opacity = '1';
      section.style.transform = 'none';
    });
  } else {
    var revealSections = document.querySelectorAll('section');
    var revealAll = function () {
      revealSections.forEach(function (section) {
        section.style.opacity = '1';
        section.style.transform = 'none';
      });
    };

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0 });

    revealSections.forEach(function (section) {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      revealObserver.observe(section);
    });

    // Safety net: if a section never registers as "intersecting" (e.g. it's
    // taller than the viewport so its threshold-0 edges never trigger, a
    // crawler/automated renderer that never scrolls, or any other edge case
    // the observer misses) force everything visible so content can never be
    // silently stuck invisible.
    window.setTimeout(revealAll, 2000);
  }

  /* ---- Active nav link highlighting ---- */
  var navAnchorLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var trackedSections = navAnchorLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (trackedSections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navAnchorLinks.forEach(function (link) {
          var isActive = link.getAttribute('href') === id;
          link.classList.toggle('active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    trackedSections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---- Scroll-to-top button ---- */
  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    var toggleScrollTop = function () {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleScrollTop, { passive: true });
    toggleScrollTop();
  }

  /* ---- Dynamic footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Hero rotating focus areas (Typed.js) ---- */
  var typedTarget = document.getElementById('typed-roles');
  if (typedTarget && !prefersReducedMotion && typeof Typed !== 'undefined') {
    new Typed('#typed-roles', {
      strings: ['Computer Vision', 'Generative AI &amp; NLP', 'ML-Powered Backends', 'MLOps &amp; Deployment'],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1800,
      smartBackspace: true,
      loop: true
    });
  }

  /* ---- GitHub stats widget: hide gracefully if the public stats
     service is unavailable, instead of showing broken-image icons ---- */
  var statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    var statsImgs = statsRow.querySelectorAll('img');
    var failedCount = 0;
    statsImgs.forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        failedCount += 1;
        if (failedCount === statsImgs.length) {
          statsRow.style.display = 'none';
        }
      });
    });
  }

  /* ---- Site search ---- */
  var SEARCH_INDEX = [
    { title: 'About Me', snippet: 'AI/ML engineer who builds complete systems.', target: '#about', tag: 'Section' },
    { title: 'Intelligent Applications', snippet: 'End-to-end applications where ML is the core feature.', target: '#build', tag: 'What I Build' },
    { title: 'Generative AI & NLP', snippet: 'LLM API integration (Gemini, Groq), TF-IDF, prompt-driven automation.', target: '#build', tag: 'What I Build' },
    { title: 'Computer Vision', snippet: 'Real-time detection, tracking and OCR with YOLO and OpenCV.', target: '#build', tag: 'What I Build' },
    { title: 'Backend & APIs', snippet: 'FastAPI, Flask, REST APIs, NVIDIA Triton model serving.', target: '#build', tag: 'What I Build' },
    { title: 'Data & ML Systems', snippet: 'Data pipelines, feature engineering, predictive modeling.', target: '#build', tag: 'What I Build' },
    { title: 'Production ML Inference API', snippet: 'FastAPI + NVIDIA Triton, ONNX, Docker, Kubernetes. p95 200ms.', target: '#projects', tag: 'Project' },
    { title: 'Real-Time Vehicle Detection & Tracking', snippet: 'YOLO, OpenCV, OCR smart-parking pipeline. 95%+ accuracy.', target: '#proj-vehicle-detection', tag: 'Project' },
    { title: 'Customer Support CSAT Prediction', snippet: 'XGBoost, SMOTE, SHAP, NLP/TF-IDF. 89.2% accuracy.', target: '#projects', tag: 'Project' },
    { title: 'IoT Sensor Data Imputation Platform', snippet: 'ML-based imputation for missing IoT sensor readings.', target: '#projects', tag: 'Project' },
    { title: 'XAMBOREE', snippet: 'Full-stack event management platform, ticket booking.', target: '#projects', tag: 'Project' },
    { title: 'Open-Source & Other Work', snippet: 'Counterfactual, MEMC, Peer Reviewer Finder, Webscraper.', target: '#opensource', tag: 'Section' },
    { title: 'Research Intern — NIT Rourkela', snippet: 'IoT Smart Parking System, YOLO object detection, May-July 2024.', target: '#experience', tag: 'Experience' },
    { title: 'B.Tech, XIM University', snippet: 'Computer Science and Engineering (Hons.), 2021-2025.', target: '#experience', tag: 'Education' },
    { title: 'AI / Machine Learning', snippet: 'PyTorch, TensorFlow, Scikit-learn, CNNs, RNNs, model deployment.', target: '#skills', tag: 'Skills' },
    { title: 'Generative AI & NLP skills', snippet: 'Transformers, NLP, TF-IDF, LLM APIs, prompt engineering.', target: '#skills', tag: 'Skills' },
    { title: 'Computer Vision skills', snippet: 'YOLO, OpenCV, OCR, real-time detection and tracking.', target: '#skills', tag: 'Skills' },
    { title: 'MLOps & Infrastructure', snippet: 'Docker, Kubernetes, MLflow, Prometheus, AWS, GCP.', target: '#skills', tag: 'Skills' },
    { title: 'Coding Profiles', snippet: 'CodeChef, LeetCode, Codeforces, HackerRank, GeeksforGeeks.', target: '#links', tag: 'Section' },
    { title: 'Contact', snippet: 'Email, phone, LinkedIn and GitHub.', target: '#contact', tag: 'Section' },
    { title: 'Resume', snippet: 'Download the resume PDF.', target: 'https://drive.google.com/uc?export=download&id=1YV2-aIi_iUuKmIl474Cd4BjDEclVXs2i', tag: 'Link' }
  ];

  var searchToggle = document.getElementById('searchToggle');
  var searchPanel = document.getElementById('searchPanel');
  var searchBackdrop = document.getElementById('searchBackdrop');
  var searchInput = document.getElementById('searchInput');
  var searchClose = document.getElementById('searchClose');
  var searchResultsEl = document.getElementById('searchResults');

  if (searchToggle && searchPanel) {
    var activeIndex = -1;
    var currentResults = [];

    var renderResults = function (items) {
      searchResultsEl.innerHTML = '';
      activeIndex = -1;
      currentResults = items;

      if (!items.length) {
        var empty = document.createElement('li');
        empty.className = 'search-empty';
        empty.textContent = 'No matches. Try a different word.';
        searchResultsEl.appendChild(empty);
        return;
      }

      items.forEach(function (item, i) {
        var li = document.createElement('li');
        var el = document.createElement('a');
        el.className = 'search-result';
        el.href = item.target;
        if (item.target.indexOf('#') !== 0) {
          el.target = '_blank';
          el.rel = 'noopener';
        }
        el.dataset.index = i;

        var strong = document.createElement('strong');
        strong.textContent = item.title;
        var span = document.createElement('span');
        span.textContent = item.snippet;
        var tag = document.createElement('span');
        tag.className = 'search-result-tag';
        tag.textContent = item.tag;

        el.appendChild(strong);
        el.appendChild(span);
        el.appendChild(tag);
        el.addEventListener('click', function (e) {
          if (item.target.indexOf('#') === 0) {
            e.preventDefault();
            var dest = document.querySelector(item.target);
            closeSearch();
            if (dest) {
              window.setTimeout(function () {
                dest.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
              }, 50);
            }
          } else {
            closeSearch();
          }
        });

        li.appendChild(el);
        searchResultsEl.appendChild(li);
      });
    };

    var filterResults = function (query) {
      var q = query.trim().toLowerCase();
      if (!q) {
        renderResults(SEARCH_INDEX);
        return;
      }
      var filtered = SEARCH_INDEX.filter(function (item) {
        return (item.title + ' ' + item.snippet + ' ' + item.tag).toLowerCase().indexOf(q) !== -1;
      });
      renderResults(filtered);
    };

    var openSearch = function () {
      searchPanel.hidden = false;
      searchBackdrop.hidden = false;
      searchToggle.setAttribute('aria-expanded', 'true');
      renderResults(SEARCH_INDEX);
      searchInput.value = '';
      window.setTimeout(function () { searchInput.focus(); }, 10);
      document.body.style.overflow = 'hidden';
    };

    var closeSearch = function () {
      searchPanel.hidden = true;
      searchBackdrop.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      searchToggle.focus();
    };

    searchToggle.addEventListener('click', function () {
      if (searchPanel.hidden) { openSearch(); } else { closeSearch(); }
    });
    searchClose.addEventListener('click', closeSearch);
    searchBackdrop.addEventListener('click', closeSearch);

    searchInput.addEventListener('input', function () {
      filterResults(searchInput.value);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== searchInput && searchPanel.hidden) {
        e.preventDefault();
        openSearch();
        return;
      }
      if (searchPanel.hidden) return;

      if (e.key === 'Escape') {
        closeSearch();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var links = searchResultsEl.querySelectorAll('.search-result');
        if (!links.length) return;
        activeIndex += e.key === 'ArrowDown' ? 1 : -1;
        if (activeIndex < 0) activeIndex = links.length - 1;
        if (activeIndex >= links.length) activeIndex = 0;
        links.forEach(function (l) { l.classList.remove('active'); });
        links[activeIndex].classList.add('active');
        links[activeIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        var active = searchResultsEl.querySelector('.search-result.active') || searchResultsEl.querySelector('.search-result');
        if (active) active.click();
      }
    });
  }

  /* ---- "Ask about Daniel" chatbot ----
     Rule-based only: matches the visitor's message against a fixed set of
     keyword-tagged answers built from real content already on this page.
     No LLM, no API calls, no external service — it can only ever say what's
     already true and published here. */
  var CHAT_KB = [
    {
      keywords: ['who', 'about', 'yourself', 'introduce', 'daniel is', 'what does daniel do'],
      answer: 'Daniel Bavisetti is an AI/ML Engineer who builds computer vision pipelines, ML-powered backends, and production inference systems. He\'s currently deepening his work in generative AI and applied NLP. Based in Rajahmundry, India.'
    },
    {
      keywords: ['skill', 'tech stack', 'technology', 'technologies', 'language', 'framework', 'know'],
      answer: 'Core stack: Python, PyTorch, TensorFlow and Scikit-learn for ML; YOLO/OpenCV for computer vision; FastAPI, Flask and NVIDIA Triton for backend & model serving; Docker, Kubernetes, MLflow and Prometheus for MLOps; and Gemini/Groq LLM APIs plus NLP/TF-IDF for generative AI work. Full list in the Technical Stack section.'
    },
    {
      keywords: ['triton', 'inference api', 'resnet', 'onnx', 'model serving', 'deploy'],
      answer: 'The Production ML Inference API serves a ResNet50 classifier via FastAPI in front of NVIDIA Triton (ONNX, dynamic batching), containerized with Docker and Kubernetes HPA. Load-tested at ~122ms avg / 200ms p95 latency, zero failed requests. Code: <a href="https://github.com/Daniel-Bavisetti/fastapi-triton-resnet50" target="_blank" rel="noopener">fastapi-triton-resnet50</a>'
    },
    {
      keywords: ['parking', 'vehicle', 'yolo', 'license plate', 'nit rourkela', 'rourkela', 'ocr'],
      answer: 'During a Research Internship at NIT Rourkela (May-July 2024), Daniel built an IoT Smart Parking System: a YOLO-based vehicle detector at 95%+ accuracy, real-time multi-vehicle tracking, and license-plate recognition via OCR.'
    },
    {
      keywords: ['csat', 'customer satisfaction', 'xgboost', 'flipkart', 'sentiment', 'shap', 'smote'],
      answer: 'The Customer Support CSAT Prediction project analyzed 85,907 support records to predict satisfaction, using SMOTE for class balance, TF-IDF for sentiment, and an XGBoost classifier at 89.2% accuracy (F1 0.89), with SHAP for driver analysis. Code: <a href="https://github.com/Daniel-Bavisetti/Flipkart_Customer_Satisfaction" target="_blank" rel="noopener">Flipkart_Customer_Satisfaction</a>'
    },
    {
      keywords: ['project', 'built', 'portfolio', 'what has daniel built'],
      answer: 'Highlights: a production ML inference API (FastAPI + NVIDIA Triton), a real-time vehicle detection & tracking system from a research internship, and a customer support CSAT prediction model. See the Featured Projects section for all five, each with an expandable architecture diagram.'
    },
    {
      keywords: ['experience', 'intern', 'internship', 'job', 'work history'],
      answer: 'Research Intern at NIT Rourkela (May-July 2024), building the IoT Smart Parking System. Also completing a B.Tech (Hons.) in Computer Science at XIM University, Bhubaneswar (2021-2025).'
    },
    {
      keywords: ['education', 'degree', 'university', 'college', 'study', 'cgpa', 'btech'],
      answer: 'B.Tech (Hons.) in Computer Science and Engineering, XIM University, Bhubaneswar (2021-2025). CGPA 7.71, Class 12: 94.1%, Class 10: 9.7 GPA. Coursework: ML, DL & NLP, AI, Data Science, Software Engineering, Big Data, Web Tech, Blockchain.'
    },
    {
      keywords: ['contact', 'reach', 'hire', 'email', 'phone', 'call'],
      answer: 'Reach Daniel at daniel.bavisetti0579@gmail.com or 9121592164, or connect via LinkedIn/GitHub in the Contact section.'
    },
    {
      keywords: ['resume', 'cv'],
      answer: 'Download Daniel\'s resume via the Resume button in the nav bar, or the button in the Experience section.'
    },
    {
      keywords: ['github', 'leetcode', 'codechef', 'codeforces', 'hackerrank', 'competitive', 'coding profile'],
      answer: 'Coding profiles: CodeChef (2★), LeetCode (rating 1729), Codeforces (rating 436), HackerRank (1259 Hackos), GeeksforGeeks, and GitHub — all linked in the Coding Profiles section.'
    },
    {
      keywords: ['generative', 'llm', 'gpt', 'gemini', 'groq', 'prompt', 'rag'],
      answer: 'Generative AI/NLP work includes LLM API integration (Gemini, Groq) for automation workflows, and NLP feature pipelines (TF-IDF, sentiment analysis) used in the CSAT prediction project.'
    },
    {
      keywords: ['computer vision', ' cv ', 'detection', 'tracking', 'image classif'],
      answer: 'Computer vision is one of Daniel\'s strongest areas — real-time YOLO-based detection and multi-vehicle tracking, OpenCV pipelines, and OCR for license-plate recognition from the NIT Rourkela internship.'
    },
    {
      keywords: ['location', 'live', 'based', 'city', 'where'],
      answer: 'Daniel is based in Rajahmundry, Andhra Pradesh, India.'
    },
    {
      keywords: ['open source', 'other work', 'github repo', 'side project'],
      answer: 'Beyond the featured projects: Counterfactual (explainable-AI decisions), Peer Reviewer Finder, MEMC (motion estimation/compensation), and a Python web scraper. See the Open-Source & Other Work section.'
    }
  ];
  var CHAT_GREETINGS = ['hi', 'hello', 'hey', 'yo', 'sup'];
  var CHAT_FALLBACK = 'I can only answer from what\'s published on this page — try asking about skills, projects, experience, education, or how to contact Daniel. Or use the search icon in the nav to jump straight to a section.';
  var CHAT_QUICK = ['Skills', 'Projects', 'Experience', 'Contact'];

  var chatToggle = document.getElementById('chatToggle');
  var chatPanel = document.getElementById('chatPanel');
  var chatMessages = document.getElementById('chatMessages');
  var chatQuick = document.getElementById('chatQuickReplies');
  var chatForm = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');

  if (chatToggle && chatPanel) {
    var chatStarted = false;

    var addChatMessage = function (text, sender, asHtml) {
      var msg = document.createElement('div');
      msg.className = 'chat-msg ' + (sender === 'user' ? 'chat-msg-user' : 'chat-msg-bot');
      if (asHtml) {
        msg.innerHTML = text;
      } else {
        msg.textContent = text;
      }
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    var answerFor = function (query) {
      var q = query.toLowerCase();
      var isGreeting = CHAT_GREETINGS.some(function (g) { return q === g || q.indexOf(g) === 0; });
      if (isGreeting) {
        return 'Hi! Ask me about Daniel\'s skills, projects, experience, education, or how to get in touch.';
      }
      var best = null;
      var bestScore = 0;
      CHAT_KB.forEach(function (entry) {
        var score = entry.keywords.reduce(function (acc, kw) {
          return acc + (q.indexOf(kw) !== -1 ? kw.length : 0);
        }, 0);
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
      });
      return best ? best.answer : CHAT_FALLBACK;
    };

    var sendChat = function (text) {
      if (!text.trim()) return;
      addChatMessage(text, 'user');
      chatInput.value = '';
      window.setTimeout(function () {
        addChatMessage(answerFor(text), 'bot', true);
      }, prefersReducedMotion ? 0 : 350);
    };

    var renderQuickReplies = function () {
      chatQuick.innerHTML = '';
      CHAT_QUICK.forEach(function (label) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.addEventListener('click', function () { sendChat(label); });
        chatQuick.appendChild(btn);
      });
    };

    var openChat = function () {
      chatPanel.hidden = false;
      chatToggle.setAttribute('aria-expanded', 'true');
      if (!chatStarted) {
        chatStarted = true;
        addChatMessage('Hi, I\'m a quick FAQ bot for this page — not a general AI. Ask about Daniel\'s skills, projects, experience or contact info.', 'bot');
        renderQuickReplies();
      }
      window.setTimeout(function () { chatInput.focus(); }, 10);
    };

    var closeChat = function () {
      chatPanel.hidden = true;
      chatToggle.setAttribute('aria-expanded', 'false');
      chatToggle.focus();
    };

    chatToggle.addEventListener('click', function () {
      if (chatPanel.hidden) { openChat(); } else { closeChat(); }
    });

    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      sendChat(chatInput.value);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !chatPanel.hidden) {
        closeChat();
      }
    });
  }
})();
