const express = require('express');
const axios = require('axios');
const router = express.Router();

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

router.post('/preferences', async (req, res) => {
    try {
        if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
            return res.status(500).json({
                success: false,
                error: "Missing Cloudflare API credentials in environment variables"
            });
        }

        const userInput = req.body.userQuery;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const formattedDate = `${currentYear}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const timestamp = Date.now(); 

        const strictPrompt = 
        `Current date: ${formattedDate}. [Request ID: ${timestamp}]
        
You are extracting structured data for a hotel search request. **This is a stateless, single-turn request with no memory of past interactions.**
        
**Return ONLY a valid JSON object, without any extra text or explanations.** The output **MUST** follow this structure:

{
  "IATACityCode": *string*,
  "amenities": *array of strings*,
  "ratings": *integer*,
  "checkInDate": "yyy-mm-dd",
  "checkOutDate": "yyy-mm-dd",
  "numRooms": *integer*,
  "guestCount": *integer*,
  "perNightPriceLow": *integer*,
  "perNightPriceHigh": *integer*,
  "guestRelationship": *string*
}

### **Rules for Extraction**
    **City Code (IATACityCode)**
   - Extract ONLY from a **valid airport/city list** (e.g., NYC, LAX, SFO).
   - If a city is mentioned (e.g., 'New York'), return **'NYC'**.
   - If an airport is mentioned, return its code (e.g., 'JFK').

    **Amenities**
   - Extract exact matches from this enum list:
     ['WIFI', 'PARKING', 'SPA', 'RESTAURANT', 'FITNESS_CENTER', 'SWIMMING_POOL', 'BUSINESS_CENTER', 'AIR_CONDITIONING'].
   - If none are mentioned, return [].

    **Ratings**
   - Extract the **minimum guest review rating** (1-5). If not mentioned, default to \`0\`.

    **Dates (checkInDate & checkOutDate)**
   - Always use **YYYY-MM-DD format**.
   - Use **current year (${currentYear})** unless the user explicitly mentions a different year.
   - If only the number of nights is given, calculate **checkOutDate = checkInDate + numNights**.

    **Number of Rooms & Guests**
   - Extract exact values.
   - If unspecified, default to \`1\`.

    **Price Range (perNightPriceLow / perNightPriceHigh)**
   - Extract exactly as stated. **Do NOT round, modify, or assume missing values.**
   - Example: "Budget is $xxx-$zzz per night." → { "perNightPriceLow": xxx, "perNightPriceHigh": zzz }.
   - If no price is mentioned, return { "perNightPriceLow": 0, "perNightPriceHigh": 0 }.

    **Guest Relationship**
   - If 'alone' → "TRAVELING_ALONE".
   - If 'with family' → "FAMILY".
   - If 'business trip' → "BUSINESS".
   - If unspecified, return "".

### **Critical Instructions**
    **DO NOT** hallucinate missing values. If a parameter is absent, return an empty or default value.  
    **DO NOT** alter numbers or price ranges.  
    **DO NOT** add explanatory text—**ONLY return the JSON object.**  
    **DO NOT** remember previous requests. Each extraction is **stateless and independent**.`;  

        const response = await axios({
            method: 'POST',
            url: `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
            headers: {
                'Authorization': `Bearer ${CF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messages: [
                    { role: "system", content: strictPrompt },
                    { role: "user", content: userInput }
                ],
                response_format: "text",
                max_tokens: 500,
                temperature: 0 
            }
        });

        console.log('Raw Cloudflare API response:', response.data);

        let extractedParams;
        try {
            if (typeof response.data.result.response === 'string') {
                extractedParams = JSON.parse(response.data.result.response);
            } else {
                extractedParams = response.data.result.response;
            }
        } catch (e) {
            return res.status(500).json({
                success: false,
                error: "Failed to parse AI response JSON",
                rawResponse: response.data,
                parseError: e.message
            });
        }

        if (!extractedParams.perNightPriceLow || !extractedParams.perNightPriceHigh) {
            const priceMatch = userInput.match(/\$(\d+)\s*-\s*\$(\d+)/);
            if (priceMatch) {
                extractedParams.perNightPriceLow = parseInt(priceMatch[1], 10);
                extractedParams.perNightPriceHigh = parseInt(priceMatch[2], 10);
                console.log("Fallback extracted price range:", extractedParams.perNightPriceLow, extractedParams.perNightPriceHigh);
            }
        }

        console.log('Final extracted parameters:', extractedParams);

        res.json({
            success: true,
            parameters: extractedParams
        });

    } catch (error) {
        console.error('Error extracting hotel preferences:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            statusCode: error.response?.status,
            data: error.response?.data
        });
    }
});

module.exports = router;