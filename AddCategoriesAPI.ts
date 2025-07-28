import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

router.post('/categories', (req: Request, res: Response) => {
  const { name } = req.body;

  const sql = 'INSERT INTO categories (name) VALUES (?)';
  con.query(sql, [name], (err: any, result: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(201).json({
      message: 'カテゴリが登録されました',
      id: result.insertId,
      name
    });
  });
});

export default router;