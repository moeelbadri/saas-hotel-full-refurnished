"use client";
import React, { useState } from 'react';
import styled from 'styled-components';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity?: number;
  customization?: string;
};

type Menu = {
  [key: string]: MenuItem[];
};

const KitchenPageWrapper = styled.div`
  display: flex;
  height: 85vh;
  font-family: Arial, sans-serif;
`;

const LeftPanel = styled.div`
  width: 30%;
  background: #2b2b2b;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 2px solid #444;
`;

const RightPanel = styled.div`
  width: 70%;
  background: #f4f4f4;
  background-image: url('/background-menu.jpeg');
  background-size: cover;
  background-position: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 85vh;
  overflow: auto;
`;

const Categories = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${(props) => (props.active ? 'orange' : '#ddd')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? 'darkorange' : '#ccc')};
  }
`;

const SubCategories = styled.div`
  margin-bottom: 20px;
`;

const SubCategoryTitle = styled.h3`
  // margin-top: 0;
  color: #fff;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-grow: 1;
  padding-right: 5px;
  height: 95%;
  overflow-y: auto;
  align-items: stretch;
`;

const MenuItem = styled.div`
  background: white;
  position: relative;
  padding: 0;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  min-height: 200px;
  max-height: 200px;
  min-width: 200px;
  max-width: 200px;
  margin: 0 auto;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    z-index: 1;
  }

    h4, p {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    background: rgba(255, 255, 255, 0.8);
    margin: 0;
    border-radius: 5px;
    color: #333;
    display: inline-block;
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  h4 {
    bottom: 30px;
    
    font-weight: bold;
  }

  p {
    bottom: 00px;
    font-size: 0.9em;
    color: #777;
  }
`;
const PaymentButtons = styled.div`
  display: flex;
  flex-direction: column;
  button {
    padding: 10px;
    margin: 5px 0;
    width: 100%;
    background: #444;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background: #555;
    }
  }
`;

const TotalDisplay = styled.div`
  margin-top: 20px;
  padding: 10px;
  background: #333;
  color: white;
  text-align: center;
  border-radius: 5px;
  font-size: 1.2em;
`;

const SelectedItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;

  li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px;
    background: #3a3a3a;
    margin-bottom: 5px;
    border-radius: 5px;
    color: white;

    .item-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .customization {
      font-size: 0.9em;
      color: #aaa;
      margin-top: 5px;
    }

    button {
      background: red;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background: darkred;
      }
    }
  }
`;

const KitchenPage: React.FC = () => {
  const categories: string[] = ["Food", "Snacks", "Drinks"];
  const menu: Menu = {
    Food: [
      { id: 1, name: 'T-Bone', price: 65.2, image: '/t-bone-steak-grill-768x1152.jpg', category: 'Red Meat' },
      { id: 2, name: 'Meatball', price: 48.3, image: 'http://127.0.0.1:3002/150?text=Meatball', category: 'Red Meat' },
      { id: 3, name: 'Chicken Breast', price: 45.0, image: 'http://127.0.0.1:3002/150?text=Chicken+Breast', category: 'Red Meat' },
      { id: 4, name: 'Grilled Chicken', price: 50.0, image: 'http://127.0.0.1:3002/150?text=Grilled+Chicken', category: 'Red Meat' },
      { id: 7, name: 'Steak', price: 60.0, image: 'http://127.0.0.1:3002/150?text=Steak', category: 'Red Meat' },
      { id: 9, name: 'Lamb Chops', price: 75.0, image: 'http://127.0.0.1:3002/150?text=Lamb+Chops', category: 'Chicken' },
      { id: 10, name: 'Turkey Sandwich', price: 40.0, image: 'http://127.0.0.1:3002/150?text=Turkey+Sandwich', category: 'Poultry' },
    ],
    Snacks: [
      { id: 5, name: 'Nachos', price: 25.0, image: 'http://127.0.0.1:3002/150?text=Nachos', category: 'Mexican' },
      { id: 6, name: 'Spring Rolls', price: 28.5, image: 'http://127.0.0.1:3002/150?text=Spring+Rolls', category: 'Asian' },
      { id: 11, name: 'Chips', price: 15.0, image: 'http://127.0.0.1:3002/150?text=Chips', category: 'Crunchy' },
      { id: 12, name: 'Mini Tacos', price: 35.0, image: 'http://127.0.0.1:3002/150?text=Mini+Tacos', category: 'Mexican' },
    ],
    Drinks: [
      { id: 7, name: 'Coke', price: 12.5, image: 'http://127.0.0.1:3002/150?text=Coke', category: 'Soft Drinks' },
      { id: 8, name: 'Orange Juice', price: 18.0, image: 'http://127.0.0.1:3002/150?text=Orange+Juice', category: 'Juices' },
      { id: 13, name: 'Espresso', price: 20.0, image: 'http://127.0.0.1:3002/150?text=Espresso', category: 'Coffee' },
      { id: 14, name: 'Smoothie', price: 30.0, image: 'http://127.0.0.1:3002/150?text=Smoothie', category: 'Blended Drinks' },
    ]
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("Food");
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  const addItem = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = (): string => {
    return selectedItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);
  };

  const getSubCategories = (): string[] => {
    const items = menu[selectedCategory];
    return [...new Set(items.map((item) => item.category))];
  };

  return (
    <KitchenPageWrapper>
      {/* Left Panel */}
      <LeftPanel>
        <h2>Selected Items</h2>
        <SelectedItemsList>
          {selectedItems.map((item, index) => (
            <li key={index}>
              <div className="item-header">
                <span>
                  {item.name} x{item.quantity || 1} - {(item.price * (item.quantity || 1)).toFixed(2)} TRY
                </span>
                <button onClick={() => removeItem(index)}>Remove</button>
              </div>
              {item.customization && <div className="customization">{item.customization}</div>}
            </li>
          ))}
        </SelectedItemsList>
        <TotalDisplay>
          Grand Total: {calculateTotal()} TRY
        </TotalDisplay>
        <PaymentButtons>
          <button>Credit Card</button>
          <button>Cash</button>
          <button>Others</button>
        </PaymentButtons>
      </LeftPanel>

      {/* Right Panel */}
      <RightPanel>
        <Categories>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </Categories>
        {getSubCategories().map((subCategory) => (
          <SubCategories key={subCategory}>
            <SubCategoryTitle>{subCategory}</SubCategoryTitle>
            <MenuItems>
              {menu[selectedCategory]
                .filter((item) => item.category === subCategory)
                .map((item) => (
                  <MenuItem key={item.id} onClick={() => addItem(item)}>
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>{item.price.toFixed(2)} TRY</p>
                  </MenuItem>
                ))}
            </MenuItems>
          </SubCategories>
        ))}
      </RightPanel>
    </KitchenPageWrapper>
  );
};

export default KitchenPage;
