$(document).ready(function (req, res) {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
       // hiddenField()
    });
});

$('#bodyMain').click(function (e) {
    var bar = $('#sidebar')
    window.alert(bar.getAttribute("Class"))
    if (bar.getAttribute("Class") === "mCustomScrollbar _mCS_1 mCS-autoHide mCS_no_scrollbar") {
        $('#sidebar').toggleClass('active');
       // hiddenField()
    }
});

function hiddenField() {

    //if (sidebar.getAttribute("class") != 'active') {
        try {
            $('#buttonsBar').each(function(){($(this).toggle('hidden'))})
           // $('#buttonsBar').each(function(){($(this).toggle('hidden'))})
        } catch (err) {

        }
   // } else {
        try {
            $('#buttonsBar').each(function(){($(this).toggle('hidden'))})
            //$('#buttonsBar').each(function(){($(this).toggle('hidden'))})           
        } catch (err) {

        }
  //  }
}    


