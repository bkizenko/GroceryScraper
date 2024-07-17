'''
from bs4 import BeautifulSoup
import requests

url = "https://new.aldi.us/products/aldi-finds/kitchen-supplies/k/175"

#http get requet to url
result = requests.get(url)
result.encoding = result.apparent_encoding  # Ensure correct encoding

doc =BeautifulSoup(result.text, "html.parser")
#print(doc.prettify())

# Find all elements with the class 'base-price__regular'
# for all of aldi site
price_elements = doc.find_all(class_="base-price__regular")

if price_elements:  # Check if the list is not empty
    for price_element in price_elements:
        print(price_element.text.strip())  # Print the text content of the price element, removing any extra whitespace
else:
    print("No prices found")

'''