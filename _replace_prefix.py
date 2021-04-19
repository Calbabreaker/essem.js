import re 
import os

def writeFile(pathToFile, content):
    file = open(pathToFile, "w+", encoding='utf-8')
    file.write(str(content))
    file.close()

def readFile(pathToFile):
    file = open(pathToFile, "r", encoding="utf-8")
    content = file.read()
    file.close()
    return content

prefix = "essem.js"

directory ='./'
for root, dirnames, filenames in os.walk(directory):
    for filename in filenames:
        if filename.endswith(".html") or filename.endswith(".js") or filename.endswith(".json"):
            fname = os.path.join(root, filename)
            content = readFile(fname) 
            contentNew = re.sub(f'"\\/(?!{prefix}|\\/|")(?=.+")', f'"/{prefix}/', content)
            contentNew = re.sub('siteRoot: "docs"', f'siteRoot: "{prefix}/docs"', contentNew)
            writeFile(fname, contentNew)
