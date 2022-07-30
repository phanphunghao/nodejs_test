const ExampleError = require (__ROOT + 'libraries/Exception/ExampleError');

/**
 * Example model
 * @see http://mongoosejs.com/docs/models.html
 * @return Example model instance
 */
class Example {
  constructor () {
    let ExampleModel = require ('./Schemas/ExampleSchema');

    /**
     * Find item by name
     *
     * @param name
     * @return {Promise.<T>}
     */
    this.findByExampleName = function (name) {
      return ExampleModel.findOne ({name: name}).exec ().then (result => {
        return result;
      }).catch (_err => {
        logger.error ("\n");
        logger.error ('Example::findByExampleName - Could not find Example with the name ' + name);
        logger.error (JSON.stringify (_err));

        throw new ExampleError ('Invalid Example.', CONSTANT.HTTP_STATUS_BAD_REQUEST);
      });
    }
  }
}

module.exports = Example;
