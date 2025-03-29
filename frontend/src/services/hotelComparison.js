/**
 * @param {Object} userPreferences - The preferences extracted from user input
 * @param {Array} hotelResults - The hotels returned from the API
 * @returns {Array} - Enhanced hotel results with match information
 */
const compareHotelsWithPreferences = (userPreferences, hotelResults) => {
    const keyFeatures = [
      'IATACityCode', 
      'ratings', 
      'amenities', 
      'boardType', 
      'accessibilityNeeds'
    ];
  
    const activePreferences = Object.entries(userPreferences)
      .filter(([key, value]) => {
        return value !== null && 
               value !== undefined && 
               value !== '' && 
               !(Array.isArray(value) && value.length === 0);
      })
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    const activePreferenceCount = Object.keys(activePreferences).length;
    
    const enhancedResults = hotelResults.map(hotel => {
      let matchCount = 0;
      const matchedFeatures = {};
      const missingFeatures = {};
  
      Object.entries(activePreferences).forEach(([key, preferenceValue]) => {
        const hotelValue = hotel[key];
        
        let isMatch = false;
        
        if (key === 'IATACityCode') {
          isMatch = hotelValue === preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = hotelValue;
          } else {
            missingFeatures[key] = preferenceValue;
          }
        } else if (key === 'checkInDate' || key === 'checkOutDate') {
          isMatch = hotelValue === preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = formatDate(hotelValue);
          } else {
            missingFeatures[key] = formatDate(preferenceValue);
          }
        } else if (key === 'amenities' && Array.isArray(preferenceValue)) {
          if (Array.isArray(hotelValue)) {
            const matched = preferenceValue.filter(amenity => hotelValue.includes(amenity));
            const missing = preferenceValue.filter(amenity => !hotelValue.includes(amenity));
            
            isMatch = missing.length === 0;
            
            if (matched.length > 0) {
              matchedFeatures[key] = matched;
            }
            
            if (missing.length > 0) {
              missingFeatures[key] = missing;
            }
          }
        } else if (key === 'accessibilityNeeds' && Array.isArray(preferenceValue)) {
          if (Array.isArray(hotelValue)) {
            const matched = preferenceValue.filter(need => hotelValue.includes(need));
            const missing = preferenceValue.filter(need => !hotelValue.includes(need));
            
            isMatch = missing.length === 0;
            
            if (matched.length > 0) {
              matchedFeatures[key] = matched;
            }
            
            if (missing.length > 0) {
              missingFeatures[key] = missing;
            }
          }
        } else if (key === 'ratings') {
          isMatch = hotelValue >= preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = hotelValue;
          } else {
            missingFeatures[key] = `${preferenceValue}+ stars`;
          }
        } else if (key === 'perNightPriceLow') {
          const hotelPrice = parseFloat(hotel.price);
          isMatch = !isNaN(hotelPrice) && hotelPrice >= preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = `Min $${preferenceValue}`;
          } else {
            missingFeatures[key] = `Min $${preferenceValue}`;
          }
        } else if (key === 'perNightPriceHigh') {
          const hotelPrice = parseFloat(hotel.price);
          isMatch = !isNaN(hotelPrice) && hotelPrice <= preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = `Max $${preferenceValue}`;
          } else {
            missingFeatures[key] = `Max $${preferenceValue}`;
          }
        } else if (key === 'guestRelationship' || key === 'boardType') {
          isMatch = hotelValue === preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = formatEnumValue(preferenceValue);
          } else {
            missingFeatures[key] = formatEnumValue(preferenceValue);
          }
        } else if (key === 'numRooms' || key === 'guestCount' || key === 'roomCapacity') {
          isMatch = hotelValue >= preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = hotelValue;
          } else {
            missingFeatures[key] = preferenceValue;
          }
        } else {
          isMatch = hotelValue === preferenceValue;
          if (isMatch) {
            matchedFeatures[key] = hotelValue;
          } else {
            missingFeatures[key] = preferenceValue;
          }
        }
        
        if (isMatch) {
          matchCount++;
        }
      });
  
      const matchPercentage = activePreferenceCount > 0 
        ? (matchCount / activePreferenceCount) * 100 
        : 0; 
      
      const highlightedFeatures = Object.keys(matchedFeatures)
        .filter(key => keyFeatures.includes(key))
        .reduce((obj, key) => {
          obj[key] = matchedFeatures[key];
          return obj;
        }, {});
  
      return {
        ...hotel,
        matchPercentage: Math.round(matchPercentage),
        matchedFeatures,
        missingFeatures,
        highlightedFeatures,
        matchDetails: {
          total: activePreferenceCount,
          matched: matchCount
        }
      };
    });
  
    return enhancedResults.sort((a, b) => b.matchPercentage - a.matchPercentage);
  };
  
  /**
   * @param {string} value - The enum value to format
   * @returns {string} - Formatted string
   */
  function formatEnumValue(value) {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
  
  /**
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
  
  module.exports = { compareHotelsWithPreferences };