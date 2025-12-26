import App from "./app";

const main = async () => {
  const server = new App();
  await server.start();
};

main().catch((err) => {
  console.error("Error starting server: ", err);
});
