//     elementjson.js 1.0.0
//     (c) 2016-2020 Carlos Enrique Illesca Monsalve
//     elementjson may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://elementjson.netlify.com
(function (factory) {
  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global;
  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.elementjson = factory(root, exports, _, $);
    });
  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);
  // Finally, as a browser global.
  } else {
    root.elementjson = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
  }
})(function(root, elementjson, _, $){
'use strict';


/**
 * @function TAG_notclose
 * @author Carlos Illesca <c4rl0sill3sc4@gmail.com>
 * @param {strimg} tagname - Etiqueta para saber si es necesario la declaración de cierre
 * @returns {boolean}  
 */
elementjson.tag_noclose = function(tagname){
	return _.indexOf(['img','meta','link','script','br'],tagname) != -1;
};

/**
 * @function createAttr
 * @author Carlos Illesca <c4rl0sill3sc4@gmail.com>
 * @param {(string|object)} attributes - Listado de attributos para ingresar en el elemento
 * @returns {string} cadena con los attributos html formateados en su formato ejemplo: id="myid" name="myname"
 */
elementjson.createAttr = function(attr){
	var _attr = "";
	if( _.isObject(attr) ){
		for( const _name in attr ){
			_attr +=_name+"='"+attr[_name]+"' ";
		};	
	}else if ( _.isString(attr) ){
		const ArrayAttr = attr.split("|");
	    for(const _iden in ArrayAttr){
	    	 const __name = ArrayAttr[_iden].split("@");
	    	 if(!_.isUndefined(__name[1])){
	    	 	_attr +=  __name[0]+"='"+ __name[1] +"' " 
	    	 }else{
	    	 	_attr+= __name[0]+" ";
	    	 };
	    	
	    };
	};
	return _attr === "" ? "":" "+_attr;
}
/**
 * @function create
 * @author Carlos Illesca <c4rl0sill3sc4@gmail.com>
 * @param {(object|Array)} objHtml - Objecto o Array para la construcción del componente html
 * @returns {string} cadena en formato html
 */
elementjson.create = function(objHtml){
	
		if(  !_.isFunction(objHtml.forEach)  ){ objHtml=[objHtml]   };	
		
		var EString = ""
		for(var i = 0; i < objHtml.length;i++){

			if(objHtml[i].constructor.name == 'Object'){
				 const tag  = objHtml[i].tag || objHtml[i].t || "div" ;
				 const beforeContent = objHtml[i].beforeContent || objHtml[i].bc || "";
				 const afterContent = objHtml[i].afterContent || objHtml[i].ac || "";
				 
				 const notClose = _.indexOf(this.tag_noclose,tag) != -1;

				 const attr = objHtml[i].attr || objHtml[i].a || {};
				 const attrString = this.createAttr(attr);
				 const each = objHtml[i].each || null;

				 const children = objHtml[i].children || objHtml[i].c || null;
				 
				 const _if = objHtml[i].i || null;
				 
				 if(notClose){
				 	 EString += "<"+tag+" "+attrString+">";
				 }else{
				 	
				 	EString += _.isNull(_if) ? "":"<% if("+_if+"){ %>";
				 	EString += _.isNull(each) ? "" : 
				 	"<% if(typeof "+each+" !== 'undefined' ) _.each("+each+",function(item,iterator){%>";
					EString += "<"+tag+attrString+">";
					EString += beforeContent;
					if(!_.isNull(children)){
						EString += this.create(children);
					};
					EString += afterContent;
					EString += "</"+tag+">"; 
					EString += _.isNull(each) ? "" : "<%})%>";
					EString += _.isNull(_if) ? "":"<%}%>";

				 };
			}else{
				
				EString += _.template(this.create(objHtml[i]["o"]))(objHtml[i]["d"]);
			};
		};
		return EString;

};

/**
 * @object Components
 * @author Carlos Illesca <c4rl0sill3sc4@gmail.com>
 */
var Components = elementjson.Components = {};
/**
 * @function create
 * @author Carlos Illesca <c4rl0sill3sc4@gmail.com>
 * @param {string} name - Nombre del Componente para manipular
 * @returns {object} cadena en formato html
 */
Components.getComponents = function(name){
	 return _.has(this.List,name) ?  this.List[name] : {};
};
/**
 * @object List
 * @author Carlos Illesca <c4rl0sill3sc4@gmail.com>
 */
Components.List = {};
/**
 * @function registerGroup
 * @autor Carlos Illesca <c4rl0sill3sc4@gmail.com>
 * @param {Array} ListComponent - lista de los componentes ha registrar 
 */
elementjson.registerGroup = function(ListComponent){
	_.extend(this.Components.List,ListComponent);
}
/**
 * @function getComponent
 * @autor Carlos Illesca <c4rl0sill3sc4@gmail.com>
 * @param {string} name - Nombre del componente
 * @param {object} data - lista de la data a remplazar 
 */
elementjson.getComponent = function(name, data){
	 
	 const components = this.Components.getComponents(name);
	 const _object = this.Components.getComponents(name)["o"];
	 const _data = this.Components.getComponents(name)["d"];
	 return _.template(this.create(  _object ))( _data ) ;	

};

return elementjson;



})