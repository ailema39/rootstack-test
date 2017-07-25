import $ from 'jquery';
import whatInput from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

// ID Sequence
var id = 9;

// Funtion to get the initials of a full name
var getInitials = function( fullName ) {
  var initials = fullName.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

  return initials;
}

// Getting the JSON data
$.getJSON( "/assets/data/data.json", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    var initials = getInitials(val.fullName);

    items.push( "<tr id='" + val.id + "'><td><div class='initials'>" + initials + "</div><div class='name'>" + val.fullName + "<div>Case: " + val.case + "</div><div class='hide-for-large'>Email:" + val.email +
    "<br>Phone:" + val.phoneNumber + "<br>Source:" + val.source + "</div></div></td><td class='email show-for-large'>" + val.email + "</td><td class='show-for-large'>" + val.phoneNumber +
    "</td><td class='source show-for-large'>" + val.source + "</td><td class='show-for-large'><div class='button status'>" + val.status +
    "</div></td><td class='more'><i class='fa fa-ellipsis-h' aria-hidden='true'></i><ul><li class='remove'>Remove</li><li>Option A</li><li>Option B</li></ul></td></tr>" );
  });

  $( "<tbody/>", {
    "class": "lead",
    html: items.join( "" )
  }).appendTo( "#leads" );
});

// Adding a new contact
$('.reveal.modal form').on('submit', function(e) {
  e.preventDefault();

  var fullName = $('#fullname').val();
  var initials = getInitials(fullName);
  var leadCase = $('#case').val();
  var email = $('#email').val();
  var phoneNumber = $('#phonenumber').val();
  var source = $('#source').val();

  $('#leads tbody').append("<tr id='" + id + "'><td><div class='initials'>" + initials + "</div><div class='name'>" + fullName + "<div>Case: " + leadCase + "</div><div class='hide-for-large'>Email:" + email +
  "<br>Phone:" + phoneNumber + "<br>Source:" + source + "</div></div></td><td  class='email show-for-large'>" + email + "</td><td class='show-for-large'>" + phoneNumber +
  "</td><td class='source show-for-large'>" + source + "</td><td class='show-for-large'><div class='button status'>Lead</div>" +
  "</td><td class='more'><i class='fa fa-ellipsis-h' aria-hidden='true'></i><ul><li class='remove'>Remove</li><li>Option A</li><li>Option B</li></ul></td></tr>" );
  id++;

  $(this).get(0).reset();
  $('#add-modal').foundation('close');
});

// Revealing additional options
$('#leads').on('click', '.more i', function() {
  $(this).parent().children('ul').slideToggle(500);
});

// Closing additional options box clicking outside
$(document).mouseup(function(e) {
  var container = $('.more ul');

  if(!container.is(e.target) && container.has(e.target).length === 0) {
    container.slideUp(500);
  }
});

// Removing a contact
$('#leads').on('click', '.more .remove', function() {
  $(this).closest('tr').remove();
});

// Function to sort the table
var sortTable = function(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("leads");
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }

  return dir;
}

// Sorting the table
$('th.sortable').on('click', function() {
  $(this).removeClass('asc desc');
  $(this).siblings('.sortable').removeClass('asc desc');
  var dir = sortTable($(this).data('index'));
  $(this).addClass(dir);
});

// Opening mobile menu
$('.mobile.header .menu').on('click', function() {
  $('.mobile-menu').animate({"margin-left": '+=40vw'},500);
});

// Closing mobile menu
$('.mobile-menu .close i').on('click', function() {
  $('.mobile-menu').animate({"margin-left": '-=40vw'},500);
});

$(document).foundation();
