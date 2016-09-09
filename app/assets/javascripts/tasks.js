$(function() {
  // The taskHtml method takes in a Javascript representation
  // of the task and produces an HTML respresentation using
  // <li> tags

  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : "";
      var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' +
      '<div class="view"><input class="toggle" type="checkbox"' + 
      ' data-id="' + task.id + '"' +
      checkedStatus + 
      '><label>' + 
      task.title + 
      '</label></div></li>';

      return liElement;
  }

  // toggleTask takes in an HTML representation of
  // an event that fires from an HTML representation of
  // the toggle checkbox and performs an API request to
  // toggle the value of the 'done' field

  function toggleTask(e) {
    var itemId = $(e.target).data('id');

    var doneValue = Boolean($(e.target).is(':checked'));

    $.post("/tasks/" + itemId, {
      _method: 'PUT',
      task: {
        done: doneValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $('#listItem-' + data.id);
      $li.replaceWith(liHtml); // Why $ before the variable name?
      $('.toggle').change(toggleTask);
    });
  }

  $.get('/tasks').success( function (data) {
    var htmlString = "";

    $.each(data, function(index, task) {        
      htmlString += taskHtml(task); // Append each task to htmlString after it loops
    });
    var ulTodos = $('.todo-list'); // Grab the .todo-list element
    ulTodos.html(htmlString);

    $('.toggle').change(toggleTask);
      
  });

  $('#new-form').submit(function(event) {
    event.preventDefault(); // Prevents from loading
    var textbox = $('.new-todo'); // Grabs the HTML area
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post('/tasks', payload).success( function (data) {
      var htmlString = taskHtml(data)
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.new-todo').val('');
    })
  });

});

