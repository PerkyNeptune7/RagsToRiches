import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// Checking database connection 
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("🚀 Pinged your deployment. Connection Successful!");
  } catch (err) {
    console.error("❌ Connection Failed:", err.message);
  } finally {
    await client.close();
  }
}
run();
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  appearance: {
    shirtColor: { type: String, default: 'white' },
    extraDetail: { type: String, default: 'none' }
  },
  stats: {
    financeKnowledge: { type: Number, default: 0 },
    happiness: { type: Number, default: 100 },
    money: { type: Number, default: 1000 }
  }
});

// 3. Exporting model 
export default mongoose.model('User', UserSchema);