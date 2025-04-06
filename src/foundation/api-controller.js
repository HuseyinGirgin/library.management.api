'use-strict';

import Utils from '../foundation/utils.js';

class ApiController {

    sendSuccess(res, data, statusCode = 200, message = '', apiStatus = true) {
        if (Utils.isStringEmpty(message)) {
            message = '';
        }
        let successData = this.success(data, message, apiStatus, statusCode);
        return res.status(statusCode).send(successData);
    }

    success(data, message, apiStatus, statusCode) {
        return {
            ApiStatus: apiStatus,
            ApiStatusCode: statusCode,
            ApiStatusMessage: message,
            Data: data
        }
    }

    sendError(res, statusCode = 500, message = '') {
        return res.status(statusCode).send(this.error(message || ''));
    }

    error(statusCode, message) {
        return {
            ApiStatus: false,
            ApiStatusCode: statusCode,
            ApiStatusMessage: message,
            Data: null
        }
    }
}

export default ApiController;