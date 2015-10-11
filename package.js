Package.describe({
  name: 'lai:astronomy-simple-schema',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Convert Astronomy classes to SimpleSchemas',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rclai/meteor-astronomy-simple-schema.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('ecmascript');
  api.use('jagi:astronomy');
  api.use('jagi:astronomy-validators');
  api.addFiles('astronomy-simple-schema.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lai:astronomy-simple-schema');
  api.addFiles('astronomy-simple-schema-tests.js');
});
