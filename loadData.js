var _ = require('underscore');
var mongojs = require('mongojs');
var csv = require('./lib/csv');
var format = require('./lib/format');
var async = require('async');

var dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/openerz',
    coll = [ 'calendar', 'station' ],
    db = mongojs(dbUrl, coll);

db.on('error', function(err) {
    console.log('database error', err);
});

db.on('ready', function() {
    console.log('db connected', dbUrl);
    // remove previous entries
    db.station.remove();
    db.calendar.remove();

    var importCsv = function(path, format, collection, type, delimiter, callback) {
        csv.convertToJson(path, format, delimiter, function(objArr) {
            console.log('CSV converted, got ' + objArr.length + ' objects');

            _.each(objArr, function(obj) {
                if (type !== 'stations') {
                    obj['type'] = type;
                }
                collection.insert(obj);
            });
            console.log("Finished inserting", type);
            callback();
        });
    };

    var csvs = [
        {
            'path': './csv/Entsorgung_Sammelstellen.csv',
            'format': format.stationEntry,
            'delimiter': ',',
            'collection': db.station,
            'type': 'stations'
        },
        {
            'path': './csv/Entsorgungskalender_Bioabfall_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'organic'
        },
        {
            'path': './csv/Entsorgungskalender_CargoTram_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'cargotram'
        },
        {
            'path': './csv/Entsorgungskalender_eTram_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'etram'
        },
        {
            'path': './csv/Entsorgungskalender_Karton_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'cardboard'
        },
        {
            'path': './csv/Entsorgungskalender_Papier_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'paper'
        },
        {
            'path': './csv/Entsorgungskalender_Kehricht_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'waste'
        },
        {
            'path': './csv/Entsorgungskalender_Sonderabfall_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'special'
        },
        {
            'path': './csv/Entsorgungskalender_Textilien_2014.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'textile'
        },
        {
            'path': './csv/Entsorgungskalender_Bioabfall_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'organic'
        },
        {
            'path': './csv/Entsorgungskalender_CargoTram_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'cargotram'
        },
        {
            'path': './csv/Entsorgungskalender_eTram_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'etram'
        },
        {
            'path': './csv/Entsorgungskalender_Karton_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'cardboard'
        },
        {
            'path': './csv/Entsorgungskalender_Papier_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'paper'
        },
        {
            'path': './csv/Entsorgungskalender_Kehricht_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'waste'
        },
        {
            'path': './csv/Entsorgungskalender_Sonderabfall_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'special'
        },
        {
            'path': './csv/Entsorgungskalender_Textilien_2015.csv',
            'format': format.calendarEntry,
            'delimiter': ';',
            'collection': db.calendar,
            'type': 'textile'
        },
        {
            'path': './csv/Entsorgungskalender_Bioabfall_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'organic'
        },
        {
            'path': './csv/Entsorgungskalender_CargoTram_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'cargotram'
        },
        {
            'path': './csv/Entsorgungskalender_eTram_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'etram'
        },
        {
            'path': './csv/Entsorgungskalender_Karton_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'cardboard'
        },
        {
            'path': './csv/Entsorgungskalender_Papier_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'paper'
        },
        {
            'path': './csv/Entsorgungskalender_Kehricht_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'waste'
        },
        {
            'path': './csv/Entsorgungskalender_Sonderabfall_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'special'
        },
        {
            'path': './csv/Entsorgungskalender_Textilien_2016.csv',
            'format': format.calendarEntry,
            'delimiter': ',',
            'collection': db.calendar,
            'type': 'textile'
        }
    ];

    async.eachSeries(
        csvs,
        function(csv, callback) {
            try {
                importCsv(csv.path, csv.format, csv.collection, csv.type, csv.delimiter, callback);
            } catch (e) {
                callback(e);
            }
        },
        function(err) {
            if (err) {
                console.log('Import failed:', err);
                process.exit(1);
            } else {
                console.log("Import finished");
                process.exit(0);
            }
        }
    );
});

// make sure the database in opened and the 'ready' event is fired
db.open();
