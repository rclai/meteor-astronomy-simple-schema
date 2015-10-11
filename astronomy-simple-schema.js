var constructorTypeMap = {
  StringField: String,
  DateField: Date,
  BooleanField: Boolean,
  ObjectField: Object,
  NumberField: Number,
  ArrayField: []
  // Sorry, no NullField in SimpleSchema -_-
};

var determineFieldType = function(field) {
  var constructorName = field.constructor.name;
  var fieldType = constructorTypeMap[constructorName];
  if (constructorName === 'ArrayField') {
    // XXX Need to account for nested SimpleSchemas
    // Currently only plain nested types are allowed
    var arrayElementType = constructorTypeMap[field.field.constructor.name];
    if (!_.isUndefined(arrayElementType)) {
      return [arrayElementType];
    } else {
      // Assume an array of objects
      return [Object];
    }
  }
  return fieldType;
};

var validatorMap = {
  minLength: 'min',
  maxLength: 'max',
  gte: 'min',
  lte: 'max',
  gt: 'exclusiveMin',
  lt: 'exclusiveMax',
  email: 'regEx',
  choice: 'allowedValues',
  unique: 'unique',
  regexp: 'regEx'
};

applySingleFieldValidator = function(fieldDef, validatorDef) {
  var validatorSimpleSchemaObject = validatorMap[validatorDef.validator.name];
  switch (validatorDef.validator.name) {
    case 'minLength':
    case 'gte':
    case 'maxLength':
    case 'lte':
    case 'gt':
    case 'lt':
    case 'choice':
    case 'unique':
    case 'regexp':
      fieldDef[validatorSimpleSchemaObject] = validatorDef.param;
      break;
    case 'email':
      fieldDef[validatorSimpleSchemaObject] = SimpleSchema.RegEx.Email;
      break;
    default:
      console.log('Currently there is no translation of', validatorDef.validator.name);
      break;
  }
};

Astro.eventManager.on('initClass', function() {
  var Class = this;

  Class.getSimpleSchema = function(manualFieldDefs) {
    var fieldDefs = {};
    _.each(Class.getFields(), function(field, fieldName) {
      var fieldDef = {};
      // Check if we have a manual field definition
      // This is used when Astronomy's schema definitions
      // are way too complex to be translated into a SimpleSchema definition
      if (manualFieldDefs && manualFieldDefs[fieldName]) {
        fieldDefs[fieldName] = manualFieldDefs[fieldName];
        // Continue
        return;
      }

      // The field type is required
      fieldDef.type = determineFieldType(field);

      // XXX for now any object field or array of Objects will be a blackbox
      // until I get a chance to handle it
      if (fieldDef.type === Object || (_.isArray(fieldDef.type) && fieldDef.type[0] === Object)) {
        fieldDef.blackbox = true;
      }

      // defaultValue
      if (field.default) {
        fieldDef.defaultValue = _.isFunction(field.default) ? field.default() : field.default;
      }

      // denyUpdate
      if (field.immutable) {
        fieldDef.denyUpdate = true;
      }

      // optional
      if (field.optional) {
        fieldDef.optional = true;
      }

      var fieldValidator = Class.getValidator(fieldName);
      if (fieldValidator) {
        // XXX Currently only supports non-array Validators
        // Use manual field def approach to define your simple schema field
        if (!_.isArray(fieldValidator)) {
          applySingleFieldValidator(fieldDef, fieldValidator);
        }
      }

      fieldDefs[fieldName] = fieldDef;
    });
    return new SimpleSchema(fieldDefs);
  };
});
