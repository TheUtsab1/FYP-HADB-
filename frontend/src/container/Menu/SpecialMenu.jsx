import { useEffect, useState } from "react";
import axios from "axios";

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/listFood/")
            .then(response => {
                console.log("API Response:", response.data); // Debugging
                setMenuItems(response.data.results || response.data); // Adjust if needed
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching menu:", error);
                setError("Failed to load menu");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Menu</h2>
            <div className="menu-container">
                {menuItems.length > 0 ? (
                    menuItems.map((food) => (
                        <div key={food.food_slug} className="food-item">
                            <img src={food.food_img_url} alt={food.food_name} />
                            <h3>{food.food_name}</h3>
                            <p>{food.food_content}</p>
                            <p>Price: ${food.food_price}</p>
                            <p>Category: {food.food_type?.food_type}</p>
                            <p>Taste: {food.taste?.taste_type}</p>
                        </div>
                    ))
                ) : (
                    <p>No menu items available.</p>
                )}
            </div>
        </div>
    );
};

export default Menu;
