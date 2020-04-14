
//Mise en place d'une grille pour la selection
var $grida = $('.grid-packery').packery({
  itemSelector: '.grid-packery-item',
   percentPosition: true,
  columnWidth: 400,
   columnHeight: 100,
});



//Ajoute, Enlève les cartes

$('.append-button').on( 'click', function(event) {
  // create new item elements
//var $source=event.currentTarget.parentElement;
//récupère l'élement source
var $source=$(event.currentTarget).closest('.element-item');

//Verifie que la carte n'est pas déjà selectionnée
var $estunenouvellecarte = true;
$grida.find('.grid-packery-item').each( function( i, gridItem ) {
  if ($source.find(".name").html()== $(this).find(".name").html()) {$estunenouvellecarte = false};
});  

	//Si c'est une nouvelle carte
	if ($estunenouvellecarte) {
		//Clone la carte
		var  $items = $source.clone();
		//Ajoute la carte
		ajouteitem($items);
	/*
	//Rend les cartes manipulable
	$grida.find('.grid-packery-item').each( function( i, gridItem ) {
	  //var draggie = new Draggabilly( gridItem );
	  // bind drag events to Packery
	  //$grida.packery( 'bindDraggabillyEvents', draggie );
	});  
	*/
	} else {
		alert("vous avez déjà ajouté cette proposition...");
	}
});

// Ajoute les éléments depuis une liste d'id (en cas d'ajout par fichier CSV)
function addelement(elementid) {
//
var estunenouvellecarte = true;
$grida.find('.element-item').each( function( k, gridItem ) {
	if ( parseInt($(this).find(".id-element").html()) == parseInt(elementid)) {
		estunenouvellecarte = false;
	
	}
});

		
	if (estunenouvellecarte) {
	$grid.find('.element-item').each( function( j, gridItem ) {
		
		if ( parseInt($(this).find(".id-element").html()) == parseInt(elementid)) {
			var  items = $(this).closest('.element-item').clone();;
			ajouteitem(items);	
			}  
		});
	};
}

//Ajoute les cartes par clone
function ajouteitem(items) {
 items.addClass( "grid-packery-item" );
 items.addClass( "grid-packery-item-large" );
 items.find(".name").addClass("packery-name-large");
 items.find("button:first-child").removeClass("append-button");
 items.find("button:first-child").addClass("remove-button");
 items.find("button:first-child").text("Supprimer");
// append elements to container
  $grida.prepend( items )
// add and lay out newly appended elements
   .packery( 'prepended', items );
     $grida.packery('layout');
}


//Enlève les éléments
$grida.on( 'click', '.remove-button', function( event ) {
  // remove clicked element
  $grida.packery( 'remove', $(event.currentTarget).closest('.grid-packery-item') )
    // shiftLayout remaining item elements
    .packery('shiftLayout');
});



// Importe les actions choisis dans un fichier CSV
$('.file-button').on( 'change', function(event) {

  var f = document.getElementById('file');
  var file = f.files[0];
  var fr = new FileReader();
  var text = '';        
        fr.onprogress = function() {
        };
        fr.onerror = function() {
        };
		fr.onload = function() {
        var text = fr.result;
		var textarray = fr.result.split(/\r\n|\n/);
			for (var i = 0; i < textarray.length; i++) {
				addelement(textarray[i].split(';')[0]);
			};
		};
        fr.readAsText(file);
});



// Exporte vers un fichier CSV

$('.export-button').on( 'click', function(event) {

var idtoexport = $grida.packery('getItemElements');
var arrayid = [];
	for (var i = 0; i < idtoexport.length; i++) {
		arrayid.push([$(idtoexport[i]).find(".id-element").html(),$(idtoexport[i]).find(".name").html()]); 
	}
exportToCsv('export.csv', arrayid);
});

function exportToCsv(filename, rows) {
        var processRow = function (row) {
            var finalVal = '\uFEFF';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();					
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ';';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
				console.log(blob);
				console.log(csvFile);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }



// Action en cas d'usage du bouton détail
$grida.on( 'click', '.detail', function() {
  $(this).closest('.element-item').toggleClass('gigante');

  if ($(this).closest('.element-item').find('.name').hasClass( "packery-name-large" )){
	  $(this).closest('.element-item').find('.name').removeClass( "packery-name-large" )
  }
  else {
	  $(this).closest('.element-item').find('.name').addClass( "packery-name-large" )
  }
  
  // trigger layout after item size changes

  $grida.packery('layout');
});


// Gestion de l'ordre des cartes
// show item order after layout
function orderItems() {

  var itemElems = $grida.packery('getItemElements');
  $( itemElems ).each( function( i, itemElem ) {
  $(itemElem).find('.ordre').text(i+1);
 // $( itemElem ).text( i + 1 );
  });

   $grida.packery('layout');
 
}


// redessine les cartes après un déplacement
//$grida.on( 'layoutComplete', orderItems );
$grida.on( 'dragItemPositioned', orderItems );


function getItemElement() {
  var $item = $('<div class="grid-packery-item"></div>');
 
  // add width and height class
  var wRand = Math.random();
  var hRand = Math.random();
  var widthClass = wRand > 0.85 ? 'grid-packery-item--width3' : wRand > 0.7 ? 'grid-packery-item--width2' : '';
  var heightClass = hRand > 0.85 ? 'grid-packery-item--height3' : hRand > 0.5 ? 'grid-packery-item--height2' : '';
  $item.addClass( widthClass ).addClass( heightClass );
  return $item;
}





//Deprecated

/*
$('.load-button').on( 'click', function(event) {

for (var i = 0; i < idtoappend.length; i++) {
 console.log(idtoappend[i]);
		$grid.find('.element-item').each( function( j, gridItem ) {
				  
		  if ( $(this).find(".id-element").html() == idtoappend[i]) {
			  
		var  items = $(this).closest('.element-item').clone();;
		    console.log(items.html());
			ajouteitem(items);
			
		}  

		});
     
}

});




*/

/*
var csvContent = "data:text/csv;charset=utf-8,Actions;Nom\n";
arrayid.forEach(function(infoarray, index){

   dataString = infoarray.join(";");
 
   
   csvContent += index < arrayid.length ? dataString+ "\n" : dataString;

}); 
console.log(csvContent);
var encodedUri = encodeURI(csvContent);
console.log(encodedUri);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
document.body.appendChild(link); // Required for FF

//link.click(); // This will download the data file named "my_data.csv".*/


function getCSV() {
var csv = jQuery(".grid-packery-item").map(function(a,i){
  return $.trim($(this).text()).split(/\s*\n\s*/).join(",");
}).toArray().join("\r\n");

alert(csv);
}

