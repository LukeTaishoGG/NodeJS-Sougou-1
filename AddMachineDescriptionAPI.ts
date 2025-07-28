import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

router.post('/machine_descriptions', (req: Request, res: Response) => {
  // 受信データをログ出力
  console.log('受信データ:', req.body);

  const { description } = req.body;

  const sql = 'INSERT INTO machine_descriptions (description) VALUES (?)';
  con.query(sql, [description], (err: any, result: any) => {
    // DBエラーをログ出力
    if (err) {
      console.log('DBエラー:', err);
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(201).json({
      message: '自販機説明が登録されました',
      id: result.insertId,
      description
    });
  });
});

export default router;