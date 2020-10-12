var cardImage = '';


$(function() {

    var cardName;
    var cardValueUSD;
    var cardValueEUR;
    var currency1 = "USD";



    $('#addCard').on('keypress', function (event) {
        if (event.which == 13) {
            cardName = document.querySelector('#addCard').value;
            console.log("card name ", cardName);
            displayCard();
        } 
        });
    //jquery documentation, look into on key press/ on key press event
    //specific key to be pressed, so look for a keycode for enter is 13
    function displayCard() {
        cardName = document.querySelector('#addCard').value;
            $.ajax({
                url: 'https://api.scryfall.com/cards/named?fuzzy=' + cardName,
                method: "GET"
            }).then(function (response) {
            console.log("response ", response);
            console.log("response status", response.status);
            console.log('price:', response.prices.usd);
            console.log('img url', response.image_uris.large);
            cardImage = response.image_uris.border_crop;
            $('.cardFace').replaceWith('<img class="cardFace" src="' + cardImage + '">');
            // <img class='cardFace' src="assets/placeholder.png">
            console.log('image test 1', cardImage)
            console.log("USD Price is ", response.prices);
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
            cardValueUSD = response.prices.usd;
            $('#addCard').val('');
            // var cardDiv = $("<div>");
            // cardImage.attr("src", response.image_uris.large);
            // cardDiv.append(cardImage);
            //console.log(response.prices.usd) dot notation for price
            currencyConvert();
            })
            console.log('image test 2', cardImage)
    }

// https://api.exchangeratesapi.io/latest?base=USD

    function currencyConvert() {
            $.ajax({
                url: 'https://api.exchangeratesapi.io/latest?base=' + currency1,
                method: "GET"
            }).then(function (response) {
                console.log("response2 ", response);
                console.log("responseEUR ", response.rates.EUR);
                cardValueEUR = cardValueUSD * response.rates.EUR;
                console.log('cardValueEUR:', cardValueEUR);
// Thoughts would need to allow user to pick from a list the base currency and the desired currency (the gathering API has EUR and USD available where the currency api has more options), 
// Side thought, might auto select between USD and EUR (go from USD to EUR if it is not available) and then let the user select the value from the drop down of allowed currencies from the xchange API - 

// Functional notes for above: Need to set up variables to accept the user selection then combine user selection with the drill down for the code.  userWantsCur = drop down; userWantsCurrencyDrillDown = response.rates.userWantsCur; (need to make sure it comes out as an interger)

            });

    }
    // $(document).on('keypress',function(e) {
    //     if(e.which == 13) {
    //         alert('You pressed enter!');
    //     }
    // });




});