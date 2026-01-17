import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import signUpAPI from './SingUpAPI';
import loginAPI from './LoginAPI';
import emailVerificationAPI from './EmailVerificationAPI';
import resendEmailAPI from './ResendEmailAPI';
import addVendingMachineAPI from './AddVendingMachineAPI';
import addMapPinAPI from './AddMapPinAPI';
import addPriceRangeAPI from './AddPriceRangeAPI';
import addMachineDescriptionAPI from './AddMachineDescriptionAPI';
import addProductAPI from './AddProductAPI';
import addManufacturerAPI from './AddManufacturerAPI';
import addCategoriesAPI from './AddCategoriesAPI';
import getPinAPI from './GetPinAPI';
import getInfomationAPI from './GetInfomationAPI';

const port = 3001;
const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use('/api', signUpAPI);
app.use('/api', loginAPI);
app.use('/api', emailVerificationAPI);
app.use('/api', resendEmailAPI);
app.use('/api', addVendingMachineAPI);
app.use('/api', addMapPinAPI);
app.use('/api', addPriceRangeAPI);
app.use('/api', addMachineDescriptionAPI);
app.use('/api', addProductAPI);
app.use('/api', addManufacturerAPI);
app.use('/api', addCategoriesAPI);
app.use('/api', getPinAPI);
app.use('/api', getInfomationAPI);

// データベース初期化とサーバー起動
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`APIポート ${port} で起動しました!`);
    });
  } catch (error) {
    console.error('サーバー起動エラー:', error);
    process.exit(1);
  }
};

startServer();