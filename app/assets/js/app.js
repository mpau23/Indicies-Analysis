var jq = jQuery.noConflict();

jq(document).on('mouseenter', '.tick text', function() {
    jq(this).prev('line').css('opacity', '1');
});

jq(document).on('mouseleave', '.tick text', function() {
    jq(this).prev('line').css('opacity', '0');

});
