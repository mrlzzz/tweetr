$(document).ready(function() {
    $('li.active').removeClass('active');
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
});
$("#new-post").click(function() {
    window.scrollTo(0,0)
});