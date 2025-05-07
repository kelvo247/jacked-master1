export default async function handler(req, res) {
    const { mealType } = req.query;

    if (!mealType) {
        return res.status(400).json({ message: "Meal type is required" });
    }

    try {
        const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${mealType}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_API_KEY}`;

        console.log("Fetching:", apiUrl); // Debugging

        const response = await fetch(apiUrl, {
            headers: {
                "Edamam-Account-User": "your-edamam-username-here"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${response.status} ${response.statusText}`, errorText);
            return res.status(response.status).json({ message: "Failed to fetch meals" });
        }

        const data = await response.json();

        if (!data.hits || data.hits.length === 0) {
            return res.status(404).json({ message: `No meals found for ${mealType}.` });
        }

        res.status(200).json({ meals: data.hits.map(hit => hit.recipe) });

    } catch (error) {
        console.error("Error fetching meals:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
