import {spawn} from 'child_process'

const executePython = async(script, args) => {
  const argument = args.map(arg => arg.toString());
  const py = spawn('python', [script, ...argument]);
  const result = await new Promise ((resolve, reject) => {
      let output = '';
      py.stdout.on('data', (data) => {
          output += data;
      });
      
      py.stderr.on('data', (data) => {
          console.error(`[python] Error: ${data}`);
          reject(`Error in ${script}`);
      });
      
      py.on('close', () => {
          console.log(`Predicted completely`);
          resolve(output);
      });
  });
  return result;
}

export default executePython;