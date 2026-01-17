import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

router.post('/manufacturers', (req: Request, res: Response) => {
  const { name } = req.body;
  const sql = 'INSERT INTO manufacturers (name) VALUES (?)';
  con.query(sql, [name], (err: any, result: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(201).json({
      message: 'メーカーが登録されました',
      id: result.insertId,
      name
    });
  });
});

export default router;