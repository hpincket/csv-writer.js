# csv-writer.js
### Super Simple CSV Writer for Javascript

A smack-you-in-the-face simple library for generating RFC 4180 compliant CSV files
from javascript objects.

##Usage

Just include

```
<script src="csv-writer.js"></script>
```

Then create a CSVWriter object. Optionally include a configuration object.
```javascript
config = {'header': true };
writer = CSVWriter(config);
```

Convert an array of objects to a csv string with `toCSV(map, content)`.
Where map defines the rules for generating fields, and content is your array.
You can think of the resulting CSV as the cartesian product of map (columns) and content (rows).
This guarantees that each row has an equal number of columns.

###Map Format

A map is an array of fieldname and function pairings.
The function takes an element in the content array.

###Example

```
var getName = function(princess) {...};
var getAddress = function(princess) {...};
var getFilm = function(princess) {...};
map = [
    {'Name': getName },
    {'Castle': getAddress },
    {'Film': getFilm }]

var res = writer.toCSV(map, list_of_disney_princesses);

if(res.error) {
    alert(res.error);
}

csvfilecontents = res.data;
```

##Config
```javascript
{
    'header': false,
    'newline': '\n'
}
```
header: true or false
newline: '\n', '\r\n', '\r'

(more planned)

##Possible Errors
* Invalid Map Error: The map object has more than one header:f() pairing
* Undefined Map Error: Map function returned undefined on data row
* Null Map Error: Map function returned null on data row

Currently null/undefined return with an error.
It is unclear if null/undefined should be converted to some string representation.
Let me know if you desire some sort of functionality.

##Testing

So have you tested this? Hell yes!
csv-writer.js is aggressively tested against papa-paser.js and with hellish data. 
Check out our testing oracles if you're curious.

##Alternatives
This may not be what you're looking for. No prob, check below.
* [Papa Parser](https://github.com/mholt/PapaParse) (mostly reading)
* [csv-write-stream](https://www.npmjs.com/package/csv-write-stream) (requires node)
* [csvwriter](https://www.npmjs.com/package/csvwriter) (requires node)
* [jquery-csv](https://code.google.com/p/jquery-csv/) (no write implementation)

