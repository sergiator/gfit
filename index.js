var request = require('request-promise');

module.exports = function (options) {

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
      request({
        method: 'POST',
        uri: 'https://www.googleapis.com/oauth2/v4/token',
        form: {
          code: authCode,
          client_id: _options.client_id,
          client_secret: _options.client_secret,
          grant_type: 'authorization_code'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (body) {
        if (!body.access_token) {
          return callback({ code: 422, message: "Got no access_token from Google Fitness" })
        }
        if (!body.refresh_token) {
          return callback({ code: 422, message: "Got no refresh_token from Google Fitness" });
        }
        return callback(null, { accessToken: body.accessToken, refreshToken: body.refreshToken });
      }).catch(function (response) {
        response = response || {};
        var message;
        if (response.error) {
          message - response.error.error_description;
        }
        return callback({ code: response.statusCode || 400, message: message || "Error while requesting Google Fitness API" });
      });
    },
    getAccessToken: function (refreshToken, callback) {
      if (!callback || (typeof(callback) !== 'function')) {
        throw new Error('Callback must be a function');
      }
      if (!refreshToken) {
        return callback({ code: 400, message: "Missing refreshToken" });
      }
      /* TODO:
      POST request to https://www.googleapis.com/oauth2/v4/token. The request must include the following parameters:
      Field 	Description
      refresh_token 	The refresh token returned from the authorization code exchange.
      client_id 	The client ID you obtained from the Google API Console.
      client_secret 	The client secret you obtained from the API Console (not applicable for clients registered as Android, iOS or Chrome applications).
      grant_type 	As defined in the OAuth 2.0 specification, this field must contain a value of refresh_token.
      */
      return callback({ code: 500, message: "THIS FUNCTION IS NOT READY YET (((" });
    },
    getSteps: function (params, callback) {
      if (!callback || (typeof(callback) !== 'function')) {
        throw new Error('Callback must be a function');
      }
      if (!params) {
        return callback({ code: 400, message: "Missing params" });
      }
      if (!params.accessToken) {
        return callback({ code: 400, message: "Missing accessToken parameter" });
      }
      if (!params.startTime) {
        return callback({ code: 400, message: "Missing startTime parameter" });
      }
      if (!params.endTime) {
        return callback({ code: 400, message: "Missing endTime parameter" });
      }
      request({
        method: 'POST',
        uri: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        headers: {
          'Content-Type': 'application/json;encoding=utf-8',
          'Authorization': 'Bearer ' + params.accessToken
        },
        json: true
      }).then(function (body) {
        console.log(body);
        res.json({ body: body });
      }).catch(function (response) {
        var errObj = response.error || {};
        var error = errObj.error || {};
        return callback({ code: error.code || 400, message: error.message || "Error while requesting Google Fitness API" });
      });
      //return callback(null, { message: 'All seems good here...' });
      /*request({
        method: 'POST',
        uri: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        body: {
          "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
          }],
          startTimeMillis: '' + params.startTime,
          endTimeMillis: '' + params.endTime
        },
        headers: {
          'Content-Type': 'application/json;encoding=utf-8',
          'Authorization': 'Bearer ' + params.accessToken
        }
      }).then(function (body) {
        console.log(body);
        return callback(null, { body: body });
      }).catch(function (response) {
        response = response || {};
        var message;
        if (response.error) {
          message = response.error.error_description;
        }
        return callback({ code: response.statusCode || 400, message: message || "Error while requesting Google Fitness API" });
      });*/
    }
  };
};
