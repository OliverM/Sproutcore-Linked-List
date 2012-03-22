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
  }.property('_next').cacheable()

});


SCLL.SinglyLinkedList = SC.Object.extend(SC.Enumerable, {

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
    if(this.get('_head')){
      this.get('_tail').set('next', node);
      this.set('_tail', node);
      this.set('length', this.get('length')+1);
    }
    else {
      this.set('_head', node);
      this.set('_tail', node);
      this.set('length', 1);
    }
    return this;
  },

  insertBefore: function(node, nodeToInsert){
    return this;
  },

  insertAfter: function(node, nodeToInsert){
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
    SC.Set

    while(listCursor){

      // check if current listCursor matches the passed node
      if(listCursor === node){
        successor = node.get('next');
        if(predecessor) predecessor.set('next', successor);
        else this.set('_head', successor); // no predecessor so must be first in list (or empty list)
        if(!successor) this.set('_tail', null); // no successor so it was the only value in the list; point the tail to null
        this.set('length', this.get('length') -1);
        return this;
      }

      // not current node; prepare for next one
      predecessor = listCursor;
      listCursor = listCursor.get('next');
    }
    console.warn('Sought node not found during remove(): ', node);
    return this;
  },

  addListObservers: function(){},

  removeListObservers: function(){}

});