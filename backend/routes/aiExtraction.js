const express = require('express');
const axios = require('axios');
const router = express.Router();

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

router.post('/preferences', async (req, res) => {
  try {
    const userInput = req.body.userQuery;
    
    const response = await axios({
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        messages: [
          {
            role: "system",
            content: "Extract hotel search parameters from the user input and return them as a JSON object with the following fields: IATACityCode, amenities, ratings, checkInDate, checkOutDate, numRooms, guestCount, roomCapacity, perNightPriceLow, perNightPriceHigh, guestRelationship, boardType, hotelSource, accessibilityNeeds. Use the specified enums and formats for each field."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
            "type": "object",
            "properties": {
                "IATACityCode": {
                "type": "string"
                },
                "amenities": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": ["SWIMMING_POOL", "SPA", "FITNESS_CENTER", "AIR_CONDITIONING", "RESTAURANT", "PARKING", "PETS_ALLOWED", "AIRPORT_SHUTTLE", "BUSINESS_CENTER", "DISABLED_FACILITIES", "WIFI", "MEETING_ROOMS", "NO_KID_ALLOWED", "TENNIS", "GOLF", "KITCHEN", "ANIMAL_WATCHING", "BABY-SITTING", "BEACH", "CASINO", "JACUZZI", "SAUNA", "SOLARIUM", "MASSAGE", "VALET_PARKING", "BAR", "LOUNGE", "KIDS_WELCOME", "MINIBAR", "TELEVISION", "WI-FI_IN_ROOM", "ROOM_SERVICE", "GUARDED_PARKG", "SERV_SPEC_MENU"]
                }
                },
                "ratings": {
                "type": "integer",
                "enum": [1, 2, 3, 4, 5]
                },
                "checkInDate": {
                "type": "string",
                "format": "date"
                },
                "checkOutDate": {
                "type": "string",
                "format": "date"
                },
                "numRooms": {
                "type": "integer"
                },
                "guestCount": {
                "type": "integer"
                },
                "roomCapacity": {
                "type": "integer"
                },
                "perNightPriceLow": {
                "type": "integer"
                },
                "perNightPriceHigh": {
                "type": "integer"
                },
                "guestRelationship": {
                "type": "string",
                "enum": ["ALONE", "FRIENDS", "FAMILY", "OTHER"]
                },
                "boardType": {
                "type": "string",
                "enum": ["ROOM_ONLY", "BREAKFAST", "HALF_BOARD", "FULL_BOARD", "ALL_INCLUSIVE"]
                },
                "hotelSouce": {
                "type": "string"
                },
                "accessibilityNeeds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
                },
            },
            "required": [
                "IATACityCode",
                "checkInDate",
                "checkOutDate",
                "numRooms"
            ]
            }
        },
        max_tokens: 500
      }
    });

    const aiResponse = response.data.result.response;
    
    let extractedParams;
    try {
      extractedParams = JSON.parse(aiResponse);
    } catch (e) {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedParams = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to extract valid JSON from AI response");
      }
    }
    
    res.json({
      success: true,
      parameters: extractedParams
    });
    
  } catch (error) {
    console.error('Error extracting hotel preferences:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;