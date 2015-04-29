/**
 * Created by ws on 2015/4/29.
 */
$('#update').on('click', function (e) {
    'use strict';
    $.ajax({
        type: 'GET',
        dataType: 'html',
        url: '/about',
        success: function (data) {
            $("#update").html(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
});