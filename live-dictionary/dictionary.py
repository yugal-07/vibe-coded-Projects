import pyperclip,asyncio,requests,re
from desktop_notifier import DesktopNotifier

#reading data from clipboard...
word=pyperclip.paste()
word="".join(word.splitlines()).strip()         #removing \n and blank spaces
word = re.sub(r'[^a-zA-Z0-9]', '', word)        #removing special characters
if len(word)>45 or len(word)==0 :
    exit()

#dictionary api integration
link=f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
r=requests.get(url=link)
data=r.json()
found=False
for i in data:
    if i=='title':
        found=True
        break

if found==True:
    meaning=data['title']
else:
    meaning=data[0]['meanings'][0]['definitions'][0]['definition']

#notify
notifier = DesktopNotifier()

async def main():
    await notifier.send(title="Live Dictionary", message=meaning)

asyncio.run(main())
