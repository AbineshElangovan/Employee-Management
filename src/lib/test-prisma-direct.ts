import prisma from "./prisma";

async function main() {
  try {
    console.log("Querying prisma...");
    const employees = await prisma.employee.findMany();
    console.log("Success! Found employees count:", employees.length);
  } catch (error) {
    console.error("Error occurred while querying database:");
    console.error(error);
  } finally {
    process.exit(0);
  }
}

main();
