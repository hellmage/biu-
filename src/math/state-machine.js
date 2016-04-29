class InvalidStateError extends Error {}
class MachineNotBeginError extends Error {}
class UnknownMachineStateError extends Error {}
class EventRedefinitionError extends Error {}
class MissingDefinitionError extends Error {}

export class StateMachine {
  constructor () {
    this.states = []
    this.transitions = {}
    this._state = null
  }

  state (newState, opts) {
    var t = typeof (newState)
    if ((t !== 'number' && t !== 'string') || (t === 'number' && isNaN(newState))) {
      throw new InvalidStateError('Invalid type of state: ' + newState)
    }
    if (!(newState in this.states)) {
      this.states.push(String(newState))
    }
    if (opts && opts.initial) {
      this.states.initial = newState
    }
    if (opts && opts.ending) {
      this.states.ending = newState
    }
    return this
  }

  _key (evt, from) {
    return from + evt
  }

  event (evt, from, to) {
    if (typeof (evt) !== 'string') {
      throw new Error('Event must be string: ' + evt)
    }
    if (this.states.indexOf(from) === -1 || this.states.indexOf(to) === -1) {
      throw new UnknownMachineStateError(`Unknown state: ${from}, ${to}`)
    }
    if (this.transitions[this._key(evt, from)] !== undefined) {
      throw new EventRedefinitionError(`Redefinition of event "${evt}" on state "${from}"`)
    }
    this.transitions[this._key(evt, from)] = to
    return this
  }

  begin () {
    if (!this.states.initial || !this.states.ending) {
      throw new MissingDefinitionError('Missing initial or ending state definition')
    }
    this._state = this.states.initial
    return this
  }

  next (evt) {
    if (!this.began()) {
      throw new MachineNotBeginError()
    }
    var nextState = this.transitions[this._key(evt, this._state)]
    if (nextState === undefined) {
      return false
    }
    this._state = nextState
    return true
  }

  current () {
    if (!this.began()) {
      throw new MachineNotBeginError()
    }
    return this._state
  }

  began () {
    return this._state !== null
  }

  finished () {
    return this._state === this.states.ending
  }
}
