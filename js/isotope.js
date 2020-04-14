// external js: isotope.pkgd.js

// init Isotope
var $grid = $('.grid').isotope({
  itemSelector: '.element-item',
  masonry: {
  
  },
  
   getSortData: {
    name: '.name',
	id: '.id-element parseInt'

  }
  
});
// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan50: function() {
    var number = $(this).find('.number').text();
    return parseInt( number, 10 ) > 50;
  },
  // show if name ends with -ium
  ium: function() {
    var name = $(this).find('.name').text();
    return name.match( /ium$/ );
  }
};
// bind filter button click
$('.filters-button-group').on( 'click', 'li', function() {
  var filterValue = $( this ).attr('data-filter');
  // use filterFn if matches value
  filterValue = filterFns[ filterValue ] || filterValue;
  $grid.isotope({ filter: filterValue });
});
// change is-checked class on buttons
$('.filters-button-group').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'li', function() {
    $buttonGroup.find('.active').removeClass('active');
    $( this ).addClass('active');
  });
});



// bind sort button click


// bind sort button click
$('.sort-button-group').on( 'click', 'li', function() {
  var sortValue = $(this).attr('data-sort-value');
  $grid.isotope({ sortBy: sortValue });
});



// change size of item by toggling gigante class
$grid.on( 'click', '.detail', function() {
  $(this).closest('.element-item').toggleClass('gigante');
  
  console.log($(this).closest('.element-item').find('.name').hasClass( "packery-name-large" ));
  if ($(this).closest('.element-item').find('.name').hasClass( "packery-name-large" )){
	  $(this).closest('.element-item').find('.name').removeClass( "packery-name-large" )
  }
  else {
	  $(this).closest('.element-item').find('.name').addClass( "packery-name-large" )
  }

  // trigger layout after item size changes
  $grid.isotope('layout');
});
