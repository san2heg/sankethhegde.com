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

function createScrollSeg(params) {
  SCROLL_FUNCS.push(function(y) {
    var startHeight = params['startHeight'],
        endHeight = params['endHeight'],
        property = params['property'],
        transformProperty = params['transformProperty'],
        startVal = params['startVal'],
        endVal = params['endVal'],
        elem = params['elem'],
        elemActive = params['elemActive'] != undefined ? params['elemActive'] : true,
        diffVal = Math.abs(endVal - startVal),
        easeMethod = params['easeMethod'] || EasingFunctions.linear,
        multiplier = endVal - startVal >= 0 ? 1 : -1,
        beforeFunc = params['beforeFunc'],
        duringFunc = params['duringFunc'],
        afterFunc = params['afterFunc']

    if (!elemActive) { return; }

    var length = endHeight - startHeight;
    if (y >= startHeight && y <= endHeight) {
      // DURING
      var percentComplete = (y - startHeight) / length;
      var percentEase = easeMethod(percentComplete);
      var currVal = startVal + (percentEase * diffVal) * multiplier;
      if (transformProperty != undefined) {
        elem.css('transform', property + '(' + currVal + transformProperty + ')');
      } else {
        elem.css(property, currVal);
      }

      if (duringFunc != undefined) { duringFunc() };
    } else if (y < startHeight) {
      // BEFORE
      if (transformProperty != undefined) {
        elem.css('transform', property + '(' + startVal + transformProperty + ')');
      } else {
        elem.css(property, startVal);
      }

      if (beforeFunc != undefined) { beforeFunc() };
    } else {
      // AFTER
      if (transformProperty != undefined) {
        elem.css('transform', property + '(' + endVal + transformProperty + ')');
      } else {
        elem.css(property, endVal);
      }

      if (afterFunc != undefined) { afterFunc() };
    }
  });
}

function setupScrollAnimation() {
  createScrollSeg({
    elem: $('#nav .nav-inner'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: 0,
    endVal: parseFloat($('#nav .nav-inner').css('margin-right')),
    startHeight: 0,
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeInOutQuad,
    beforeFunc: function() {
      $('#nav').css('border-bottom', 'none');
      $('#nav').css('background', 'none');
    },
    duringFunc: function() {
      $('#nav').css('border-bottom', 'none');
      $('#nav').css('background', 'none');
    },
    afterFunc: function() {
      $('#nav').css('border-bottom', '1px solid #d9d9d9');
      $('#nav').css('background-color', 'white');
    }
  });
  createScrollSeg({
    elem: $('#title .title-inner'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: 0,
    endVal: -1 * parseFloat($('#title .title-inner').css('margin-left')),
    startHeight: 0,
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeInQuad
  });
  createScrollSeg({
    elem: $('#top-logo'),
    property: 'translateX',
    transformProperty: 'px',
    startVal: isMobile() ? 20 : 40,
    endVal: -1 * parseFloat($('#top-logo').css('margin-left')),
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeOutQuad
  });
  createScrollSeg({
    elem: $('#top-logo'),
    property: 'opacity',
    startVal: 0,
    endVal: 1,
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
  });
  createScrollSeg({
    elem: $('.bkg-wrapper'),
    property: 'opacity',
    startVal: 1,
    endVal: 0,
    startHeight: 0,
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
  });
  createScrollSeg({
    elem: $('#menu-mobile'),
    elemActive: isMobile(),
    property: 'translateX',
    transformProperty: 'px',
    startVal: isMobile() ? -40 : -20,
    endVal: 0,
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
    easeMethod: EasingFunctions.easeOutQuad
  });
  createScrollSeg({
    elem: $('#menu-mobile'),
    elemActive: isMobile(),
    property: 'opacity',
    startVal: 0,
    endVal: 1,
    startHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
    endHeight: $('#centerpiece').outerHeight(true) - $('#nav').height(),
  });
  createScrollSeg({
    elem: $('#nav .nav-inner'),
    elemActive: isMobile(),
    property: 'opacity',
    startVal: 1,
    endVal: 0,
    startHeight: 0,
    endHeight: $('#title .title-inner').offset().top + $('#title .title-inner').height(),
  });
}

function setupClicks() {
  $('.down-btn').on('click', function(e) {
    e.preventDefault();
    scrollTo('#about', $('#footer').hasClass('fixed') ? 0 : $('#footer').outerHeight(true));
  });
}

function setup() {
  reset()
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

function centerpieceAnimate() {
  $('#header .bkg').animate({
    opacity: 1
  }, 1000);
}

$(document).ready(function() {
  setupRAFScroll();
  setupAnchors();
  setupClicks();
  setup();
  centerpieceAnimate();

  $(window).on('resize', function() {
    setup();
  });
});
