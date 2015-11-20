fs = require('fs');
var ngram = require('simple-ngram-markov');


var options = {
  length: 10, // ngram size; default is 2
  stripPunctuation: true // default is true
};
 
var model = ngram.createModel(options);

var contents = fs.readFileSync('./stefanposts.txt', 'utf8')
posts = contents.split('\n');

for (post of posts) {
  ngram.addSentenceToModel(model, post);
}

for (var i = 0; i < 100; i++) {
  var sentence = ngram.generateSentence(model, 10); // 10 is the desired length of the sentence
  console.log(sentence);
}

console.log("generated with " + posts.length + " posts");