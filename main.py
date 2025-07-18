import pandas as pd
from deep_translator import GoogleTranslator

# Define your column header mapping manually (add more as needed)
# Marathi : English
header_map = {
    "तारीख": "date",
    "विद्यार्थ्यांचे नाव": "student_name",
    "विद्यार्थ्यांचे वय": "age",
    "इयत्ता": "class",
    "गावाचे नाव": "village",
    "शाळेचे / महाविद्यालयाचे नाव": "school_college_name",
    "सध्या घेत असलेले इतर शिक्षण": "other_current_education",
    "मुलगा दिव्यांग आहे का": "is_disabled",
    "पालकांचे नाव (वडिलांचे नाव , आईचे नाव )": "parent_names",
    "पालकांचे वय": "parent_ages",
    "पालकांचे शिक्षण": "parent_education",
    "घरातील एकूण सदस्य संख्या": "family_members",
    "घरातील कमावणारे सदस्य संख्या": "earning_members",
    "कुटुंबाचा एकूण वार्षिक उत्पन्न": "family_annual_income",
    "संपर्क फोन क्रमांक": "phone_number",
    "पत्रव्यवहाराचा पत्ता": "address"
    # Add all the headers you want to map
}

# Some categorical value mappings, customize as needed
value_map = {
    "हो": "Yes", "होय": "Yes", "नाही": "No", "नाहीत": "No", "Yes": "Yes", "No": "No"
    # Add more value translations as needed
}

def marathi_to_english(val):
    """AI translation using Google. Only for non-numeric, non-empty Marathi text."""
    if pd.isna(val):
        return ""
    val = str(val)
    # Don't try to translate numbers/empty/very short text
    if val.strip() == "" or val.strip().isnumeric() or len(val.strip()) <= 1:
        return val
    # Use dictionary for common values to save time
    if val.strip() in value_map:
        return value_map[val.strip()]
    # Use Google Translate for other Marathi text
    try:
        return GoogleTranslator(source='mr', target='en').translate(val)
    except Exception as e:
        # On error, just return the original value
        return val

def process_csv(input_csv, output_csv):
    # Read original data
    df = pd.read_csv(input_csv)
    
    # Clean headers
    new_columns = []
    for col in df.columns:
        col_cleaned = col.strip()
        for marathi, english in header_map.items():
            if marathi in col_cleaned:
                col_cleaned = english
        new_columns.append(col_cleaned)
    df.columns = new_columns
    
    # Translate values for key columns
    translate_cols = [header_map[k] for k in header_map]
    for col in df.columns:
        if col in translate_cols:
            df[col] = df[col].apply(marathi_to_english)
    
    # Optional: Fill NA/blank with empty string, or handle as needed
    df = df.fillna("")

    # Save cleaned, translated CSV
    df.to_csv(output_csv, index=False)
    print(f"Cleaned and translated CSV saved to {output_csv}")

# Example usage:
process_csv("sample.csv", "cleaned_translated_sample.csv")
