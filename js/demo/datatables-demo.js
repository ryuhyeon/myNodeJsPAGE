// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
    searching:false,
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
