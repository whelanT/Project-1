$('#addCard').on('keypress', function (event) {
    if (event.which == 13) {
        var cardName = document.querySelector('#addCard').value;
        console.log(cardName)
        displayCard();
    }
});
//jquery documentation, look into on key press/ on key press event
//specific key to be pressed, so look for a keycode for enter is 13
function displayCard() {
    var cardName = document.querySelector('#addCard').value;
    $.ajax({
        url: 'https://api.scryfall.com/cards/named?fuzzy=' + cardName,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log(response.prices.usd)
        console.log(response.image_uris.large)
        // var cardDiv = $("<div>");
        // cardImage.attr("src", response.image_uris.large);
        // cardDiv.append(cardImage);
        //console.log(response.prices.usd) dot notation for price
    })
}
// $(document).on('keypress',function(e) {
//     if(e.which == 13) {
//         alert('You pressed enter!');
//     }
// });