import fs from "fs";
import path from "path";

export interface CustomMeasurements {
  unit: "in" | "cm";
  top?: {
    chest?: number;
    waist?: number;
    hips?: number;
    shoulder?: number;
    sleeveLength?: number;
    topLength?: number;
  };
  bottom?: {
    waist?: number;
    hips?: number;
    inseam?: number;
    bottomLength?: number;
  };
  notes?: string;
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  size: string;
  customMeasurements?: CustomMeasurements;
  image: string;
  quantity: number;
}

export interface User {
  username: string;
  password: string; // Plain password for development/mockup environment
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cart: CartItem[];
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  occasion: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface DatabaseSchema {
  users: {
    [username: string]: User;
  };
  consultations?: Consultation[];
}

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

// Ensure the directory exists
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

export function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      ensureDirectoryExistence(DB_PATH);
      const initialData: DatabaseSchema = { users: {}, consultations: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const data: DatabaseSchema = JSON.parse(raw);
    if (!data.consultations) {
      data.consultations = [];
    }
    return data;
  } catch (error) {
    console.error("Error reading database file", error);
    return { users: {}, consultations: [] };
  }
}

export function writeDB(data: DatabaseSchema): boolean {
  try {
    ensureDirectoryExistence(DB_PATH);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing database file", error);
    return false;
  }
}
