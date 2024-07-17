from bs4 import BeautifulSoup
import requests
import re
import json

import requests  # Import requests for making HTTP requests
import re  # Import re for regular expressions
import json  # Import json for parsing JSON data

def extract_prices(url):
    # HTTP GET request to URL
    result = requests.get(url)
    result.encoding = result.apparent_encoding  # Ensure correct encoding

    # Parse the HTML content using BeautifulSoup
    doc = BeautifulSoup(result.text, "html.parser")

    # Find all <script> tags in the HTML
    script_tags = doc.find_all('script')

    # List to store item names and prices
    items = []

    # Regular expression to find price patterns (e.g., $12.99)
    price_pattern = re.compile(r'\$\d+(\.\d{2})?')

    # Iterate over all <script> tags
    for script in script_tags:
        if script.string:  # Check if the script tag contains text
            try:
                # Attempt to parse JSON data from the script tag
                data = json.loads(script.string)
                # Recursively search for price patterns in the JSON data
                items.extend(find_prices_in_json(data, price_pattern))
            except json.JSONDecodeError:
                continue  # Skip if JSON parsing fails

    # If no prices found in JSON, search for common price-related classes or IDs
    if not items:
        # List of common class names related to prices
        common_classes = ["price", "cost", "amount", "value"]
        # Iterate over common class names
        for class_name in common_classes:
            # Find all elements with the current class name (case-insensitive)
            for element in doc.find_all(class_=re.compile(class_name, re.IGNORECASE)):
                price = element.text.strip()  # Get the text content of the element
                parent = element.find_parent()  # Find the parent element
                if parent:
                    # Extract the item name by removing the price from the parent text
                    name = parent.text.strip().replace(price, '').strip()
                    # Append the formatted item name and price to the list
                    items.append(f"{name}: {price}")

    return items  # Return the list of items and prices

def find_prices_in_json(data, price_pattern):
    # List to store found prices
    items = []
    if isinstance(data, dict):  # If data is a dictionary
        for key, value in data.items():  # Iterate over dictionary items
            items.extend(find_prices_in_json(value, price_pattern))  # Recursively search in values
    elif isinstance(data, list):  # If data is a list
        for item in data:  # Iterate over list items
            items.extend(find_prices_in_json(item, price_pattern))  # Recursively search in items
    elif isinstance(data, str):  # If data is a string
        if price_pattern.search(data):  # Check if the string matches the price pattern
            # Append the found price with a default item name
            items.append(f"Unknown Item: {data.strip()}")
    return items  # Return the list of found prices

# Example usage
url = "https://new.aldi.us/products/aldi-finds/kitchen-supplies/k/175"
items = extract_prices(url)  # Extract prices from the URL
if items:  # If any items were found
    for item in items:  # Iterate over the items
        print(item)  # Print each item
else:
    print("No prices found")  # Print a message if no prices were found

def find_prices_in_json(data, price_pattern):
    items = []
    if isinstance(data, dict):
        for key, value in data.items():
            items.extend(find_prices_in_json(value, price_pattern))
    elif isinstance(data, list):
        for item in data:
            items.extend(find_prices_in_json(item, price_pattern))
    elif isinstance(data, str):
        if price_pattern.search(data):
            items.append(f"Unknown Item: {data.strip()}")
    return items

# Example usage
url = "https://new.aldi.us/products/aldi-finds/kitchen-supplies/k/175"
items = extract_prices(url)
if items:
    for item in items:
        print(item)
else:
    print("No prices found")
