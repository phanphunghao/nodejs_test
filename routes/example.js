const express = require('express');
const router = express.Router();

/**
 * Get a single example
 */
router.get('/example/:name', async function (request, response) {
    try {
        let exampleModel = new (require('../models/example'));

        let result = request.params.name

        response.json({
            code: "200",
            message: "success",
            data: result,
            metadata: {
                created: new Date().toISOString()
            }
        });
    } catch (error) {
        response.json({
            code: CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
            data: error.message,
            metadata: { created: new Date().toISOString() }
        });
    }
});

module.exports = router;
