var bat;
var bats=[];
var rawText;
var joined;
var story;
var parsed;
var draculas
delimiters = "  ,.!?:;";

function preload() {
	rawText=loadStrings('data/dracula.txt');
	bat=loadImage('data/bat.png');
}

function setup() {
	createCanvas(500,500);
	background(255);
	imageMode(CENTER);
	joined = join(rawText, " ");
	var beforebeginText="338";
	var beforebegin=joined.indexOf("338");
	var endText="THE END";
	var end=joined.indexOf(endText);
	story=joined.substring(beforebegin+beforebeginText.length, end+endText.length);
	var cleaned1=story.replace(/\*/g, '');
	var cleaned2=cleaned1.replace(/:/g, ',');
	var cleaned3=cleaned2.replace(/_/g, '');
	var cleaned4=cleaned3.replace(/--/g, ' ')
	parsed=splitTokens(cleaned4, delimiters);
	draculas=numRepeats("Dracula", parsed);
	for (var i=0; i<draculas; i++) {
	  var size=random(0.3,1);
	  bats.push(image(bat, random(width),random(height), bat.width*size, bat.height*size));
	}
	entries=diaryEntries(parsed);
	chapters=splitChapters(parsed);
}

function draw() {
	for (var i=0; i<entries.length; i++) {
	  var x=map(i,0, entries.length, 0, width)
	  var y=500;
	  var col=map(entries[i],0,12,0,255)
	  stroke(col);
	  line(x,y,x,y-2*i);
	}
}

function numRepeats(s, wholeText) {
  var total=0;
  for (i=0; i<wholeText.length; i++) {
    if (wholeText[i]==s) {
      total++;
    }
  }
  return total;
}

function diaryEntries(wholeText) {
  var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  var entries=[]
  for (i=0; i<wholeText.length;i++) {
    for (j=0; j<months.length; j++) {
      if (!isNaN(wholeText[i-1]) && (wholeText[i]==months[j])) {
        entries.push(j);
      }
    }
  }
  return entries
}

function splitChapters(wholeText) {
  var chapters=[];
  var begin=0;
  var c=0;
  for (i=0; i<wholeText.length; i++) {
    if (wholeText[i]=="CHAPTER") {
      if (begin!=0) {
        chapters[c]=wholeText.slice(begin, i);
        c++;
      }
      begin=i;
    }
    if (i==wholeText.length-1) {
      chapters[c]=wholeText.slice(begin,wholeText.length);
    }
  }
  return chapters;
}