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
	joined = join(rawText, " ");   //puts all text in 1 string
	var beforebeginText="338";
	var beforebegin=joined.indexOf("338");
	var endText="THE END";
	var end=joined.indexOf(endText);   
	story=joined.substring(beforebegin+beforebeginText.length, end+endText.length); //shortens text to only the story
	var cleaned1=story.replace(/\*/g, '');     //gets rid of astericks
	var cleaned2=cleaned1.replace(/:/g, ',');    //replaces colons with commas
	var cleaned3=cleaned2.replace(/_/g, '');     //gets rid of underscores
	var cleaned4=cleaned3.replace(/--/g, ' ')    //replaces double dashes with spaces
	parsed=splitTokens(cleaned4, delimiters);    //splits the story into words
	chapters=splitChapters(parsed);    //splits the story into chapters
	draculas=numRepeats("Dracula", parsed);    //counts number of times "Dracula" appears in each chapter
  //a bat picture is displayed for every "Dracula" in the story
	for (var i=0; i<draculas.length; i++) {
	  for (var j=0; j<draculas[i][1]; j++) {
  	  var size=map(draculas[i][0], 0, chapters.length, 0.2, 1.2);    //the smaller the chapter number the smaller the size of the bat picture
      bats.push(image(bat, random(width),random(height), bat.width*size, bat.height*size));
	  }
	}
	entries=diaryEntries(parsed);    //counts how many diary entries written each month
}

function draw() {
  //draws lines for every diary entry
	for (var i=0; i<entries.length; i++) {
	  var x=map(i,0, entries.length, 0, width)   //spaces out lines along the canvas width
	  var y=500;
	  var col=map(entries[i],0,12,0,255)   //color of line depends on what month the entry is from
	  stroke(col,0,0);
	  line(x,y,x,y-10*entries[i]);   //height of line depends on what month the entry is from
    //this shows that the method is not fully functional because some lines are shorter/longer than they're supposed to be, but that's not possible because the diary entries are chronological
	}
}

//counts the number of times string s occures in a piece of text
function numRepeats(s, wholeText) {
  var total=[];
  var chapters=splitChapters(wholeText);    //spits text into chapters
  for (i=0; i<chapters.length; i++) {
    num=0;
    for (j=0; j<chapters[i].length; j++) {
      if (chapters[i][j]==s) {
        num++;    //counts number of times s occurs in the current chapter
      }
    }
    total.push([i+1, num])    //creates a 2D array that stores how many times s occures in a certain chapter
  }
  return total;
}

//returns the month of each diary entry
function diaryEntries(wholeText) {
  var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  var entries=[]
  for (i=0; i<wholeText.length;i++) {
    for (j=0; j<months.length; j++) {
      //uses !isNaN() to check that the word before the name of the month is a number,  since all the diary entries in the story are formatted such that "[date] [month]"
      //this needs to be fixed; the code in draw() shows that some mentioned months that aren't diary entry titles are still counted
      if (!isNaN(wholeText[i-1]) && (wholeText[i]==months[j])) {   
        entries.push(j);    //adds numberical month to array
      }
    }
  }
  return entries
}

//splits text into chapters
function splitChapters(wholeText) {
  var chapters=[];
  var begin=0;    //keeps track of beginning index of a chapter
  var c=0;    //keeps track of which chapter we're on
  for (i=0; i<wholeText.length; i++) {
    if (wholeText[i]=="CHAPTER") {
      if (begin!=0) {
        chapters[c]=wholeText.slice(begin, i);    //adds current chapter to array
        c++;
      }
      begin=i;
    }
    //adds last chapter to array
    if (i==wholeText.length-1) {
      chapters[c]=wholeText.slice(begin,wholeText.length);
    }
  }
  return chapters;
}