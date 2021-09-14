const { exec } = require('child_process');
const fs = require('fs');

const versionPattern =
  '[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}-?[0-9]{0,4}-?[0-9A-z]{0,8}';
const buildNumber = '%TAG';

function updateFile(environmentFile, versionPattern, stdout) {
  fs.readFile(environmentFile, (err, data) => {
    const reg = new RegExp(`version: '${versionPattern}'`, 'g');
    if (data.toString().search(reg) === -1) {
      console.log(
        `Cannot find 'version: ' regExp in file: ${environmentFile}!`
      );
      return;
    }
    const result = data.toString().replace(reg, "version: '" + stdout + "'");
    fs.writeFile(environmentFile, result, (err) => {
      if (err === null) {
        console.log('successfully updated:', environmentFile, ' to: ', stdout);
      }
    });
  });
}

exec('git describe', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
  console.log('git describe tag: ', stdout);
  console.log('azure build number: ', buildNumber);

  // Checking if azure build task replaced the "%TAG", if not - apply git describe tag
  if (stdout.match(versionPattern)) {
    stdout = stdout.replace(/\n$/, '');
    let tag;
    if (buildNumber.length === 4) {
      tag = stdout;
      console.log('Applying git tag:', tag);
    } else {
      tag = buildNumber;
      console.log('Applying azure tag:', tag);
    }
    updateFile('./src/environments/environment.ts', versionPattern, tag);
    updateFile(
      './src/environments/environment.develop.ts',
      versionPattern,
      tag
    );
    updateFile('./src/environments/environment.production.ts', versionPattern, tag);
    updateFile('./src/environments/environment.demo.ts', versionPattern, tag);
  }
});
