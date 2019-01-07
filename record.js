const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';
speech.onresult = function(e) {
  const text = e.results[0][0].transcript;

  var xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open( 'POST', '/webhook' );
  xmlHttpRequest.setRequestHeader( 'Content-Type', 'text/plain' );
  //xmlHttpRequest.send( EncodeHTMLForm( data ) );
  xmlHttpRequest.send(text);
};
speech.onend = function() {
  console.log("end")
  speech.start();
};
speech.start();