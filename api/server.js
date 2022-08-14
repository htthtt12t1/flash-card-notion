const express = require("express");
const { Client } = require("@notionhq/client");
const cors = require("cors");

const RecentVocab = 100;
const RandomTest = 20;
const NOTION_API_KEY = 'secret_JDyed6oxlGqacgYb9hll1n13jZNrFFdkjVwATHpPxc9'
const DATABASE_ID = '3439dba09c5a4b5197924d4d5dc0968d'
const PropertiesID = {
    front: "xbB%5B",
    back: "title"
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


const app = express();
app.use(cors());

const PORT = 8000;
const HOST = "localhost";

const notion = new Client({
    auth: NOTION_API_KEY
})

app.get("/", async(req, res) => {

    const r = await notion.databases.query({ database_id: DATABASE_ID});

    const list = r.results.map((item) => item.id)
    var listPageID = []
    for (let i = 0; i < 90; i++) {
        listPageID.push(list[i])
    }

    listPageID = shuffle(listPageID);
    
    var cardList = []
    for (let i = 0; i < RandomTest; i++) {
        const front = await notion.pages.properties.retrieve({
            page_id: listPageID[i], 
            property_id: PropertiesID.front,
        })

        const back = await notion.pages.properties.retrieve({
            page_id: listPageID[i],
            property_id: PropertiesID.back,
        })

        const data = {
            id: i + 1,
            front: front.results[0]?.rich_text?.text.content,
            back: back.results[0]?.title?.text.content,
        }

        cardList.push(data)
    }

    const response = { cards: cardList }
    return res.status(200).json(response)

});

app.listen(PORT, HOST, () => {
    console.log("Starting proxy at...");
})