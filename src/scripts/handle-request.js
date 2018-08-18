"use strict";
let ds = require('./data-store');
const collectTweets = require('./collect-tweets');
const retweet = require('./retweet-tweets');

module.exports = (data) => {
    // data = data.slice(0, -1);
    let option, keywords;
    [option, keywords] = data.split(':');
    if (keywords)
        keywords = keywords.split(',') || keywords;

    switch (option) {
        case 'ls':
            console.log(`Stored keywords : ${Object.keys(ds)}`);
            break;
        case 'clear':
            ds = {};
            // Stop all timers
            collectTweets('clear');
            console.log(`Cleared all keywords and stopped all timers`);
            break;
        case 'rmkeyword':
            if (keywords && keywords.length) {
                for (let key of keywords) {
                    if (ds[key]) {
                        delete ds[key];
                        // Stop timer for the removed keyword
                        collectTweets('remove', key);
                        console.log(`Keyword deleted and timer stopped for ${key}`);
                    } else {
                        console.error(`Err: Keyword ${key} unavailable`);
                    }
                }
                console.log(`Available keywords : ${Object.keys(ds)}`);
            }
            break;
        case 'addkeyword':
            if (keywords && keywords.length) {
                for (let key of keywords) {
                    if (!ds[key]) {
                        ds[key] = [];
                        // Add timers to collect tweets for the new keyword after a delay
                        setTimeout(() => {
                            collectTweets('add', key);
                        }, Object.keys(ds).length * 1000);
                    } else {
                        console.error(`Err: Duplicate keyword ${key}`);
                    }
                }
                console.log(`Current keywords : ${Object.keys(ds)}`);
            }
            break;
        case 'stop':
            retweet.stop();
            break;
        case 'start':
            retweet.retweetOnInterval();
            break;
        case 'ds':
            console.log(JSON.stringify(ds));
            break;
        default:
            break;
    }
}