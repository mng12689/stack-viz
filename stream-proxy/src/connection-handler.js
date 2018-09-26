// Abstract class
class ConnectionHandler {
  constructor() {
    this.on = (event) => {
      throw new Error(`Event handler not yet implemented: ${event}`);
    };
    this.close = () => {
      throw new Error(`Close function not yet implemented`);
    };
  }
}

module.exports = ConnectionHandler;
