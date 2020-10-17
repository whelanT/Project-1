//Global Variables are listed here
var cardImage;
var cardName;
var cardValueUSD;
var currency1 = "USD";
var deckArray = [];
var favArray = [];
var currencyCode = "EUR";
var currencyCatch;
var cardValueVar;
var cardValueVarRound;
var currencySymbol;
var counter = 0

showFavorites();

//This is the primary function that will call the card and dispaly it on the DOM
function displayCard() {
    $.ajax({
        url: 'https://api.scryfall.com/cards/named?fuzzy=' + cardName,
        method: "GET"
    }).then(function (response) {
        cardName = response.name;
        cardImage = response.image_uris.border_crop;
        $('.cardFace').replaceWith('<img class="cardFace" src="' + cardImage + '">');
        $('.othr').remove();
        $('.pthr').remove();
        $('.name').replaceWith('<h2 class="name">' + response.name + '</h2>');
        $('.cost').replaceWith('<p class="cost">' + response.mana_cost + '</p>');
        $('.cardType').replaceWith('<p class="cardType">' + response.type_line + '</p>');
        if (response.oracle_text != null) {
            $('.oracleText').replaceWith('<hr class="rounded othr"><p class="oracleText">' + response.oracle_text + '</p>');
        } else if (response.card_faces[0].oracle_text != null) {
            $('.oracleText').replaceWith('<hr class="rounded othr"><p class="oracleText">' + response.card_faces[0].oracle_text + '<br>' + response.card_faces[1].oracle_text + '</p>');   
        } else {
            $('.oracleText').replaceWith('<p class="oracleText"></p>');
        }
        if (response.power != null) {
            $('.powerToughness').replaceWith('<hr class="rounded pthr"><p class="powerToughness">' + response.power + '/' + response.toughness + '</p>');
        } else {
            $('.powerToughness').replaceWith('<p class="powerToughness"></p>');
        }
        if (response.prices.usd != null) {
            $('.price').replaceWith('<p class="price">US$ ' + response.prices.usd + '</p>');
        } else {
            $('.price').replaceWith('<p class="price">$0.00</p>');
        }
        $('#addCard').val('');
        jQuery('.card-info').addClass('infoblockstyle');
        jQuery('.price').addClass('pricestyle');
        jQuery('.converted').addClass('convertpricestyle');
        cardValueUSD = response.prices.usd;
        currencyConvert();
        createDeckArray();
        createQuickCard(response.name);
        }).catch(function (error) {
            $('.error').replaceWith('<p class="error">' + error.responseJSON.details + '</p>');
            $(".modal").addClass("is-active"); 
            $('#addCard').val('');
        });
    
};

// Thoughts would need to allow user to pick from a list the base currency and the desired currency (the gathering API has EUR and USD available where the currency api has more options), 
// Side thought, might auto select between USD and EUR (go from USD to EUR if it is not available) and then let the user select the value from the drop down of allowed currencies from the xchange API - 

// Functional notes for below: Need to set up variables to accept the user selection then combine user selection with the drill down for the code.  userWantsCur = drop down; userWantsCurrencyDrillDown = response.rates.userWantsCur; (need to make sure it comes out as an interger)
function currencyConvert() {
    $.ajax({
        url: 'https://api.exchangeratesapi.io/latest?base=' + currency1,
        method: "GET"
    }).then(function (response) {
        currencyCatch = eval('response.rates.' + currencyCode);
        cardValueVar = cardValueUSD * currencyCatch;
        cardValueVarRound = cardValueVar.toFixed(2);
        currencySymbol = document.getElementById(currencyCode).getAttribute("data-CurrencySymbol");
        $('.converted').replaceWith('<p class="converted convertpricestyle">' + currencySymbol  + cardValueVarRound + '</p>');
    });
};

// This function will update the array after the card is pulled
// user input to array then array to string then to local storage
function createDeckArray() {
    deckArray.push(cardName); 
    console.log('response.name:', cardName);
    localStorage.setItem("deckArray", JSON.stringify(deckArray));
    console.log('deckArray as a string:', deckArray);
};

// This function adds the card to the list of cards on the DOM
// creating varibales for the info to be shown on the HTML 
//indented items show they are affecting the variable above
//create cardnmae locale so we can clearly tell it's a local variable
function createQuickCard(cardNameLocale) {
    if (cardNameLocale === null){
        return;
    }
    var tableRow = $("<tr>");
    var tableDataIcon = $('<td width="10 %">');
    var iTag = $("<i>");
    iTag.addClass("fab fa-wizards-of-the-coast")
    tableDataIcon.append(iTag)
    var tableDataName = $("<td>");
    var tableDataButton = $("<td>");
    var aTag = $("<a>");
    aTag.addClass("button is-small is-primary grad");
    aTag.addClass("pleaseWork");
    aTag.text("favorite");
    aTag.attr('value', cardNameLocale);
    //did not add href to the button - would not know where to point it
    tableDataButton.addClass("level-right");
    tableDataButton.append(aTag);
    // Moving items from the local storage to the html 
    tableDataName.text(cardNameLocale);
    tableRow.append(tableDataIcon,tableDataName,tableDataButton);
    $('#savedCards').prepend(tableRow);
    counter++;
    if (counter > 10){
        counter--;
        $('#savedCards').find("tr:last-child").remove()
        console.log("tableRow")
    

    }
};

// These are all the trigger events for clicks and keypresses
// change to point to list and point to innerHTML or innerText   <-----------------LOOK HERE FOR SELECTING THE DROPDOWN
$(".modal-close").click(function() {
    $(".modal").removeClass("is-active");
});

$("#closebtn").click(function() {
    $(".modal").removeClass("is-active");
});

$(".modal-background").click(function() {
    $(".modal").removeClass("is-active");
});

$('#addCard').on('keypress', function (event) {
    cardName = document.querySelector('#addCard').value;
    if(cardName === null){
        return;
    }
    if (event.which == 13) {
        if ($('.modal').hasClass('is-active')) {
            $(".modal").removeClass("is-active");
        } else {
        cardName = document.querySelector('#addCard').value;
        displayCard();
        }
    } 
});

$("#clearBtn").click(function () {
    favArray = [];
    localStorage.clear();
    console.log('favArray:', favArray)
    $('.cardFace').replaceWith('');
    $('.othr').remove();
    $('.pthr').remove();
    $('.name').replaceWith('');
    $('.cost').replaceWith('');
    $('.cardType').replaceWith('');
    $('.oracleText').replaceWith('');
    $('.powerToughness').replaceWith('');
    $('.price').replaceWith('');
    $('.converted').replaceWith('');
    $('td').replaceWith('');
});


$(".currencySelect").change(function () {
    currencyCode = $(".currencySelect option:selected").attr("id");
    if ($('.converted').hasClass('convertpricestyle')) {
        currencyConvert()
    } else {

    }

});


// loads the favorites from the favarray onto the page
function showFavorites(){
    var myFavs = JSON.parse(localStorage.getItem('favArray'));
    if(myFavs !== null){
        favArray = myFavs;
        for (i = 0; i < myFavs.length; i++) {
        cardName = myFavs[i];
        createQuickCard(myFavs[i]);
        
    }
    }
    
}



// change to point to list and point to innerHTML or innerText 
$(document).on('click',".pleaseWork", function (e) {
// console.log("event", e.target);
    // localStorage.getItem('favArray');
    cardName = $(this).attr("value");
     favArray.push(cardName);
   localStorage.setItem('favArray', JSON.stringify(favArray))
     
console.log (cardName);
displayCard();

});
