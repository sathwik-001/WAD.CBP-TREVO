require('dotenv').config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");

// Helper to calculate "Next Friday"
function getNextFriday() {
    const now = new Date();
    const resultDate = new Date(now.getTime());
    let daysUntil = (5 - now.getDay() + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;
    resultDate.setDate(now.getDate() + daysUntil);
    return resultDate.toISOString().split('T')[0];
}

function getNextDay(dateString) {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

// RapidAPI Fetch Helper
async function fetchRapidAPI(url, host) {
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': host,
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`RapidAPI Error HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        console.error(`Error fetching ${url}:`, e.message);
        return null;
    }
}

// Geoapify Helper
async function fetchGeoapify(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Geoapify Error HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        console.error(`Error fetching ${url}:`, e.message);
        return null;
    }
}

async function runPipeline(message) {
    // 1. Initial Parsing
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-3-flash-preview",
        maxOutputTokens: 2048,
        apiKey: process.env.GEMINI_API_KEY
    });

    const sysPrompt = `Extract travel details from the user input. Output ONLY a valid JSON object with keys: source, tourist_places (mapping city to landmarks as string array), destinations (array), start_date (YYYY-MM-DD), duration (days), members, expenditure. If expenditure and duration is in other formats then convert that into number(Rs) and days format. Return pure JSON.`;
    
    let response = await model.invoke([
        new SystemMessage(sysPrompt),
        new HumanMessage(message)
    ]);

    let parsedOutput = {};
    try {
        const cleanString = typeof response.content === 'string' ? response.content.replace(/```json|```/g, "").trim() : JSON.stringify(response.content);
        parsedOutput = typeof response.content === 'string' ? JSON.parse(cleanString) : response.content;
    } catch (e) {
        throw new Error("Failed to parse initial LLM JSON: " + e.message);
    }

    // 2. Expand Tourist Places using secondary AI Agent
    if (parsedOutput.destinations && parsedOutput.tourist_places) {
        const expanderModel = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash", // Using 2.5 flash as lite replacement
            maxOutputTokens: 2048,
            apiKey: process.env.GEMINI_API_KEY
        });
        const expandSysPrompt = `Role: You are a JSON Data Transformation Engine.
Task: Receive the user's tourist_places object.
Constraint: Do NOT add new cities. Only use the cities provided in the input.
Transformation: For each city, convert the list of strings into a list of objects. Set status: "original" for the places the user provided. Add 2 NEW famous places for each city and set status: "suggested". 
Output ONLY valid JSON. Note: For the output, make the schema a map where keys are city names and values are arrays of { "name": string, "status": "original" | "suggested" }.`;

        try {
            const expandResponse = await expanderModel.invoke([
                new SystemMessage(expandSysPrompt),
                new HumanMessage(JSON.stringify(parsedOutput.tourist_places))
            ]);
            const expandedClean = expandResponse.content.replace(/```json|```/g, "").trim();
            parsedOutput.tourist_places = JSON.parse(expandedClean);
        } catch (e) {
            console.error("Expand places failed, continuing with original...", e);
            // Convert existing strings to our desired shape
            for (const city of Object.keys(parsedOutput.tourist_places)) {
                if (Array.isArray(parsedOutput.tourist_places[city]) && typeof parsedOutput.tourist_places[city][0] === 'string') {
                    parsedOutput.tourist_places[city] = parsedOutput.tourist_places[city].map(p => ({ name: p, status: "original" }));
                }
            }
        }
    }

    // Prepare global return structure
    const finalReport = {
        status: "Success",
        generated_at: new Date().toLocaleString(),
        source_data: parsedOutput,
        hotels_list: [],
        tourist_list: [],
        restaurants_list: []
    };

    const destinations = parsedOutput.destinations || [];
    let checkinRaw = parsedOutput.start_date;
    if (!checkinRaw || checkinRaw === "null") checkinRaw = getNextFriday();
    
    const guests = parsedOutput.members || 1;

    // --- PIPELINE BATCHES ---
    // We process each destination city concurrently
    for (const city of destinations) {
        
        // --- A. Fetch Hotels (Booking.com) ---
        let checkoutDest = getNextDay(checkinRaw);
        const locResponse = await fetchRapidAPI(`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(city)}&locale=en-gb`, "booking-com.p.rapidapi.com");
        
        let destId = null;
        if (locResponse && locResponse.length > 0) {
            const cityMatch = locResponse.find(r => r.dest_type === "city" && r.name && r.name.toLowerCase().trim() === city.toLowerCase().trim());
            if (cityMatch) destId = cityMatch.dest_id;
            else if (locResponse.find(r => r.dest_type === "city")) destId = locResponse.find(r => r.dest_type === "city").dest_id;
        }

        if (destId) {
            const hotelSearchUrl = `https://booking-com.p.rapidapi.com/v1/hotels/search?checkin_date=${checkinRaw}&checkout_date=${checkoutDest}&adults_number=${guests}&room_number=1&dest_id=${destId}&dest_type=city&locale=en-gb&units=metric&order_by=price&filter_by_currency=INR`;
            const hotelRes = await fetchRapidAPI(hotelSearchUrl, "booking-com.p.rapidapi.com");
            
            if (hotelRes && hotelRes.result) {
                const top3 = hotelRes.result
                    .filter(h => h.hotel_name && h.min_total_price)
                    .sort((a,b) => (b.review_score || 0) - (a.review_score || 0))
                    .slice(0, 3)
                    .map(h => ({
                        name: h.hotel_name,
                        price: `${h.currencycode || 'INR'} ${Math.round(h.min_total_price)}`,
                        rating: `${h.review_score || 'N/A'} / 10`,
                        review_count: h.review_nr || 0,
                        image_url: h.main_photo_url || "",
                        location: h.distance_to_cc_formatted || "Central Area",
                        perks: h.is_free_cancellable ? "Free Cancellation ✅" : "Standard Policy",
                        url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.hotel_name)}&dest_id=${h.hotel_id}&dest_type=hotel`
                    }));
                
                finalReport.hotels_list.push({
                    city: city.charAt(0).toUpperCase() + city.slice(1),
                    recommendations: top3
                });
            }
        }

        // --- B. Fetch Landmarks & Restaurants ---
        const places = parsedOutput.tourist_places?.[city] || [];
        for (const place of places) {
            let qName = place.name;
            // n8n hardcoded manual override for Itmad-ud-Daulah
            let lat = null, lon = null;
            if (qName.toLowerCase().includes("itmad") || qName.toLowerCase().includes("daulah")) {
                qName = "Tomb of I'timad-ud-Daulah, Agra";
                lat = 27.1929;
                lon = 78.0310;
            } else {
                qName = qName.replace(/'s/g, "").replace(/-/g, " ").trim();
                const geoUrl = `https://api.geoapify.com/v1/geocode/search?name=${encodeURIComponent(qName)}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
                const geoRes = await fetchGeoapify(geoUrl);
                if (geoRes && geoRes.results && geoRes.results.length > 0) {
                    lat = geoRes.results[0].lat;
                    lon = geoRes.results[0].lon;
                }
            }

            // Attractions (TripAdvisor Search by Name)
            // The n8n logic uses TripAdvisor's locations/search for attractions, then get-details
            const taSearch = await fetchRapidAPI(`https://travel-advisor.p.rapidapi.com/locations/search?query=${encodeURIComponent(qName)}&category=attractions&limit=1`, "travel-advisor.p.rapidapi.com");
            let locId = null;
            let attrItem = null;
            if (taSearch && taSearch.data && taSearch.data.length > 0) {
                locId = taSearch.data[0].result_object.location_id;
                attrItem = taSearch.data[0].result_object; // fallback snippet
            }

            if (locId) {
                const taDetails = await fetchRapidAPI(`https://travel-advisor.p.rapidapi.com/attractions/get-details?location_id=${locId}`, "travel-advisor.p.rapidapi.com");
                if (taDetails) {
                    attrItem = taDetails;
                }
            }
            
            if (attrItem) {
                finalReport.tourist_list.push({
                    name: attrItem.name || qName,
                    city: city,
                    status: place.status,
                    description: attrItem.description || `Historical landmark in ${city}`,
                    image_url: attrItem.photo?.images?.large?.url || "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800", // Fallback Beautiful Image
                    rating: attrItem.rating || "N/A",
                    type: attrItem.subtype?.[0]?.name || "Point of Interest",
                    google_maps_link1: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attrItem.name || qName)}+${encodeURIComponent(city)}`,
                    latitude: lat,
                    longitude: lon
                });
            }

            // Restaurants (TripAdvisor list-by-latlng)
            if (lat && lon) {
                const restList = await fetchRapidAPI(`https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${lat}&longitude=${lon}&distance=0.02&limit=4`, "travel-advisor.p.rapidapi.com");
                if (restList && restList.data) {
                    const ans = restList.data.filter(r => r.name).slice(0, 4).map(item => ({
                        name: item.name,
                        near_to: qName,
                        rating: parseFloat(item.rating) || 0,
                        nums_review: item.num_reviews || "0",
                        famous_for: item.cuisine?.length ? item.cuisine[0].name : "Specialty Dining",
                        key_details: item.ranking || "Top Rated",
                        image_url: item.photo?.images?.large?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500", // Fallback Resto
                        trip_advisor_url: item.web_url,
                        google_maps_link1: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}+${encodeURIComponent(city)}`,
                        distance_from_monument: item.distance ? `${(parseFloat(item.distance) * 1000).toFixed(0)}m` : "Nearby"
                    }));

                    if (ans.length > 0) {
                        finalReport.restaurants_list.push({
                            tourist_place: place.name,
                            city: city,
                            ans: ans
                        });
                    }
                }
            }
        }
    }

    return finalReport;
}

module.exports = { runPipeline };
