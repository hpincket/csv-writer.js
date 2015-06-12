#Super Simple CSV Writer (sscsvwriter)

##Under Construction

I know there are tons of csv reader/writers out there, but none of them were as
smack-you-in-the-face simple as what I wanted them to be. So that's my plan here.

If such a thing does exist, kindly let me know. 

sscsvwriter
* tries to be RFC 4180 Complient
* is not fast
* writes only

##Example

We have one use case. You have an array of object you want to map to a CSV file.

```
myobjects = [obj1, obj2, obj3, obj4];

var contents = sscsvwriter.toCSV([
        "id": function(data) { return uuid.uuid4(); },
        "heraldry: ["country.region.villa[4].family"],
        "image": ['country','region','villa',4, 'city-logo']
        ],
        myobjects)

```

There are 3 simple ways to map a value
* function which takes in item, returns a string
* string identifying property (only with valid properties)
* array of fields to access



Source:  http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key

Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

