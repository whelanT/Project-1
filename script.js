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