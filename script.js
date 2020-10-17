$(function() {
    var cardName = document.querySelector('#addCard').value

//add card to the search field, 
$('#addCard').on('keypress', function(event){
var cardName = document.querySelector('#addCard').value;

    if(cardName === ""){
        return;
    }

    if(event.which == 13){
          
        console.log(cardName)
        displayCard();
        
    }

    
});

//gives the card object, appends the image to the page, and creates a table of searched cards. 
function displayCard(){
    var cardName = document.querySelector('#addCard').value;

    $.ajax({
        url: 'https://api.scryfall.com/cards/named?fuzzy=' + cardName,
        method: "GET"
    }).then(function(response){
        console.log(response)
        console.log('price in usd:',response.prices.usd)
        //appends new image to the placholder
        var newImg = response.image_uris.large; 
        console.log(newImg)
        $('#img').attr('src', newImg);

        //creates the card info to the right of the card
        $('.othr').remove();
        $('.pthr').remove();
        $('.name').replaceWith('<h2 class="name">' + response.name + '</h2>');
        $('.cost').replaceWith('<p class="cost">' + response.mana_cost + '</p>');
        $('.cardType').replaceWith('<p class="cardType">' + response.type_line + '</p>');
        if (response.oracle_text != null) {
        $('.oracleText').replaceWith('<hr class="rounded othr"><p class="oracleText">' + response.oracle_text + '</p>');
        } else {
            $('.oracleText').replaceWith('<p class="oracleText"></p>');
        }
        if (response.power != null) {
            $('.powerToughness').replaceWith('<hr class="rounded pthr"><p class="powerToughness">' + response.power + '/' + response.toughness + '</p>');
            } else {
            $('.powerToughness').replaceWith('<p class="powerToughness"></p>');
            }
        if (response.prices.usd != null) {
        $('.price').replaceWith('<p class="price">$' + response.prices.usd + '</p>');
        } else {
        $('.price').replaceWith('<p class="price"></p>');
        }
        
        buildTable(response);
        // var tableRow = $("<tr>");
        // var tableDataIcon = $('<td width="10 %">');
        //     var iTag = $("<i>");
        //     iTag.addClass("fab fa-wizards-of-the-coast")
        //     tableDataIcon.append(iTag)
        // var tableDataName = $("<td>");
        // var tableDataButton = $("<td>");
        //     var aTag = $("<a>");
        //     aTag.addClass("button is-small is-primary grad");
        //     aTag.text("Favorite");
        // tableDataButton.addClass("level-right");
        // tableDataButton.append(aTag);
        // // Moving items from the local storage to the html 
        // tableDataName.text(response.name);
        // tableRow.append(tableDataIcon,tableDataName,tableDataButton);
        // $('#tableBody').prepend(tableRow);
        // tableDataButton.addeventlistener('click', console.log('clicked'))
    })
}

function buildTable(){
    var tableRow = $("<tr>");
    var tableDataIcon = $('<td width="10 %">');
        var iTag = $("<i>");
        iTag.addClass("fab fa-wizards-of-the-coast")
        tableDataIcon.append(iTag)
    var tableDataName = $("<td>");
    var tableDataButton = $("<td>");
        var aTag = $("<a>");
        aTag.addClass("button is-small is-primary grad");
        aTag.text("Favorite");
    tableDataButton.addClass("level-right");
    tableDataButton.append(aTag);
    // Moving items from the local storage to the html 
    tableDataName.text(cardName.value);
    tableRow.append(tableDataIcon,tableDataName,tableDataButton);
    $('#tableBody').prepend(tableRow);
}
});

