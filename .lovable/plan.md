
# Form Simplification and Response Handling Update

This plan addresses your request to simplify the shipment form and ensure the app waits for the actual analysis response from n8n.

## Summary of Changes

### Form Field Changes

**Add:**
- Truck City (new text field for the truck's origin city)

**Modify:**
- Crops Loaded: Change from dropdown to free-text input so you can type multiple crops (comma-separated or however you prefer)

**Remove:**
- Warehouse Temperature
- Warehouse Humidity
- Expected Duration (Days)
- Refrigerated option from Transport Type (keeping only "Unrefrigerated/Ambient")
- WhatsApp Number
- Additional Notes

### Simplified Form Structure

After changes, the form will have:

1. **Vehicle & Cargo**
   - Truck ID (required)
   - Truck City (required) - NEW
   - Crops Loaded (required) - now a text input

2. **Warehouse Details**
   - Warehouse City (required)

3. **Transport Information**
   - Transport Type (required) - only "Unrefrigerated (Ambient)" option

4. **Alert Contacts**
   - Alert Email Address (required)

### Response Handling

The current code already waits for the webhook response. Looking at your network logs, the webhook returns `{"message":"Workflow was started"}` which means your n8n workflow is using the default response mode.

To get actual analysis results, you need to configure your n8n workflow to use the "Respond to Webhook" node at the end, which will return the actual analysis text. The frontend code is already set up to display whatever JSON response comes back.

---

## Technical Details

### Files to Modify

**src/components/ShipmentForm.tsx**
- Update Zod schema: remove fields for temperature, humidity, duration, whatsapp, notes; add truck_city
- Change crops field validation to accept free text instead of requiring specific values
- Update default values to match new schema
- Remove warehouse temperature and humidity form fields
- Remove transport duration field
- Remove refrigerated option from transport type dropdown
- Remove whatsapp and notes form fields
- Add new Truck City text input field
- Change Crops from Select to Input component

**src/pages/Index.tsx**
- Update payload building to remove deleted fields
- Add truck_city to the payload
- Remove type conversions for temperature/humidity/duration since those fields are gone
