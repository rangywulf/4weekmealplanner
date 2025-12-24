/**
 * Meal Planner - 4 Week Meal Planning Tool
 * 
 * A comprehensive meal planning solution that helps users create customized
 * 4-week meal plans with recipe management, automatic generation, and calendar views.
 * 
 * Features:
 * - Add and manage recipes with categories and meal type tags
 * - Auto-generate 4-week meal plans with no recipe repetition per week
 * - Customizable sides for each meal
 * - Dynamic calendar view with color-coded weeks
 * - Dropdown validation for easy meal swapping
 * 
 * @author jxdata
 * @version 2.0
 * @created December 23, 2025
 * @license All rights reserved
 */

/**
 * Creates the menu when the spreadsheet opens
 * Adds "Meal Planner" menu with "Generate Meal Plan" option
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Meal Planner')
    .addItem('Generate Meal Plan', 'generateWeeklyMealPlan')
    .addToUi();
}

/**
 * Ensures all required sheets exist and creates them with proper structure
 * Creates: Recipes, Breakfast, Lunch, Snacks, Dinner, Calendar, How to Use, License & Terms
 */
function ensureSheetsExist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Initialize Recipes Sheet
  var recipesSheet = ss.getSheetByName("Recipes");
  var isNewSheet = !recipesSheet;
  if(!recipesSheet) recipesSheet = ss.insertSheet("Recipes");
  
  if(isNewSheet) {
    // Set up headers
    recipesSheet.getRange("A1:G1").setValues([["Recipe Name", "Category", "Breakfast", "Lunch", "Dinner", "Snacks", "Side"]]);
    
    // Add pre-filled special entries
    var specials = [
      ["MYO","MYO",true,false,true,false,false],
      ["Eat Out","Eat Out",false,false,true,false,false],
      ["Leftovers","Leftovers",false,false,false,false,false]
    ];
    recipesSheet.getRange(2,1,specials.length,7).setValues(specials);
  }

  // Add data validation for categories
  var categories = ["Chicken","Beef","Vegetarian","Tacos","MYO","Eat Out","Leftovers","Pasta","Soup","Breakfast","Seafood","Pork","Salads","Asian","Sandwiches","Pizza","Snacks", "Sides"];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(categories,true).build();
  recipesSheet.getRange(2,2,recipesSheet.getMaxRows()-1).setDataValidation(rule);

  // Add checkboxes for meal type columns (C-G)
  var mealTypeColumns = [3, 4, 5, 6, 7];
  mealTypeColumns.forEach(function(col){
    var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    recipesSheet.getRange(2, col, 100, 1).setDataValidation(checkboxRule);
  });

  // Initialize Meal Sheets
  var mealSheets = ["Breakfast","Lunch","Snacks","Dinner"];
  mealSheets.forEach(function(name){
    var sheet = ss.getSheetByName(name);
    if(!sheet) {
      sheet = ss.insertSheet(name);
    }
    sheet.clear();
    
    // Add title
    sheet.getRange(1, 1, 1, 8).merge();
    sheet.getRange(1, 1).setValue(name);
    
    // Add day headers
    var days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    sheet.getRange(2,2,1,7).setValues([days]);
    
    // Add 4 weeks of meal + sides rows
    var currentRow = 3;
    for(var w=0; w<4; w++){
      sheet.getRange(currentRow,1).setValue("Week " + (w+1));
      currentRow++;
      sheet.getRange(currentRow,1).setValue("Sides");
      currentRow++;
    }
  });

  // Initialize Calendar Sheet
  var calendarSheet = ss.getSheetByName("Calendar");
  if(!calendarSheet) calendarSheet = ss.insertSheet("Calendar");

  // Initialize Help Sheets
  var guideSheet = ss.getSheetByName("How to Use");
  if(!guideSheet) {
    guideSheet = ss.insertSheet("How to Use", 0);
    createInstructions(guideSheet);
  }

  var licenseSheet = ss.getSheetByName("License & Terms");
  if(!licenseSheet) {
    licenseSheet = ss.insertSheet("License & Terms", 0);
    createLicense(licenseSheet);
  }

  // Format new Recipes sheet
  if(isNewSheet) {
    formatRecipesSheet();
  }
}

/**
 * Creates and formats the License & Terms sheet
 * @param {Sheet} sheet - The License & Terms sheet
 */
function createLicense(sheet) {
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 700);

  var row = 1;
  sheet.getRange(row, 1, 1, 2).merge();
  sheet.getRange(row, 1).setValue("LICENSE & TERMS OF USE").setBackground("#333333").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(16).setVerticalAlignment("middle");
  sheet.setRowHeight(row, 30);
  row += 2;

  var terms = [
    ["COPYRIGHT", "© 2025 jxdata. All rights reserved. Meal Planner is a proprietary tool created and owned by jxdata."],
    ["LICENSE GRANT", "You are granted a non-exclusive, non-transferable license to use this Meal Planner template for personal use only."],
    ["PERMITTED USE", "✓ Personal meal planning\n✓ Customization for your own use."],
    ["PROHIBITED USE", "✗ Reselling or redistributing this template\n✗ Creating derivative works for commercial purposes\n✗ Removing or altering copyright notices\n✗ Using this for commercial meal planning services without written permission"],
    ["MODIFICATIONS", "You may modify this template for your personal use, but you may not sell, lease, or otherwise transfer modified versions."],
    ["NO WARRANTY", "This template is provided as-is. jxdata makes no warranties about fitness for any particular purpose."],
    ["LIABILITY", "jxdata is not liable for any damages or losses resulting from use of this template."],
    ["CONTACT", "For commercial licensing, partnerships, or permission requests, contact jxdata directly at jxdata@pm.me."]
  ];

  terms.forEach(function(term) {
    sheet.getRange(row, 1, 1, 2).merge();
    sheet.getRange(row, 1).setValue(term[0]).setBackground("#E8E8E8").setFontWeight("bold").setFontSize(12);
    sheet.setRowHeight(row, 20);
    row++;

    sheet.getRange(row, 1, 1, 2).merge();
    sheet.getRange(row, 1).setValue(term[1]).setWrap(true).setVerticalAlignment("top").setFontSize(11);
    sheet.setRowHeight(row, Math.max(50, term[1].split('\n').length * 18));
    row += 2;
  });
}

/**
 * Creates and formats the How to Use instruction sheet
 * @param {Sheet} sheet - The How to Use sheet
 */
function createInstructions(sheet) {
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 700);

  sheet.getRange(1, 1, 1, 2).merge();
  sheet.getRange(1, 1).setValue("How to Use This Meal Planner").setBackground("#333333").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(16).setVerticalAlignment("middle");
  sheet.setRowHeight(1, 30);

  var row = 3;
  var instructions = [
    ["⚠️ Authorization Warning", "When you first open this template, Google shows a warning saying the app is unverified. This is normal and safe! Click 'Advanced' at the bottom, then click 'Go to Meal Planner (unsafe)' to continue. Then click 'Allow' to authorize the script. After that, everything works normally."],
    ["Getting Started", "When you receive this template, make your own copy: Click File menu, select Make a copy, give it a name, and click Make a copy."],
    ["Step 1: Add Your Recipes", "Go to Recipes sheet and add recipes in column A, starting from row 5."],
    ["Step 2: Select Category", "Choose a category in column B (Chicken, Beef, Vegetarian, etc.)"],
    ["Step 3: Check Meal Types", "Use checkboxes in columns C-F: Breakfast (C), Lunch (D), Dinner (E), Snacks (F)"],
    ["Step 4: Mark Sides (Optional)", "Check column G if the item is a side dish. Sides will appear as dropdown options in your meal sheets."],
    ["Special Entries", "MYO=Make Your Own, Eat Out, Leftovers are pre-filled."],
    ["Step 5: Generate", "Click Meal Planner menu and select Generate Meal Plan."],
    ["Step 6: Add Sides", "After generation, on each meal sheet, use the 'Sides' rows to select a side dish for each day. This is optional."],
    ["Customize Your Plan", "Click any meal to change it using the dropdown."],
    ["View Calendar", "Calendar sheet shows 4-week overview with meals and selected sides (shown as Meal + Side)."],
    ["Tips", "Add 7+ recipes per meal type, mark sides in column G, use MYO and Eat Out for variety."]
  ];

  instructions.forEach(function(instruction) {
    sheet.getRange(row, 1, 1, 2).merge();
    sheet.getRange(row, 1).setValue(instruction[0]).setBackground("#E8E8E8").setFontWeight("bold").setFontSize(12);
    sheet.setRowHeight(row, 20);
    row++;

    sheet.getRange(row, 1, 1, 2).merge();
    sheet.getRange(row, 1).setValue(instruction[1]).setWrap(true).setVerticalAlignment("top").setFontSize(11);
    sheet.setRowHeight(row, Math.max(60, instruction[1].split('\n').length * 20));
    row += 2;
  });
}

/**
 * Main function to generate the 4-week meal plan
 * Reads recipes, generates random meal assignments, adds dropdowns, and creates calendar
 */
function generateWeeklyMealPlan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.flush();
  ensureSheetsExist();
  
  // Read recipes from Recipes sheet
  var recipesSheet = ss.getSheetByName("Recipes");
  var lastRow = recipesSheet.getLastRow();
  if(lastRow<2){ SpreadsheetApp.getUi().alert("No recipes found."); return; }
  
  var recipesRaw = recipesSheet.getRange(2,1,lastRow-1,7).getValues();
  var recipesData = recipesRaw.map(r => ({
    name: r[0].toString().trim(),
    category: r[1].toString().trim(),
    breakfast: r[2].toString().trim().toUpperCase() === "TRUE",
    lunch: r[3].toString().trim().toUpperCase() === "TRUE",
    dinner: r[4].toString().trim().toUpperCase() === "TRUE",
    snacks: r[5].toString().trim().toUpperCase() === "TRUE",
    side: r[6].toString().trim().toUpperCase() === "TRUE"
  }));

  // Extract side items for dropdowns
  var sidesNames = recipesData.filter(function(r) { return r.side; }).map(function(r) { return r.name; });

  // Generate meals for each sheet
  var mealSheets = ["Breakfast","Lunch","Snacks","Dinner"];
  mealSheets.forEach(function(meal){
    var sheet = ss.getSheetByName(meal);
    if(!sheet) return;

    // Filter recipes by meal type
    var mealsForThisType = recipesData.filter(r=>{
      if(meal==="Breakfast") return r.breakfast;
      if(meal==="Lunch") return r.lunch;
      if(meal==="Snacks") return r.snacks;
      if(meal==="Dinner") return r.dinner;
      return false;
    });

    // Generate 4 weeks of meals
    for(var w=0; w<4; w++){
      var weeklyUsed = new Set();
      var shuffled = mealsForThisType.sort(() => 0.5 - Math.random());
      
      var mealRow = 3 + (w * 2);
      // Fill 7 days with no repeats in same week
      for(var d=0; d<7; d++){
        var mealName = shuffled[d % shuffled.length].name;
        var attempts = 0;
        while(weeklyUsed.has(mealName) && attempts < shuffled.length){
          attempts++;
          mealName = shuffled[(d + attempts) % shuffled.length].name;
        }
        weeklyUsed.add(mealName);
        sheet.getRange(mealRow, d+2).setValue(mealName);
      }
    }

    // Add meal dropdowns for easy customization
    for(var w=0; w<4; w++){
      var mealRow = 3 + (w * 2);
      var recipeRange = recipesSheet.getRange(2, 1, recipesSheet.getLastRow() - 1, 1);
      var rule = SpreadsheetApp.newDataValidation().requireValueInRange(recipeRange, true).build();
      sheet.getRange(mealRow, 2, 1, 7).setDataValidation(rule);
    }

    // Add sides dropdowns
    if(sidesNames.length > 0) {
      for(var w=0; w<4; w++){
        var sidesRow = 4 + (w * 2);
        var sidesRule = SpreadsheetApp.newDataValidation().requireValueInList(sidesNames, true).build();
        sheet.getRange(sidesRow, 2, 1, 7).setDataValidation(sidesRule);
      }
    }
    
    sheet.getRange(1, 1, 2, 10).clearDataValidations();
  });

  // Format all sheets and generate calendar
  formatRecipesSheet();
  formatMealSheets();
  generateCalendar();
  
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✓ Weekly meal plans generated successfully!");
}

/**
 * Formats the Recipes sheet with colors, borders, and alignment
 */
function formatRecipesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var recipesSheet = ss.getSheetByName("Recipes");

  var mealColors = {
    "Breakfast": "#D4845C",
    "Lunch": "#6BA587",
    "Snacks": "#C97BA4",
    "Dinner": "#5A8CB8"
  };

  // Format name and category headers
  recipesSheet.getRange(1, 1, 1, 2)
    .setBackground("#333333")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  // Format meal type headers with corresponding colors
  var headerColors = [
    [mealColors["Breakfast"]],
    [mealColors["Lunch"]],
    [mealColors["Dinner"]],
    [mealColors["Snacks"]],
    ["#888888"]
  ];

  for(var i = 0; i < 5; i++){
    recipesSheet.getRange(1, 3 + i).setBackground(headerColors[i][0]).setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(12).setHorizontalAlignment("center").setVerticalAlignment("middle");
  }

  // Batch format recipe rows with alternating backgrounds
  var backgrounds = [];
  for(var r = 0; r < 100; r++){
    var bgColor = r % 2 === 0 ? "#F9F9F9" : "#FFFFFF";
    backgrounds[r] = Array(7).fill(bgColor);
  }
  recipesSheet.getRange(2, 1, 100, 7).setBackgrounds(backgrounds);

  recipesSheet.getRange(2, 1, 100, 7)
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left")
    .setBorder(false, false, true, false, false, false, "#E0E0E0", SpreadsheetApp.BorderStyle.SOLID);

  recipesSheet.setColumnWidth(1, 180);
  recipesSheet.setColumnWidth(2, 120);
  for(var c = 3; c <= 7; c++){
    recipesSheet.setColumnWidth(c, 100);
  }
  recipesSheet.setRowHeight(1, 28);
}

/**
 * Formats all meal sheets (Breakfast, Lunch, Snacks, Dinner) with colors and layout
 */
function formatMealSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mealSheets = {
    "Breakfast": "#D4845C",
    "Lunch": "#6BA587",
    "Snacks": "#C97BA4",
    "Dinner": "#5A8CB8"
  };

  for(var mealName in mealSheets){
    var sheet = ss.getSheetByName(mealName);
    if(!sheet) continue;

    var primaryColor = mealSheets[mealName];

    // Format title row
    sheet.getRange(1, 1, 1, 10)
      .setBackground("#FFFFFF")
      .setFontColor(primaryColor)
      .setFontWeight("bold")
      .setFontSize(14)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    // Format day headers
    sheet.getRange(2, 1, 1, 8)
      .setFontWeight("bold")
      .setBackground(primaryColor)
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center")
      .setFontSize(12);

    // Format 4 weeks of meals and sides
    for(var w = 0; w < 4; w++){
      var mealRow = 3 + (w * 2);
      var sidesRow = 4 + (w * 2);
      var lightColor = adjustColorBrightness(primaryColor, 0.4);
      var sidesLabelColor = adjustColorBrightness(lightColor, 0.5);

      // Format week label
      sheet.getRange(mealRow, 1)
        .setFontWeight("bold")
        .setBackground(primaryColor)
        .setFontColor("#FFFFFF")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setFontSize(11);
      
      // Format meal cells
      sheet.getRange(mealRow, 2, 1, 7)
        .setBorder(true, true, true, true, false, false, primaryColor, SpreadsheetApp.BorderStyle.SOLID)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setWrap(true)
        .setBackground("#FFFFFF")
        .setFontSize(11);
      
      // Format sides label
      sheet.getRange(sidesRow, 1)
        .setFontWeight("bold")
        .setBackground(sidesLabelColor)
        .setFontColor("#1F1F1F")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setFontSize(10);
      
      // Format sides cells
      sheet.getRange(sidesRow, 2, 1, 7)
        .setBorder(true, true, true, true, false, false, sidesLabelColor, SpreadsheetApp.BorderStyle.SOLID)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setWrap(true)
        .setBackground("#FFFFFF")
        .setFontSize(10);
    }

    // Set column widths
    sheet.setColumnWidth(1, 90);
    for(var c = 2; c <= 8; c++){
      sheet.setColumnWidth(c, 130);
    }

    // Set row heights
    sheet.setRowHeight(1, 32);
    sheet.setRowHeight(2, 28);
    for(var r = 3; r <= 10; r++){
      sheet.setRowHeight(r, 55);
    }
  }
}

/**
 * Adjusts color brightness by a given factor
 * @param {string} color - Hex color code (e.g. "#FFFFFF")
 * @param {number} factor - Brightness factor (0-1, where 1 is white)
 * @return {string} Adjusted hex color code
 */
function adjustColorBrightness(color, factor) {
  var hex = color.replace("#", "");
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  r = Math.round(r + (255 - r) * factor);
  g = Math.round(g + (255 - g) * factor);
  b = Math.round(b + (255 - b) * factor);
  return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}

/**
 * Generates a dynamic calendar view with all 4 weeks
 * Uses formulas to automatically pull meal and side data from meal sheets
 */
function generateCalendar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var calendarSheet = ss.getSheetByName("Calendar");
  calendarSheet.clear();

  var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var mealTypes = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  var weekColors = ["#5A8CB8", "#6BA587", "#D4845C", "#C97BA4"];

  var currentRow = 1;
  
  // Build 4 weeks
  for(var w = 0; w < 4; w++){
    var weekColor = weekColors[w];
    var lightWeekColor = adjustColorBrightness(weekColor, 0.4);
    var sidesLabelColor = adjustColorBrightness(lightWeekColor, 0.5);
    var sidesCellColor = adjustColorBrightness(lightWeekColor, 0.8);
    var mealSheetRow = 3 + (w * 2);
    var sidesSheetRow = 4 + (w * 2);
    var weekStartRow = currentRow;

    // Week header
    calendarSheet.getRange(currentRow, 1, 1, 8).merge();
    calendarSheet.getRange(currentRow, 1)
      .setValue("Week " + (w + 1))
      .setBackground(weekColor)
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setFontSize(16)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    currentRow++;

    // Day headers
    calendarSheet.getRange(currentRow, 1).setValue("");
    for(var d = 0; d < 7; d++){
      calendarSheet.getRange(currentRow, d + 2).setValue(days[d]);
    }
    calendarSheet.getRange(currentRow, 1, 1, 8)
      .setBackground(lightWeekColor)
      .setFontColor("#1F1F1F")
      .setFontWeight("bold")
      .setFontSize(11)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    currentRow++;

    // Meal types (Breakfast, Lunch, Snacks, Dinner)
    for(var m = 0; m < 4; m++){
      var mealType = mealTypes[m];
      
      // Meal type label
      calendarSheet.getRange(currentRow, 1)
        .setValue(mealType)
        .setBackground(lightWeekColor)
        .setFontColor("#1F1F1F")
        .setFontWeight("bold")
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontSize(11);

      // Meal values with formulas
      for(var d = 0; d < 7; d++){
        var col = d + 2;
        var colLetter = String.fromCharCode(64 + col);
        var formula = "=" + mealType + "!" + colLetter + mealSheetRow;
        calendarSheet.getRange(currentRow, col).setFormula(formula);
      }

      calendarSheet.getRange(currentRow, 2, 1, 7)
        .setBackground(sidesCellColor)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setWrap(true);

      currentRow++;

      // Sides label
      calendarSheet.getRange(currentRow, 1)
        .setValue("Sides")
        .setBackground(sidesLabelColor)
        .setFontColor("#1F1F1F")
        .setFontWeight("bold")
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontSize(10);

      // Sides values with formulas
      for(var d = 0; d < 7; d++){
        var col = d + 2;
        var colLetter = String.fromCharCode(64 + col);
        var formula = "=IF(" + mealType + "!" + colLetter + sidesSheetRow + "=\"\", \"\", " + mealType + "!" + colLetter + sidesSheetRow + ")";
        calendarSheet.getRange(currentRow, col).setFormula(formula);
      }

      calendarSheet.getRange(currentRow, 2, 1, 7)
        .setBackground("#FFFFFF")
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setWrap(true)
        .setFontSize(10);

      currentRow++;
    }

    // Spacer row
    currentRow++;

    // Apply week border
    calendarSheet.getRange(weekStartRow, 1, currentRow - weekStartRow - 1, 8)
      .setBorder(true, true, true, true, false, false, weekColor, SpreadsheetApp.BorderStyle.SOLID);
  }

  // Set column widths
  calendarSheet.setColumnWidth(1, 100);
  for(var c = 2; c <= 8; c++){
    calendarSheet.setColumnWidth(c, 130);
  }

  // Set row heights based on content type
  for(var r = 1; r < currentRow; r++){
    if(calendarSheet.getRange(r, 1).getValue().toString().indexOf("Week") === 0){
      calendarSheet.setRowHeight(r, 30);
    } else if(calendarSheet.getRange(r, 1).getValue() === ""){
      calendarSheet.setRowHeight(r, 24);
    } else if(calendarSheet.getRange(r, 1).getValue() === "Sides"){
      calendarSheet.setRowHeight(r, 35);
    } else {
      calendarSheet.setRowHeight(r, 45);
    }
  }
}

/**
 * Navigates to a specified sheet
 * @param {string} sheetName - Name of the sheet to navigate to
 */
function goToSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if(sheet) {
    ss.setActiveSheet(sheet);
    SpreadsheetApp.flush();
  }
}