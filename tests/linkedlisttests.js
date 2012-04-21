module("Test basic linked list functions", {
  setup: function(){
    LL = SCLL.SinglyLinkedList.create();
    LL2 = SCLL.SinglyLinkedList.create();

    node1 = SCLL.SingleNode.create().set('value', 'Oliver');
    node2 = SCLL.SingleNode.create().set('value', 'Stephen');
    node3 = SCLL.SingleNode.create().set('value', 'Terry');
    node4 = SCLL.SingleNode.create().set('value', 'Olive');

    listObserver = SC.Object.create({
      counter: 0,
      didAddItemAfter: function(list, item, predecessor){
        this.set('counter', this.get('counter') + 1);
      },
      didRemoveItemAfter: function(list, item, predecessor){
        this.set('counter', this.get('counter') - 1);
      }
    });

    listPosnObserver = SC.Object.create({
      previousNode: null,
      item: null,
      didAddItemAfter: function(list, item, predecessor){
        this.set('previousNode', predecessor);
        this.set('item', item);
      },
      didRemoveItemAfter: function(list, item, predecessor){
        this.set('previousNode', predecessor);
        this.set('item', item);
      }
    });

  },
  teardown: function(){
    LL = LL2 = node1 = node2 = node3 = listAdditionObserver = listPosnObserver = null;
  }
});

test("Adding & removing element nodes gives corrent length", function() {
  var expected = 0;
  var result = LL.get('length');
  equals(result, expected, "Length of empty list is 0");

  LL.add(node1).add(node2);

  expected = 2;
  result   = LL.get('length');
  equals(result, expected, "Length should be 2");

  expected = 0;
  result = LL2.get('length');
  equals(result, expected, "Length should not be shared between lists");

  expected = 1;
  result   = LL.remove(node1).get('length');
  equals(result, expected, "Length should be 1");

  expected = 1;
  result = LL.remove(node1).get('length');
  equals(result, expected, "Length should be unchanged after removing a node not present");

});

// TODO: implementation of native object handling (not just objects pre-wrapped in SCLL.SingleNodes)
//test("Values added directly are wrapped in nodes before adding", function(){
//  LL.add('Oliver').add('Stephen');
//
//  var expected = 2;
//  var result = LL.get('length');
//  equals(result, expected, "Length should be 2");
//});

test("nextObject() works after adding & removing objects", function(){

  LL.add(node1).add(node2).add(node3);

  var expected, result;
  result = LL.nextObject(0, null, null);
  expected = 'Oliver';
  equals(result.value(), expected, "Value of first object in list should match");

  result = LL.nextObject(1, result, null);
  expected = 'Stephen';
  equals(result.value(), expected, "Value of second object in list should match");

  result = LL.nextObject(0, null, null);
  expected = 'Oliver';
  equals(result.value(), expected, "Resetting passed index to zero returns to start of list");

  LL.remove(node2);
  result = LL.nextObject(1, result, null);
  expected = 'Terry';
  equals(result.value(), expected, "Value of second object in list after removing original second object should match");

  LL.add(node2);
  result = LL.nextObject(2, result, null);
  expected = 'Stephen';
  equals(result.value(), expected, "Value of third object in list after adding original second object should match");

  result = LL.get('length');
  expected = 3;
  equals(result, expected, "Length after above should be 3");
});

test("Observers are notified of structural changes to the list", function(){
  LL.addListObserver(listObserver);
  LL.add(node1).add(node2).add(node3);

  var expected, result;
  result = listObserver.get('counter');
  expected = 3;
  equals(result, expected, "Adding three nodes reflected three times in the list observer");

  LL.remove(node1).remove(node2);
  result = listObserver.get('counter');
  expected = 1;
  equals(result, expected, "Removing two nodes reflected in list observer's counter");
});

test("Removed list observers are no longer notified of changes", function(){
  LL.addListObserver(listObserver);
  LL.add(node1).add(node2);
  LL.removeListObserver(listObserver);
  LL.add(node3);

  var expected, result;
  result = listObserver.get('counter');
  expected = 2;
  equals(result, expected, "Structural changes to list are not reported to de-registered observers");
});

test("Observers correctly identify predecessors of changed nodes", function(){
  LL.addListObserver(listPosnObserver);

  var result;

  LL.add(node1);
  result = listPosnObserver.get('previousNode');
  equals(result, null, "Adding a node to an empty list returns a predecessor of null to the list observer");

  LL.add(node2);
  result = listPosnObserver.get('previousNode');
  equals(result, node1, "Adding a node to a list returns the expected predecessor to the list observer");

  LL.add(node3).remove(node2);
  result = listPosnObserver.get('previousNode');
  equals(result, node1, "Removing a node from the middle of the list returns the expected predecessor to the list observer");

  LL.remove(node4);
  result = listPosnObserver.get('previousNode');
  equals(result, node1, "Removing a non-existent node from the list leaves the list observer unchanged");

});

test("Conversion to Array", function(){
  var expected, result;

  result = LL.toArray().length;
  expected = [].length;
  equals(result, expected, "Conversion of an empty list returns an empty array"); // [] === [] returns false

  LL.add(node1).add(node2);
  result = LL.toArray().objectAt(1);
  expected = "Stephen";
  equals(result, expected, "Converstion of a list returns an array with values unwrapped from nodes"); // [1,2] === [1,2] returns false

});

test("Empty list insertAfter functionality", function(){
  LL.addListObserver(listPosnObserver);

  var expected, result;

  LL.insertAfter(node2, node1);
  result = LL.get('_head');
  expected = node1;
  equals(result, expected, "Inserting a node into an empty list sets it to the head, even if the guide node is not present");

  result = listPosnObserver.get('item');
  equals(result, expected, "List observer supplied with newly inserted node");

  result = listPosnObserver.get('previousNode');
  equals(result, null, "List observer supplied with a predecessor of null when inserting a node into an empty list")

});

test("Non-empty list insertAfter functionality", function(){
  LL.addListObserver(listPosnObserver);
  LL.add(node1);

  var result, expected;
  result = listPosnObserver.get('previousNode');
  equals(result, null, "add() node to an empty list gives the list observer an previousNode of null");

  LL.insertAfter(node1, node2);

  result = LL.get('length');
  expected = 2;
  equals(result, expected, "List length increases after insertAfter call");

  result = listPosnObserver.get('previousNode');
  expected = node1;
  equals(result, expected, "Inserting a node after a supplied node gives the supplied node as predecessor in the list observer");

  result = listPosnObserver.get('item');
  expected = node2;
  equals(result, expected, "Inserting a node after a supplied node gives the inserted node as item in the list observer");

  LL.insertAfter(node2, node3);
  result = LL.get('_tail');
  equals(result, node3, "Tail is correctly set if the insertAfter position results in the insertedNode being the tail");
});

