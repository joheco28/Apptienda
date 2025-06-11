import { Stack } from 'expo-router';

import migrations from "@/drizzle/migrations/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';


const DATABASE_NAME = 'basetienda.db';
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);


export default function RootLayout() {

const {success, error} = useMigrations(db, migrations);

  if (error) {
    console.error('Error running migrations:', error);
  } else if (success) {
    console.log('Migrations completed successfully');
  } else {
    console.log('No migrations to run');
  }


  return (
    <SQLiteProvider databaseName={DATABASE_NAME}>
      <Stack>
        <Stack.Screen 
        name="(tabs)"
        options={{ headerShown: false }} />  
      </Stack>
    </SQLiteProvider>
  );
}

