# Meal Planner (Google Sheets)

A lightweight 4-week meal planning system built in Google Sheets using Google Apps Script.  
This tool focuses on **planning and organization**, not recipe storage.

It helps you decide *what* you’re eating without managing full recipes.

---

## ✨ What This Tool Does

- Generates **4 weeks of meals** automatically  
- Supports **Breakfast, Lunch, Snacks, and Dinner**
- Prevents repeating the same meal within a week
- Uses a **simple recipe name system**, not full recipes
- Allows optional **side dishes**
- Includes a clean, color-coded **calendar view**
- Allows quick meal swaps using dropdowns

---

## ⚠️ Important: About the Recipe Database

This tool **does not store full recipes**.

The “Recipes” sheet is intentionally minimal and only contains:
- Recipe name  
- Category (Chicken, Beef, Vegetarian, etc.)
- Meal type checkboxes (Breakfast, Lunch, Dinner, Snacks)
- Optional “Side” flag  

Think of it as a **meal name index**, not a cookbook.

You are expected to:
- Keep actual recipes elsewhere (cookbook, notes app, website, etc.)
- Use this planner to decide *what* you’re making, not *how*

---

## 📁 Sheets Overview

### Recipes
A simple list of meal names with tags that determine where and when they appear.

Includes built-in entries such as:
- MYO (Make Your Own)
- Eat Out
- Leftovers

---

### Breakfast / Lunch / Snacks / Dinner
Each sheet:
- Displays 4 weeks of meals
- Prevents duplicate meals within a week
- Allows manual overrides via dropdowns
- Includes optional side selections

---

### Calendar
A consolidated view of all meals:
- Displays each week together
- Pulls directly from the meal sheets
- Updates automatically when meals change

---

### How to Use
Built-in instructions inside the spreadsheet walk through:
- Adding recipes
- Generating a plan
- Customizing meals and sides

---

## 🚀 Getting Started

1. Create a new Google Sheet at sheets.google.com
2. Go to **Extensions → Apps Script**
3. Copy the entire contents of `meal-planner.gs` from this repository
4. Paste into the Apps Script editor
5. Return to your Google Sheet and refresh the page
6. The "Meal Planner" menu should now appear
7. Add recipe names to the **Recipes** sheet
8. Click **Meal Planner → Generate Meal Plan**

---

## 🔒 License and Usage

**Copyright © 2025 jxdata. All rights reserved.**

This project is not open source.

You may:
- Use it for personal meal planning
- Modify it for your own personal use

You may not:
- Sell or redistribute this template
- Use it in commercial products or services
- Remove copyright or attribution

For commercial licensing or permission requests:  
📧 jxdata@pm.me

---

## 🛠 Technical Notes

- Built entirely with Google Apps Script  
- No external services or APIs  
- No data collection  
- Everything runs inside your Google account  

---
