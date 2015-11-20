// includes
var FB = require("fb");
var Markov = require("markovchain");
var Prompt = require("prompt");
var fbConfig = require("./config");
var Step = require('step');
var http = require('http');
var request = require('request');
var fs = require('fs');

FB.options({
  accessToken: "CAACEdEose0cBAHRFtfC3FhuYvZASObVLSPYD2QmzSRNMxE6oYvEhrFSDlfWSh9FCZCMnv0gDqyg6k9szdcWvKZCIjsicEFZA00kYiQ9u0JipG1y49nYxBIm2ZBozqFjzU2JC839dSggg6NHRpYiLkBZAzSz0VlfUjSpXaVLprS0UUOaxQ76bHXl325tIDOxshhwWVZCZA7Aj0AZDZD"
});

filename = "stefanposts.txt";
fs.writeFileSync(filename, '');
counter = 100;
// function getNextPage(nextURL) {
//   if (counter > 0) {
//     console.log("=======================NEXT PAGE=====================");
//     FB.api(nextURL, function(res) {
//       if(!res || res.error) {
//        console.log(!res ? 'error occurred' : res.error);
//        return;
//       }
//       // console.log(res.id);
//       // console.log(res.name);
//       console.log(res);
//       // config.myId = res.id;
//       // config.myName = res.name;
//       counter--;
//       getNextPage(res.paging.next);
//     });
//   } else {
//     console.log("====================NO MORE PAGES====================");
//   }
// }

function sanitize(post) {
  if (post != null) {
    post = post.toLowerCase();
    post = post.replace(/(\r\n|\n|\r)/gm,"");
    if (post.indexOf("http") >= 0) {
      post = null;
    }
    return post;
  } else {
    return null;
  }
}

function postsParser(data) {
  var posts = data;
  var writeBuffer = "";
  for (post of posts) {
    // append to string
    console.log(post.message);
    sanitizedPost = sanitize(post.message);
    if (sanitizedPost != null) {
      writeBuffer += sanitizedPost + "\n";
    }
  }
  console.log(writeBuffer);
  // put string in file
  fs.appendFileSync(filename, writeBuffer);
}

function getNextPage(nextURL) {
  if (counter > 0) {
    console.log("=======================NEXT PAGE=====================");
    request(nextURL, function (error, res, body) {
      if (error) {
        console.log(error);
        return;
      }
      var full = JSON.parse(body);
      var posts = full.data;
      // console.log(posts);
      postsParser(posts);
      counter--;
      getNextPage(full.paging.next);
    })
  } else {
    console.log("====================NO MORE PAGES====================");
  }
}

FB.api('/me/feed?filter=nf', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  // console.log(res.id);
  // console.log(res.name);
  // console.log(res.description);
  // config.myId = res.id;
  // config.myName = res.name;
  // postsParser(JSON.parse(res.data));
  // console.log(res.paging);
  getNextPage(res.paging.next);
});


// var properties = [
//   {
//     name: 'username', 
//     validator: /^[a-zA-Z\s\-]+$/,
//     warning: 'Username must be only letters, spaces, or dashes'
//   },
//   {
//     name: 'password',
//     hidden: true
//   }
// ];

// prompt.start();

// prompt.get(properties, function (err, result) {
//   if (err) { return onErr(err); }
//   console.log('Command-line input received:');
//   console.log('  Username: ' + result.username);
//   console.log('  Password: ' + result.password);
// });

// function onErr(err) {
//   console.log(err);
//   return 1;
// }