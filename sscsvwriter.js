function sscsvwriter(config) {

    /*Config*/
    config = config || {};
    var newline = config.newline;
    var header = config.header;
    if(newline != '\n' && newline != '\r' && newline != '\r\n') 
        newline = '\n'; //Default

    function makeCSVRow(value, includeNewLine) {
        //Thanks to:
        // http://stackoverflow.com/posts/20623188/
        // Small additions to quoted characters
        // Also, I later remove \n from final line
        finalVal = "";
        for (var j = 0; j < value.length; j++) {
            var innerValue =  value[j]===null?'':value[j].toString();
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n|\f|\r)/g) >= 0 || result.length === 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        finalVal += newline;
        return finalVal;
    }

    /*
     * Errors
     */

    // The map object has more than one header:f() pairing
    function makeInvalidMapError(mapIndex) {
        return {data: null, error: "Error: Invalid map for column "+ mapIndex+"."};
    }
    // Map function returned undefined
    function makeUndefinedMapError(mapIndex, rowIndex, data) {
        return {data: data, error: "Error: Mapping produced 'undefined' at row "+rowIndex+" col "+colIndex + "."};
    }
    // Map function returned null
    function makeNullMapError(mapIndex, rowIndex, data) {
        return {data: data, error: "Error: Mapping produced 'null' at row "+rowIndex+" col "+colIndex + "."};
    }


    /*
     * Returns a CSV string
     */
    this.toCSV = function(map, content) {
        var resultantString = "";
        var i; 
        //Check for map error
        for(i =0; i< map.length; i++) {
            if(Object.keys(map[i]).length !== 1)
                return makeInvalidMapError(i);
            // Just check ahead of time, that way we don't have to check in two places
            // I don't know how much of a performance hit this gives
        }
        
        // Header
        if(header) {
            var tempHeaderRowData = [];
            for (i = 0; i < map.length; i++) {
                tempHeaderRowData.push(Object.keys(map[i])[0]); //Man this is ugly
            }
            resultantString += makeCSVRow(tempHeaderRowData);
        }
        //For each row (or for each element in content)
        for (i = 0; i < content.length; i++) {
            var rowElement = content[i];
            var rowData = [];
            //For each column (or for each f() in map)
            for(var k = 0; k < map.length; k++) {
                temp = map[k][Object.keys(map[k])[0]](rowElement);
                if(typeof temp === "undefined")
                    return makeUndefinedMapError(k, i, resultantString);
                if(temp === null)
                    return makeNullMapError(k, i, resultantString);
                rowData.push(temp);
            }
            resultantString += makeCSVRow(rowData);
        }
        return {data: resultantString.slice(0, (0 - newline.length)), error: null};
    };
}
