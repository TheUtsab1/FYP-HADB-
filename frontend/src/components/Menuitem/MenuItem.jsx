import React from "react";

import "./MenuItem.css";

const MenuItem =
  () =>
  ({ category, setCategory }) => {
    const sampleMenuList = [
      { menu_name: "Pizza", menu_image: "/images/pizza.jpg" },
      { menu_name: "Burger", menu_image: "/images/burger.jpg" },
      { menu_name: "Sushi", menu_image: "/images/sushi.jpg" },
      { menu_name: "Pasta", menu_image: "/images/pasta.jpg" },
    ];

    return (
      <div className="explore-menu" id="explore-menu">
        <h1>Explore Our Menu</h1>
        <p className="explore-menu-text">
          Choose your favorite food from our diverse menu. We have every kind of
          food available.
        </p>
        <div className="explore-menu-list">
          {sampleMenuList.map((item, index) => (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>
    );
  };

export default MenuItem;
