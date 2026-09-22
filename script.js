(function(){
  var STORAGE_KEY = 'al-ittihad-lang';
  var htmlEl = document.documentElement;
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function applyLang(lang){
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
})();
