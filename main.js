const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const url = "https://github.com/topics";
const getIssues = require("./issues")
request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    }
    else {
        getTopicLinks(html);
    }
}

function getTopicLinks(html) {
    let $ = cheerio.load(html);
    let linkElemArr = $(".no-underline.d-flex.flex-column.flex-justify-center");
    for (let i = 0; i < linkElemArr.length; i++) {
        let href = $(linkElemArr[i]).attr("href");
        let topicLink = "https://github.com" + href;
        let topic = href.split("/").pop();
        GetRepo(topicLink, topic);
    }
}

function GetRepo(link, topic) {
    request(link, cb);
    function cb(error, response, html) {
        if (error) { console.log(error); }
        else { gitFiles(html, topic); }
    }
}

function gitFiles(html, topic) {
    let $ = cheerio.load(html);
    let linkArr = $(".color-fg-muted.text-normal.lh-condensed");
    //console.log(topic);
    for (let i = 0; i < 8; i++) {
        let twoAnchors = $(linkArr[i]).find("a");
        let href = ($(twoAnchors[1]).attr("href"));
        let fileLink = `https://github.com${href}/issues`;
        //console.log(href);
        //console.log(fileLink);
        let repoName = href.split("/").pop();
        getIssues(fileLink, topic,repoName);
    }
    //console.log("'''''''''''''''''''''''''''''''''''''''''''''''''''''");
}

