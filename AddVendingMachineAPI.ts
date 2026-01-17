import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

router.post('/vending_machines', async (req: Request, res: Response) => {
  const {
    pin_id,
    user_id,
    manufacturer_id,
    category_id,
    price_range_id,
    machine_description_id,
    product_id
  } = req.body;

  // デバッグ用ログ
  console.log('受け取ったデータ:', req.body);
  console.log('user_id type:', typeof user_id, 'value:', user_id);

  // トランザクション開始
  con.beginTransaction(async (err) => {
    if (err) {
      console.error('トランザクション開始エラー:', err);
      return res.status(500).json({ error: 'サーバーエラー' });
    }

    try {
      const sql = `
        INSERT INTO vending_machines
        (pin_id, user_id, manufacturer_id, category_id, price_range_id, product_id, machine_description_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        pin_id,
        user_id,
        manufacturer_id,
        category_id,
        price_range_id,
        product_id,
        machine_description_id
      ];

      con.query(sql, values, (err: any, result: any) => {
        if (err) {
          console.error('データベースエラー:', err);
          // ロールバック
          con.rollback(() => {
            return res.status(500).json({ error: 'サーバーエラー' });
          });
          return;
        }

        // コミット
        con.commit((err) => {
          if (err) {
            console.error('コミットエラー:', err);
            con.rollback(() => {
              return res.status(500).json({ error: 'サーバーエラー' });
            });
            return;
          }

          res.status(201).json({
            message: 'マシンが登録されました',
            id: result.insertId,
            pin_id,
            user_id,
            manufacturer_id,
            category_id,
            price_range_id,
            product_id,
            machine_description_id
          });
        });
      });
    } catch (error) {
      console.error('処理エラー:', error);
      con.rollback(() => {
        return res.status(500).json({ error: 'サーバーエラー' });
      });
    }
  });
});

export default router;