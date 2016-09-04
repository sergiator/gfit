var request = require('request-promise');

module.exports = funtion (options) {

  if (!options) {
    throw new Error('Options are required!');
  }

  if (!options.clientId) {
    throw new Error('Client ID is required');
  }

  if (!options.clientSecret) {
    throw new Error('Client Secret is required');
  }

  var _options = {
    client_id: options.clientId,
    client_secret: options.clientSecret
  };

  return {
    getTokens: function (authCode, callback) {
      if (!callback || (typeof(callback) !== 'function')) {
        throw new Error('Callback must be a function');
      }
      if (!authCode) {
        return callback({ code: 400, message: "Missing authCode" });
      }
      requset({
        method: 'POST',
        uri: 'https://www.googleapis.com/oauth2/v4/token',
        form: {
          code: authCode,
          client_id: _options.client_id,
          client_secret: _options.client_secret,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then(function (body) {
        if (!body.access_token) {
          return callback({ code 422, message: "Got no access_token from Google Fitness" })
        }
        if (!body.refresh_token) {
          return callback({ code 422, message: "Got no refresh_token from Google Fitness" });
        }
        return callback(null, { accessToken: body.accessToken, refreshToken: body.refreshToken });
      }).catch(function (response) {
        response = response || {};
        var message;
        if (response.error) {
          message - response.error.error_description;
        }
        callback({ code: response.statusCode || 400, message || "Error while requesting Google Fitness API" });
      });
    }
  };
};
