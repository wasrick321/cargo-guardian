
# Fix Webhook Response Parsing

The frontend expects a simple `{"text": "..."}` response, but your n8n webhook is returning a nested Gemini AI response structure. This plan will update the frontend to intelligently extract the analysis text from multiple possible response formats.

## The Problem

Your n8n webhook returns data in this nested format:
```json
{
  "content": {
    "parts": [{ "text": "..." }],
    "role": "model"
  },
  "finishReason": "STOP",
  "index": 0
}
```

But the frontend code looks for `result.text` at the root level, which doesn't exist in this structure.

## The Solution

Update the response parsing logic to handle multiple formats:
1. Direct `text` property (original expected format)
2. Nested Gemini format at `content.parts[0].text`
3. Any other common variations

## Changes

### File: src/pages/Index.tsx

Update the response handling to extract text from the nested structure:

```text
After receiving responseData from fetch:
1. Check if responseData.text exists (simple format)
2. If not, check if responseData.content?.parts?.[0]?.text exists (Gemini format)  
3. Parse the extracted text and set it as the result
```

### File: src/components/ResultsPanel.tsx

Enhance the results display to:
1. Handle the analysis JSON structure beautifully
2. Parse the stringified JSON analysis into readable sections
3. Display risk levels with color-coded badges
4. Show crop-specific analysis in organized cards

## Technical Details

**src/pages/Index.tsx changes:**
- Add a `extractAnalysisText()` helper function that checks multiple response paths
- Handle both direct text and nested Gemini response formats
- Parse the inner JSON string to extract structured analysis data

**src/components/ResultsPanel.tsx changes:**
- Update the interface to accept parsed analysis data
- Add structured display for:
  - Analysis context (origin, destination, weather, temperature)
  - Individual crop risk cards with risk levels
  - Overall recommendations section
- Add color-coded risk level badges (HIGH=red, MEDIUM=yellow, LOW=green)
- Fallback to plain text display if parsing fails
