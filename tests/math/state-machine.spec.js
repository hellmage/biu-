import {assert} from "../utils/assert"
import {StateMachine} from "../../src/math/state-machine"

describe("StateMachine", function() {
  it("happy path", function() {
    var sm = new StateMachine()
      .state('a', {initial: true})
      .state('b')
      .state('c')
      .state('d')
      .state('e', {ending: true})
      .event('point', 'a', 'b')
      .event('point', 'b', 'e')
      .event('length', 'b', 'c')
      .event('angle', 'c', 'e')
      .event('angle', 'b', 'd')
      .event('length', 'd', 'e');
    assert.false(sm.began());
    sm.begin();
    assert.equal(sm.current(), 'a');
    assert.true(sm.next('point'));
    assert.equal(sm.current(), 'b');
    sm.next('length');
    assert.false(sm.finished());
    sm.next('angle');
    assert.true(sm.finished());
  });
  describe("constructor", function() {
    it("transition must be built on known states", function() {
      assert.throws(function() {
        var sm = new StateMachine()
          .state('a', {initial: true})
          .state('b', {ending: true})
          .event('run', 'a', 'c');
      }, /Unknown/);
    });
    it("initial and ending state must be present", function() {
      assert.throws(function() {
        var sm = new StateMachine()
          .state('a')
          .state('b', {ending: true})
          .event('run', 'a', 'b')
          .begin();
      }, /initial or ending/);
      assert.throws(function() {
        var sm = new StateMachine()
          .state('a', {initial: true})
          .state('b')
          .event('run', 'a', 'b')
          .begin();
      }, /initial or ending/);
    });
    it("duplicate definition of event on the same state is not allowed", function() {
      assert.throws(function() {
        var sm = new StateMachine()
          .state('a', {initial: true})
          .state('b')
          .state('c', {ending: true})
          .event('run', 'a', 'b')
          .event('run', 'a', 'c')
          .begin();
      }, /Redefinition/);
    });
  });
  describe(".next", function() {
    it("machine must begin first", function() {
      assert.throws(function() {
        var sm = new StateMachine()
          .state('a', {initial: true})
          .state('b', {ending: true})
          .event('run', 'a', 'b');
        sm.next('run');
      }, /not begin/);
    });
    it("fails for unknown event", function() {
      var sm = new StateMachine()
        .state('a', {initial: true})
        .state('b', {ending: true})
        .event('run', 'a', 'b')
        .begin();
      assert.false(sm.next('rush'));
    });
  })
  describe(".current", function() {
    it("machine must begin first", function() {
      assert.throws(function() {
        var sm = new StateMachine()
          .state('a', {initial: true})
          .state('b', {ending: true})
          .event('run', 'a', 'b');
        sm.current();
      }, /not begin/);
    });
  })
});
