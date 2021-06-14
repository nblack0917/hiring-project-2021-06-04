$('#closeFirstChart').click(function() {
    console.log('click')
    $('#firstChart').toggleClass('full-box')
    $('#firstChart').toggleClass('reduce-box')
    $('#firstBox').toggleClass('fa-minus-square')
    $('#firstBox').toggleClass('fa-plus-square')
})
$('#closeSecondChart').click(function() {
    console.log('click')
    $('#secondChart').toggleClass('full-box')
    $('#secondChart').toggleClass('reduce-box')
    $('#secondBox').toggleClass('fa-minus-square')
    $('#secondBox').toggleClass('fa-plus-square')
})
