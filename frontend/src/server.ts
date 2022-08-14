require("dotenv").config();
import http from "http";
import { Client } from "@notionhq/client";
import * as Config from './config'

const notionDatabaseId = Config.DATABASE_ID
const notionSecret = Config.NOTION_API_KEY

const notion = new Client({
    auth: notionSecret,
})

const host = "localhost";
const port = 8000;

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    switch (req.url) {
        case "/":
            const query = await notion.databases.query({
                database_id: notionDatabaseId,
            });

            console.log(query.results)
    }
})

server.listen(port, host, () => {
    console.log("Server is running on localhost")
})


