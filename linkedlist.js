// ==========================================================================
// Project:   Sproutcore Linked List SCLL
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals SCLL */

/** @namespace

  A linked list data structure for Sproutcore.

  @extends SC.Object
*/
SCLL = SC.Object.create(
  /** @scope GBEData.prototype */ {

  NAMESPACE: 'SCLL',
  VERSION: '0.1.0'

}) ;

SCLL.SingleNode = SC.Object.extend({
  _value: null,
  value: function(key, value){
    if(value){
      this.set('_value', value);
    }
    return this.get('_value');
  }.property('_value').cacheable(),

  _next: null,
  next: function(key, value){
    if(value){
      this.set('_next', value);
    }
    return this.get('_next');
  }.property('_next').cacheable(),

  isLinkedListNode: YES

});


SCLL.SinglyLinkedList = SC.Object.extend(SC.Enumerable, {

  /**
   * The node type used to hold values.
   */
  nodeType: SCLL.SingleNode,

  /**
   * private pointer to the first item in this list
   */
  _head: null,

  /**
   * private pointer to the last item in this list
   */
  _tail: null,

  /**
   * Set this to the base node the linked list structure strings together
   */
  exampleNode: SCLL.SingleNode,

  /**
   * the number of nodes in this list (included for SC.Enumerable conformance)
   */
  length: 0,

  /**
   * enumeration function included for SC.Enumerable compatibility
   *
   * @param index The index enumeration should start at (contract states this increases monotonically or resets to zero)
   * @param previousObject The object returned by the previous call to this method if a monotonic sequence
   * @param context Unused here (See SC.Enumerable.nextObject)
   * @returns the next node in the linked list
   */
  nextObject: function(index, previousObject, context){
    if(index) return previousObject.next();
    return this.get('_head');
  },

  /**
   * adds a node to the end of the list
   * @param node Node to add. The _tail of the list will point at this node when added
   */
  add: function(node){
    return this.insertAfter(this.get('_tail'), node);
  },

  insertAfter: function(node, nodeToInsert){
      // TODO: handle passing in of straight values; need to hash those values for comparison
     // stash passed value in a node if not already a node
//    if(!node.isLinkedListNode){
//      node = this.get('nodeType').create().set('value', node);
//    }
    var predecessor = null;

    if(node && this.get('_head')){ // list has content and specific location requested
      predecessor = node;
      nodeToInsert.set('next', node.get('next'));
      node.set('next', nodeToInsert);
      if(this.get('_tail') === node) this.set('_tail', nodeToInsert);
    }
    else { // List is empty or no predecessor supplied, so just add node to the end of the list
      if(this.get('_head')){ // list has content; replace head with new node
        nodeToInsert.set('next', this.get('_head'));
        this.set('_head', nodeToInsert);
      }
      else{ // list has no content; set new node as only element
        this.set('_head', nodeToInsert);
        this.set('_tail', nodeToInsert);
      }
    }

    this.set('length', this.get('length') + 1);
    if (this.listObservers) this.didAddItemAfter(nodeToInsert, predecessor);
    return this;
  },

  /**
   * Remove the supplied node from the linked list
   *
   * @param node
   */
  remove: function(node){
    var listCursor = this.get('_head'),
        predecessor = null,
        successor = null;

    while(listCursor){

      // check if current listCursor matches the passed node
      if(listCursor === node){
        successor = node.get('next');
        if(predecessor) predecessor.set('next', successor);
        else this.set('_head', successor); // no predecessor so must be first in list (or empty list)
        if(!successor) this.set('_tail', null); // no successor so it was the only value in the list; point the tail to null
        this.set('length', this.get('length') -1);
        if (this.listObservers) this.didRemoveItemAfter(node, predecessor);
        return this;
      }

      // not current node; prepare for next one
      predecessor = listCursor;
      listCursor = listCursor.get('next');
    }
    console.warn('Sought node not found during remove(): ', node);
    return this;
  },

  /**
   * Convert the list to an array
   * @returns {Array} array of values (unwrapped from the nodes)
   */
  toArray: function(){
    var ret = [];
    this.forEach(function(item){
      if(item.get('isLinkedListNode')) ret.push(item.value());
      else ret.push(item);
    });

    return ret;
  },

  /**
   * Register to be notified for structural changes to the list
   *
   * @param listObserver The observer to notify of changes
   */
  addListObserver: function(listObserver) {
    // create set observer set if needed
    if (!this.listObservers) {
      this.listObservers = SC.CoreSet.create();
    }
    this.listObservers.add(listObserver);
  },

  /**
   * De-register for changes
   *
   * @param listObserver The observer to remove from the observer set
   */
  removeListObserver: function(listObserver) {
    // if there is no set, there can be no currently observing set observers
    if (!this.listObservers) return;
    this.listObservers.remove(listObserver);
  },

  /**
   * @private
   * Notify observers of an addition to the list
   */
  didAddItemAfter: function(item, predecessor) {
    var o = this.listObservers;
    if (!o) return;

    var len = o.length, idx;
    for (idx = 0; idx < len; idx++) o[idx].didAddItemAfter(this, item, predecessor);
  },

  /**
   * @private
   * Notify observers of a removal to the list
   */
  didRemoveItemAfter: function(item, predecessor) {
    var o = this.listObservers;
    if (!o) return;

    var len = o.length, idx;
    for (idx = 0; idx < len; idx++) o[idx].didRemoveItemAfter(this, item, predecessor);
  }

});