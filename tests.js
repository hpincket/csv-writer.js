g = {
    getIndex: function(num) {
        return function(x) { return x[num];};
    },
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    randomAlphabetString: function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    randomDangerousString: function(length) {
        var text = '';
        var possible = ' \'"\\\n\r\t\b\f';
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;

    },
    randomTotalString: function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \'"\\\n\r\t\b\f';
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
};

QUnit.module("Wikipedia Examples");
QUnit.test( "hello test", function( assert ) {
      assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "wiki test basic", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350']];
    assert.equal(ss.toCSV(map, content).data, '1997,Ford,E350', "Passed!");
});

QUnit.test( "wiki test quoted", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)},
        {'fourth': g.getIndex(3)}];
    content = [['1997', 'Ford', 'E350', 'Super, luxurious truck']];
    assert.equal(ss.toCSV(map, content).data, '1997,Ford,E350,"Super, luxurious truck"', "Passed!");
});

QUnit.test( "wiki test escape quotes", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)},
        {'fourth': g.getIndex(3)}];
    content = [['1997', 'Ford', 'E350', 'Super, "luxurious" truck']];
    assert.equal(ss.toCSV(map, content).data, '1997,Ford,E350,"Super, ""luxurious"" truck"', "Passed!");
});

QUnit.test( "wiki test embedded linebreaks", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)},
        {'fourth': g.getIndex(3)}];
    content = [['1997', 'Ford', 'E350', 'Go get one now\nthey are going fast']];
    assert.equal(ss.toCSV(map, content).data, '1997,Ford,E350,"Go get one now\nthey are going fast"', "Passed!");
});

QUnit.test( "wiki test leading spaces", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)},
        {'fourth': g.getIndex(3)}];
    content = [['  1997', ' Ford', 'E350 ', 'Go get one now\nthey are going fast']];
    assert.notEqual(ss.toCSV(map, content).data, '1997,Ford,E350,"Go get one now\nthey are going fast"', "Passed!");
    assert.equal(ss.toCSV(map, content).data, '  1997, Ford,E350 ,"Go get one now\nthey are going fast"', "Passed!");
});

QUnit.test( "wiki test spaces with quotes", function( assert ) {
    //Should not be any spaces around quoted fields
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)},
        {'fourth': g.getIndex(3)}];
    content = [['1997', 'Ford', 'E350', 'Go get one now\nthey are going fast']];
    assert.notEqual(ss.toCSV(map, content).data, '1997,Ford,E350, "Go get one now\nthey are going fast"', "Passed!");
});

QUnit.test( "wiki test example", function( assert ) {
    //Should not be any spaces around quoted fields
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)},
        {'fourth': g.getIndex(3)},
        {'fifth': g.getIndex(4)}];
    content = [['1997', 'Ford', 'E350', 'ac, abs, moon','3000.00'],
            ['1999', 'Chevy', 'Venture "Extended Edition"', '', '4900.00'],
            ['1999', 'Chevy', 'Venture "Extended Edition, Very Large"', '', '5000.00'],
            ['1996', 'Jeep', 'Grand Cherokee', 'MUST SELL!\nair, moon roof, loaded', '4799.00']];
    result = '1997,Ford,E350,"ac, abs, moon",3000.00\n1999,Chevy,"Venture ""Extended Edition""","",4900.00\n1999,Chevy,"Venture ""Extended Edition, Very Large""","",5000.00\n1996,Jeep,Grand Cherokee,"MUST SELL!\nair, moon roof, loaded",4799.00';
    assert.equal(ss.toCSV(map, content).data, result, "Passed!");
});

QUnit.module("Oracle Papa Parse");
QUnit.test( "simple", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350']];
    ssResult = ss.toCSV(map, content).data;
    ppResult = Papa.parse(ssResult);
    assert.equal(JSON.stringify(ppResult.data),JSON.stringify(content));
});

QUnit.test( "singleline 3cols", function( assert ) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [[]];
    for(var i=0;i<3;i++) {
        content[0].push(g.randomAlphabetString(g.random(5,20)));
    }
    ssResult = ss.toCSV(map, content).data;
    ppResult = Papa.parse(ssResult);
    assert.equal(JSON.stringify(content), JSON.stringify(ppResult.data));
});

QUnit.test( "singleline 100cols", function( assert ) {
    ss = new sscsvwriter();
    map = [];
    content = [[]];
    for(var i=0;i<100;i++) {
        temp = i.toString();
        map.push({temp: g.getIndex(i)});
        content[0].push(g.randomAlphabetString(g.random(5,20)));
    }
    ssResult = ss.toCSV(map, content).data;
    //ppResult = Papa.parse(ssResult);
    ppResult = Papa.parse(ssResult, {newline: "\n", delimiter: ","} );
    assert.equal(JSON.stringify(content), JSON.stringify(ppResult.data));
});

QUnit.test( "1000s of lines 100cols", function( assert ) {
    ss = new sscsvwriter();
    map = [];
    content = [[]];
    numOfLines = g.random(1000,9999);
    numOfCols = g.random(100,999);
    for(i=0;i<numOfCols;i++) {
        temp = i.toString();
        map.push({temp: g.getIndex(i)});
    }
    for(var l=0;l<numOfLines;l++) {
        content[l] = [];
        for(i=0;i<numOfCols;i++) {
            content[l].push(g.randomAlphabetString(g.random(5,20)));
        }
    }
    ssResult = ss.toCSV(map, content).data;
    ppResult = Papa.parse(ssResult, {newline: "\n", delimiter: ","} );
    assert.equal(JSON.stringify(content), JSON.stringify(ppResult.data));
});

QUnit.test( "Specific case 1", function( assert) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)}];
    content = [["\r '\f'' \f\t", "\n\f \r'\" "]];
    assert.equal(ss.toCSV(map, content).data, "\"\r '\f'' \f\t\",\"\n\f \r'\"\" \"");

});

QUnit.test( "Specific case 2", function( assert) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)}];
    content = [[" '\t\t \t\t\b\\'\\\b\\'\t \r\\\\'\t\b \\\t ", "\f\t\"\r\b\b \r\\\r\b\"'\"\r \n\f \b\r\n \b\n\f\b'\t\t\b\"\\\\\"\r"]];
    ssResult = ss.toCSV(map,content).data;
    ppResult = Papa.parse(ssResult, {newline: "\n", delimiter: ","} );
    assert.equal(JSON.stringify(content), JSON.stringify(ppResult.data));
});


QUnit.test( "Dangerous 100s of lines 100cols", function( assert ) {
    ss = new sscsvwriter();
    map = [];
    content = [[]];
    numOfLines = g.random(100,999);
    numOfCols = g.random(100,999);
    for(i=0;i<numOfCols;i++) {
        temp = i.toString();
        map.push({temp: g.getIndex(i)});
    }
    for(var l=0;l<numOfLines;l++) {
        content[l] = [];
        for(i=0;i<numOfCols;i++) {
            content[l].push(g.randomDangerousString(g.random(5,20)));
        }
    }
    ssResult = ss.toCSV(map, content).data;
    ppResult = Papa.parse(ssResult, {newline: "\n", delimiter: ","} );
    assert.equal(JSON.stringify(content), JSON.stringify(ppResult.data));
});

QUnit.test( "Dangerous and Alphabetical 100s of lines 100cols", function( assert ) {
    ss = new sscsvwriter();
    map = [];
    content = [[]];
    numOfLines = g.random(100,999);
    numOfCols = g.random(100,999);
    for(i=0;i<numOfCols;i++) {
        temp = i.toString();
        map.push({temp: g.getIndex(i)});
    }
    for(var l=0;l<numOfLines;l++) {
        content[l] = [];
        for(i=0;i<numOfCols;i++) {
            content[l].push(g.randomTotalString(g.random(5,20)));
        }
    }
    ssResult = ss.toCSV(map, content).data;
    ppResult = Papa.parse(ssResult, {newline: "\n", delimiter: ","} );
    assert.equal(JSON.stringify(content), JSON.stringify(ppResult.data));
});


QUnit.module("Config");
QUnit.test( "header config true", function( assert) {
    ss1 = new sscsvwriter({'header':true});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350']];
    assert.notEqual(ss1.toCSV(map, content).data, '1997,Ford,E350');

    ss2 = new sscsvwriter({'header':true});
    content = [['1997', 'Ford', 'E350']];
    assert.equal(ss2.toCSV(map, content).data, 'first,second,third\n1997,Ford,E350');
});

QUnit.test( "header config false", function( assert) {
    ss3 = new sscsvwriter({'header':false});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350']];
    assert.equal(ss3.toCSV(map, content).data, '1997,Ford,E350');
});

QUnit.test( "newline config \\n", function( assert) {
    ss1 = new sscsvwriter({'newline':'\n'});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350'],['2002','Chevy','ABC']];
    assert.equal(ss1.toCSV(map, content).data, '1997,Ford,E350\n2002,Chevy,ABC');
});

QUnit.test( "newline config \\r", function( assert) {
    ss1 = new sscsvwriter({'newline':'\r'});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350'],['2002','Chevy','ABC']];
    assert.equal(ss1.toCSV(map, content).data, '1997,Ford,E350\r2002,Chevy,ABC');
});

QUnit.test( "newline config \\r\\n", function( assert) {
    ss1 = new sscsvwriter({'newline':'\r\n'});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350'],['2002','Chevy','ABC']];
    assert.equal(ss1.toCSV(map, content).data, '1997,Ford,E350\r\n2002,Chevy,ABC');
});

QUnit.test( "newline config \\n\\r (not valid)", function( assert) {
    ss1 = new sscsvwriter({'newline':'\n\r'});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350'],['2002','Chevy','ABC']];
    assert.equal(ss1.toCSV(map, content).data, '1997,Ford,E350\n2002,Chevy,ABC');
});

QUnit.test( "newline config abc", function( assert) {
    ss1 = new sscsvwriter({'newline':'abc'});
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350'],['2002','Chevy','ABC']];
    assert.equal(ss1.toCSV(map, content).data, '1997,Ford,E350\n2002,Chevy,ABC');
});

QUnit.module("Error Cases");
QUnit.test( "Invalid Map Error", function( assert) {
    ss = new sscsvwriter();
    map = [{'first': g.getIndex(0)},
        {'second': g.getIndex(1), 'illegal': g.getIndex(0)},
        {'third': g.getIndex(2)}];
    content = [['1997', 'Ford', 'E350']];
    assert.equal(ss.toCSV(map, content).data, null);
    assert.ok(ss.toCSV(map, content).error.indexOf("Error:") !== -1);
});
