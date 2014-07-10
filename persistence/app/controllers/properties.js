var args = arguments[0] || {};
var fieldValue =  Titanium.App.Properties.getString("fieldValue");


/**
 * View Event Listeners
 */
$.tf1.addEventListener('return', function() {
	// hide the keyboard
	$.tf1.blur();
});

$.tf1.addEventListener('change', function(e) {
	// save the text field's value 
	Titanium.App.Properties.setString("fieldValue",e.value);
});

/**
 * Initialize View
 */
var initView = function(){
	$.tf1.setValue( fieldValue );
 
};
initView();
