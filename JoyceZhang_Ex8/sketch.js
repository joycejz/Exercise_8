var bat;
var bats=[];
var rawText;
var joined;
var story;
var parsed;
var draculas;
var chapters;
var delimiters = "  ,.!?:;";

function preload() {
	rawText=loadStrings('data/dracula.txt');
	bat=loadImage('data/bat.png');
}

function setup() {
	createCanvas(500,500);
	background(200);
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
	chapters=splitChapters(parsed);
	draculas=numRepeats("Dracula", parsed);
	for (var i=0; i<draculas.length; i++) {
	  for (var j=0; j<draculas[i][1]; j++) {
  	  var size=map(draculas[i][0], 0, chapters.length, 0.2, 1.2);
      bats.push(image(bat, random(width),random(height), bat.width*size, bat.height*size));
	  }
	}
	entries=diaryEntries(parsed);
}

function draw() {
	for (var i=0; i<entries.length; i++) {
	  var x=map(i,0, entries.length, 0, width)
	  var y=500;
	  var col=map(entries[i],0,12,0,255)
	  stroke(col,0,0);
	  line(x,y,x,y-2*i);
	}
}

function numRepeats(s, wholeText) {
  var total=[];
  var chapters=splitChapters(wholeText);
  for (i=0; i<chapters.length; i++) {
    num=0;
    for (j=0; j<chapters[i].length; j++) {
      if (chapters[i][j]==s) {
        num++;
      }
    }
    total.push([i+1, num])
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