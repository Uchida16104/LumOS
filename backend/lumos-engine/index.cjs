const { Runtime } = require('./src/core/runtime');
const { REPL } = require('./src/cli/repl');
const { FileRunner } = require('./src/cli/fileRunner');

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    const repl = new REPL();
    repl.start();
    return;
  }
  
  const command = args[0];
  
  if (command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  
  if (command === 'version' || command === '--version' || command === '-v') {
    const runtime = new Runtime();
    console.log(`Lumos Language v${runtime.getVersion()}`);
    return;
  }
  
  if (command === 'targets') {
    const runtime = new Runtime();
    console.log('Supported compilation targets:');
    console.log(runtime.getSupportedTargets().join(', '));
    return;
  }
  
  if (command === 'compile') {
    if (args.length < 3) {
      console.error('Usage: node index.cjs compile <file> <target>');
      process.exit(1);
    }
    
    const filepath = args[1];
    const target = args[2];
    
    const runner = new FileRunner();
    const result = runner.run(filepath, { compile: true, target: target });
    
    if (!result.success) {
      process.exit(1);
    }
    return;
  }
  
  if (command === 'analyze') {
    if (args.length < 2) {
      console.error('Usage: node index.cjs analyze <file>');
      process.exit(1);
    }
    
    const filepath = args[1];
    const runner = new FileRunner();
    const result = runner.analyze(filepath);
    
    if (!result.success) {
      process.exit(1);
    }
    return;
  }
  
  const filepath = command;
  const runner = new FileRunner();
  const result = runner.run(filepath);
  
  if (!result.success) {
    process.exit(1);
  }
}

function showHelp() {
  console.log('Lumos Language Interpreter and Compiler');
  console.log('');
  console.log('Usage:');
  console.log('  node index.cjs                          - Start REPL');
  console.log('  node index.cjs <file>                   - Execute Lumos file');
  console.log('  node index.cjs compile <file> <target>  - Compile to target language');
  console.log('  node index.cjs analyze <file>           - Analyze and show AST');
  console.log('  node index.cjs targets                  - List compilation targets');
  console.log('  node index.cjs version                  - Show version');
  console.log('  node index.cjs help                     - Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node index.cjs examples/hello.lumos');
  console.log('  node index.cjs compile examples/hello.lumos python');
  console.log('  node index.cjs analyze examples/hello.lumos');
}

if (require.main === module) {
  main();
}

module.exports = { Runtime, REPL, FileRunner };
