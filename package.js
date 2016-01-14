Package.describe({
    name: "jimmiebtlr:cart",
    summary: "A simple shopping cart.",
  	version: "0.0.1",
    git: "https://github.com/jimmiebtlr/meteor-cart.git"
});

Package.on_use(function (api) {
	api.versionsFrom("METEOR@1.0.2");

  api.use([
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.3.3',
    'dburles:collection-helpers@1.0.3',
    'peppelg:on-login-logout@1.0.0',
    'accounts-base',
    'deps',
    'mongo',
    'underscore',
  ]);

	api.use([
    'ground:db@0.3.10',
	],
	'client');

	api.add_files('cart.js',['client','server']);

  api.export('Cart', ['client','server']);
});

Package.onTest(function(api) {
  api.use('sanjo:jasmine@0.17.0');
  api.use('velocity:core');
  api.use('velocity:html-reporter@0.6.2');
  api.use('pstuart2:velocity-notify@0.0.5');
  api.use('elevatedevdesign:cart');
  api.use('mongo');
  api.use('accounts-password');

  api.addFiles(['tests/lib-fixtures.js'], ['client','server']);
  api.addFiles(['tests/cart-spec.js'], 'client');
  api.addFiles(['tests/server/cart-spec.js'], 'server');
});
