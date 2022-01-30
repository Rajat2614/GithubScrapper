const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");

function getIssues(url, topic, repoName) {
    //console.log(url);
    request(url, cb);
    function cb(error, response, html) {
        if (error) {
            console.log(error);
        } else if (response.statusCode == 404) {
            console.log("Page Not Found");
        }
        else {
            getIssueLink(html, topic, repoName);
        }
    }

    function getIssueLink(html, topic, repoName) {
        let $ = cheerio.load(html);
        let issueElemArr = $(".flex-auto.min-width-0.p-2.pr-3.pr-md-2").find(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        //console.log(issueElemArr.length);
        let arr = [];
        for (let i = 0; i < issueElemArr.length; i++) {
            let link = $(issueElemArr[i]).attr("href");
            //console.log(`https://github.com${link}`);
            arr.push("https://github.com" + link);
        }
        //console.log(topic, "  ", repoName, "   ", arr);
        let folderpath = path.join(__dirname,topic);
        dirCreator(folderpath);
        let filepath = path.join(folderpath,repoName+".pdf");
        let text = JSON.stringify(arr);
        let pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(filepath));
        pdfDoc.text(text);
        pdfDoc.end();

    }



}
module.exports = getIssues

function dirCreator(folderpath) {
    if (fs.existsSync(folderpath) == false) {
        fs.mkdirSync(folderpath);
    }
}