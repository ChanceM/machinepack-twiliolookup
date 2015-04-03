module.exports = {


  friendlyName: 'Format Lookup',


  description: 'Reformat numbers provided into local format',


  extendedDescription: '',


  inputs: {
    phoneNumber: {
        example: '209 525-6325',
        description: 'Phone number you wish to validate.',
        required: true
    },
    accountSid: {
        example: 'AC2b6da5680e4cdd77db1a679e8c7a42f3',
        description: 'Twilio Accoutn SID.',
        required: true
    },
    authToken: {
        example: '4135d4dba945c3d883d260148860aaaa',
        description: 'Your Twilio Auth Token.',
        required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },
    wrongOrNoKey: {
        description: 'Invalid or unprovided API key. All calls must have a key.'
    },
    success: {
      description: 'Returns a validated phone number.',
      example: '(209) 525-6325'
    },

  },


  fn: function (inputs,exits) {
    var request = require('request');
    var auth = "Basic " + new Buffer(inputs.accountSid+":"+inputs.authToken).toString("base64");
    request.get(
      {
        url: 'https://lookups.twilio.com/v1/PhoneNumbers/'+inputs.phoneNumber,
        headers: {
          "Authorization": auth
        }
      },
      function Response(error, response, body){
        if (error) {
          return exits.error(error);
        }
        console.log(error, response);
        if (response.statusCode === 401) {
          return exits.wrongOrNoKey("Invalid API or Auth key. All calls must have vailid keys.");
        }
         try {
          var responseBody = JSON.parse(body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }
        return exits.success(responseBody.national_format);
      });
  },



};
