(function(window) {
 can.view.preloadStringRenderer('apps_main_components_bootstrap_bootstrap_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>Bootstrap</h2>\n<div id=\"carousel-example-generic\" class=\"carousel slide\" data-ride=\"carousel\" ");___v1ew.push(
can.view.txt(
1,
'div',
1,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"carousel"})));___v1ew.push(
"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n  <!-- Wrapper for slides -->\n  <div class=\"carousel-inner\">\n    <div class=\"item active\">\n      <img ");___v1ew.push(
can.view.txt(2,'img','src',this,function(){var ___v1ew = [];___v1ew.push(
"src=\"");___v1ew.push(
"http://bitovi.com/img/about/justin.jpg\"");return ___v1ew.join('')}));
___v1ew.push(
" alt=\"...\">\n      <div class=\"carousel-caption\">\n      </div>\n    </div>\n    <div class=\"item\">\n      <img ");___v1ew.push(
can.view.txt(2,'img','src',this,function(){var ___v1ew = [];___v1ew.push(
"src=\"");___v1ew.push(
"http://bitovi.com/img/about/brian.jpg\"");return ___v1ew.join('')}));
___v1ew.push(
" alt=\"...\">\n      <div class=\"carousel-caption\">\n      </div>\n    </div>\n    <div class=\"item\">\n      <img ");___v1ew.push(
can.view.txt(2,'img','src',this,function(){var ___v1ew = [];___v1ew.push(
"src=\"");___v1ew.push(
"http://bitovi.com/img/about/mihael.jpg\"");return ___v1ew.join('')}));
___v1ew.push(
" alt=\"...\">\n      <div class=\"carousel-caption\">\n      </div>\n    </div>\n  </div>\n  <!-- Controls -->\n  <a class=\"left carousel-control\" href=\"#carousel-example-generic\" data-slide=\"prev\">\n    <span class=\"glyphicon glyphicon-chevron-left\"></span>\n  </a>\n  <a class=\"right carousel-control\" href=\"#carousel-example-generic\" data-slide=\"next\">\n    <span class=\"glyphicon glyphicon-chevron-right\"></span>\n  </a>\n</div>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_home_home_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>Welcome to the home page.</h2>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t<p>You have ");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"secrets.length"})));___v1ew.push(
" secrets</p>\n\t<p>You have ");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"todos.length"})));___v1ew.push(
" things to do.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"<h3>This page contains all sorts of information that is available to the public.</h3>\n<h4>To see private information, please ");___v1ew.push(
can.view.txt(
1,
'h4',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"linkTo"},'login')));___v1ew.push(
"</h4>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_jquery-ui_jquery-ui_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div ");___v1ew.push(
can.view.txt(
1,
'div',
1,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"accordion"})));___v1ew.push(
"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n  <h3>Section 1</h3>\n  <div>\n    <p>\n    Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer\n    ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit\n    amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut\n    odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.\n    </p>\n  </div>\n  <h3>Section 2</h3>\n  <div>\n    <p>\n    Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet\n    purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor\n    velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In\n    suscipit faucibus urna.\n    </p>\n  </div>\n  <h3>Section 3</h3>\n  <div>\n    <p>\n    Nam enim risus, molestie et, porta ac, aliquam ac, risus. Quisque lobortis.\n    Phasellus pellentesque purus in massa. Aenean in pede. Phasellus ac libero\n    ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis\n    lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui.\n    </p>\n    <ul>\n      <li>List item one</li>\n      <li>List item two</li>\n      <li>List item three</li>\n    </ul>\n  </div>\n  <h3>Section 4</h3>\n  <div>\n    <p>\n    Cras dictum. Pellentesque habitant morbi tristique senectus et netus\n    et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in\n    faucibus orci luctus et ultrices posuere cubilia Curae; Aenean lacinia\n    mauris vel est.\n    </p>\n    <p>\n    Suspendisse eu nisl. Nullam ut libero. Integer dignissim consequat lectus.\n    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per\n    inceptos himenaeos.\n    </p>\n  </div>\n</div>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_login_login_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h3>Please login.</h3>\n<form can-submit=\"login\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n\t<input placeholder='email' can-value=\"email\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n\t<input placeholder='password' can-value=\"password\" type='password'",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n\t<button>Login</button>\n</form>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_secrets_secrets_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>My Secrets</h2>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"secrets"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t<p>");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"description"})));___v1ew.push(
"</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_todos_todos_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>My Todo List</h2>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"todos"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t<p>");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"description"})));___v1ew.push(
"</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_nav_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<nav class=\"navbar navbar-default\" role=\"navigation\">\n  <div class=\"container-fluid\">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">CanJS Example App</a>\n    </div>\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n      <ul class=\"nav navbar-nav\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"          <li><a href=\"/#!\">Home</a></li>\n          <li><a href=\"/#!todos\">To-dos</a></li>\n          <li><a href=\"/#!secrets\">Secrets</a></li>\n          <li class=\"dropdown\">\n            <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Dropdown <b class=\"caret\"></b></a>\n            <ul class=\"dropdown-menu\">\n              <li><a href=\"#\">Action</a></li>\n              <li><a href=\"#\">Another action</a></li>\n              <li><a href=\"#\">Something else here</a></li>\n              <li class=\"divider\"></li>\n              <li><a href=\"#\">Separated link</a></li>\n              <li class=\"divider\"></li>\n              <li><a href=\"#\">One more separated link</a></li>\n            </ul>\n          </li>\n        ");return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n          <li><a href=\"/#!\">Home</a></li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      </ul>\n      <ul class=\"nav navbar-nav navbar-right\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"unless"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"        <li><a href=\"/#!login\">Login</a></li>\n        ");return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n          <li class=\"dropdown\">\n            <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">");___v1ew.push(
can.view.txt(
1,
'a',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"session.email"})));___v1ew.push(
" <b class=\"caret\"></b></a>\n            <ul class=\"dropdown-menu\">\n              <li><a href=\"/#!my-account\">My Account</a></li>\n              <li class=\"divider\"></li>\n              <li><a href=\"javascript://\" can-click='logout'",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"Logout</a></li>\n            </ul>\n          </li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      </ul>\n    </div><!-- /.navbar-collapse -->\n  </div><!-- /.container-fluid -->\n</nav>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_site_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"container\">\n\t");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
function(){ return can.Mustache.renderPartial('apps/main/nav.mustache',scope,options)}));
___v1ew.push(
"\n\t<div id=\"main\">Loading ...</div>\n</div>");; return ___v1ew.join('') })); 
})(this);