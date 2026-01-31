

# Spoilage Risk Assessment App

A single-page web application to submit shipment data and receive AI-powered spoilage risk analysis from your n8n workflow.

## Page Layout

### Header Section
- App title: "Crop Spoilage Risk Assessment"
- Brief description explaining the purpose of the tool

### Shipment Data Form
A clean, organized form with the following fields grouped logically:

**Vehicle & Cargo**
- Truck ID (text, required)
- Crops Loaded (dropdown: Apple, Tomato, Potato - required)

**Warehouse Details**
- Warehouse City (text, required)
- Warehouse Temperature in °C (number, optional)
- Warehouse Humidity in % (number, optional)

**Transport Information**
- Transport Type (dropdown: Unrefrigerated/Refrigerated - required)
- Expected Transport Duration in Days (number, optional)

**Alert Contacts**
- Alert Email Address (email, required)
- WhatsApp Number for Alerts (text, optional)

**Additional Information**
- Additional Notes (textarea, optional)

**Form Behavior:**
- All required fields validated before submission
- Submit button shows loading spinner during request
- Button disabled while request is in-flight

### Results Panel
- Appears below the form after successful submission
- Displays the analysis text from n8n in a clean, readable card
- "Run Again" button to reset and start fresh

### Error Handling
- Friendly error message panel if request fails
- Shows status information and retry button
- "No data returned" message for empty responses

## Design Approach
- Clean, minimal interface using existing shadcn/ui components
- Responsive layout that works on both desktop and mobile
- Professional color scheme suitable for logistics/agriculture context
- Clear visual hierarchy with proper spacing and grouping

