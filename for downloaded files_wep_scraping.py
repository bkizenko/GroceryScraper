
'''
from bs4 import BeautifulSoup

with open("index.html", "r") as f:
    doc = BeautifulSoup(f,"html.parser")
#print(doc.prettify())

#how to find things by the tag name
tags = doc.find_all("p")[0]
#doc.find will find only first one
# tag.string = "hello#" #actually changes the document
print(tags.find_all("b")) # find nested b tags


# pip3 install requests to do actual web scraping
'''