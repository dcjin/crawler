/**
 * Created by ws on 2015/4/29.
 */
$('#update').on('click', function () {
    'use strict';
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/about'
    }).done(function (data) {
        if (data.msg) {
            //for(var i = 0; i < data.msg.length; i++) {
            //    if (i % 100 === 0) {
            //        alert(JSON.stringify(data.msg[i].job));
            //    }
            //}
            alert('Just testing Ajax');
        }
    });
});