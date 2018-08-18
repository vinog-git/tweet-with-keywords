"use strict";
require('../../config');

let ds = require('./data-store');
const Twitter = require('twitter');
const twitter_key = JSON.parse(process.env.twitter_key);
const T = Twitter(twitter_key);
let timers = {};

function collectTweets(keyword){
    let tweetParams = {
        q: keyword,
        count: 100
    }
    T.get('search/tweets', tweetParams, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            ds[keyword].push(res.statuses);
            console.log(`${res.statuses.length} new Tweets for ${keyword}`);
        }
    });
}

module.exports = (action, keyword) => {
    switch (action) {
        case 'add':
            collectTweets(keyword);
            
            // Collect tweet on regular interval
            timers[keyword] = setInterval(() => {
                collectTweets(keyword);
            }, 1800000);
            break;
        case 'remove':
            clearInterval(timers[keyword]);
            console.log(`Stopped timer to collect tweets for ${keyword}`);
            break;
        case 'clear':
            if (Object.keys(timers).length) {
                Object.keys(timers).forEach((timer) => {
                    clearInterval(timers[timer]);
                });
            }
            break;
        default:
            console.log(`${action} is invalid`)
            break;
    }
}