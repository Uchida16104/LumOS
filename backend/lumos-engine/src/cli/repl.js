const readline = require('readline');
const { Runtime } = require('../core/runtime');

class REPL {
  constructor() {
    this.runtime = new Runtime();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'lumos> '
    });
  }

  start() {
    console.log(`Lumos Language REPL v${this.runtime.getVersion()}`);
    console.log('Type .help for help, .exit to quit\n');
    
    this.rl.prompt();
    
    this.rl.on('line', (line) => {
      const trimmed = line.trim();
      
      if (trimmed === '.exit' || trimmed === '.quit') {
        console.log('Goodbye!');
        process.exit(0);
      }
      
      if (trimmed === '.help') {
        this.showHelp();
        this.rl.prompt();
        return;
      }
      
      if (trimmed === '.targets') {
        console.log('Supported compilation targets:');
        console.log(this.runtime.getSupportedTargets().join(', '));
        this.rl.prompt();
        return;
      }
      
      if (trimmed.startsWith('.compile ')) {
        const parts = trimmed.split(' ');
        const target = parts[1];
        const code = parts.slice(2).join(' ');
        const result = this.runtime.compile(code, target);
        
        if (result.success) {
          console.log(result.compiled);
        } else {
          console.error(`Error: ${result.error}`);
        }
        
        this.rl.prompt();
        return;
      }
      
      if (trimmed === '') {
        this.rl.prompt();
        return;
      }
      
      const result = this.runtime.execute(trimmed);
      
      if (result.success) {
        if (result.output) {
          console.log(result.output);
        }
      } else {
        console.error(`Error: ${result.error}`);
      }
      
      this.rl.prompt();
    });
    
    this.rl.on('close', () => {
      console.log('\nGoodbye!');
      process.exit(0);
    });
  }

  showHelp() {
    console.log('Lumos REPL Commands:');
    console.log('  .help             - Show this help message');
    console.log('  .exit, .quit      - Exit the REPL');
    console.log('  .targets          - Show supported compilation targets');
    console.log('  .compile <target> <code> - Compile code to target language');
    console.log('\nExamples:');
    console.log('  lumos> let x = 5');
    console.log('  lumos> print(x)');
    console.log('  lumos> .compile python let x = 5; print(x)');
  }
}

module.exports = { REPL };
