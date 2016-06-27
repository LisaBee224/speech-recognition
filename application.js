var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var grammar = '#JSGF V1.0; grammar phrases; public <phrases>;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


var diagnostic = document.querySelector('.result');

var flickr = new Flickr({
  api_key:"088e523fc7d576df1eb7b6b985c60430"
});

var post = function(keyword,result){
  var farm = result.photos.photo[0].farm
  var server = result.photos.photo[0].server
  var id = result.photos.photo[0].id
  var secret = result.photos.photo[0].secret
  $('.prompt').hide();
  $('.result').empty();
  $('.result').prepend("<div><p>"+keyword+"</p><img src='https://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret+".jpg'/></div>");
    $('.searches').append("<p>"+keyword+"</p>")
};


var search = function(keyword) {
  flickr.photos.search({
    text: keyword
  }, function(err, result) {
    if(err) { throw new Error(err); }
    post(keyword, result)
  })
};

document.body.onclick = function() {
  recognition.start();
  $('.prompt').addClass('active');
};

recognition.onresult = function(event) {
  var keyword = event.results[0][0].transcript;
  $('.probability').text('Confidence: ' + event.results[0][0].confidence);
  search(keyword);
  recognition.stop();

};

recognition.onerror = function(event){
  diagnostic.textContent = 'Error' + event.error;
};

