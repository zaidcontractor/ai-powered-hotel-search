import axios from 'axios';
import qs from 'qs';

const BASE_URL_V1 = 'https://test.api.amadeus.com/v1';
const BASE_URL_V3 = 'https://test.api.amadeus.com/v3';
const AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

let accessToken = null;

async function getAccessToken() {
  try {
    const response = await axios.post(AUTH_URL,
      qs.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.API_KEY,
        client_secret: process.env.API_SECRET
      }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
}

async function getAuthHeader() {
  if (!accessToken) {
    accessToken = await getAccessToken();
  }
  return { Authorization: `Bearer ${accessToken}` };
}

async function getMultiHotelOffers() {
  const BASE_URL = 'https://test.api.amadeus.com/v3';
  try {
    const headers = await getAuthHeader();

    const response = await axios.get(`${BASE_URL}/shopping/hotel-offers`, {
      headers,
      params: {
        hotelIds: 'MCLONGHM', // or for multiple IDs: 'MCLONGHM,ANOTHERID'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

async function getHotelsByCity(cityCode = 'NYC') {
  const BASE_URL = 'https://test.api.amadeus.com/v1';
  try {
    const headers = await getAuthHeader();

    const response = await axios.get(`${BASE_URL}/reference-data/locations/hotels/by-city`, {
      headers,
      params: {
        cityCode: cityCode,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

async function getHotelOffersWithFilters(params) {
  try {
    const headers = await getAuthHeader();
    
    // First get basic hotel list
    const searchParams = new URLSearchParams({
      cityCode: params.IATACityCode,
      radius: '50',
      radiusUnit: 'KM'
    });

    const hotelsResponse = await axios.get(
      `${BASE_URL_V1}/reference-data/locations/hotels/by-city`, 
      {
        headers,
        params: searchParams
      }
    );

    if (!hotelsResponse.data.data) {
      return { hotels: [] };
    }

    const hotels = hotelsResponse.data.data;
    const hotelDetails = [];

    // Process in batches of 10
    for (let i = 0; i < Math.min(hotels.length, 100); i += 10) {
      const batchHotels = hotels.slice(i, i + 10);
      try {
        // Format dates properly
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formattedToday = today.toISOString().split('T')[0];
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];

        const offersParams = {
          hotelIds: batchHotels.map(h => h.hotelId).join(','),
          adults: 1,
          checkInDate: formattedToday,
          checkOutDate: formattedTomorrow,
          roomQuantity: 1,
          bestRateOnly: true,
          lang: 'EN'
        };

        console.log('Requesting offers with params:', offersParams);

        const offersResponse = await axios.get(`${BASE_URL_V3}/shopping/hotel-offers`, {
          headers,
          params: offersParams
        });

        if (offersResponse.data.data) {
          offersResponse.data.data.forEach(hotelOffer => {
            let score = 0;
            const hotel = hotelOffer.hotel;

            // Score calculation
            if (params.amenities && hotel.amenities) {
              const amenityMatches = params.amenities.filter(
                amenity => hotel.amenities.includes(amenity)
              ).length;
              score += amenityMatches;
            }

            if (params.ratings && hotel.rating === params.ratings) {
              score += 2;
            }

            const hotelParams = {
              success: true,
              parameters: {
                IATACityCode: params.IATACityCode,
                hotelId: hotel.hotelId,
                name: hotel.name || "Unknown",
                address: {
                  cityName: hotel.cityCode,
                  countryCode: hotel.address?.countryCode,
                  lines: hotel.address?.lines,
                  postalCode: hotel.address?.postalCode,
                  stateCode: hotel.address?.stateCode,
                  latitude: hotel.latitude,
                  longitude: hotel.longitude
                },
                amenities: params.amenities || [],
                ratings: params.ratings || "",
                checkInDate: formattedToday,
                checkOutDate: formattedTomorrow,
                numRooms: params.numRooms || 1,
                guestCount: params.guestCount || 1,
                roomCapacity: params.roomCapacity || 1,
                perNightPriceLow: params.perNightPriceLow || 0,
                perNightPriceHigh: params.perNightPriceHigh || 1000,
                guestRelationship: params.guestRelationship || "NONE",
                boardType: params.boardType || "ROOM_ONLY",
                hotelSource: "ALL",
                accessibilityNeeds: params.accessibilityNeeds || [],
                score // for sorting
              }
            };

            hotelDetails.push(hotelParams);
          });
        }

        // Add delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`Batch error details:`, error.response?.data || error.message);
        continue;
      }
    }

    // Sort and clean up scores
    const sortedHotels = hotelDetails
      .sort((a, b) => b.parameters.score - a.parameters.score)
      .map(hotel => {
        const { score, ...params } = hotel.parameters;
        return { success: true, parameters: params };
      });

    return {
      hotels: sortedHotels
    };

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

export default { 
  getMultiHotelOffers, 
  getHotelsByCity,
  getHotelOffersWithFilters 
};
