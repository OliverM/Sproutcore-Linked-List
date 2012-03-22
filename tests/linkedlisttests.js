module("Test basic linked list functions", {
  setup: function(){
    LL = SCLL.SinglyLinkedList.create();
    LL2 = SCLL.SinglyLinkedList.create();
    node1 = SCLL.SingleNode.create().set('value', 'Oliver');
    node2 = SCLL.SingleNode.create().set('value', 'Stephen');
    node3 = SCLL.SingleNode.create().set('value', 'Terry');
    node4 = SCLL.SingleNode.create().set('value', 'Olive');
  },
  teardown: function(){
    LL = LL2 = node1 = node2 = node3 = null;
  }
});

test("Adding & removing elements gives corrent length", function() {
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

});