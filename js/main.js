RESETS = [];
SCROLL_FUNCS = [];

function reset() {
  var i;
  for (i = 0; i < RESETS.length; i++) {
    RESETS[i]();
  }

  RESETS = [];
  SCROLL_FUNCS = [];
}

function isMobile() { return $(window).outerWidth() <= 535; }

function scrollTo(selector, offset) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top - offset
  }, 2000, "swing");
}

function setupCenterpiece() {
  var windowHeight = window.innerHeight;
  var cpHeight = $('#centerpiece').height();
  var navHeight = $('#nav').height();
  var marginHeight = (windowHeight - cpHeight) / 2;

  $('#centerpiece').css('padding-top', marginHeight - navHeight/2);
  $('#centerpiece').css('padding-bottom', marginHeight + navHeight/2);
}

function setupAnchors() {
  $('.content-section').css({
    'padding-top': $('#nav').height(),
    'margin-bottom': $('#nav').height() * -1
  })
  $('#header').css('margin-bottom', $('#nav').height() * -1);
  $('#footer').css('margin-top', $('#nav').height());
  $('#content .content-section:last-child').css('padding-bottom', $('#footer').height());
}

function setupStickyScroll() {
  var $nav = $('#nav');
  var $footer = $('#footer');
  var navTop = $nav.offset().top;
  var footerBottom = $footer.offset().top + $footer.height();

  SCROLL_FUNCS.push(function(y) {
    var yBottom = y + $(window).height();
    var navIsFixed = $nav.hasClass('fixed');
    var footerIsFixed = $footer.hasClass('fixed');

    if (y >= navTop) {
      if (!navIsFixed) {
        $nav.addClass('fixed');
      }
    } else {
      if (navIsFixed) {
        $nav.removeClass('fixed');
      }
    }

    if (yBottom >= footerBottom) {
      if (!footerIsFixed) {
        $footer.addClass('fixed');
      }
    } else {
      if (footerIsFixed) {
        $footer.removeClass('fixed');
      }
    }
  })

  RESETS.push(function() {
    $('#nav').removeClass('fixed');
    $('#footer').removeClass('fixed');
  });
}

function createScrollFrame(params) {
  if (params['elemActive'] == false) { return; }

  if (params['verbose'] == true) {
    console.log(params);
  }

  var startHeight = params['startHeight'],
      endHeight = params['endHeight'],
      property = params['property'],
      transformProperty = params['transformProperty'],
      startVal = params['startVal'],
      endVal = params['endVal'],
      elem = params['elem'],
      diffVal = Math.abs(endVal - startVal),
      easeMethod = params['easeMethod'] || EasingFunctions.linear,
      multiplier = endVal - startVal >= 0 ? 1 : -1,
      frameFunctions = params['frameFunctions'],
      verbose = params['verbose'] == true

  function logMsg(msg) {
    console.log("[#" + elem.get(0).id + "] " + msg)
  }

  SCROLL_FUNCS.push(function(y) {
    var length = endHeight - startHeight;
    var newVal;
    if (y >= startHeight && y <= endHeight) {
      // DURING
      if (verbose) { logMsg("DURING: " + startHeight + " <= " + y + " <= " + endHeight) }
      var percentComplete = (y - startHeight) / length;
      var percentEase = easeMethod(percentComplete);
      newVal = startVal + (percentEase * diffVal) * multiplier;
      if (frameFunctions != undefined) { frameFunctions.during() };
    } else if (y < startHeight) {
      // BEFORE
      if (verbose) { logMsg("BEFORE: " + y + " < " + startHeight) }
      newVal = startVal;
      if (frameFunctions != undefined) { frameFunctions.before() };
    } else {
      // AFTER
      if (verbose) { logMsg("AFTER: " + y + " > " + endHeight) }
      newVal = endVal;
      if (frameFunctions != undefined) { frameFunctions.after() };
    }

    if (verbose) {
      logMsg(property + ": " + newVal);
    }

    if (transformProperty != undefined) {
      elem.css('transform', property + '(' + newVal + transformProperty + ')');
    } else {
      elem.css(property, newVal);
    }
  });
}

function setupScrollAnimation() {
  createScrollFrame({
    elem: $('#nav .nav-inner'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: 0,
    endVal: parseFloat($('#nav .nav-inner').css('margin-right')),
    startHeight: 0,
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeInOutQuad,
    frameFunctions: {
      before: function() {
        $('#nav').css('border-bottom', 'none');
        $('#nav').css('background', 'none');
      },
      during: function() {
        $('#nav').css('border-bottom', 'none');
        $('#nav').css('background', 'none');
      },
      after: function() {
        $('#nav').css('border-bottom', '1px solid #d9d9d9');
        $('#nav').css('background-color', 'white');
      }
    },
    verbose: true
  });
  createScrollFrame({
    elem: $('#title .title-inner'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: 0,
    endVal: -1 * parseFloat($('#title .title-inner').css('margin-left')),
    startHeight: 0,
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeInQuad
  });
  createScrollFrame({
    elem: $('#top-logo'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: isMobile() ? 20 : 40,
    endVal: -1 * parseFloat($('#top-logo').css('margin-left')),
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeOutQuad
  });
  createScrollFrame({
    elem: $('#top-logo'),
    property: 'opacity',
    startVal: 0,
    endVal: 1,
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
  });
  createScrollFrame({
    elem: $('.bkg-wrapper'),
    property: 'opacity',
    startVal: 1,
    endVal: 0,
    startHeight: 0,
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
  });
  createScrollFrame({
    elem: $('#menu-mobile'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: isMobile() ? -20 : -40,
    endVal: 0,
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeOutQuad
  });
  createScrollFrame({
    elem: $('#menu-mobile'),
    elemActive: isMobile(),
    property: 'opacity',
    startVal: 0,
    endVal: 1,
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    frameFunctions: {
      before: function() {
        $('#menu-mobile').css('display', 'none');
      },
      during: function() {
        $('#menu-mobile').css('display', 'flex');
      },
      after: function() {
        $('#menu-mobile').css('display', 'flex');
      }
    }
  });
  createScrollFrame({
    elem: $('#nav .nav-inner'),
    elemActive: isMobile(),
    property: 'opacity',
    startVal: 1,
    endVal: 0,
    startHeight: 0,
    endHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    frameFunctions: {
      before: function() {
        $('#nav .nav-inner').css('display', 'block');
      },
      during: function() {
        $('#nav .nav-inner').css('display', 'block');
      },
      after: function() {
        $('#nav .nav-inner').css('display', 'none');
      }
    }
  });

  RESETS.push(function() {
    $('#nav .nav-inner').css('display', '');
    $('#nav .nav-inner').css('opacity', '');
    $('#menu-mobile').css('display', '');
    $('#menu-mobile').css('opacity', '');
  });
}

function setupClicks() {
  // Scroll to about
  $('.down-btn').on('click', function(e) {
    e.preventDefault();
    scrollTo('#about', $('#footer').hasClass('fixed') ? 0 : $('#footer').outerHeight(true));
  });

  // Mobile drop down menu
  var mobileNavHeight = $('#mobile-nav').height();
  $('#mobile-nav').css('margin-top', -1 * mobileNavHeight);
  var open = false;
  var scrollTop;
  console.log('scrollTop = ' + scrollTop);

  function toggleNav() {
    if (open) {
      closeMobileNav();
    } else {
      if (scrollTop >= $('#header').height() - $('#nav').height()) {
        openMobileNav();
      }
    }
  }

  function openMobileNav() {
    $('#mobile-nav-container').css('visibility', 'visible');
    $('#mobile-nav').animate({
      marginTop: '0',
      opacity: 1
    }, 300);
    open = true;
  }

  function closeMobileNav() {
    $('#mobile-nav').animate({
      marginTop: -1 * mobileNavHeight + 'px',
      opacity: 0
    }, 300, function() {
      $('#mobile-nav-container').css('visibility', 'hidden');
    });
    open = false;
  }

  $('#hamburger-nav').on('click', toggleNav);

  $(window).on('scroll', function() {
    scrollTop = $(this).scrollTop();
    if (open) {
      closeMobileNav();
    }
  });
}

function setupScroll() {
  reset();
  setupCenterpiece();
  setupStickyScroll();
  setupScrollAnimation();
  $(window).trigger('scroll');
}

function setupRAFScroll() {
  var lastScrollY = 0;
  var ticking = false;
  var k = 0, j = 0;

  var update = function() {
    var i;
    for (i = 0; i < SCROLL_FUNCS.length; i++) {
      SCROLL_FUNCS[i](lastScrollY);
    }
    ticking = false;
  };

  var requestTick = function() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  var onScroll = function() {
    lastScrollY = window.scrollY;
    requestTick();
  };

  $(window).on('scroll', onScroll);
}

function centerpieceAnimate(animInstance) {
  $('#header .bkg').animate({
    opacity: 1
  }, 1000);

  animInstance.play();
}

function setupLottie() {
  return lottie.loadAnimation({
    container: document.getElementById('centerpiece-inner'),
    renderer: 'svg',
    path: '../json/centerpiece.json'
  });
}

$(document).ready(function() {
  var cp = setupLottie();
  setupRAFScroll();
  setupAnchors();
  setupClicks();
  setupScroll();
  centerpieceAnimate(cp);

  $(window).on('resize', function() {
    setupScroll();
  });
});
