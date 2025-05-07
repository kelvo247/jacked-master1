export default async function handler(req, res) {
    const { mealType } = req.query;

    if (!mealType) {
        return res.status(400).json({ message: "Meal type is required" });
    }

    try {
        const response = await fetch(
            `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(mealType)}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_API_KEY}`,
            {
                headers: {
                    "Edamam-Account-User": process.env.NEXT_PUBLIC_EDAMAM_ACCOUNT_USER
                }
            }
        );

        console.log("App ID:", process.env.NEXT_PUBLIC_EDAMAM_APP_ID);
        console.log("API Key:", process.env.NEXT_PUBLIC_EDAMAM_API_KEY);
        console.log("Account User:", process.env.NEXT_PUBLIC_EDAMAM_ACCOUNT_USER);


        if (!response.ok) {
            console.error(`Failed to fetch meals:`, response.status, response.statusText);
            return res.status(response.status).json({ message: "Error fetching meals" });
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
