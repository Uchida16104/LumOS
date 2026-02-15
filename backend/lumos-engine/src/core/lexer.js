class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  tokenize() {
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;

      const char = this.input[this.position];

      if (this.isComment()) {
        this.skipComment();
        continue;
      }

      if (this.isLetter(char)) {
        this.tokens.push(this.readIdentifierOrKeyword());
        continue;
      }

      if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      if (char === '"' || char === "'") {
        this.tokens.push(this.readString(char));
        continue;
      }

      if (this.isOperator(char)) {
        this.tokens.push(this.readOperator());
        continue;
      }

      if (this.isPunctuation(char)) {
        this.tokens.push(this.readPunctuation());
        continue;
      }

      throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
    }

    this.tokens.push(new Token('EOF', null, this.line, this.column));
    return this.tokens;
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      if (this.input[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  isComment() {
    return this.input[this.position] === '#' || 
           (this.input[this.position] === '/' && this.input[this.position + 1] === '/');
  }

  skipComment() {
    while (this.position < this.input.length && this.input[this.position] !== '\n') {
      this.position++;
      this.column++;
    }
  }

  isLetter(char) {
    return /[a-zA-Z_]/.test(char);
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  isOperator(char) {
    return '+-*/%=<>!&|'.includes(char);
  }

  isPunctuation(char) {
    return '(){}[],.;:'.includes(char);
  }

  readIdentifierOrKeyword() {
    const start = this.position;
    const startColumn = this.column;

    while (this.position < this.input.length && 
           (this.isLetter(this.input[this.position]) || this.isDigit(this.input[this.position]))) {
      this.position++;
      this.column++;
    }

    const value = this.input.substring(start, this.position);
    const keywords = ['let', 'const', 'if', 'else', 'while', 'for', 'function', 'return', 
                     'true', 'false', 'null', 'print', 'to', 'in', 'and', 'or', 'not',
                     'class', 'import', 'export', 'from', 'as', 'async', 'await', 'try', 
                     'catch', 'throw', 'new', 'this', 'super', 'extends', 'static'];

    const type = keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER';
    return new Token(type, value, this.line, startColumn);
  }

  readNumber() {
    const start = this.position;
    const startColumn = this.column;
    let hasDecimal = false;

    while (this.position < this.input.length) {
      const char = this.input[this.position];
      
      if (this.isDigit(char)) {
        this.position++;
        this.column++;
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        this.position++;
        this.column++;
      } else {
        break;
      }
    }

    const value = this.input.substring(start, this.position);
    return new Token('NUMBER', parseFloat(value), this.line, startColumn);
  }

  readString(quote) {
    const startColumn = this.column;
    this.position++;
    this.column++;
    const start = this.position;

    while (this.position < this.input.length && this.input[this.position] !== quote) {
      if (this.input[this.position] === '\\') {
        this.position += 2;
        this.column += 2;
      } else {
        this.position++;
        this.column++;
      }
    }

    const value = this.input.substring(start, this.position);
    this.position++;
    this.column++;

    return new Token('STRING', value, this.line, startColumn);
  }

  readOperator() {
    const startColumn = this.column;
    const char = this.input[this.position];
    let operator = char;
    
    this.position++;
    this.column++;

    if (this.position < this.input.length) {
      const nextChar = this.input[this.position];
      const twoCharOps = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/='];
      const potential = operator + nextChar;
      
      if (twoCharOps.includes(potential)) {
        operator = potential;
        this.position++;
        this.column++;
      }
    }

    return new Token('OPERATOR', operator, this.line, startColumn);
  }

  readPunctuation() {
    const startColumn = this.column;
    const char = this.input[this.position];
    this.position++;
    this.column++;
    return new Token('PUNCTUATION', char, this.line, startColumn);
  }
}

module.exports = { Lexer, Token };
