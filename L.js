/**
  Author:  Abbas Abdulmalik
  Created: ~ May, 2017
  Revised: March 3, 2019
  Original Filename: L.js 
  Purpose: a small (but growing) personal re-usable js library for a simple MVC architecture
  Notes: Now qualifyFunction helper doesn't return true for empty arrays (no vacuous truth)
  
      Added UploadFiles:
         uploadFiles takes a callback -- progressReporter-- as it FIRST argument (parameter)
         to allow for an optional fourth parameter of an upload path for the server.
         progressReporter will be passed three arguments when called:
         1.) the amount of bytes uploaded so far
         2.) the total size of the file in bytes
         3.) the index of the file in the "array" of files being uploaded
         
      Added sortByExtension that alphabetizes an array of strings 'in place' by filename extension          
      Added arrayStringMatch that matches a collection of string arrays to a search string.
        later (6-9-2018) included an option for a "maximum array index" to eliminate
        searching irrelevant fields at the end of the array, such as image name and primary key.
      Added loopCall as a 'better' version of setInterval
      Replaced L.attributes. It's a reserved word: an object belonging to DOM elements
       Now it uses L.attribs
      Added L.loopCall.stop() so that user can easily stop L.loopCall
      Added L.symDiff for comparing arrays to determine their symmetric difference = conjunctive union =
       exclusive-or
      Restored an updated version of uploadFiles that signals the final file has uploaded
      Added secToMinSec
      Added runQualifiedFunctions that mirrors runQualifiedMethods using different parameters,
        namely: functionQualifiers, model, view, controller
      Added the alias runQualifiedHandlers for runQualifiedFunctions
      Added attachNewElement(tagname, id, view). Create new element, gives it an id and
        attaches it to object provided:
        L.attachNewElement(`div`, `picHolder`, view)
      Added createListMixer and scrammbleThis, which depends on createListMixer
      Added sortArrayOfStringArrays, with option of using a "link token" of choice as the 3rd argument
      Added an optional argument for arrayStringMatch for a maximum array index
        to eliminate searching irrelevant fields at the end of the array,
        such as image name and primary key
      Added L.css to apply a string of "semi-colon" seperated css declarstions all at once to
        any element with an id. It works only if L.styles in attached to the element.
      Added L.addToView( idString, viewObject ) to add elements to the view object
        that are latecomers, or dynamically created after an app first loads. Those elements
        will then be referenced like all prior ones that are properties of the view object
      Replaced L.noPinchZoom's code: 
        (@mattis on https://stackoverflow.com/questions/4389932/how-do-you-disable-viewport-zooming-on-mobile-safari)
      Added L.wheelDelta() for mouse event "wheel." It returns +1 for a negative event property of deltaY, else -1
      Added L.includedInClass to id-ed elements along with .styles(), .atribs(), and .css()        
      Added extra check on L.runQualifiedFunctions to check for, and run, functions that were named
        without their prefixes "set" and "show"
      Added a filename "sanitizer" (regex search and replace with empty string) for uploading files after fileReader finishes          
      Added L.concatNoDupes, which returns the merging of arrays and other arguments into a single array, eliminating duplicates

*/

var L = {}
L.styles = function(styleString){
  const colonPosition = styleString.indexOf(':')
  const property = styleString.slice(0, colonPosition)
  const value = styleString.slice(colonPosition + 1)
  this.style[property] = value
  
  return this.styles  
}

L.attribs = function(attributeString){
  const assignmentPosition = attributeString.indexOf('=')
  const attribute = attributeString.slice(0, assignmentPosition)
  const value = attributeString.slice(assignmentPosition + 1)
  this.setAttribute(attribute, value)
  
  return this.attribs
}
/*
  L.css depends on L.styles (above)
*/
L.css = function(cssString){
  const cssArray = cssString.split(`;`);
  for ( let i = cssArray.length; i--; ){ // speed-optimized reverse for loop
    this.styles(cssArray[i].trim()); // "trim()" is crucial
  }
}

///////////////////////////////////// 

L.includedInClass = function(className){
  return !! Array.from( document.querySelectorAll(`.${className}`) ).includes(this);
}
/////////////////////////////////////

L.attachAllElementsById = function(view){
  let allElements = document.getElementsByTagName('*')
  let array = []
  array.forEach.call(allElements, element => {
      if(element.id){
        view[element.id] = element
        element.styles = L.styles.bind(element) // attach L's styles() method here
        element.attribs = L.attribs.bind(element) // attach L's attribs() method here
        element.css = L.css.bind(element) // attach L's css() method here. Only works if L.styles is attached
        element.includedInClass = L.includedInClass.bind(element) //attach L's includedInClass() method here
      }
  })
}
///////////////| START of L.addToView |////////////////
/**
  Attach an element that has the id provided to the object (usually the view object) provided.
  This element could now be referenced as a property of the object, and can use 
  all of the methods (three, so far) used by elements that were attahced using L.attachAllElementsById().
  Example: L.addToView(`screenA1`, v) ...
  ... allows us to refer to the element as v.screenA1, and it can use the methods styles, attribs, and css.
  Example:  v.screenA1.css(`
              visibility: visible;
              opacity: 1;
            `) ...
  ... uses the css method to add style properties to the element.
*/
L.addToView = function( idString, viewObject){
  const element = document.getElementById(idString)
  viewObject[idString] = element
  element.styles = L.styles.bind(element)
  element.attribs = L.attribs.bind(element)
  element.css = L.css.bind(element)
  element.includedInClass = L.includedInClass.bind(element)   
  
  return element
}
////////////////| END of L.addToView |/////////////////

///////////////| START of L.attachNewElement |/////////////
/**
  L.attachNewElement(string tagname, string id, object view) ...
  ... creates a new element of type "tagname" given as the first argument,
  and gives it the id "id" given as the second argument.
  The third argument is the view object where this new reference will be attached.
  The element can then be referenced as view.id.
*/
L.attachNewElement = function(tagname, id, view){
  if(arguments.length !== 3){
    console.log(`Error: requires 3 arguments: tagname, id, view`)
    return
  }
  try{
    if(typeof tagname === `string`){
      var newElement = document.createElement(tagname)
    }
    else{
      console.log(`Error: tagname needs to be a string`)
      return
    }
    if(typeof id === `string`){
      newElement.id = id
    }
    else{
      console.log(`Error: id needs to be a string`)
      return
    }
    if(view.toString() === `[object Object]`){
      view[newElement.id] = newElement
      newElement.styles = L.styles.bind(newElement) // attach L's styles() method here
      newElement.attribs = L.attribs.bind(newElement) // attach L's attribs() method here
      newElement.css = L.css.bind(newElement) // attach L's css() method here. Only works if L.styles is attached      
      newElement.includedInClass = L.includedInClass.bind(newElement) //attach L's includedInClass() method here      
      
      return newElement
    }
    else{
      console.log(`Error: view needs to be an object`)
      return
    }
  }
  catch(e){
    console.log(`Error in L.attachNewElement: ${e}`)
    return
  }
}
///////////////| END of L.attachNewElement |/////////////

L.noPinchZoom = function(){ //revised from above on 10-10-18
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
  });
}

L.runQualifiedMethods = function(functionQualifiers, object, runNextUpdate){
  Object
    .keys(functionQualifiers)
    .filter(qualifyFunction)
    .forEach(runFunction)
  if(typeof runNextUpdate === 'function'){runNextUpdate()}
  
  //-----| helpers |-----//
  function qualifyFunction(functionName){
    const isQualified = functionQualifiers[functionName].every( qualifier => qualifier) &&
                        !!functionQualifiers[functionName].length
    return isQualified
  }
  function runFunction(functionName){
    if(typeof object[functionName] === 'function'){
      object[functionName]()        
    }
    /**
      If the prefix of this function's name is 'set' (for updating the MODEL),
      and there is a similarly named function with a prefix of 'show' (for updating the VIEW),
      then run the 'show' version as well.
    */
    let prefix = functionName.slice(0,3)
    let newFunctionName = 'show' + functionName.slice(3)
    if(prefix === 'set' && typeof object[newFunctionName] === 'function'){
      object[newFunctionName]()
    }
  }
}

L.runQualifiedFunctions = function(functionQualifiers, model, view, controller){
  Object
    .keys(functionQualifiers)
    .filter(qualifyFunction)
    .forEach(runFunction) 
  //-----| helpers |-----//
  function qualifyFunction(functionName){
    const isQualified = functionQualifiers[functionName].every( qualifier => qualifier) &&
                        !!functionQualifiers[functionName].length
    return isQualified
  }
  function runFunction(functionName){
    if(typeof controller[functionName] === 'function'){
      controller[functionName](model)        
    }
    /**
      If the prefix of this function's name is 'set' (for updating the MODEL),
      and there is a similarly named function with a prefix of 'show' (for updating the VIEW),
      then run the 'show' version as well.
    */
    let prefix = functionName.slice(0,3)
    let newFunctionName = 'show' + functionName.slice(3)
    if(prefix === 'set' && typeof controller[newFunctionName] === 'function'){
      controller[newFunctionName](view)
    }
    /**
      Check to see if the function name lacks the "set" and "show" prefixes.
      If so, add the prefixes and run the "set and "show versons in succession.
      (you have to first "uppercase" the first letter of the function to comform to camel case)
      const UCfunctionName = functionName.slice(0,1).toUpperCase() + functionName.slice(1)
      const setVersion = `set${UCfunctionName}`
      const showVersion = `show${UCfunctionName}`
      const setShowPair = typeof controller[setVesrsion] === `function` &&
                          typeof controller[showVersion] === `function`
    */
    const UCfunctionName = functionName.slice(0,1).toUpperCase() + functionName.slice(1)
    const setVersion = `set${UCfunctionName}`
    const showVersion = `show${UCfunctionName}`
    const setShowPair = typeof controller[setVersion] === `function` &&
                        typeof controller[showVersion] === `function`
    if(setShowPair){
      controller[setVersion](model)
      controller[showVersion](view) 
    }    
  }
}
//L.runQualifiedHandlers is an alias for L.runQualifiedFunctions
L.runQualifiedHandlers = L.runQualifiedFunctions

/**
  Use a php script that reads contents of file from $_POST['contents'] that was convert by client
  as DataURL, and expects filename and uploadPath from: $_POST['filename'] and $_POST['uploadPath']
  with trailing slash (/) provided by client (though script could check for this).  
*/
L.uploadFiles = function(progressReporter, fileElement, phpScriptName, uploadPath='../uploads/'){
  let doneCounter = 0
  let fileCount = fileElement.files.length
  const array = [] // make a real array to borrow it's forEach method
  array.forEach.call(fileElement.files, (file, index) => {
    const postman = new XMLHttpRequest() // make a file deliverer for each file
    const uploadObject = postman.upload // This object keeps track of upload progress
    const envelope = new FormData() // make a holder for the file's name and content
    envelope.stuff = envelope.append // give 'append' the nickname 'stuff'
    const reader = new FileReader() // make a file reader (the raw file element is useless)
    
    reader.readAsDataURL(file) // process the file's contents
    reader.onload = function(){ // when done ...
      const contents = reader.result // collect the result, and ...
      envelope.stuff('contents', contents) // place it in the envelope along with ...
	    let filename = file.name.replace(/[\)\(\"\/>|<' \*\^~-\s]+/g, "");
      envelope.stuff('filename', filename) // its "sanitized" filename ...      
      envelope.stuff('uploadPath', uploadPath) // and its upload path on the server
      
      postman.open(`POST`, phpScriptName)// open up a POST to the server's php script
      postman.send(envelope) // send the file
      
      //check when file loads and when there is an error
      postman.onload = eventObject => {
        postman.status !== 200 ? showMessage() : checkLastFileDone()
        //-----| helper |------//
        function showMessage(){
          const message = `Trouble with file: ${postman.status}`
          console.log(message)
          alert(message)
        }
        function checkLastFileDone(){
          doneCounter++          
          if(typeof progressReporter === 'function'){
            if(doneCounter === fileCount){
              progressReporter(1, 1, index)              
            }
          }          
        }
      }
      
      postman.onerror = eventObject => {
        const message = `Trouble connecting to server`
        console.log(message)
        alert(message)
      }
      
      //invoke the callback for each upload progress report
      uploadObject.onprogress = function(progressObject){
        if(typeof progressReporter === 'function'){
          progressReporter(progressObject.loaded, progressObject.total, index)
        }
      }
    }
  })
}

//---------------------------------------------------------//
/**
  Given an array of strings (array), sorts the array 'in place' by filename EXTENSION,
  and returns a copy of the array as well. Since it mutates the array, it is decidedly not
  functionistic (but it functions).
*/
L.sortByExtension = function (array) {
  const type = {}.toString.call(array, null);
  if (type !== '[object Array]') {
    return array;
  }
  if (array.length === 0 || array.some(member => typeof member !== 'string')) {
    return array;
  }
  //-------------------------------------//
  let extension = ``;
  let nudeWord = ``;  
  array.forEach((m, i, a) => {
    if (m.lastIndexOf(`.`) !== -1) {
      //get the extension
      extension = m.slice(m.lastIndexOf(`.`) + 1);
      nudeWord = m.slice(0, m.lastIndexOf(`.`));
      a[i] = `${extension}.${nudeWord}`;
    }
  });
  
  array.sort();
  
  array.forEach((m, i, a) => {
    if (m.indexOf(`.`) !== -1){
      //get prefix (formerly the extension)
      extension = m.slice(0, m.indexOf(`.`))
      nudeWord = m.slice(m.indexOf(`.`) + 1)
      a[i] = `${nudeWord}.${extension}`
    }
  });
  
  const newArray = []
  array.forEach( m => newArray.push(m))
  
  return newArray;
}

/**
From an array of string arrays, return a possibly smaller array
of only those string arrays whose member strings contain the given subString
regardless of case.
   1. For arrayOfStringArrays, use the filter method (a function property of an array)
   that expects a function argument that operates on each array member
   2. Let's call the function argument 'match'
   3. 'match' should test each member array for a match of the substring as follows:
    a.) join the members strings together into a bigString that is lowerCased
    b.) lowerCase the subString
    c.) use indexOf to match substring to the bigString
    d.) return true for a match, otherwise return false
   4. the filter creates a new array after doing this.
   5. final step: return the new array that the filter produced 
*/
L.arrayStringMatch = function(subString, arrayOfStringArrays, maxIndex){
  //============================================================//
  return arrayOfStringArrays.filter(match)
  //-------| Helper function 'match' |---------//
  function match(memberArray){
    //on 6-9-2018, added option of maximum index to eliminate searching through irrelevant fields
    let bigString = ''
    if(maxIndex && typeof maxIndex === "number" && maxIndex > 0){
      bigString = memberArray
                    .filter((m,i) => i <= maxIndex)
                    .join(` `)              
                    .toLowerCase()
    }    
    else{
      bigString = memberArray.join(` `).toLowerCase()
    }
    const substringToMatch = subString.toLowerCase()
    return bigString.indexOf(substringToMatch) !== -1   
  }
}
//-------------------------------------------------//

/**
  L.loopCall can be used to replace setInterval, which has been somewhat discredited.
  See this blog post:
  https://dev.to/akanksha_9560/why-not-to-use-setinterval--2na9
  
  L.loopCall uses setTimeout recursively, which is a technique
  reportedly more reliabale than setInterval.  

  L.loopCall repeatedly calls (invokes) the callback function provided as its first argument.
  The first call is immediate, but subsequent calls are delayed by the milliseconds
  provided as the second argument. All additional arguments are optional
  to be used by the callback if required.
  
  If needed, you can delay the initial call as well,
  by having loopCall invoked by setTimeout using the same delay:
  
    setTimeout(L.loopCall, delay, callback, delay, arg1, arg2 ...)
    
    or the more readable, but more risky ...
    
    setTimeout("L.loopCall(callback, delay, arg1, arg2 ...)", delay) 
    //Doug Crockford would not be pleased  

  To stop the loop, the callback function can test some external state condition,
  (or test its own arguments, if they are passed by reference):
   
    if(externalStateCondition){
      L.loopCall.stop()
    }
*/
L.loopCall = function (callback, delay, ...args){
    L.loopCall.stopLoop = setTimeout(L.loopCall, delay, callback, delay, ...args)   
    callback(...args)
}

L.loopCall.stop = () => {
  clearTimeout(L.loopCall.stopLoop)  
}

/**
  Returns an array that is the "mathematical or logical" symmetric difference between or among
  any number of arrays provided as arguments (typically two). If the order of members is ignored
  (as is done for mathematical sets), the result acts as the the exclusive-or (XOR), also know as
  the disjunctive union. For the trivial cases of comparing one or two arrays, the result is
  not surprising: for one array, the result is itself: L.symDiff(A, []) =>  A ⊕ [] = A. 
  For two arrays, the result is an array that has only members which are not shared in common:
  L.symDiff(A, B) => A ⊕ B .
  When comparing more than two arrays, the result may be surprising. The proper result can be verified 
  by comparing only two at a time: L.symDiff(A, B, C) => A ⊕ B ⊕ C = (A ⊕ B) ⊕ C
*/
L.symDiff = function symDiff(arrayA, arrayB){ // dummy paramters NOT referenced in body of the function
    var partialSymDiff = [],   
        argsArray = arguments
    ;
    //============THE CRUX=================
    return findSymDiff(partialSymDiff,0);
    //============UNDER THE HOOD===========
    function findSymDiff(partialSymDiff,index){
        if (argsArray[index] === undefined){
            return partialSymDiff;
        }
        else{
            partialSymDiff = sd(partialSymDiff, argsArray[index] );
            return findSymDiff( partialSymDiff, index + 1 );
        }
    }    
    //=====================================
    function sd(arrayI, arrayJ){
        var diff = [],
            blackList = [],
            i = 0,
            j = 0,
            maxI = arrayI.length,
            maxJ = arrayJ.length
        ;
        //-------------------------------------------------
        //1.) Combine the arrays into a third array.
        //2.) Find the matched elements and place them into a blacklist array.
        //3.) Pull blacklisted elements from the combined array.
        //4.) return the "reduced" combined array.
        //---------------------------------------------------
        // 1.) Combine the arrays into a third array.
        diff = arrayI.concat(arrayJ);        
        //---------------------------------------------------
        // 2.) Find the matched elements and place them into a blacklist array.
        for ( i=0; i < maxI; i++ ){
            for( j=0; j< maxJ; j++ ){
                if(arrayI[i] === arrayJ[j]){
                    blackList.push(arrayI[i] );
                }                
            }  
        }
        //----------------------------------------------------
        // 3.) Pull blacklisted elements from the combined array.
            diff = diff.filter( (element) => blackList.indexOf(element) === -1 )
        //----------------------------------------------------
        // 4.) return the "reduced" combined array.        
        return killDupes(diff);
    }
    //========================================================
    function killDupes(array){
        var kept = []; // Record of the "keepers"
        return array.filter(function(element){
            if ( kept.indexOf(element) === -1 ){ //if not already retained ...
                kept.push(element); // Record it as retained now, and...
                return true;  // allow this element to be kept (true)
            }
            else{
                return false; // otherwise, don't keep it (already kept)
            }
        });
    }      
};

/**
 * Pass in a numerical seconds: it returns a string in the format
 *  mm : ss, like ...
 *  35 : 37 in minutes and seconds
*/
L.secToMinSec = (seconds) =>{
    var min = Math.floor(seconds / 60);
    var sec = Math.floor(seconds % 60);
    if(isNaN(min)){min = 0}
    if(isNaN(sec)){sec = 0}
    var zeroMin = ((min < 10) ? ("0" + min) : ("" + min));
    var zeroSec = ((sec < 10) ? ("0" + sec) : ("" + sec));
    var minSec = zeroMin + ":" + zeroSec;  
    return minSec;
};
//====| END of secToMinSec |====//

///////////////////| START of CreateListMixer |//////////////////////
/**
  * CreateListMixer: a factory that creates and returns a function that
  * returns a random item from the collection (array or object) provided.
  * Notes: Example-> var list = ["a", "short", "list"];//three (3) items to test
  *  		var getRandomItem = CreateListMixer();
  * 		getRandomItem(list);//returns first of randomized list
  * 		getRandomItem();//returns next item
  * 		getRandomItem();//returns next item (last of three)
  * 		getRandomItem();//new first item from re-randomized list
  * 
  *			// a new list;					
  *			var list2 = { record1: "string", record2: "anotherString", ...};
  * 		getRandomItem(list2);//returns first of new randomized list2
  * 		getRandomItem();//etc.
  * It returns a property name for objects or an array member for arrays;
  * It returns 'false' if argument of function is not an object
  * or an array (fails typeof arg === 'object')
  * 
*/
L.CreateListMixer = function(){
	var	list=[], 
		randList= [],
		listLength= 0,
		itemReturned= null,
		itemReturnedIndex= -1
	;
	return function(){
		if(arguments[0]){
			if(typeof arguments[0] === 'object'){
					list = arguments[0];
				if({}.toString.call(arguments[0]) === '[object Object]'){
					list = Object.keys(list);
				}
				randList = randomize(list);
				listLength = list.length;
			}
			else{
				return false;
			}
		}
		//----| no args activity: return next random item |----
		if(itemReturnedIndex >= listLength-1){
			do{
				randList = randomize(list);
				itemReturnedIndex = -1;
			}
			while(randList[itemReturnedIndex +1] === itemReturned);
		}
		itemReturnedIndex++;
		itemReturned = randList[itemReturnedIndex];
		return itemReturned;
		//-----helpers-----
		function randomize(x){
			var mixedIndexes = [];
			var randomList = [];
			randomizeIndexes();
			return randomList;
			//----sub helper----
			function randomizeIndexes(){
				// random numbers for mixedIndexes
				while(mixedIndexes.length !== x.length){
					var match = false;
					var possibleIndex = (x.length)*Math.random();
					possibleIndex = Math.floor(possibleIndex);
					mixedIndexes.forEach(function(m){
						if(m === possibleIndex){
							match = true;
						}
					});
					if(!match){
						mixedIndexes.push(possibleIndex);
					}
				}
				for(var i = 0; i < x.length; i++){
					var newIndex = mixedIndexes[i];
					randomList.push(list[newIndex]);
				}
			}		
		}
	};//===| END returned function |======
}//===| END enclosing factory function======
///////////////////| END of CreateListMixer |//////////////////////

///////////////////| START of scrammbleThis |//////////////////////
/**
  scrammbleThis: (depends on createListMixer, above)
  It returns an array of randomly arranged items of the collection provided.
  The argument must be an array, an object, or a string.
  If the argument is an object, a random array of its property names is returned.
  If the argument is a string, a random array of its characters is returned.
  If the argument is an array, a random array of its members is returned.
*/
L.scrammbleThis = function(collection){
  if ( !(typeof collection === 'object' || typeof collection === 'string') ){return collection}
	var mix = L.CreateListMixer();
  var list = (Object.prototype.toString.call(collection) === '[object Array]')
              ? collection
              : (typeof collection === 'string')
              ? collection.split('')
              : (typeof collection === 'object') 
              ? Object.keys(collection)
              : null   
  return list.map((m,i,a)=> (i === 0) ? mix(a) : mix())
}
L.scrambleThis = L.scrammbleThis
///////////////////| END of scrammbleThis |//////////////////////

/**
  Given an array of string arrays, this function returns an alphabetized version
*/
L.sortArrayOfStringArrays = function(arrayOfStringArrays, linkToken='```'){
  //use a unique token (default = triple back-ticks ```) to join the strings of each array of strings
  const arrayOfStrings = arrayOfStringArrays.map(stringArray => stringArray.join(linkToken))
  
  //case-insensitive sort this array of strings, mutating it in place:
  //https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-in-javascript
  arrayOfStrings.sort(  (a,b) => a.toLowerCase().localeCompare(b.toLowerCase())  )
  
  //return a new array of string arrays after splitting the strings on the unique token
  return arrayOfStrings.map( string => string.split(linkToken))  
}
////////////////////
L.wheelDelta = (eventObject) => {
    const e = eventObject; 
    return (
    	e.deltaY && (e.deltaY < 0) ?
    		1 
    	: e.deltaY && (e.deltaY > 0) ?
    		-1
		: 0  		
    )		
}
//////////////
/*
  Returns an array of the merged arrays from the argument list, eliminating duplicates.
  If the argument list includes non-arrays, they are also included, eliminating duplicates.
  It is also given an alias function name: L.mergeArrays  
*/
L.concatNoDupes = (...arraysEtc) => {
    return [  ...( new Set( [].concat(...arraysEtc) ) )  ];  
}  
L.mergeArrays = L.concatNoDupes


//////////////////////////////////