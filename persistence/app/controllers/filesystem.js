var args = arguments[0] || {};

if(Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'test.json').exists()) {
	// if file exists in applicationDataDirectory, use it
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'test.json');
} else {
	// otherwise, open the 'stock' version from resourcesDirectory
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'test.json');
}

var resources = JSON.parse(f.read().text);

/**
 * View Event Listeners
 */
$.tf1.addEventListener('return', function() {
	$.tf1.blur();
});
$.tf1.addEventListener('change', function(e) {
	resources.en_us.hello = e.value;
});

$.tf2.addEventListener('return', function() {
	$.tf2.blur();
});
$.tf2.addEventListener('change', function(e) {
  resources.en_us.goodbye = e.value;
});

$.b1.addEventListener("click", function(e) {
	$.tf1.blur();
	$.tf2.blur();
	f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'test.json');
	f.write(JSON.stringify(resources));
});

/**
 * Initialize View
 */
var initView = function(){
	$.tf1.setValue( resources.en_us.hello );	
	$.tf2.setValue( resources.en_us.goodbye ); 
};
initView();
