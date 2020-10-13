
//add card to the search field, 
$('#addCard').on('keypress', function(event){
    if(event.which == 13){
          var cardName = document.querySelector('#addCard').value;
        console.log(cardName)
        displayCard();
    }
    
});

//gives the card object, will later add code to append to the appropriate place on the page
function displayCard(){
    var cardName = document.querySelector('#addCard').value;
    $.ajax({
        url: 'https://api.scryfall.com/cards/named?fuzzy=' + cardName,
        method: "GET"
    }).then(function(response){
        console.log(response)
        console.log('price in usd:',response.prices.usd)

        var newImg = response.image_uris.large; 
        console.log(newImg)
        $('#img').attr('src', newImg);

        // $('#logo').attr('src', '/images/new-logo.jpg');
        //something like this??
        // $("#addImg").click(function() {

            
            //  console.log(newImg)
        //     newImg.css({left: xCoor, top: yCoor});
        //     $("div").append(newImg);
        // });
      
        //console.log(response.prices.usd) dot notation for price
    })
}
// $(document).on('keypress',function(e) {
//     if(e.which == 13) {
//         alert('You pressed enter!');
//     }
// });
=======
$(function() {

    var cardName;
    var cardValueUSD;
    var cardValueEUR;
    var currency1 = "USD";
    var deckArray = [];



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
            console.log(response.prices.usd);
            console.log(response.image_uris.large);
            console.log("USD Price is ", response.prices);
            cardValueUSD = response.prices.usd;
            
            // user input to array then array to string then to local storage
            deckArray.push(response.name); 
            console.log('response.name:', response.name);
            localStorage.setItem("deckArray", JSON.stringify(deckArray));
            console.log('deckArray as a string:', deckArray);

            
            // creating varibales for the info to be shown on the HTML 
            //indented items show they are affecting the variable above
            var tableRow = $("<tr>");
            var tableDataIcon = $('<td width="10 %">');
                var iTag = $("<i>");
                iTag.addClass("fab fa-wizards-of-the-coast")
                tableDataIcon.append(iTag)
            var tableDataName = $("<td>");
            var tableDataButton = $("<td>");
                var aTag = $("<a>");
                aTag.addClass("button is-small is-primary grad");
                aTag.text("Select");
                //did not add href to the button - would not know where to point it
            tableDataButton.addClass("level-right");
            tableDataButton.append(aTag);
            // Moving items from the local storage to the html 
            tableDataName.text(response.name);
            tableRow.append(tableDataIcon,tableDataName,tableDataButton);
            $('#tableBody').prepend(tableRow);


            // HTML code for reference 
                // <tr>
                //     <td width="10%"><i class="fab fa-wizards-of-the-coast"></i></td>
                //     <td>Card Name Here</td>
                //     <td class="level-right"><a class="button is-small is-primary grad" href="#">Select</a></td>
                // </tr>




            // var cardDiv = $("<div>");
            // cardImage.attr("src", response.image_uris.large);
            // cardDiv.append(cardImage);
            //console.log(response.prices.usd) dot notation for price
            currencyConvert();
            }).catch(function(error){
            console.log('error:', error)
            console.log('error details:', error.responseJSON.details)
            });
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
}
