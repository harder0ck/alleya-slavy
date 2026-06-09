/* ============================================================
   Аллея Славы — общий скрипт подстраниц (site.js)
   Меню, плавное появление блоков, лайтбокс с зумом фото.
   ============================================================ */
(function(){
  'use strict';

  /* ---- бургер-меню ---- */
  window.toggleNav = function(){
    var n = document.querySelector('.nav-links');
    if(n) n.classList.toggle('show');
  };
  document.addEventListener('click', function(e){
    if(e.target.closest('.nav-links a')){
      var n = document.querySelector('.nav-links');
      if(n) n.classList.remove('show');
    }
  });

  /* ---- плавное появление (.reveal) ---- */
  function initReveal(){
    var els = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){el.classList.add('in');});
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el,i){ el.style.transitionDelay = (Math.min(i%4,3)*0.06)+'s'; io.observe(el); });
  }

  /* ---- лайтбокс ---- */
  var lb, lbImg, lbCap, group = [], idx = 0;
  function buildLightbox(){
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Закрыть">&times;</button>'+
      '<button class="lb-nav prev" aria-label="Назад">&#8249;</button>'+
      '<button class="lb-nav next" aria-label="Вперёд">&#8250;</button>'+
      '<img alt="">'+
      '<div class="lb-cap"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbCap = lb.querySelector('.lb-cap');
    lb.querySelector('.lb-close').onclick = closeLb;
    lb.querySelector('.prev').onclick = function(e){ e.stopPropagation(); step(-1); };
    lb.querySelector('.next').onclick = function(e){ e.stopPropagation(); step(1); };
    lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('show')) return;
      if(e.key === 'Escape') closeLb();
      else if(e.key === 'ArrowLeft') step(-1);
      else if(e.key === 'ArrowRight') step(1);
    });
  }
  function show(){
    var item = group[idx];
    lbImg.src = item.full;
    lbImg.alt = item.cap || '';
    lbCap.textContent = item.cap || '';
    var multi = group.length > 1;
    lb.querySelector('.prev').style.display = multi ? '' : 'none';
    lb.querySelector('.next').style.display = multi ? '' : 'none';
  }
  function step(d){ idx = (idx + d + group.length) % group.length; show(); }
  function closeLb(){ lb.classList.remove('show'); document.body.style.overflow = ''; }

  // открываем лайтбокс: groupName собирает все элементы [data-lb-group="..."]
  window.openLightbox = function(el){
    if(!lb) buildLightbox();
    var gname = el.getAttribute('data-lb-group') || '__single';
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll('[data-lb][data-lb-group="'+gname+'"]'));
    if(gname === '__single') nodes = [el];
    group = nodes.map(function(n){
      return { full: n.getAttribute('data-lb'), cap: n.getAttribute('data-cap') || '' };
    });
    idx = Math.max(0, nodes.indexOf(el));
    lb.classList.add('show');
    document.body.style.overflow = 'hidden';
    show();
  };

  // авто-привязка кликов к [data-lb]
  function bindLb(){
    document.querySelectorAll('[data-lb]').forEach(function(el){
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function(){ window.openLightbox(el); });
    });
  }

  function init(){ initReveal(); bindLb(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
