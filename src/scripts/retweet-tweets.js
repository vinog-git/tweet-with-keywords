"use strict";
require('../../config');

let ds = require('./data-store');
const Twitter = require('twitter');
const twitter_key = JSON.parse(process.env.twitter_key);
const T = Twitter(twitter_key);

let retweetOnInterval = () => {

    startTweeting();

    setInterval(() => {
        startTweeting();
        // Retweet duration based on 800 retweets per day
    }, 300000);
}

function startTweeting(){
    let index = 0;
    let tweetsArray;
    if (Object.keys(ds).length) {
        if (index === Object.keys(ds).length) {
            index = 0;
        }
        console.log(ds);
        tweetsArray = ds[Object.keys(ds)[index]][0];
        if (tweetsArray.length) {
            let chosenTweet = Math.floor(Math.random() * tweetsArray.length);
            let tweetId = tweetsArray[chosenTweet].id_str;
            console.log({
                tweetId
            });
            T.post(`statuses/retweet/${tweetId}`, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Retweeted: ${res.text}`);
                }
            });
        }
        index++;
    }
}

function stop() {
    clearInterval('retweetOnInterval');
}

module.exports = {
    retweetOnInterval,
    stop
}