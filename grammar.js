module.exports = function(){
	var module = {};
    
    // Reads JSON Files 
	var loadJSON = function(filename) {
		console.log("debug: Loading " + filename + "...");
		try { 
			var data = require('fs').readFileSync(__dirname+'/'+filename +'.json', 'ascii');
			if (data.length == 0) {
				console.log("ERROR: " + filename + " had no data...");
				return {};
			} else {
				console.log("debug: " + filename + " loaded...");
				return data.length > 0 ? JSON.parse(data): {};
			}
		} catch (err) {
			console.log("ERROR: " + filename + " failed to load");
				console.log(err);
			process.exit(-1);
		}
	}
    
    // Test for word ending in specific regex
    var endMatch = function (str, match) {
        var regexp = new RegExp('\\w*' + match + '\\b');
        return regexp.test(str);
    }
    
	module.vowelstart = loadJSON('vowelstart');
	module.plurals = loadJSON('plurals');

	module.checkAn = function(str) {
        // Check for beginning vowel sound
		if (str && module.vowelstart.includes(str.toUpperCase()))
			return "an";
        
		return "a";
	};

    module.formatAn = function(str) {
        return module.checkAn(str) + " " + str;
    };
    
	module.checkPlural = function(str) {
        // Check for special plurals
        if (!str || str.length == 0)
            return '';
        
        for (var i in module.plurals)
            if (module.plurals[i] == str)
                return true;
            
        // Check for special singular
		if (module.plurals[str])
			return false;
        
        // Check for ending in s
		if (endMatch(str, s))
			return true;
        
		return false;
	};

	module.singularToPlural = function (str) {
		if (str && str.length > 0) {
			str = str.trim();
            
            // Only use last word
			if(str.lastIndexOf(" ") >= 0)
				return str.substring(str.lastIndexOf(" ") + 1,str.length);
            
            // Return special plurals
			if (module.plurals[str])
				return module.plurals[str];
            
            // ch, sh, s, x, z -> es
			if (endMatch(str, 'ch') || endMatch(str, 'sh') || endMatch(str, 's')  || endMatch(str, 'x')  ||endMatch(str, 'z') )
				return str + 'es';
            
            // consonant + y -> ies
			if (endMatch(str, '[^aeiou]y') )
				return str.substring(0,str.length - 1) + 'ies';
            
            // fe -> ves
			if (endMatch(str, 'fe'))
				return str.substring(0,str.length - 2) + 'ves';
            
            // f -> ves
			if (endMatch(str, 'f'))
				return str.substring(0,str.length - 1) + 'ves';
            
            // consonant + o -> es
			if (endMatch(str, '[^aeoiu]o'))
				return str + 'es';
            
            // else -> s
			return str + 's';
		}
		return '';
	};

	return module;
}.call(this);