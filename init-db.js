const { exec } = require("child_process");
const path = require("path");

const services = ["auth-service", "reservation-service"];

async function runCommand(command, service) {
  return new Promise((resolve, reject) => {
    console.log(`Running command in ${service}: ${command}`);
    exec(
      command,
      { cwd: path.join(__dirname, service) },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error in ${service}:`, error);
          reject(error);
          return;
        }
        console.log(`${service} output:`, stdout);
        if (stderr) {
          console.error(`${service} stderr:`, stderr);
        }
        resolve();
      }
    );
  });
}

async function initializeDatabases() {
  try {
    for (const service of services) {
      // Install dependencies
      await runCommand("npm install", service);

      // Run migrations
      await runCommand("npm run migrate", service);
    }
    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing databases:", error);
    process.exit(1);
  }
}

initializeDatabases();
