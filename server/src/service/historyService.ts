import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // Derive __dirname from the current module's URL
  private __filename = fileURLToPath(import.meta.url);
  private __dirname = path.dirname(this.__filename);
  private filePath = path.join(this.__dirname, 'searchHistory.json');

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      const fsError = error as NodeJS.ErrnoException; 
      if (fsError.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // TODO: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string): Promise<void> {
    const cities = await this.getCities();
    const id = (cities.length + 1).toString();
    const newCity = new City(id, name);
    cities.push(newCity);
    await this.write(cities);
  }

  // TODO: 
  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.getCities();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();