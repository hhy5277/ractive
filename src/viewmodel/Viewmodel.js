import { create } from 'utils/object';
import { magic } from 'config/environment';
import adapt from './prototype/adapt';
import applyChanges from './prototype/applyChanges';
import capture from './prototype/capture';
import clearCache from './prototype/clearCache';
import compute from './prototype/compute';
import get from './prototype/get';
import init from './prototype/init';
import map from './prototype/map';
import mark from './prototype/mark';
import merge from './prototype/merge';
import register from './prototype/register';
import release from './prototype/release';
import set from './prototype/set';
import smartUpdate from './prototype/smartUpdate';
import teardown from './prototype/teardown';
import unregister from './prototype/unregister';
import adaptConfig from './adaptConfig';

var Viewmodel = function ( ractive, mappings = create(null) ) {
	var key, mapping;

	this.ractive = ractive; // TODO eventually, we shouldn't need this reference

	Viewmodel.extend( ractive.constructor, ractive );

	// set up explicit mappings
	this.mappings = mappings;
	for ( key in mappings ) {
		mappings[ key ].initViewmodel( this );
	}

	if ( ractive.data && ractive.parameters !== true ) {
		// if data exists locally, but is missing on the parent,
		// we transfer ownership to the parent
		for ( key in ractive.data ) {
			if ( ( mapping = this.mappings[ key ] ) && mapping.getValue() === undefined ) {
				mapping.setValue( ractive.data[ key ] );
			}
		}
	}

	this.cache = {}; // we need to be able to use hasOwnProperty, so can't inherit from null
	this.cacheMap = create( null );

	this.deps = {
		computed: create( null ),
		'default': create( null )
	};
	this.depsMap = {
		computed: create( null ),
		'default': create( null )
	};

	this.patternObservers = [];

	this.specials = create( null );

	this.wrapped = create( null );
	this.computations = create( null );

	this.captureGroups = [];
	this.unresolvedImplicitDependencies = [];

	this.changes = [];
	this.implicitChanges = {};
	this.noCascade = {};
};

Viewmodel.extend = function ( Parent, instance ) {

	if ( instance.magic && !magic ) {
		throw new Error( 'Getters and setters (magic mode) are not supported in this browser' );
	}

	instance.adapt = adaptConfig.combine(
		Parent.prototype.adapt,
		instance.adapt) || [];

	instance.adapt = adaptConfig.lookup( instance, instance.adaptors );
};

Viewmodel.prototype = {
	adapt: adapt,
	applyChanges: applyChanges,
	capture: capture,
	clearCache: clearCache,
	compute: compute,
	get: get,
	init: init,
	map: map,
	mark: mark,
	merge: merge,
	register: register,
	release: release,
	set: set,
	smartUpdate: smartUpdate,
	teardown: teardown,
	unregister: unregister
};

export default Viewmodel;
