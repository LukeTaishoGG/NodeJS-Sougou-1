import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

router.post('/price_ranges', (req: Request, res: Response) => {
  const { price_range } = req.body;

  const sql = 'INSERT INTO price_ranges (price_range) VALUES (?)';
  con.query(sql, [price_range], (err: any, result: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(201).json({
      message: '価格帯が登録されました',
      id: result.insertId,
      price_range
    });
  });
});

export default router;