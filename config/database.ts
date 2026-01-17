import * as mysql from 'mysql2';

export const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vending_machine_db'
});

// データベース接続とテーブル作成
export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    con.connect(function(err: any) {
      if (err) {
        reject(err);
        return;
      }
      console.log('Connected to vending_machine_db');

      // テーブル作成
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      //Pins Table
      const createPinsTable = `
        CREATE TABLE IF NOT EXISTS map_pins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          address VARCHAR(255)
        )
      `;

      // カテゴリテーブル
      const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL
        )
      `;

      // メーカーテーブル
      const createManufacturersTable = `
        CREATE TABLE IF NOT EXISTS manufacturers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL
        )
      `;

      // 商品テーブル
      const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `;

      // 価格帯テーブル
      const createPriceRangesTable = `
        CREATE TABLE IF NOT EXISTS price_ranges (
          id INT AUTO_INCREMENT PRIMARY KEY,
          price_range VARCHAR(255) NOT NULL
        )
      `;

      // 自販機説明テーブル
      const createMachineDescriptionsTable = `
        CREATE TABLE IF NOT EXISTS machine_descriptions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          description TEXT NOT NULL
        )
      `;

      // 自販機テーブル
      const createVendingMachinesTable = `
        CREATE TABLE IF NOT EXISTS vending_machines (
          id INT AUTO_INCREMENT PRIMARY KEY,
          pin_id INT NOT NULL,
          user_id INT NOT NULL,
          manufacturer_id INT,
          category_id INT,
          price_range_id INT,
          machine_description_id INT
        )
      `;

      // メール認証コードテーブル
      const createEmailVerificationTable = `
        CREATE TABLE IF NOT EXISTS email_verifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          code VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_email_code (email, code),
          INDEX idx_expires (expires_at)
        )
      `;

      // テーブル作成の実行
      const tables = [
        { query: createUsersTable, name: 'users' },
        { query: createPinsTable, name: 'map_pins' },
        { query: createCategoriesTable, name: 'categories' },
        { query: createManufacturersTable, name: 'manufacturers' },
        { query: createProductsTable, name: 'products' },
        { query: createPriceRangesTable, name: 'price_ranges' },
        { query: createMachineDescriptionsTable, name: 'machine_descriptions' },
        { query: createVendingMachinesTable, name: 'vending_machines' },
        { query: createEmailVerificationTable, name: 'email_verifications' }
      ];

      let completedTables = 0;
      const totalTables = tables.length;

      tables.forEach(({ query, name }) => {
        con.query(query, function(err: any, result: any) {
          if (err) {
            reject(err);
            return;
          }
          console.log(`${name} テーブルが作成されました`);
          completedTables++;
          if (completedTables === totalTables) {
            resolve();
          }
        });
      });
    });
  });
};