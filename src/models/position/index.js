const colors = require("colors");
class Position {
  constructor({ trade, id }) {
    this.state = "open";
    this.enter = trade;
    this.id = id;
  }
  close({ trade }) {
    this.state = "closed";
    this.exit = trade;
  }
  print() {
    const enter = `Enter | ${this.enter.price} * ${this.enter.size} | ${this.enter.time} |`;
    const exit = this.exit
      ? `Exit | ${this.exit.price} * ${this.exit.size} | ${this.exit.time}`
      : "";
    var profit = "";
    if (this.state == "closed") {
      const prof = `${this.profitString()}`;
      const colored = this.profit() > 0 ? colors.green(prof) : colors.red(prof);
      profit = `Profit: ${colored}`;
    }
    console.log(`${enter} - ${exit} = ${profit}`);
  }
  profit() {
    const fee = 0.0025;
    const entrance = this.enter.price * this.enter.size * (1 + fee);
    if (this.exit) {
      const exit = this.exit.price * this.enter.size * (1 - fee);
      return exit - entrance;
    } else {
      return 0;
    }
  }
  profitString() {
    return this.profit().toFixed(2);
  }
}

module.exports = Position;
