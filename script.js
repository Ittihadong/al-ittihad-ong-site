(function(){
  var STORAGE_KEY = 'al-ittihad-lang';
  var htmlEl = document.documentElement;
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var currentLang = 'fr';

  // ---------- CMS-editable content (content/news.json, content/projects.json, content/gallery.json) ----------
  var cmsData = { news: null, projects: null, gallery: null };
  var PROJECT_CTA_TEXT = {
    fr: 'Soutenir ce projet', en: 'Support this project',
    ar: 'ادعم هذا المشروع', tr: 'Bu projeye destek ol'
  };
  var PROJECT_STATUS_TEXT = {
    fr: 'Projet en cours', en: 'Ongoing project',
    ar: 'مشروع قيد التنفيذ', tr: 'Devam eden proje'
  };
  var WHATSAPP_PREFIX = {
    fr: 'Bonjour, je souhaite soutenir le projet',
    en: 'Hello, I would like to support the project',
    ar: 'مرحبًا، أرغب في دعم مشروع',
    tr: 'Merhaba, şu projeye destek olmak istiyorum'
  };

  function pick(item, field, lang){
    return item[field + '_' + lang] || item[field + '_fr'] || '';
  }

  function esc(s){
    var d = document.createElement('div');
    d.innerText = s == null ? '' : s;
    return d.innerHTML;
  }

  function renderNews(lang){
    var grid = document.getElementById('newsGrid');
    if(!grid || !cmsData.news) return;
    grid.innerHTML = cmsData.news.items.map(function(item){
      return '<article class="news-card">' +
        '<span class="news-date">' + esc(pick(item,'date',lang)) + '</span>' +
        '<h3>' + esc(pick(item,'title',lang)) + '</h3>' +
        '<p>' + esc(pick(item,'body',lang)) + '</p>' +
        '</article>';
    }).join('');
  }

  function renderProjects(lang){
    var grid = document.getElementById('projectsGrid');
    if(!grid || !cmsData.projects) return;
    grid.innerHTML = cmsData.projects.items.map(function(item){
      var title = pick(item,'title',lang);
      var waText = encodeURIComponent((WHATSAPP_PREFIX[lang]||WHATSAPP_PREFIX.fr) + ' ' + pick(item,'title','fr') + ' à AL-ITTIHAD ONG.');
      return '<div class="project-card">' +
        '<div class="project-image"><img src="' + esc(item.image) + '" alt="' + esc(title) + '"></div>' +
        '<span class="project-status">' + (PROJECT_STATUS_TEXT[lang]||PROJECT_STATUS_TEXT.fr) + '</span>' +
        '<h3>' + esc(title) + '</h3>' +
        '<p>' + esc(pick(item,'body',lang)) + '</p>' +
        '<a href="https://wa.me/22967758078?text=' + waText + '" target="_blank" rel="noopener" class="btn btn-primary project-cta">' + (PROJECT_CTA_TEXT[lang]||PROJECT_CTA_TEXT.fr) + '</a>' +
        '</div>';
    }).join('');
  }

  function renderGallery(lang){
    var grid = document.getElementById('galleryGrid');
    if(!grid || !cmsData.gallery) return;
    grid.innerHTML = cmsData.gallery.items.map(function(item){
      return '<img src="' + esc(item.image) + '" alt="' + esc(pick(item,'alt',lang)) + '" loading="lazy">';
    }).join('');
  }

  function renderCmsContent(lang){
    renderNews(lang);
    renderProjects(lang);
    renderGallery(lang);
  }

  function loadCmsContent(){
    // Standalone/offline export: content is baked in at build time (see window.__CMS_PRELOAD__)
    if(window.__CMS_PRELOAD__){
      cmsData = window.__CMS_PRELOAD__;
      renderCmsContent(currentLang);
      return;
    }
    // Hosted site: fetch the live, editor-updatable JSON files
    var files = { news: 'content/news.json', projects: 'content/projects.json', gallery: 'content/gallery.json' };
    Object.keys(files).forEach(function(key){
      fetch(files[key]).then(function(r){ return r.ok ? r.json() : null; }).then(function(json){
        if(json){ cmsData[key] = json; renderCmsContent(currentLang); }
      }).catch(function(){ /* content/*.json not reachable (e.g. opened as a local file) */ });
    });
  }

  function applyLang(lang){
    currentLang = lang;
    var dict = TRANSLATIONS[lang] || TRANSLATIONS.fr;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined){
        el.innerHTML = dict[key];
      }
    });
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){}
    renderCmsContent(lang);
  }

  document.querySelectorAll('.lang-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      applyLang(btn.getAttribute('data-lang'));
      if(mainNav.classList.contains('open')){ mainNav.classList.remove('open'); }
    });
  });

  if(navToggle){
    navToggle.addEventListener('click', function(){
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mainNav.classList.remove('open'); });
    });
  }

  // Domain cards: click to expand details
  document.querySelectorAll('.domain-item').forEach(function(item){
    item.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.domain-item.open').forEach(function(el){
        if(el !== item){ el.classList.remove('open'); }
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  // WhatsApp floating button: choose among 3 numbers
  var waWrap = document.getElementById('whatsappWrap');
  var waBtn = document.getElementById('whatsappFabBtn');
  if(waWrap && waBtn){
    waBtn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = waWrap.classList.toggle('open');
      waBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if(!waWrap.contains(e.target)){
        waWrap.classList.remove('open');
        waBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        waWrap.classList.remove('open');
        waBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var saved = null;
  try{ saved = localStorage.getItem(STORAGE_KEY); }catch(e){}
  applyLang(saved || 'fr');
  loadCmsContent();
})();
