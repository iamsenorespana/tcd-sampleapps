var args = arguments[0] || {};
var currentNote = '';
var db = Titanium.Database.open('todos');
db.execute('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, todo TEXT)');


/**
 * View Event Listeners
 */
$.tf1.addEventListener('return', function() {
	$.tf1.blur();
});
$.tf1.addEventListener("change", function(e) {
  currentNote = e.value;
  if (currentNote == '') {
    $.saveButton.enabled = false;
  }
  else {
    $.saveButton.enabled = true;
  }
});

$.tableview.addEventListener('click', function(e) {
	Titanium.UI.createAlertDialog({
	  title:'DB Test', 
	  message:'Now would be a perfect time to update the record at index ' + e.rowData.id 
	}).show();
});

if(OS_IOS){
	var editButton = Titanium.UI.createButton({
		title:'Edit'
	});
	var cancelButton = Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	
	editButton.addEventListener('click', function() {
		$.win.setRightNavButton(cancelButton);
		$.tableview.editing = true;
	});
	cancelButton.addEventListener('click', function() {
		$.win.setRightNavButton(editButton);
		$.tableview.editing = false;
	});

	// add delete event listener
	$.tableview.addEventListener('delete',function(e) {
		var db = Titanium.Database.open('todos');
		db.execute("DELETE FROM todos WHERE id = ?", e.rowData.id);
		db.close();
	});	
}


//Add event listener for save button
$.saveButton.addEventListener("click", function(e) {
  if ($.saveButton.enabled) {
	var db = Titanium.Database.open('todos');
    db.execute('INSERT INTO todos (todo) VALUES(?)',currentNote);
    var last = db.lastInsertRowId; // careful, it's not lastInsertRowID!
    $.tableview.appendRow({
      title:currentNote,
      id:last
    });
    currentNote = '';
    $.tf1.value = '';
    $.tf1.blur();
    $.saveButton.enabled = false;
    db.close();
  }
});

/**
 * Initialize View
 */
var initView = function(){
	//This is the array we'll use to back the table view
	var data = [];
	
	//Get data for tableview
	var rows = db.execute('SELECT * FROM todos');
	while (rows.isValidRow()) {
	  data.push({
	    title: rows.fieldByName('todo'),
	    id: rows.fieldByName('id')
	  });
		rows.next();
	}
	rows.close();
	db.close();	
	
	$.tableview.setData( data );
};
initView();
