//Global Variables are listed here
var cardImage;
var cardName;
var cardValueUSD;
var cardValueEUR;
var currency1 = "USD";
var deckArray = [];


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
        $('#addCard').val('');
        cardValueUSD = response.prices.usd;
        currencyConvert();
        createDeckArray();
        createQuickCard();
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
        console.log("response2 ", response);
        console.log("responseEUR ", response.rates.EUR);
        cardValueEUR = cardValueUSD * response.rates.EUR;
        console.log('cardValueEUR:', cardValueEUR);
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
function createQuickCard() {
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
    aTag.text("Select");
    aTag.attr('value', cardName);
//did not add href to the button - would not know where to point it
    tableDataButton.addClass("level-right");
    tableDataButton.append(aTag);
// Moving items from the local storage to the html 
    tableDataName.text(cardName);
    tableRow.append(tableDataIcon,tableDataName,tableDataButton);
    $('#savedCards').prepend(tableRow);
};

// These are all the trigger events for clicks and keypresses
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
    if (event.which == 13) {
        cardName = document.querySelector('#addCard').value;
        displayCard();
    } 
});

$(document).on('click',".pleaseWork", function (e) {
console.log("event", e.target);
    cardName = $(this).attr("value");
console.log ('it worked')
displayCard()

});