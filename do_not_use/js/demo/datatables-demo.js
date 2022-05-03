$(document).ready(function() {
    $('#dataTable').DataTable({
        
        ajax:{url:"/dummy_data.json",dataSrc:''},
        columns:[
            {data:"name"},
            {data:"position"},
            {data:"office"},
            {data:"age"},
            {data:"startdate"},
            {data:"salary"}
        ]
    });
    console.log("good");
});