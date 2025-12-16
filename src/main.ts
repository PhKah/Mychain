import { initDatabase } from "./Off_chain/database";
import { IndexerService } from "./Off_chain/IndexerService";

function getBlock(hash: string): Block
{

}
async function main() { 
    const dbPool = await initDatabase();
    const index = new IndexerService(dbPool);
}